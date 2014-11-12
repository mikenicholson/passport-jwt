var passport = require('passport-strategy')
    , auth_hdr = require('./auth_header')
    , util = require('util');

// Note: express http converts all headers
// to lower case.
var AUTH_HEADER = "authorization"
    , DEFAULT_AUTH_SCHEME = "JWT"

/**
 * Strategy constructor
 *
 * @param secretOrKey - string or buffer containing the secret or PEM-encoded public key
 * @param options
 *          issuer: If defined issuer will be verified against this value
 *          audience: If defined audience will be verified against this value
 *          tokenBodyField: Field in request body containing token. Default is auth_token.
 *          authScheme: Expected scheme when JWT can be found in HTTP Authorize header. Default is JWT.
 * @param verify - Verify callback with args (jwt_payload, done_callback)
 */
function JwtStrategy(secretOrKey, options, verify) {
    if (typeof options == 'function') {
        verify = options;
        options = {};
    }

    if (!verify) {
        throw new TypeError('JwtStrategy requires a verify callback');
    }

    if (!secretOrKey) {
        throw new TypeError('JwtStrategy requires a secret or key');
    }

    passport.Strategy.call(this);
    this.name = 'jwt';
    this._secretOrKey = secretOrKey;
    this._verify = verify;
    this._passReqToCallback = options.passReqToCallback;
    this._authScheme = options.authScheme || DEFAULT_AUTH_SCHEME;
    this._tokenBodyField = options.tokenBodyField;
    this._verifOpts = {} 

    if (options.issuer) {
        this._verifOpts.issuer = options.issuer;
    }

    if (options.audience) {
        this._verifOpts.audience = options.audience;
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
        if (self._authScheme === auth_params.scheme) {
            token = auth_params.value;
        }
    }

    // If not in the header try the body
    if (!token && req.body) {
        token = req.body.auth_token;
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
                self._verify(payload, verified); 
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
