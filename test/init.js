require('node-jsx').install();
var jsdom = require('jsdom');

var helpers = {
  before: function() {
    global.document = jsdom.jsdom();
    global.window = document.createWindow();
    global.navigator = window.navigator;
  },
  after: function() {
    delete global.document;
    delete global.window;
    delete global.navigator;
  }
}
// must initialize a global `window` so that React will work
helpers.before();

// can now require React
var React = require('react/addons');
helpers.render = function(component) {
  return React.addons.TestUtils.renderIntoDocument(component);
}
helpers.simulate = React.addons.TestUtils.Simulate;

global.helpers = helpers;
module.exports = helpers;
