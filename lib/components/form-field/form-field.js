/** @jsx React.DOM */
var React = require('react');
var LinkedStateMixin = require('react-addons').LinkedStateMixin;
var _ = require('lodash');

module.exports = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return {
      id: _.uniqueId('form_field_')
    };
  },
  getDefaultProps: function() {
    return {
      type: 'text',
      autoComplete: false,
      autoFocus: false,
      noValidate: false
    };
  },
  render: function() {
    if (this.props.type === 'checkbox') {
      return (
        <div className="form-group form-field">
          <input ref="input" type="checkbox" className="checkbox-styled" name={this.state.id} id={this.state.id} valueLink={this.props.model} />
          <label htmlFor={this.state.id}>{this.props.label}</label>
        </div>
      )
    } else if (this.props.type === 'radio') {
      return (
        <div className="form-group form-field">
          <input ref="input" type="radio" className="checkbox-styled" name={this.state.id} id={this.state.id} valueLink={this.props.model} />
          <label htmlFor={this.state.id}>{this.props.label}</label>
        </div>
      )
    } else {
     return (
        <div className="form-group form-field">
          <label className="form-label" htmlFor={this.state.id}>{this.props.label}</label>
          <input
            ref="input"
            type={this.props.type}
            name={this.state.id}
            id={this.state.id}
            className="form-control"
            autoComplete={this.props.autoComplete ? 'on' : 'off'}
            autoFocus={this.props.autoFocus}
            noValidate={this.props.noValidate}
            valueLink={this.props.model} />
        </div>
      )
    }
  }
});
