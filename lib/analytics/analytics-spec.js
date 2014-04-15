var assert = require('chai').assert;
var sinon = require('sinon');

var analytics = require('./analytics');

describe('analytics', function() {
  var ga;
  beforeEach(function() {
    ga = sinon.spy();
    analytics.useGa(ga);
  })

  it('should send a pageview', function() {
    analytics.pageview();
    assert.ok(ga.called);
    assert.ok(ga.calledWith('send', 'pageview'));
  })

  it('should send an event', function() {
    var event = {
      category: 'a',
      action: 'b',
      label: 'c',
      value: 'd'
    }
    var expected = {
      hitType: 'event',
      eventCategory: 'a',
      eventAction: 'b',
      eventLabel: 'c',
      eventValue: 'd'
    }
    analytics.event(event);
    assert.ok(ga.called);
    assert.ok(ga.calledWith('send', expected));
  })
})
