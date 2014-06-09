var Promise = require('bluebird'),
    assert = require('chai').assert,
    _ = require('lodash'),
    Rift = require('rift'),
    rift = Rift(),
    requestRecord = [],
    responseQueue = {};

function findRecordForTopic(topic) {
  var record;
  if (!topic) {
    return;
  }
  // find first instance of matching topic
  record = _.find(requestRecord, function(item) {
    return item.topic === topic;
  });
  return record;
};

function clearRecord(record) {
  requestRecord = _.filter(requestRecord, function(item) {
    return item !== record;
  })
};

function clearAll() {
  requestRecord = [];
};

function assertNoPending() {
  assert.equal(requestRecord.length, 0, 'should be no outstanding rift requests');
}

// dummy resolver will register any topic
rift.registerResolver(function(topic) {
  return {
    topic: topic
  };
});

// dummy middleware to allow manipulation of a request
rift.use(function(request) {
  var topic = request.endpoint.topic,
      responseDefer = Promise.defer(),
      requestDefer = Promise.defer(),
      queuedResponse;

  // if have a queued response, reply with it immediately
  if (topic in responseQueue) {
    queuedResponse = responseQueue[topic];
    delete responseQueue[topic];
    if (queuedResponse.resolve) {
      request.resolve(queuedResponse.resolve);
    } else {
      request.reject(queuedResponse.reject);
    }
    return;
  }

  // save a record of the call
  requestRecord.push({
    topic: request.endpoint.topic,
    request: request,
    defer: responseDefer
  });

  // let test control when a response/rejection occurs
  // and provide the value.
  responseDefer.promise.then(function(value) {
    request.resolve(value);
    requestDefer.resolve();
  }).catch(function(err) {
    request.reject(err);
    requestDefer.resolve();
  });

  // do not complete the middleware until
  // the test has called respondeDefer.{resolve,reject}()
  return requestDefer.promise;
});

// ensure that all tests start with clear record
beforeEach(clearAll);

// ensure that there are no outstanding requests after tests
// afterEach(assertNoPending);

module.exports = {
  clearAll: clearAll,
  assertNoPending: assertNoPending,
  resolve: function(topic, value) {
    var record = findRecordForTopic(topic);
    if (record) {
      record.defer.resolve(value);
      clearRecord(record);
    } else {
      responseQueue[topic] = {
        resolve: value
      };
    }
  },
  reject: function(topic, err) {
    var record = findRecordForTopic(topic);
    if (record) {
      record.defer.reject(err);
      clearRecord(record);
    } else {
      responseQueue[topic] = {
        reject: err
      };
    }
  },
  hasRequestForTopic: function(topic) {
    return !!findRecordForTopic(topic);
  },
  hasRequests: function() {
    return !!requestRecord.length;
  }
};
