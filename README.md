# passport-jwt

[![Build Status](https://travis-ci.org/mikenicholson/passport-jwt.svg?branch=master)](https://travis-ci.org/mikenicholson/passport-jwt)
[![Code Climate](https://codeclimate.com/github/mikenicholson/passport-jwt/badges/gpa.svg)](https://codeclimate.com/github/mikenicholson/passport-jwt)

A [Passport](http://passportjs.org/) strategy for authenticating with a
[JSON Web Token](http://jwt.io).

This module lets you authenticate endpoints using a JSON web token. It is
intended to be used to secure RESTful endpoints without sessions.

#### Update

Now **updated** to version v5.x.x with support for `typescript` and `jose`.

## Supported By

If you want to quickly add secure token-based authentication to Node.js apps, feel free to check out Auth0's Node.js SDK and free plan at [auth0.com/developers](https://auth0.com/developers?utm_source=GHsponsor&utm_medium=GHsponsor&utm_campaign=passport-jwt&utm_content=auth) <img alt='Auth0 Logo' src='https://s3.amazonaws.com/passport-jwt-img/Auth0+logo.svg'/>

## Install

    npm install passport-jwt

## Usage

### Configure Strategy

The JWT authentication strategy is constructed as follows:

    new JwtStrategy(options, verify)

`options` is an object literal containing options to control how the token is
extracted from the request or verified.

**(LEGACY)** options can only be used if the strategy is imported from `passport-jwt/auto`.\
**(REQUIRED)** options are required for the library to work correctly.\
**(MODERN)** is the recommended way to use the library and required if the library is imported from the main import.

* `secretOrKey` is a string or buffer containing the secret
  (symmetric) or PEM-encoded public key (asymmetric) for verifying the token's
  signature. REQUIRED unless `secretOrKeyProvider` is provided.
* `secretOrKeyProvider` is a callback in the format `function secretOrKeyProvider(request, rawJwtToken, done)`,
  which should call `done` with a secret or PEM-encoded public key (asymmetric) for the given key and request combination.
  `done` accepts arguments in the format `function done(err, secret)`. Note it is up to the implementer to decode rawJwtToken.
  REQUIRED unless `secretOrKey` is provided.
* `jwtFromRequest` (REQUIRED) Function that accepts a request as the only
  parameter and returns either the JWT as a string or *null*. See
  [Extracting the JWT from the request](#extracting-the-jwt-from-the-request) for
  more details.
* `issuer`: (LEGACY) If defined the token issuer (iss) will be verified against this
  value.
* `audience`: (LEGACY) If defined, the token audience (aud) will be verified against
  this value.
* `algorithms`: (LEGACY) List of strings with the names of the allowed algorithms. For instance, ["HS256", "HS384"].
* `ignoreExpiration`: (LEGACY) if true do not validate the expiration of the token.
* `passReqToCallback`: If true the request will be passed to the verify
  callback. i.e. verify(request, jwt_payload, done_callback).
* `jsonWebTokenOptions`: (LEGACY) passport-jwt is verifying the token using [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken).
Pass here an options object for any other option you can pass the jsonwebtoken verifier. (i.e maxAge)
* `jwtDriver`: (MODERN) the driver object can be imported from the platforms, for more information about drivers look below. 
All LEGACY options above are reimplemented in the driver infrastructure.

`verify` is a function with the parameters `verify(jwt_payload, done)`

* `jwt_payload` is an object literal containing the decoded JWT payload.
* `done` is a passport error first callback accepting arguments
  done(error, user, info)

# Example

An example using legacy configuration which reads the JWT from the http
Authorization header with the scheme 'bearer':

```js
var JwtStrategy = require('passport-jwt/auto').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'yoursite.net';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));
```
A more modern variant of the above example using esm and driver options.

```js
import {Strategy, ExtractJwt} from "passport-jwt";
import * as jose from "jose";
import {JoseDriver} from "passport-jwt/platform-jose";

const myValidator = (jwt_payload, done) => {
  User.findOne({id: jwt_payload.sub}).then(user => {
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
      // or you could create a new account
    }
  }).catch(err => done(err, false));
}

const strategy = new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  jwtDriver: new JoseDriver(jose, {
        issuer: 'accounts.examplesoft.com',
        audience: 'yoursite.net'
  }),
  secretOrKey: 'secret'
}, myValidator);

passport.use(strategy);
```

# Drivers
Drivers validate the jwt and return the payload to `passport`. 
They have a `validation` method that receives a token and a key and returns a result message.

`validate` is a method with the following signature `validate(token, key)` and returns `Promise<SuccesMessage>`.
* `token` is the token returned by the extractor.
* `key` is the key parsed by the (internal) keyOrSecret provider.

`SuccesMessage` is an object with the following properties `{success, message, payload}`.
* `success` is a boolean indicating whether the token is valid.
* `message` is a string containing the error message.
* `payload` is an object containing the payload.

`getOptions()` is a method that returns the options given to the constructor merged with the default options.

You can make custom drivers with the above signatures.
```javascript
var jwtValid = require('jwt-validator');
var MyValidator = {validate: function(token, key) {
    return Promise.resolve({
      success: jwtValid(token, key, {issuer: "name"}), 
      payload: {user: "name"}
    });
}}
// ...
jwtDriver: MyValidator,
// ...
```
**Or** in typescript

```typescript
import {JwtDriver, JwtResult} from "passport-jwt";
import jwtValid from "jwt-validator";

type MyCore = typeof jwtValid;
type MyPayload = {user: string};
type MyKey = string;
type MyOptions = {issuer: string};

class MyDriver extends JwtDriver<MyCore, MyOptions, MyKey> {
  public async validate(token /* :string */, key /* :MyKey */): Promise<JwtResult<MyPayload>> {
    return {
        success: this.driver(token, key, this.getOptions()), 
        payload: {user: "name"}
    };
  }
}
// ...
jwtDriver: new MyDriver(jwtValid, {issuer: "sdf"}),
// ...
```

### `jsonwebtoken` driver
`npm install jsonwebtoken` is the default library from auth0, although still supported it hasn't received an updated in years.
```typescript
import jsonwebtoken from "jsonwebtoken";
import {JsonWebTokenDriver} from "passport-jwt/jsonwebtoken";
// ...
const jwt = new JsonWebTokenDriver(jsonwebtoken, {
    // view the jsonwebtoken package for all options, legacy options can be used here.
});
// ...
jwtDriver = jwt,
// ...
```
### `jose` driver
`npm install jose` is a modern everything json library. recommended to use over `jsonwebtoken`.
```typescript
import * as jose from "jose";
import {JoseDriver} from "passport-jwt/platform-jose";
//...
const jos = new JoseDriver(jose, {
    // view the jose package for all options
});
// ...
jwtDriver: jos,
// ...
```
### `@nestjs/jwt` driver
`npm install @nestjs/jwt` uses `jsonwebtoken` as core with some tweaks (mainly `none` algorithms), it has a high integration with `nestjs`.
```typescript
import {JwtService} from "@nestjs/jwt";
import {NestJsJwtDriver} from "passport-jwt/platform-nestjsjwt";
// ...
const nest = new NestJsJwtDriver(JwtService, {
    // view the @nestjs/jwt package for all options 
    // most options are configured by the module see nestjs documentation
});
// ...
jwtDriver: nest,
// ...
```

### Extracting the JWT from the request

There are a number of ways the JWT may be included in a request.  In order to remain as flexible as
possible the JWT is parsed from the request by a user-supplied callback passed in as the
`jwtFromRequest` parameter.  This callback, from now on referred to as an extractor,
accepts a request object as an argument and returns the encoded JWT string or *null*.

#### Included extractors

A number of extractor factory functions are provided in passport-jwt.ExtractJwt. These factory
functions return a new extractor configured with the given parameters.

* ```fromCookie(cookie_name)``` Creates a new extractor that searches for the JWT in a given cookie.
* ```fromSignedCookie(cookie_name)``` Creates a new extractor that searches for the JWT in a given signed cookie.
encrypted cookies are encrypted and therefore cannot be read by the client. you need a third party implementation for this option.
* ```fromSessionKey(session_key)``` creates a new extractor that looks for the JWT in the given http
    session.
* ```fromRequestProperty(req_property_key)``` Creates a new extractor that looks for the JWT in the current request. 
This can be used if another middleware is extracting the JWT (e.g., from a websocket connection).
* ```fromHeader(header_name)``` creates a new extractor that looks for the JWT in the given http
  header.
* ```fromBodyField(field_name)``` creates a new extractor that looks for the JWT in the given body
  field.  You must have a body parser configured in order to use this method.
* ```fromUrlQueryParameter(param_name)``` creates a new extractor that looks for the JWT in the given
  URL query parameter.
* ```fromAuthHeaderWithScheme(auth_scheme)``` creates a new extractor that looks for the JWT in the
  authorization header, expecting the scheme to match auth_scheme.
* ```fromAuthHeaderAsBearerToken()``` creates a new extractor that looks for the JWT in the authorization header
  with the scheme 'bearer'
* ```fromExtractors([array of extractor functions])``` creates a new extractor using an array of
  extractors provided. Each extractor is attempted in order until one returns a token.

### Writing a custom extractor function

If the supplied extractors don't meet your needs you can easily provide your own callback. For
example, if you are using the cookie-parser middleware and want to extract the JWT in a cookie
you could use the following function as the argument to the jwtFromRequest option:

```javascript
var commaExtractor = function(req) {
    var token = null;
    if(req && req.cookies) {
        token = req.cookies["jwt"];
        if(token.endsWith(",")) {
            token = token.slice(0, -1);
        }
    }
    return token;
};
// ...
opts.jwtFromRequest = cookieExtractor;
```
**Or** in typescript (only as of v5.x.x)

```typescript
import {JwtExtractor} from "passport-jwt";

// can return a promise and therefore be async
export const commaExtractor: JwtExtractor = async (req /* :Request is implicitly added */) => {
    let token = null;
    if("jwt" in req.cookies && typeof req.cookies["jwt"] === "string") {
      token = req.cookies["jwt"];
      if(token.endsWith(",")) {
        token = token.slice(0, -1);
      }
    }
    return token;
}
// ...
jwtFromRequest: commaExtractor
```

### Authenticate requests

Use `passport.authenticate()` specifying `'JWT'` as the strategy.

```js
app.post('/profile', passport.authenticate('jwt', { session: false }),
    function(req, res) {
        res.send(req.user.profile);
    }
);
```

### Include the JWT in requests

The method of including a JWT in a request depends entirely on the extractor
function you choose. For example, if you use the `fromAuthHeaderAsBearerToken`
extractor, you would include an `Authorization` header in your request with the
scheme set to `bearer`. e.g.

    Authorization: bearer JSON_WEB_TOKEN_STRING.....

## Migrating

Read the [Migration Guide](docs/migrating.md) for help upgrading to the latest
major version of `passport-jwt`.

## Typescript

Read the [Typescript Guide](docs/typescript.md) for help upgrading to `typescript`.

## NestJs

Read the [NestJs Guide](docs/nestjs.md) for help in implementing `passport-jwt` in `nestjs`.

## Tests

    npm install
    npm test

To generate test-coverage reports:

    npm install -g istanbul
    npm run testcov
    istanbul report

## License

The [MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015 Mike Nicholson (Original Implementation) \
Copyright (c) 2022 Outernet (Typescript Rewrite)
