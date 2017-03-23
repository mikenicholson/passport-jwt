var jwt = require('jsonwebtoken');

module.exports  = function(token, secretOrKeyProvider, options, callback, verify = jwt.verify) {
  return secretOrKeyProvider(token)
    .then(secretOrKey => verify(token, secretOrKey, options, callback))
    .catch(error => callback(error));
};
