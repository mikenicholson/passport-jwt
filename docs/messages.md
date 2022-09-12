# Error Messages
In the v5.x.x release, error messages are included in an enum,
this allows the message to be changed later without breaking existing code that looks at it.

Let's take a look at an example implementation. (which we found being used)

```javascript
// ... code passport
function onFail(msg) {
    // this is always the wrong thing to do, always
    if(msg == "No auth token") {
        // ... do something else
    };
}
```
This can be replaced with an enum, keep in mind that it is still not recommended, but always better than hardcoding
```javascript
/** CommonJs */
var errors = require("passport-jwt").FailureMessages
// ... code passport
function onFail(msg) {
    // this is slightly better, but only use when absolutely necessary.
    if(msg == erros["NO_TOKEN"]) {
        // ... do something else
    };
}

/** ESM */
import {FailureMessages} from "passport-jwt";
// ... code
FailureMessages.NO_TOKEN
````
These are currently all the standard errors messages that the library can throw.
```typescript
enum ErrorMessages {
    INVALID_DRIVER = "JwtStrategy has been given an invalid driver without a validate function",
    NO_DRIVER_PROVIDED = "JwtStrategy requires a driver to function (see option jwtDriver) or alternatively import the strategy from 'passport-jwt/auto' to auto register the driver.",
    DRIVER_PROVIDES_KEY = "JwtStrategy has been provided with a SecretOrKey and a driver which contains a building secret.",
    BOTH_KEY_AND_PROVIDER = "JwtStrategy has been given both a secretOrKey and a secretOrKeyProvider.",
    LEGACY_OPTIONS_PASSED = "JwtStrategy has gained a JsonWebToken option, this is no longer supported in the current version. You can pass these options to the driver instead or import the library from 'passport-jwt/auto' to keep the legacy options.",
    NO_SECRET_KEY = "JwtStrategy requires a secret or key",
    NO_VERIFY_CALLBACK = "JwtStrategy requires a verify callback",
    NO_EXTRACTOR_FOUND = "JwtStrategy requires a function to retrieve a jwt from requests (see option jwtFromRequest)",
    UNKNOWN_DRIVER_ERROR = "JwtStrategy Unknown driver error occurred",
    NO_DRIVER_FAILURE_INFO = "JwtStrategy the driver did not return a failure message, this is required to be a string",
    PROVIDER_TIME_OUT = "JwtStrategy given SecretOrKey Provider did timeout, if you are sure it works you can disable the timeout check by setting checkIfProviderWorksTimeout to -1.",
    NO_PROMISE_RETURNED = "JwtStrategy requires a promise from the SecretOrKeyProvider or the provider should use the callback, something else has been passed.",
    JOSE_CORE_INCOMPATIBLE = "JoseDriver has been given an core which is incompatible with 'jose' library.",
    JWT_CORE_INCOMPATIBLE = "JsonWebTokenDriver has been given an core which is incompatible with 'jsonwebtoken' library.",
    NEST_CORE_INCOMPATIBLE = "NestJsJwtDriver has been given an core which is incompatible with '@nestjs/jwt' library.",
    USER_TURE_WITH_MESSAGE = "JwtStrategy validate callback did give both a truthful user object and a failure message, could not determine is user should be authenticated."
}

enum FailureMessages {
    NO_KEY_FROM_PROVIDER = "Provider did not return a key.",
    USER_NOT_TRUE = "The provided user is not truthful",
    NO_TOKEN_ASYNC = "No auth token has been resolved",
    NO_TOKEN = "No auth token",
}
```
