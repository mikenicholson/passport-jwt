var jwt = require('jsonwebtoken');

module.exports  = function(token, secretOrKey, options, req, callback) {
  if (typeof secretOrKey === 'function') {
      secretOrKey(token, req, function(err, secret) {
        if (err) {
          callback(err, null);
        } else if (!secret) {
          callback(new Error('Could not determine secret'), null);
        } else {
          return jwt.verify(token, secret, options, callback);
        }
      })
  } else {
      return jwt.verify(token, secretOrKey, options, callback);
  }
};
