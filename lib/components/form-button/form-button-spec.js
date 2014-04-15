var assert = require('chai').assert;
var sinon = require('sinon');
var $ = require('jquery');

var FormButton = require('./form-button');

describe('<FormButton/>', function() {
  // local property initialization: use spies to test callbacks
  var props;
  beforeEach(function() {
    props = {
      literal: 'value',
      onClick: sinon.spy()
    }
  })
  // generic dom setup/teardown
  beforeEach(helpers.before);
  afterEach(helpers.after);

  it('should call onClick property', function() {
    var component = helpers.render(FormButton(props))
    helpers.simulate.click($(component.getDOMNode()).find('button').get(0));
    assert.ok(props.onClick.calledOnce, 'click handler called');
  });

  it('should have the correct className', function() {
    var component = helpers.render(FormButton(props));
    assert.ok($(component.getDOMNode()).is('.form-button'));
  });
});
