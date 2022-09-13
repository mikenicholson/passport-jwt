"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FailureMessages = exports.ErrorMessages = void 0;
var ErrorMessages;

(function (ErrorMessages) {
  ErrorMessages["INVALID_DRIVER"] = "JwtStrategy has been given an invalid driver without a validate function";
  ErrorMessages["NO_DRIVER_PROVIDED"] = "JwtStrategy requires a driver to function (see option jwtDriver) or alternatively import the strategy from 'passport-jwt/auto' to auto register the driver.";
  ErrorMessages["DRIVER_PROVIDES_KEY"] = "JwtStrategy has been provided with a SecretOrKey and a driver which contains a building secret.";
  ErrorMessages["BOTH_KEY_AND_PROVIDER"] = "JwtStrategy has been given both a secretOrKey and a secretOrKeyProvider.";
  ErrorMessages["LEGACY_OPTIONS_PASSED"] = "JwtStrategy has gained a JsonWebToken option, this is no longer supported in the current version. You can pass these options to the driver instead or import the library from 'passport-jwt/auto' to keep the legacy options.";
  ErrorMessages["NO_SECRET_KEY"] = "JwtStrategy requires a secret or key";
  ErrorMessages["NO_VERIFY_CALLBACK"] = "JwtStrategy requires a verify callback";
  ErrorMessages["NO_EXTRACTOR_FOUND"] = "JwtStrategy requires a function to retrieve a jwt from requests (see option jwtFromRequest)";
  ErrorMessages["UNKNOWN_DRIVER_ERROR"] = "JwtStrategy Unknown driver error occurred";
  ErrorMessages["NO_DRIVER_FAILURE_INFO"] = "JwtStrategy the driver did not return a failure message, this is required to be a string";
  ErrorMessages["PROVIDER_TIME_OUT"] = "JwtStrategy given SecretOrKey Provider did timeout, if you are sure it works you can disable the timeout check by setting checkIfProviderWorksTimeout to -1.";
  ErrorMessages["NO_PROMISE_RETURNED"] = "JwtStrategy requires a promise from the SecretOrKeyProvider or the provider should use the callback, something else has been passed.";
  ErrorMessages["JOSE_CORE_INCOMPATIBLE"] = "JoseDriver has been given an core which is incompatible with 'jose' library.";
  ErrorMessages["JWT_CORE_INCOMPATIBLE"] = "JsonWebTokenDriver has been given an core which is incompatible with 'jsonwebtoken' library.";
  ErrorMessages["NEST_CORE_INCOMPATIBLE"] = "NestJsJwtDriver has been given an core which is incompatible with '@nestjs/jwt' library.";
  ErrorMessages["USER_TURE_WITH_MESSAGE"] = "JwtStrategy validate callback did give both a truthful user object and a failure message, could not determine is user should be authenticated.";
})(ErrorMessages = exports.ErrorMessages || (exports.ErrorMessages = {}));

var FailureMessages;

(function (FailureMessages) {
  FailureMessages["NO_KEY_FROM_PROVIDER"] = "Provider did not return a key.";
  FailureMessages["USER_NOT_TRUE"] = "The provided user is not truthful";
  FailureMessages["NO_TOKEN_ASYNC"] = "No auth token has been resolved";
  FailureMessages["NO_TOKEN"] = "No auth token";
})(FailureMessages = exports.FailureMessages || (exports.FailureMessages = {}));
//# sourceMappingURL=error_messages.cjs.map
