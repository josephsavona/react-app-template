var assert = require('chai').assert;
var sinon = require('sinon');
var $ = require('jquery');

var FormField = require('./form-field');

describe('<FormField/>', function() {
  // local property initialization: use spies to test callbacks
  var props;
  beforeEach(function() {
    props = {
      label: 'Field',
      model: {
        value: 'testValue',
        requestChange: sinon.spy(function(value) {
          props.model.value = value;
        })
      }
    }
  })
  // generic dom setup/teardown
  beforeEach(helpers.before);
  afterEach(helpers.after);

  it('should call have assigned value', function() {
    var component = helpers.render(FormField(props))
    assert.equal($(component.getDOMNode()).find('input').val(), props.model.value, 'should have given value');
  });

  it.skip('should change value when typing', function() {
    var component = helpers.render(FormField(props));
    var newValue = 'newValue';
    // simulate a change
    $(component.getDOMNode()).find('input').val(newValue);
    $(component.getDOMNode()).find('input').trigger('input');
    // verify new value propagates
    assert.equal($(component.getDOMNode()).find('input').val(), newValue, 'should have new value');
    assert.equal(props.model.value, newValue, 'props value should change');
    // verify called with expected args
    assert.ok(props.model.requestChange.called, 'requestChange called');
    assert.ok(props.model.requestChange.calledWith(newValue), 'requestChange called with newValue')
  })

  it('should have the correct className', function() {
    var component = helpers.render(FormField(props));
    assert.ok($(component.getDOMNode()).is('.form-field'));
  });
});
