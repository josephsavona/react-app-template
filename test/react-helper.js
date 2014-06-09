var React = require('react/addons');

module.exports = {
  render: function(component) {
    return React.addons.TestUtils.renderIntoDocument(component);
  },
  simulate: React.addons.TestUtils.Simulate
};