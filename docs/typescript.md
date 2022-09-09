# Esm/Typescript Guide

The following examples should help in implementing the new typescript version of
passport-jwt.

# Migration from CJS
The following example can be migrated from `commonjs` to `esm`.
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
To convert code to ESM note the following: replace `require` with `import` and `var` with `const` and don't forget `function` with `=>`.
```js
import {Strategy, ExtractJwt} from "passport-jwt";
import {JoseDriver} from "passport-jwt/platform-jose";
import * as jose from "jose";

const strategy = new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    jwtDriver: new JwtDriver(jose, {
        issuer: 'accounts.examplesoft.com'
    }),
    secretOrKey: 'secret'
}, (jwt_payload, done) => {
    //... validate user
    done(null, user);
})

passport.use(strategy);
```
much better, next step typescript.
# Going to typescript
The `passport-jwt` library (as of v5.x.x) is fully typed. Any option will give intellisense now.
```typescript
import {Strategy, ExtractJwt} from "passport-jwt";
import {JoseDriver} from "passport-jwt/platform-jose";
import * as jose from "jose";

interface MyPayload {
    name: string;
}

const strategy = new Strategy<MyPayload>({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    jwtDriver: new JwtDriver(jose, {
        issuer: 'accounts.examplesoft.com'
        // intellisense here because of typescript
    }),
    secretOrKey: 'secret'
}, (jwt_payload, done) => {
    // jwt_payload is of type MyPayload
    done(null, user);
})

passport.use(strategy);
```
This example is now written entirely in typescript. The next step would be to use `nestjs` look [here](nestjs.md) for more examples
