"use strict";

var url = require('url'),
    auth_hdr = require('./auth_header');


var AUTH_HEADER = "authorization",
    DEFAULT_AUTH_SCHEME = "JWT";

var extractors = {};

extractors.fromHeader = function (header_name) {
    return function (request) {
        var token = null;
        if (request.headers[header_name]) {
            token = request.headers[header_name];
        }
        return token;
    };
};



extractors.fromBodyField = function (field_name) {
    return function (request) {
        var token = null;
        if (request.body && request.body.hasOwnProperty(field_name)) {
            token = request.body[field_name];
        }
        return token;
    };
};



extractors.fromUrlQueryParameter = function (param_name) {
    return function (request) {
        var token = null,
            parsed_url = url.parse(request.url, true);
        if (parsed_url.query && parsed_url.query.hasOwnProperty(param_name)) {
            token = parsed_url.query[param_name];
        }
        return token;
    };
};



extractors.fromAuthHeaderWithScheme = function (auth_scheme) {
    return function (request) {

        var token = null;
        if (request.headers[AUTH_HEADER]) {
            var auth_params = auth_hdr.parse(request.headers[AUTH_HEADER]);
            if (auth_params && auth_scheme === auth_params.scheme) {
                token = auth_params.value;
            }
        }
        return token;
    };
};



extractors.fromAuthHeader = function () {
    return extractors.fromAuthHeaderWithScheme(DEFAULT_AUTH_SCHEME);
};



/**
 * Export the Jwt extraction functions
 */
module.exports = extractors;
