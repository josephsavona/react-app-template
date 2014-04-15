/** @jsx React.DOM */
var config = require('./config/config');
 
// configure API
var rift = require('rift')('api');
var api = require('./config/api.rift');
rift.config.set('base', '/api');
rift.config.define(api);
 
// initialize app
var App = require('./src/routes');
var app = React.renderComponent(App(), document.body);
React.appRouter = app.refs.appRouter;
