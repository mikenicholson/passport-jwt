var passport = require('passport-strategy')
    , token_source = require('./token_source')
    , auth_hdr = require('./auth_header')
    , cookie = require('cookie')
    , util = require('util')
    , url = require('url');

// Note: express http converts all headers
// to lower case.
var AUTH_HEADER = "authorization"
    , COOKIE_HEADER = "cookie"
    , DEFAULT_AUTH_SCHEME = "JWT"
    , DEFAULT_COOKIE_NAME = "JWT"
    , DEFAULT_TOKEN_BODY_FIELD = 'auth_token'
    , DEFAULT_TOKEN_QUERY_PARAM_NAME = 'auth_token';

/**
 * Strategy constructor
 *
 * @param options
 *          secretOrKey - (REQUIRED) String or buffer containing the secret or PEM-encoded public key
 *          issuer: If defined issuer will be verified against this value
 *          audience: If defined audience will be verified against this value
 *          tokenBodyField: Field in request body containing token. Default is auth_token.
 *          tokenQueryParameterName: Query parameter name containing the token. Default is auth_token.
 *          tokenCookieName: Cookie name containing the token. Default is JWT.
 *          authScheme: Expected scheme when JWT can be found in HTTP Authorize header. Default is JWT.
 *          algorithms: List of strings with the names of the allowed algorithms. For instance, ["HS256", "HS384"].
 *          ignoreExpiration: if true do not validate the expiration of the token.
 *          passReqToCallback: If true the, the verify callback will be called with args (request, jwt_payload, done_callback).
 *          tokenSource: A callback function that takes one argument; req, and returns a token or null.
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
    this._tokenCookieName = options.tokenCookieName || DEFAULT_COOKIE_NAME;
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

    this._tokenSource = options.tokenSource || this._legacyTokenSource;
}
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
 * Extract JWT token from request.
 * The following methods are tried, in given order:
 * - AUTH_HEADER
 * - body (tokenBodyField option)
 * - query (tokenQueryParameterName option)
 * - Cookie (tokenCookieName option)
 */
JwtStrategy.prototype._legacyTokenSource = function(req) {
    var self = this;
    var token = null;

    token = token_source.AuthorizationHeader(self._authScheme)(req);
    if(token) {
	return token;
    }
    
    // If not in the header try the body
    if (req.body && self._tokenBodyField) {
	token = token_source.Body(self._tokenBodyField)(req);
	if(token) {
	    return token;
	}
    }

    if(self._tokenQueryParameterName) {
	token = token_source.Query(self._tokenQueryParameterName)(req);
	if(token) {
	    return token;
	}
    }

    // Try cookie
    if(self._tokenCookieName && req.headers[COOKIE_HEADER]) {
	token = token_source.Cookie(self._tokenCookieName)(req);
    }

    return token; // will be cookie value or null
};

/**
 * Authenticate request based on JWT obtained from request
 */
JwtStrategy.prototype.authenticate = function(req/*, options*/) {
    var self = this;
    var token = self._tokenSource(req);

    if (!token) {
        return self.fail(new Error("No auth token"));
    }

    // Verify the JWT
    JwtStrategy.JwtVerifier(token, self._secretOrKey, self._verifOpts, function(jwt_err, payload) {
        if (jwt_err) {
            return self.fail(jwt_err);
	}

        // Pass the parsed token to the user
        var verified = function(err, user, info) {
            if(err) {
                return self.error(err);
            }
	    if (!user) {
                return self.fail(info);
            }

            return self.success(user, info);
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
    });
};



/**
 * Export the Jwt Strategy
 */
 module.exports = JwtStrategy;
