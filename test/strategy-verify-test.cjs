var chai = require('chai');
var Strategy = require("../dist/cjs/jwt_strategy.cjs").JwtStrategy;
var sinon = require('sinon');
var extract_jwt = require("../dist/cjs/extract_jwt.cjs").ExtractJwt;
var mock = require("./mock_data.cjs");
var emsg = require("../dist/cjs/error_messages.cjs").ErrorMessages;
var msg = Object.assign(emsg, require("../dist/cjs/error_messages.cjs").FailureMessages);

describe('Strategy Verify', function () {
    var validationSpy;

    before(function () {
        validationSpy = sinon.spy(mock.jwtDriver, "validate");
    });

    describe('Handling a request with a valid JWT and succesful verification', function () {
        var strategy, user, info;

        before(function (done) {
            strategy = new Strategy({
                jwtFromRequest: extract_jwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: 'secret',
                jwtDriver: mock.jwtDriver
            }, function (jwt_paylod, next) {
                return next(null, {
                    user_id: 1234567890
                }, {
                    foo: 'bar'
                });
            });

            chai.passport.use(strategy).success(function (u, i) {
                user = u;
                info = i;
                done();
            }).request(function (req) {
                req.headers['authorization'] = "bearer " + mock.valid_jwt.token;
            }).authenticate();
        });

        it('should provide a user', function () {
            expect(user).to.be.an("object");
            expect(user.user_id).to.equal(1234567890);
        });

        it('should forward info', function () {
            expect(info).to.be.an("object");
            expect(info.foo).to.equal('bar');
        });
    });

    describe('handling a request with valid jwt and failed verification with a failure message', function () {
        var strategy, fail;

        before(function (done) {
            strategy = new Strategy({
                jwtFromRequest: mock.jwtExtractor,
                secretOrKey: 'secret',
                jwtDriver: mock.jwtDriver
            }, function (jwt_payload, next) {
                return next(null, false, {
                    message: 'invalid user custom'
                });
            });

            chai.passport.use(strategy).fail(function (i) {
                fail = i;
                done();
            }).authenticate();
        });

        it("should fail to authenticate with the custom message", function () {
            expect(fail).to.be.a.string("invalid user custom");
        });
    });

    describe('handling a request when the callback gives a non true user without an message', function () {
        before(function (done) {
            strategy = new Strategy({
                jwtFromRequest: mock.jwtExtractor,
                secretOrKey: 'secret',
                jwtDriver: mock.jwtDriver
            }, function (jwt_payload, next) {
                return next(null, false);
            });

            chai.passport.use(strategy).fail(function (i) {
                info = i;
                done();
            }).authenticate();
        });

        it('should fail with the generic user not found message', function () {
            expect(info).to.be.a.string(msg["USER_NOT_TRUTHY"]);
        });
    });
    describe('handling a request with a valid jwt and an error during verification', function () {
        var strategy, err;

        before(function (done) {
            strategy = new Strategy({
                jwtFromRequest: extract_jwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: 'secret',
                jwtDriver: mock.jwtDriver
            }, function (jwt_payload, next) {
                return next("ERROR", false, {
                    message: 'invalid user'
                });
            });

            chai.passport.use(strategy).error(function (e) {
                err = e;
                done();
            }).request(function (req) {
                req.headers['authorization'] = "bearer " + mock.valid_jwt.token;
            }).authenticate();
        });

        it('should error', function () {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.equal('ERROR');
        });
    });

    describe('handling a request with a valid jwt and an exception during verification', function () {
        var strategy, err;

        before(function (done) {
            strategy = new Strategy({
                jwtFromRequest: extract_jwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: 'secret',
                jwtDriver: mock.jwtDriver
            }, function (jwt_payload, next) {
                throw new Error("EXCEPTION");
            });

            chai.passport.use(strategy).error(function (e) {
                err = e;
                done();
            }).request(function (req) {
                req.headers['authorization'] = "bearer " + mock.valid_jwt.token;
            }).authenticate();
        });

        it('should error', function () {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.equal('EXCEPTION');
        });
    });

    describe('handling a request with a valid jwt and option passReqToCallback is true', function () {
        var strategy, expected_request, request_arg;

        before(function (done) {
            opts = {
                passReqToCallback: true
            };
            opts.secretOrKey = 'secret';
            opts.jwtDriver = mock.jwtDriver;
            opts.jwtFromRequest = extract_jwt.fromAuthHeaderAsBearerToken();

            strategy = new Strategy(opts, function (request, jwt_payload, next) {
                // Capture the value passed in as the request argument
                request_arg = request;
                return next(null, {
                    user_id: 1234567890
                }, {
                    foo: 'bar'
                });
            });

            chai.passport.use(strategy).success(function (u, i) {
                done();
            }).request(function (req) {
                req.headers['authorization'] = "bearer " + mock.valid_jwt.token;
                expected_request = req;
            }).authenticate();
        });

        it('will call verify with request as the first argument', function () {
            expect(expected_request).to.equal(request_arg);
        });
    });
    describe('handling a request when constructed with a secretOrKeyProvider function that succeeds', function () {
        var strategy, fakeSecretOrKeyProvider, expectedReqeust;

        before(function (done) {
            fakeSecretOrKeyProvider = sinon.spy(function (request, token, done) {
                done(null, 'secret from callback');
            });
            opts = {
                jwtDriver: mock.jwtDriver,
                secretOrKeyProvider: fakeSecretOrKeyProvider,
                jwtFromRequest: function (request) {
                    return "an undecoded jwt string";
                }
            };

            strategy = new Strategy(opts, function (jwtPayload, next) {
                return next(null, {
                    user_id: 'dont care'
                }, {});
            });

            chai.passport.use(strategy).request(function (req) {
                expectedReqeust = req;
            }).fail(function (msg) {
                done();
            }).authenticate();
        });

        it('should call the fake secret or key provider with the reqeust', function () {
            expect(fakeSecretOrKeyProvider.calledWith(expectedReqeust, sinon.match.any, sinon.match.any)).to.be.true;
        });

        it('should call the secretOrKeyProvider with the undecoded jwt', function () {
            expect(fakeSecretOrKeyProvider.calledWith(sinon.match.any, 'an undecoded jwt string', sinon.match.any)).to.be.true;
        });

        it('should call JwtVerifier with the value returned from secretOrKeyProvider', function () {
            expect(validationSpy.calledWith('an undecoded jwt string', 'secret from callback')).to.be.true;
        });
    });

    describe('handling a request when constructed with a secretOrKeyProvider function that errors', function () {
        var errorMessage;

        before(function (done) {
            fakeSecretOrKeyProvider = sinon.spy(function (request, token, done) {
                done('Error occurred looking for the secret');
            });

            opts = {
                secretOrKeyProvider: fakeSecretOrKeyProvider,
                jwtDriver: mock.jwtDriver,
                jwtFromRequest: function (request) {
                    return 'an undecoded jwt string';
                }
            };

            strategy = new Strategy(opts, function (jwtPayload, next) {
                return next(null, {
                    user_id: 'dont care'
                }, {});
            });

            chai.passport.use(strategy).fail(function (i) {
                errorMessage = i;
                done();
            }).authenticate();
        });

        it('should fail with the error message from the secretOrKeyProvider', function () {
            expect(errorMessage).to.equal('Error occurred looking for the secret');
        });
    });

    describe('handling a request when constructed with a secretOrKeyProvider function that returns something else', function () {
        var errorMessage;

        before(function (done) {
            fakeSecretOrKeyProvider = sinon.spy(function (request, token, done) {
                return {
                    message: "i could be some internal error"
                };
            });

            opts = {
                secretOrKeyProvider: fakeSecretOrKeyProvider,
                jwtDriver: mock.jwtDriver,
                jwtFromRequest: function (request) {
                    return 'an undecoded jwt string';
                }
            };

            strategy = new Strategy(opts, function (jwtPayload, next) {
                return next(null, {
                    user_id: 'dont care'
                }, {});
            });

            chai.passport.use(strategy).error(function (i) {
                errorMessage = i;
                done();
            }).authenticate();
        });

        it('should fail with the error message from the secretOrKeyProvider', function () {
            expect(errorMessage).to.be.instanceof(TypeError);
            expect(errorMessage.message).to.be.an.string(msg["NO_PROMISE_RETURNED"]);
        });
    });

    describe('handling a request when constructed with a secretOrKeyProvider function that resolves a promise', function () {
        var userObject;

        before(function (done) {
            fakeSecretOrKeyProvider = sinon.spy(function (request, token) {
                return Promise.resolve('secret');
            });

            opts = {
                secretOrKeyProvider: fakeSecretOrKeyProvider,
                jwtDriver: mock.jwtDriver,
                jwtFromRequest: mock.jwtExtractor
            };

            strategy = new Strategy(opts, function (jwtPayload, next) {
                return next(null, {
                    user_id: 'dont care'
                }, {});
            });

            chai.passport.use(strategy).success(function (i) {
                userObject = i;
                done();
            }).authenticate();
        });

        it('should successfully authenticate user', function () {
            expect(userObject).to.be.deep.equal({
                user_id: 'dont care'
            });
        });
    });

    describe('handling a request when constructed with a secretOrKeyProvider function that rejects a promise', function () {
        var errorMessage;

        before(function (done) {
            fakeSecretOrKeyProvider = sinon.spy(function (request, token) {
                return Promise.reject(new Error('Error occurred looking for the secret'));
            });

            opts = {
                secretOrKeyProvider: fakeSecretOrKeyProvider,
                jwtDriver: mock.jwtDriver,
                jwtFromRequest: function (request) {
                    return 'an undecoded jwt string';
                }
            };

            strategy = new Strategy(opts, function (jwtPayload, next) {
                return next(null, {
                    user_id: 'dont care'
                }, {});
            });

            chai.passport.use(strategy).error(function (i) {
                errorMessage = i;
                done();
            }).authenticate();
        });

        it('should fail with the error message from the secretOrKeyProvider Promise', function () {
            expect(errorMessage).to.be.instanceof(Error);
        });
    });
    describe('handling a request when constructed with a secretOrKeyProvider function that gives null to a promise', function () {
        var errorMessage;

        before(function (done) {
            fakeSecretOrKeyProvider = sinon.spy(function (request, token) {
                return Promise.resolve(null);
            });

            opts = {
                secretOrKeyProvider: fakeSecretOrKeyProvider,
                jwtDriver: mock.jwtDriver,
                jwtFromRequest: function (request) {
                    return 'an undecoded jwt string';
                }
            };

            strategy = new Strategy(opts, function (jwtPayload, next) {
                return next(null, {
                    user_id: 'dont care'
                }, {});
            });

            chai.passport.use(strategy).fail(function (i) {
                errorMessage = i;
                done();
            }).authenticate();
        });

        it('should fail with a generic error message', function () {
            expect(errorMessage).to.equal(msg["NO_KEY_FROM_PROVIDER"]);
        });
    });
    describe('handling a request when constructed with a secretOrKeyProvider function that does timeout', function () {
        var errorObj;

        before(function (done) {
            fakeSecretOrKeyProvider = sinon.spy(function (request, token) {
            });

            opts = {
                secretOrKeyProvider: fakeSecretOrKeyProvider,
                jwtDriver: mock.jwtDriver,
                jwtFromRequest: mock.jwtExtractor,
                checkIfProviderWorksTimeout: 500
            };

            strategy = new Strategy(opts, function (jwtPayload, next) {
                return next(null, {
                    user_id: 'dont care'
                }, {});
            });

            chai.passport.use(strategy).error(function (i) {
                errorObj = i;
                done();
            }).authenticate();
        });

        it('should error with a timeout message', function () {
            expect(errorObj).to.be.instanceof(TypeError);
            expect(errorObj.message).to.be.an.string(msg["PROVIDER_TIME_OUT"]);
        });
    });

    after(function () {
        sinon.restore();
    });
});