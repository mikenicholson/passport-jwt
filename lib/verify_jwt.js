var jwt = require('jsonwebtoken');

module.exports  = function(token, secretOrKeyProvider, options, callback, verify) {
    if (!verify) {
      verify = jwt.verify;
    }
    return secretOrKeyProvider(token, function (err, secretOrKey) {
        if (err) {
            callback(err);
            return;
        }
        verify(token, secretOrKey, options, callback);
    });
};
