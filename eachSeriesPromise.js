'use strict';
const utils = require('./utils');
const async = require('async');

module.exports = utils.createEachPromise(async.eachSeries);
