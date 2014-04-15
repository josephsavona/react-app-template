/** @jsx React.DOM */
var React = require('react');

module.exports = React.createClass({
  getDefaultProps: function() {
    return {
      type: 'submit',
      label: 'Submit',
      onClick: function() {}
    };
  },
  render: function() {
    return (
      <div className="form-group form-button">
        <button type={this.props.type} onClick={this.props.onClick} className="btn btn-primary btn-block">{this.props.label}</button>
      </div>
    )
  }
});
