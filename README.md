

# passport-jwt

[![Build Status](https://travis-ci.org/themikenicholson/passport-jwt.svg?branch=master)](https://travis-ci.org/themikenicholson/passport-jwt)

A [Passport](http://passportjs.org/) strategy for authenticating with a
[JSON Web Token](http://jwt.io).

This module lets you authenticate endpoints using a JSON web token. It is
intended to be used to secure RESTful endpoints without sessions.

## Install

    npm install passport-jwt

## Usage

### Configure Strategy

The JWT authentication strategy is constructed as follows:

    new JwtStrategy(options, verify)

`options` is an object literal containing options to control how the token is
extracted from the request or verified.

* `secretOrKey` is a REQUIRED string or buffer containing the secret
  (symmetric) or PEM-encoded public key (asymmetric) for verifying the token's
  signature.

* `jwtFromRequest` (REQUIRED) Function that accepts a request as the only
  parameter and returns either the JWT as a string or *null*. See 
  [Extracting the JWT from the request](#extracting-the-jwt-from-the-request) for
  more details.
* `issuer`: If defined the token issuer (iss) will be verified against this
  value.
* `audience`: If defined, the token audience (aud) will be verified against
  this value.
* `algorithms`: List of strings with the names of the allowed algorithms. For instance, ["HS256", "HS384"].
* `ignoreExpiration`: if true do not validate the expiration of the token.
* `passReqToCallback`: If true the request will be passed to the verify
  callback. i.e. verify(request, jwt_payload, done_callback).

`verify` is a function with the parameters `verify(jwt_payload, done)`

* `jwt_payload` is an object literal containing the decoded JWT payload.
* `done` is a passport error first callback accepting arguments
  done(error, user, info)

An example configuration which reads the JWT from the http
Authorization header with the scheme 'JWT':

```js
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
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

### Extracting the JWT from the request

There are a number of ways the JWT may be included in a request.  In order to remain as flexible as
possible the JWT is parsed from the request by a user-supplied callback passed in as the
`jwtFromRequest` parameter.  This callback, from now on referred to as an extractor,
accepts a request object as an argument and returns the encoded JWT string or *null*.

#### Included extractors 

A number of extractor factory functions are provided in passport-jwt.ExtractJwt. These factory
functions return a new extractor configured with the given parameters.

* ```fromHeader(header_name)``` creates a new extractor that looks for the JWT in the given http
  header
* ```fromBodyField(field_name)``` creates a new extractor that looks for the JWT in the given body
  field.  You must have a body parser configured in order to use this method.
* ```fromUrlQueryParameter(param_name)``` creates a new extractor that looks for the JWT in the given
  URL query parameter.
* ```fromAuthHeaderWithScheme(auth_scheme)``` creates a new extractor that looks for the JWT in the
  authorization header, expecting the scheme to match auth_scheme.
* ```fromAuthHeader()``` creates a new extractor that looks for the JWT in the authorization header
  with the scheme 'JWT'
* ```fromExtractors([array of extractor functions])``` creates a new extractor using an array of
  extractors provided. Each extractor is attempted in order until one returns a token.

### Writing a custom extractor function

If the supplied extractors don't meet your needs you can easily provide your own callback. For
example, if you are using the cookie-parser middleware and want to extract the JWT in a cookie 
you could use the following function as the argument to the jwtFromRequest option:

```
var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['jwt'];
    }
    return token;
};
```

### Authenticate requests

Use `passport.authenticate()` specifying `'JWT'` as the strategy.

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
specified.

## Migrating from version 1.x.x to 2.x.x

The v2 API is not backwards compatible with v1, specifically with regards to the introduction
of the concept of JWT extractor functions.  If you require the legacy behavior in v1 you can use
the extractor function ```versionOneCompatibility(options)```

*options* is an object with any of the three custom JWT extraction options present in the v1
constructor:
* `tokenBodyField`: Field in a request body to search for the JWT.
  Default is auth_token.
* `tokenQueryParameterName`: Query parameter name containing the token.
  Default is auth_token.
* `authScheme`: Expected authorization scheme if token is submitted through
  the HTTP Authorization header. Defaults to JWT

If in v1 you constructed the strategy like this:

```js
var JwtStrategy = require('passport-jwt').Strategy;
var opts = {}
opts.tokenBodyField = "MY_CUSTOM_BODY_FIELD";
opts.secretOrKey = 'secret';
opts.issuer = "accounts.examplesoft.com";
opts.audience = "yoursite.net";
passport.use(new JwtStrategy(opts, verifyFunction));
```

Identical behavior can be achieved under v2 with the versionOneCompatibility extractor:

```js
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.versionOneCompatibility({ tokenBodyField = "MY_CUSTOM_BODY_FIELD" });
opts.opts.secretOrKey = 'secret';
opts.issuer = "accounts.examplesoft.com";
opts.audience = "yoursite.net";
passport.use(new JwtStrategy(opts, verifyFunction));
```


## Tests

    npm install
    npm test

To generate test-coverage reports:

    npm install -g istanbul
    npm run-script testcov
    istanbul report

## License

The [MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015 Mike Nicholson
