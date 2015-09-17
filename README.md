# passport-jwt

A [Passport](http://passportjs.org/) strategy for authenticating with a
[JSON Web Token](http://jwt.io).

This module lets you authenticate endpoints using a JSON Web token. It is
intended to be used to secure RESTful endpoints without sessions.

## Install

    npm install passport-jwt

## Usage

### Configure Strategy

The jwt authentication strategy is constructed as follows:

    new JwtStrategy(options, verify)

`options` is an object literal containing options to control how the token is
extracted from the request or verified.

* `secretOrKey` is a REQUIRED string or buffer containing the secret
  (symmetric) or PEM-encoded public key (asymmetric) for verifying the token's
  signature.
* `issuer`: If defined the token issuer (iss) will be verified against this
  value.
* `audience`: If defined, the token audience (aud) will be verified against
  this value.
* `algorithms`: List of strings with the names of the allowed algorithms. For instance, ["HS256", "HS384"].
* `ignoreExpiration`: if true do not validate the expiration of the token.

* `tokenBodyField`: Field in a request body to search for the jwt.
  Default is auth_token.
* `tokenQueryParameterName`: Query parameter name containing the token.
  Default is auth_token.
* `authScheme`: Expected authorization scheme if token is submitted through
  the HTTP Authorization header. Defaults to JWT
* `passReqToCallback`: If true the request will be passed to the verify
  callback. i.e. verify(request, jwt_payload, done_callback).

`verify` is a function with args `verify(jwt_payload, done)`

* `jwt_payload` is an object literal containing the decoded JWT payload.
* `done` is a passport error first callback accepting arguments
  done(error, user, info)

An example configuration:

```js
var JwtStrategy = require('passport-jwt').Strategy;
var opts = {}
opts.secretOrKey = 'secret';
opts.issuer = "accounts.examplesoft.com";
opts.audience = "yoursite.net";
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, user) {
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
```

### Authenticate requests

Use `passport.authenticate()` specifying `'jwt'` as the strategy.

```js
app.post('/profile', passport.authenticate('jwt', { session: false}),
    function(req, res) {
        res.send(req.user.profile);
    }
);
```

### Include the JWT in requests

The strategy will first check the request for the standard *Authorization*
header. If this header is present and the scheme matches `options.authScheme`
or 'JWT' if no auth scheme was specified then the token will be retrieved from
it. e.g.

    Authorization: JWT JSON_WEB_TOKEN_STRING.....

If the authorization header with the expected scheme is not found, the request
body will be checked for a field matching either `options.tokenBodyField` or
`auth_token` if the option was not specified.

Finally, the URL query parameters will be checked for a field matching either
`options.tokenQueryParameterName` or `auth_token` if the option was not
sepcified.

## Tests

    npm install
    npm test

## License

The [MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015 Mike Nicholson
