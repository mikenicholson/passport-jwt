var jwt = require('jsonwebtoken');

module.exports  = function(token, secretOrKeyProvider, options, callback, verify = jwt.verify) {
    return secretOrKeyProvider(token, (err, secretOrKey) => {
        if (err) {
            callback(err);
            return;
        }
        verify(token, secretOrKey, options, callback);
    });
};
