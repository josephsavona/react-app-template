#!/usr/bin/env bash
set -e

# ensure a sensible npm install prefix
npm config set prefix "$HOME/.npm"

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

# make config available as require('config')
npm link ./config

# make lib/* packages available as eg require('components')
npm link ./lib/components
npm link ./lib/analytics