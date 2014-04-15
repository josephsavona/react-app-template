var _ = require('lodash');

var env = process.env.NODE_ENV;
var defaultConfig = require('./config.default');
var localConfig = require('./config.local');

if (!(env in defaultConfig) || !(env in localConfig)) {
  throw new Error('Invalid environment ' + env);
}

var config = _.merge(defaultConfig.default, defaultConfig[env], localConfig[env]);
config.env = env;
module.exports = config;