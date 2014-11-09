# passport-jwt

[Passport](http://passportjs.org/) strategy for authenticating with a [JSON Web Token](http://jwt.io).

This module lets you authenticate endpoints using a JSON Web token. It is intended to be used to secure RESTful
endpoints without sessions.

## Install

This module has not yet been published to the public NPM repository.  Untill it is you can install it 
with the command 

    $ npm install git+https://github.com/themikenicholson/passport-jwt.git 

## Usage

### Configure Strategy

The jwt authentication strategy is constructed as follows: 
    
    new JwtStrategy(secretOrKey, options, verify)

`secretOrKey` is a string or buffer containing the secret (symmetric) or PEM-encoded public key (asymmetric)
for verifying the token's signature.

`options` is an object literal containing options to control how the token is extracted from the request or verified.
* `issuer`: If defined the token issuer (iss) will be verified against this value.
* `audience`: If defined the toekn audience (aud) will be verified against this value.
* `tokenBodyField`: Field in a request body to search for the jwt.  Default is auth_token.
* `tokenHeader`: HTTP header to search for the jwt. Default is x-auth_token.

`verify` is a function with args `verify(jwt_payload, done)`
* `jwt_payload` is an object literal containing the decoded JWT payload.
* `done` is a passport error first callback accepting arguments done(error, user, info)

An example configuration: 

    var JwtStrategy = require('passport-jwt');
    var opts = {issuer: "accounts.examplesoft.com", audience: "yoursite.net"};  
    passport.use(new JwtStrategy('secret', opts, function(jwt_paylaod, done) {
        User.findOne({id: jwt_paylaod.sub}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
                // or you could create a new account
            }
        });
    }));


### Authenticate requests

Use `passport.authenticate()` specifying `'jwt'` as the strategy.

The request's headers will first be searched for the id_token, then the request body if it is present. Since
token-based authentication is designed to replace cookie-based sessions you may want to dsable sessions when 
authenticating an endpoint with this strategy.

    app.post('/profile', passport.authenticate('jwt', { session: false}), 
        function(req, res) {
            res.send(req.user.profile);
        }
    );

## Tests

    $ npm install
    $ npm test

## License

The [MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2014 Mike Nicholson
