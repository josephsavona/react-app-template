/** @jsx React.DOM */
var React = require('react');
var addons = require('react-addons');
var pkg = require('./package.json');
 
// configure API
var rift = require('rift')('api');
var api = require('./config/api.rift');
rift.config.set('base', '/api');
rift.config.define(api);
 
// initialize app
var App = require('./src/routes');
var app = React.renderComponent(App(), document.body);
React.appRouter = app.refs.appRouter;
