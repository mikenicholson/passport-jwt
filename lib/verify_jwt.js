var jwt = require('jsonwebtoken');

module.exports  = function(token, secretOrKey, options, callback) {
  if (typeof secretOrKey === 'function') {
      secretOrKey(token, function(err, secret) {
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
