/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var NotFound = Router.NotFound;
var Link = require('react-router-component').Link;
 
var AuthRouter = require('./auth');

var NotFoundPage = React.createClass({
  render: function() {
    return (
      <div>Not Found</div>
    )
  }
})
 
var App = React.createClass({
  render: function() {
    return (
      <Locations ref="appRouter">
        <Location path="/auth/*" handler={AuthRouter} />
        <NotFound handler={NotFoundPage} />
      </Locations>
    )
  }
});
 
module.exports = App;
