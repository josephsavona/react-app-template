/** @jsx React.DOM */
var React = require('react');

module.exports = React.createClass({
  displayName: 'Layout',
  render: function() {
    return (
      <div className="layout">
        <div className="layout-inner container">
          {this.props.children}
        </div>
      </div>
    )
  }
});
