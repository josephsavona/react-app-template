#!/usr/bin/env bash
set -e

# create local config file
if [ ! -f "./config/config.local.js" ]; then
  cp ./config/config.local.sample.js ./config/config.local.js
fi

# ensure gulp installed
if ! hash gulp; then
	npm install -g gulp
fi

# install packages
npm install

# make lib/* packages available as eg require('components')
npm link ./lib/components
npm link ./lib/analytics
