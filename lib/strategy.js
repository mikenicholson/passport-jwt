var passport = require('passport-strategy')
    , util = require('util');



/**
 * Strategy constructor
 *
 * @param options
 *          secretOrKey: (REQUIRED) String or buffer containing the secret or PEM-encoded public key
 *          jwtFromRequest: (REQUIRED) Function that accepts a reqeust as the only parameter and returns the either JWT as a string or null
 *          issuer: If defined issuer will be verified against this value
 *          audience: If defined audience will be verified against this value
 *          algorithms: List of strings with the names of the allowed algorithms. For instance, ["HS256", "HS384"].
 *          ignoreExpiration: if true do not validate the expiration of the token.
 *          passReqToCallback: If true the, the verify callback will be called with args (request, jwt_payload, done_callback).
 * @param verify - Verify callback with args (jwt_payload, done_callback) if passReqToCallback is false,
 *                 (request, jwt_payload, done_callback) if true.
 */
function JwtStrategy(options, verify) {

    passport.Strategy.call(this);
    this.name = 'jwt';

    var getOptions = options;

    if (typeof options !== 'function') {
        getOptions = function(req, callback) { return callback(null, options); };
    }

    this._getOptions = function(req, callback) {
        return getOptions(req, _qualifyOptions(callback));
    };

    this._verify = verify;
    if (!this._verify) {
        throw new TypeError('JwtStrategy requires a verify callback');
    }

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
 * Returns a function to qualify the options then call callback with the
 * qualified options
 */
function _qualifyOptions(callback) {
  return function(err, options) {
    var result = {};

    if (err) {
      return callback(err);
    }

    if (!options) {
        return callback(new TypeError('options cannot be null'));
    }

    result._secretOrKey = options.secretOrKey;
    if (!result._secretOrKey) {
        return callback(new TypeError('JwtStrategy requires a secret or key'));
    }

    result.jwtFromRequest = options.jwtFromRequest;
    if (!result.jwtFromRequest) {
        return callback(new TypeError('JwtStrategy requires a function to retrieve jwt from requests (see option jwtFromRequest)'));
    }

    result.passReqToCallback = options.passReqToCallback;
    result.verifOpts = {};

    if (options.issuer) {
        result.verifOpts.issuer = options.issuer;
    }

    if (options.audience) {
        result.verifOpts.audience = options.audience;
    }

    if (options.algorithms) {
        result.verifOpts.algorithms = options.algorithms;
    }

    if (options.ignoreExpiration != null) {
        result.verifOpts.ignoreExpiration = options.ignoreExpiration;
    }

    callback(null, result);
  };

}


/**
 * Authenticate request based on JWT obtained from header or post body
 */
JwtStrategy.prototype.authenticate = function(req) {
    var self = this;

    self._getOptions(req, function(err, options) {
      if (err) {
          return self.fail(err);
      }

      var token = options.jwtFromRequest(req);

      if (!token) {
          return self.fail(new Error("No auth token"));
      }

      // Verify the JWT
      JwtStrategy.JwtVerifier(token, options._secretOrKey, options.verifOpts, function(jwt_err, payload) {
          if (jwt_err) {
              return self.fail(jwt_err);
          }

          // Pass the parsed token to the user
          var verified = function(err, user, info) {
              if (err) {
                  return self.error(err);
              }

              if (!user) {
                  return self.fail(info);
              }

              return self.success(user, info);
          };

          try {
              if (options.passReqToCallback) {
                  self._verify(req, payload, verified);
              } else {
                  self._verify(payload, verified);
              }
          } catch(ex) {
              self.error(ex);
          }
      });

    });

};



/**
 * Export the Jwt Strategy
 */
 module.exports = JwtStrategy;
