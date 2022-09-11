# Migration Guide

The following instructions should help in migrating to a new major version of
passport-jwt.

## Migrating from 4.x.x to 5.x.x

Version 5.0.0 was released as a general modernization of the library, including new extractors, typescript support, all issues fixed,
twice as many tests (98% coverage) and a new abstract driver infrastructure.

Therefore, users of `passport-jwt` are no longer restricted to using the `jsonwebtoken` library.
The choice of this abstraction was made because the `jsonwebtoken` library is outdated and only receives security fixes.
The new abstraction allows the use of any jwt validator and some popular validators are pre-implemented,
these are: `jsonwebtoken`, `jose`, `@nestjs/jwt`. To make use of this new structure a driver option must be included during loading,
alternatively to make migration easy it is also possible to include the `passport-jwt/auto` library to automatically load the `jsonwebtoken` driver.
all options from `jsonWebTokenOptions` and the older legacy options are now passed to the driver directly.

**From** using v4.x.x (to make this example work in v5.x.x simply change the import path to `passport-jwt/auto` for the strategy)
```javascript
var JwtStrategy = require('passport-jwt' /* change here */).Strategy,
        ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
opts.issuer = 'accounts.examplesoft.com';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  //... validate user
  done(null, user)
}));
```
**To** using v5.x.x with the driver infrastructure.
```javascript
var JwtStrategy = require('passport-jwt').Strategy,
        ExtractJwt = require('passport-jwt').ExtractJwt;
        JwtDriver = require('passport-jwt/platform-jsonwebtoken').JsonWebTokenDriver;
        jsonwebtoken = require('jsonwebtoken');
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.jwtDriver = new JwtDriver(jsonwebtoken, {
    issuer: 'accounts.examplesoft.com'
});
opts.secretOrKey = 'secret';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  //... validate user
  done(null, user);
}));
```
**Or** you can use the more modern `jose` library like this:
```javascript
var JwtStrategy = require('passport-jwt').Strategy,
        ExtractJwt = require('passport-jwt').ExtractJwt;
        JwtDriver = require('passport-jwt/platform-jose').JoseDriver;
        jose = require('jose');
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.jwtDriver = new JwtDriver(jose, {
    issuer: 'accounts.examplesoft.com'
});
opts.secretOrKey = 'secret';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  //... validate user
  done(null, user);
}));
```
See the documentation for more examples and integration with `typescript` and `@nestjs/jwt`. 
Click [here](typescript.md) for the typescript documentation and examples to migrate away from `commonjs`. 
Click [here](nestjs.md) to view examples on how to integrate with `@nestjs/passport`. 
and as a final note, all compatibility with version 1 has been removed, for most people this only means that the `versionOneCompatibility` extractor no longer works. 

## Migrating from 3.x.x to 4.x.x

Version 4.0.0 was released to update [jsonwebtoken's](https://github.com/auth0/node-jsonwebtoken)
major version from v7 to v8 in order to fix a security issue (see
[#147](https://github.com/mikenicholson/passport-jwt/issues/147)).

Users of `passport-jwt` are exposed to the API of `jsonwebtoken` through the `jsonWebTokenOptions`
constructor option.  Therefore, a major version rev of `jsonwebtoken` triggered a major version rev
of `passport-jwt`.

See the
[jsonwebtoken v7-v8 Migration Notes](https://github.com/auth0/node-jsonwebtoken/wiki/Migration-Notes:-v7-to-v8)
for the full details. The change in units for the `maxAge` attribute of `jsonWebTokenOptions` is
likely to impact the greatest number of `passport-jwt` users.

## Migrating from 2.x.x to 3.x.x

Version 3.0.0 removes the `ExtractJwt.fromAuthHeader()` extractor function that would extract
JWT's from `Authorization` headers with the auth scheme 'jwt'. The default authorization scheme
of 'jwt' as the was not RFC 6750 compliant.  The extractor was replaced with 
`ExtractJwt.fromAuthHeaderAsBearerToken()`.  The removal of `ExtractJwt.fromAuthHeader()` was done
to clearly change the API so any code relying on the old API would clearly break, hopefully saving
people some debugging time.

If you want to maintain the behavior of `ExtractJwt.fromAuthHeader()` when switching to v3.3.0, simply 
replace it with `ExtractJwt.fromAuthHeaderWithScheme('jwt')` in your implementation.

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
