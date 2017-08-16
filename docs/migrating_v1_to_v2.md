# Migrating from version 1.x.x to 2.x.x
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
opts.tokenBodyField = 'MY_CUSTOM_BODY_FIELD';
opts.secretOrKey = 'secret';
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'yoursite.net';
passport.use(new JwtStrategy(opts, verifyFunction));
```

Identical behavior can be achieved under v2 with the versionOneCompatibility extractor:

```js
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.versionOneCompatibility({ tokenBodyField = 'MY_CUSTOM_BODY_FIELD' });
opts.opts.secretOrKey = 'secret';
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'yoursite.net';
passport.use(new JwtStrategy(opts, verifyFunction));
```


