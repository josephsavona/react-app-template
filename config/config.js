//  load merged config.js/config.private.js
var _ = require('lodash');
var path = require('path');

var env = process.env.NODE_ENV || 'development';
var defaultConfig = require('./config.default');
var localConfig = require('./config.local');

if (!(env in defaultConfig) || !(env in localConfig)) {
  throw new Error('Invalid environment ' + env);
}

var config = _.merge(defaultConfig.default, defaultConfig[env], localConfig[env]);
config.env = env;
config.root = path.resolve(__dirname, '..');
module.exports = config;