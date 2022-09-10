"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractJwt = void 0;
var tslib_1 = require("tslib");
var url_1 = require("url");
var auth_header_1 = require("./auth_header");
// Note: express http converts all headers
// to lower case.
var SchemaType;
(function (SchemaType) {
    SchemaType["AUTH_HEADER"] = "authorization";
    SchemaType["BEARER_AUTH_SCHEME"] = "bearer";
})(SchemaType || (SchemaType = {}));
var ExtractJwt = /** @class */ (function () {
    function ExtractJwt() {
    }
    ExtractJwt.fromSignedCookie = function (name) {
        return function (request) {
            var token = null;
            if (request.signedCookies && name in request.signedCookies && typeof request.signedCookies[name] === "string") {
                token = request.signedCookies[name];
            }
            return token;
        };
    };
    ;
    ExtractJwt.fromSessionKey = function (name) {
        return function (request) {
            var token = null;
            if (request.session && name in request.session && typeof request.session[name] === "string") {
                token = request.session[name];
            }
            return token;
        };
    };
    ExtractJwt.fromCookie = function (name) {
        return function (request) {
            var token = null;
            if (request.cookies && name in request.cookies && typeof request.cookies[name] === "string") {
                token = request.cookies[name];
            }
            return token;
        };
    };
    ExtractJwt.fromRequestProperty = function (property) {
        return function (request) {
            var token = null;
            if (property in request && typeof request[property] === "string") {
                token = request[property];
            }
            return token;
        };
    };
    ExtractJwt.fromHeader = function (header_name) {
        return function (request) {
            var token = null;
            if (request.headers && header_name in request.headers && typeof request.headers[header_name] === "string") {
                token = request.headers[header_name];
            }
            return token;
        };
    };
    ExtractJwt.fromBodyField = function (field_name) {
        return function (request) {
            var token = null;
            if (request.body && field_name in request.body) {
                token = request.body[field_name];
            }
            return token;
        };
    };
    ;
    ExtractJwt.fromUrlQueryParameter = function (param_name) {
        return function (request) {
            var token = null;
            var parsed_url = (0, url_1.parse)(request.url, true);
            if (parsed_url.query && param_name in parsed_url.query && typeof parsed_url.query[param_name] === "string") {
                token = parsed_url.query[param_name];
            }
            return token;
        };
    };
    ;
    ExtractJwt.fromAuthHeaderWithScheme = function (auth_scheme) {
        var auth_scheme_lower = auth_scheme.toLowerCase();
        return function (request) {
            var token = null;
            if (request.headers && SchemaType.AUTH_HEADER in request.headers) {
                var auth_params = (0, auth_header_1.parseAuthHeader)(request.headers[SchemaType.AUTH_HEADER]);
                if (auth_params && auth_scheme_lower === auth_params.scheme.toLowerCase()) {
                    token = auth_params.value;
                }
            }
            return token;
        };
    };
    ;
    ExtractJwt.fromAuthHeaderAsBearerToken = function () {
        return this.fromAuthHeaderWithScheme(SchemaType.BEARER_AUTH_SCHEME);
    };
    ;
    ExtractJwt.fromExtractors = function (extractors) {
        var _this = this;
        if (!Array.isArray(extractors)) {
            throw new TypeError('extractors.fromExtractors expects an array');
        }
        return function (request) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var token, _i, extractors_1, extractor;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = null;
                        _i = 0, extractors_1 = extractors;
                        _a.label = 1;
                    case 1:
                        if (!(_i < extractors_1.length)) return [3 /*break*/, 4];
                        extractor = extractors_1[_i];
                        return [4 /*yield*/, extractor(request)];
                    case 2:
                        token = _a.sent();
                        if (token)
                            return [3 /*break*/, 4];
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, token];
                }
            });
        }); };
    };
    ;
    return ExtractJwt;
}());
exports.ExtractJwt = ExtractJwt;
