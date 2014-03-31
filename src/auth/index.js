/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;

var LoginPage = React.createClass({
  render: function() {
    return (
      <div>Login</div>
    )
  }
});

var LogoutPage = React.createClass({
  render: function() {
    return (
      <div>Logout</div>
    )
  }
});

var UserPage = React.createClass({
  render: function() {
    return (
      <div>{this.props.username}</div>
    )
  }
});

var Auth = React.createClass({
  render: function() {
    return (
      <Locations contextual>
        <Location path="/login" handler={LoginPage} />
        <Location path="/logout" handler={LogoutPage} />
        <Location path="/:username" handler={UserPage} />
      </Locations>
    )
  }
});

module.exports = Auth;