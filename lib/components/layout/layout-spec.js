var assert = require('chai').assert;
var sinon = require('sinon');
var $ = require('jquery');

var Layout = require('./layout');
var React = require('react');

describe('<Layout/>', function() {
  var props;
  beforeEach(function() {
    props = {
      label: 'test',
      onClick: sinon.spy()
    }
  })
  beforeEach(helpers.before);
  afterEach(helpers.after);

  it('should have a header and footer', function() {
    var component = helpers.render(Layout());
    assert.ok($(component.getDOMNode()).find('.header-bar').length, 'has header');
    assert.ok($(component.getDOMNode()).find('.footer-bar').length, 'has footer');
  });

  it('should embed children nodes', function() {
    var div = React.DOM.div();
    var btn = React.DOM.button();
    var component = helpers.render(Layout(null, div, btn));
    assert.ok($(component.getDOMNode()).find(div.getDOMNode()), 'has child div');
    assert.ok($(component.getDOMNode()).find(btn.getDOMNode()), 'has child btn');
  })
});
