const async             = require('async');
const _                 = require('lodash');
const autoPromise       = require('./autoPromise');
const eachPromise       = require('./eachPromise');
const eachSeriesPromise = require('./eachSeriesPromise');

async.autoPromise       = autoPromise;
async.eachSeriesPromise = eachSeriesPromise;
async.eachPromise       = eachPromise

module.exports = async;
