// Copyright (c) 2012 Mark Cavage. All rights reserved.

var util = require('util');

var assert = require('assert-plus');
var restify = require('restify');
var querystring = require('querystring');


///--- Globals
var sprintf = util.format;

///--- API

function RestClient(options) {
    assert.object(options, 'options');
    //assert.object(options.log, 'options.log');
    //assert.optionalString(options.socketPath, 'options.socketPath');
    assert.optionalString(options.url, 'options.url');
    assert.optionalString(options.version, 'options.version');

    var ver = options.version || '~1.0.0';

    this.client = restify.createJsonClient({
        //log: options.log,
        name: 'RestClient',
        //socketPath: options.socketPath,
        url: options.url,
        version: ver
    });
    //this.log = options.log.child({component: 'RestClient'}, true);
    this.url = options.url;
    this.version = ver;

    if (options.username && options.password) {
        this.username = options.username;
        this.client.basicAuth(options.username, options.password);
    }
}


RestClient.prototype.get_statistic_dynamic_total = function get_statistic_dynamic_total(fields, cb) {
    assert.arrayOfString(fields, 'fields');
    assert.func(cb, 'callback');

    this.client.get('/statistic/dynamic/total?fields='+JSON.stringify(fields), function (err, req, res, obj) {
        if (err) {
            console.log(err);
            cb(err);
        } else {
            cb(null, obj);
        }
    });
};

RestClient.prototype.get_subjects = function get_subjects(params, cb) {
    assert.func(cb, 'callback');

    console.log(querystring.stringify(params));


    this.client.get('/subjects?'+querystring.stringify(params), function (err, req, res, obj) {
        if (err) {
            console.log(err);
            cb(err);
        } else {
            cb(null, obj);
        }
    });
};

RestClient.prototype.get_subject = function get_subject(id, cb) {
    assert.func(cb, 'callback');
    assert.optionalString(id, 'id');

    this.client.get('/subject/'+id, function (err, req, res, obj) {
        if (err) {
            console.log(err);
            cb(err);
        } else {
            cb(null, obj);
        }
    });
};

RestClient.prototype.add_subject_response = function add_subject_response(sbjid, params, cb) {
    assert.func(cb, 'callback');
    assert.object(params, 'params');
    assert.optionalString(sbjid, 'sbjid');

    this.client.post('/subject/'+sbjid+'/response', params, function (err, req, res, obj) {
        if (err) {
            console.log(err);
            cb(err);
        } else {
            cb(null, obj);
        }
    });
};

///--- API

module.exports = {
    createClient: function createClient(options) {
        return (new RestClient(options));
    }
};
