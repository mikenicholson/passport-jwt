var passport = require('passport-strategy')
    , auth_hdr = require('./auth_header')
    , util = require('util')
    , url = require('url');

// Note: express http converts all headers
// to lower case.
var AUTH_HEADER = "authorization"
    , DEFAULT_AUTH_SCHEME = "JWT"
    , DEFAULT_TOKEN_BODY_FIELD = 'auth_token'
    , DEFAULT_TOKEN_QUERY_PARAM_NAME = 'auth_token'

/**
 * Strategy constructor
 *
 * @param options
 *          secretOrKey - (REQUIRED) String or buffer containing the secret or PEM-encoded public key
 *          issuer: If defined issuer will be verified against this value
 *          audience: If defined audience will be verified against this value
 *          tokenBodyField: Field in request body containing token. Default is auth_token.
 *          tokenQueryParameterName: Query parameter name containing the token. Default is auth_token.
 *          authScheme: Expected scheme when JWT can be found in HTTP Authorize header. Default is JWT.
 *          algorithms: List of strings with the names of the allowed algorithms. For instance, ["HS256", "HS384"].
 *          ignoreExpiration: if true do not validate the expiration of the token.
 *          passReqToCallback: If true the, the verify callback will be called with args (request, jwt_payload, done_callback).
 * @param verify - Verify callback with args (jwt_payload, done_callback) if passReqToCallback is false,
 *                 (request, jwt_payload, done_callback) if true.
 */
function JwtStrategy(options, verify) {

    passport.Strategy.call(this);
    this.name = 'jwt';

    this._secretOrKey = options.secretOrKey;
    if (!this._secretOrKey) {
        throw new TypeError('JwtStrategy requires a secret or key');
    }

    this._verify = verify;
    if (!this._verify) {
        throw new TypeError('JwtStrategy requires a verify callback');
    }

    this._passReqToCallback = options.passReqToCallback;
    this._authScheme = options.authScheme || DEFAULT_AUTH_SCHEME;
    this._tokenBodyField = options.tokenBodyField || DEFAULT_TOKEN_BODY_FIELD;
    this._tokenQueryParameterName = options.tokenQueryParameterName || DEFAULT_TOKEN_QUERY_PARAM_NAME;
    this._verifOpts = {};

    if (options.issuer) {
        this._verifOpts.issuer = options.issuer;
    }

    if (options.audience) {
        this._verifOpts.audience = options.audience;
    }

    if (options.algorithms) {
        this._verifOpts.algorithms = options.algorithms;
    }

    if (options.ignoreExpiration != null) {
        this._verifOpts.ignoreExpiration = options.ignoreExpiration;
    }

};
util.inherits(JwtStrategy, passport.Strategy);



/**
 * Allow for injection of JWT Verifier.
 *
 * This improves testability by allowing tests to cleanly isolate failures in the JWT Verification
 * process from failures in the passport related mechanics of authentication.
 *
 * Note that this should only be replaced in tests.
 */
JwtStrategy.JwtVerifier = require('./verify_jwt');



/**
 * Authenticate request based on JWT obtained from header or post body
 */
JwtStrategy.prototype.authenticate = function(req, options) {
    var self = this;
    var token = null;
    // Extract the jwt from the request
    // Try the header first
    if( req.headers[AUTH_HEADER]) {
        var auth_params = auth_hdr.parse(req.headers[AUTH_HEADER]);
        if (!auth_params) {
            return self.fail(new Error("Invalid authorization header"));
        }
        if (self._authScheme === auth_params.scheme) {
            token = auth_params.value;
        }
    }

    // If not in the header try the body
    if (!token && req.body) {
        token = req.body[self._tokenBodyField];
    }

    if (!token) {
        var parsed_url = url.parse(req.url, true);
        if (parsed_url.query && parsed_url.query.hasOwnProperty(self._tokenQueryParameterName)) {
            token = parsed_url.query[self._tokenQueryParameterName];
        }
    }

    if (!token) {
        return self.fail(new Error("No auth token"));
    }

    // Verify the JWT
    JwtStrategy.JwtVerifier(token, this._secretOrKey, this._verifOpts, function(jwt_err, payload) {
        if (jwt_err) {
            return self.fail(jwt_err);
        } else {
            // Pass the parsed token to the user
            var verified = function(err, user, info) {
                if(err) {
                    return self.error(err);
                } else if (!user) {
                    return self.fail(info);
                } else {
                    return self.success(user, info);
                }
            };

            try {
                if (self._passReqToCallback) {
                    self._verify(req, payload, verified);
                } else {
                    self._verify(payload, verified);
                }
            } catch(ex) {
                self.error(ex);
            }
        }
    });
};



/**
 * Export the Jwt Strategy
 */
 module.exports = JwtStrategy;
