var Strategy = require("../dist/cjs/jwt_strategy.cjs").JwtStrategy;
var mock = require("./mock_data.cjs");
var chai = require("chai");
var sinon = require("sinon");
var joseDriver = require("../dist/cjs/platforms/jose.cjs").JoseDriver;
var jose = require("jose");
var jsonwebtoken = require("jsonwebtoken");
var createSecretKey = require("crypto").createSecretKey;
var jwtDriver = require("../dist/cjs/platforms/jsonwebtoken.cjs").JsonWebTokenDriver;
var nestDriver = require("../dist/cjs/platforms/nestjsjwt.cjs").NestJsJwtDriver;
var nestService = require("@nestjs/jwt").JwtService;
var msg = require("../dist/cjs/error_messages.cjs").ErrorMessages;

describe("Jwt Driver Validation", function () {

    describe('Driver Errors', function () {
        var error;

        before(function (done) {
            var driver = {
                validate: function () {
                    throw new Error("Unexpected driver error");
                }
            };
            var strategy = new Strategy({
                jwtFromRequest: mock.jwtExtractor,
                secretOrKey: "secret",
                jwtDriver: driver
            }, function (payload, next) {
                next(null, payload);
            });

            chai.passport.use(strategy).error(function (err) {
                error = err;
                done();
            }).authenticate();
        });

        it("should be able to handle a failing driver", function () {
            expect(error).to.be.instanceof(Error);
            expect(error.message).to.be.a.string("Unexpected driver error");
        });
    });

    describe("Driver Failures", function () {
        var error;

        before(function (done) {
            var driver = {
                validate: function () {
                    return Promise.resolve({
                        success: false,
                        message: null
                    });
                }
            };
            var strategy = new Strategy({
                jwtFromRequest: mock.jwtExtractor,
                secretOrKey: "secret",
                jwtDriver: driver
            }, function (payload, next) {
                next(null, payload);
            });

            chai.passport.use(strategy).error(function (err) {
                error = err;
                done();
            }).authenticate();
        });

        it("should be able to handle a failing driver", function () {
            expect(error).to.be.instanceof(Error);
            expect(error.message).to.be.a.string(msg["NO_DRIVER_FAILURE_INFO"]);
        });
    });

    describe('Mock Driver', function () {
        var strategy, driver, validationSpy, secretOrKeyStub;

        before(function (done) {
            validationSpy = sinon.stub();
            validationSpy.resetHistory();

            if (!secretOrKeyStub) {
                secretOrKeyStub = sinon.stub();
                secretOrKeyStub.onCall(0).returns("invalid-secret");
                secretOrKeyStub.onCall(1).returns("secret");
            }

            driver = mock.jwtDriver;
            strategy = new Strategy({
                jwtFromRequest: mock.jwtExtractor,
                secretOrKeyProvider: function (req, token, cb) {
                    var secret = secretOrKeyStub();
                    cb(null, secret);
                },
                jwtDriver: driver
            }, function (payload, next) {
                validationSpy();
                next(null, payload);
            });

            chai.passport.use(strategy).success(function (u, i) {
                done();
            }).fail(function (err) {
                done();
            }).error(function (err) {
                expect(err).to.not.exist;
                done();
            }).authenticate();
        });

        it("should fail in full when a non-valid JWT token is provided", function () {
            chai.passport.use(strategy).authenticate();
            sinon.assert.notCalled(validationSpy);
        });

        it("should work in full when a valid JWT token is provided", function () {
            chai.passport.use(strategy).authenticate();
            sinon.assert.calledOnce(validationSpy);
        });

        it("should be able to validate a valid JWT token", function (done) {
            driver.validate(mock.valid_jwt.token, mock.valid_jwt.secret).then(function (valid) {
                expect(valid.success).to.be.true;
                expect(valid.message).to.be.undefined;
                expect(valid.payload).to.be.deep.equal(mock.valid_jwt.payload);
                done();
            });
        });

        it("should be able to fail with an invalid secret", function (done) {
            driver.validate(mock.valid_jwt.token, "invalid-secret").then(function (valid) {
                expect(valid.success).to.be.false;
                expect(valid.message).to.be.an("string");
                expect(valid.payload).to.be.undefined;
                done();
            });
        });
    });

    describe('Jose Driver', function () {
        var strategy, driver, validationSpy, secretOrKeyStub;

        before(function (done) {
            validationSpy = sinon.stub();
            validationSpy.resetHistory();
            if (!secretOrKeyStub) {
                secretOrKeyStub = sinon.stub();
                secretOrKeyStub.onCall(0).returns(createSecretKey("invalid-secret"));
                secretOrKeyStub.onCall(1).returns("secret");
            }
            driver = new joseDriver(jose, {});

            strategy = new Strategy({
                jwtFromRequest: mock.jwtExtractor,
                secretOrKeyProvider: function (req, token, cb) {
                    var secret = secretOrKeyStub();
                    cb(null, secret);
                },
                jwtDriver: driver
            }, function (payload, next) {
                validationSpy();
                next(null, payload);
            });

            chai.passport.use(strategy).success(function (u, i) {
                done();
            }).fail(function (err) {
                done();
            }).error(function (err) {
                expect(err).to.not.exist;
                done();
            }).authenticate();
        });

        it("should fail in full when a non-valid JWT token is provided", function () {
            chai.passport.use(strategy).authenticate();
            sinon.assert.notCalled(validationSpy);
        });

        it("should work in full when a valid JWT token is provided", function () {
            chai.passport.use(strategy).authenticate();
            sinon.assert.calledOnce(validationSpy);
        });

        it("should be able to validate a valid JWT token", function (done) {
            driver.validate(mock.valid_jwt.token, mock.valid_jwt.secret).then(function (valid) {
                expect(valid.success).to.be.true;
                expect(valid.message).to.be.undefined;
                expect(valid.payload).to.be.deep.equal(mock.valid_jwt.payload);
                done();
            });
        });

        it("should be able to fail with an invalid secret", function (done) {
            driver.validate(mock.valid_jwt.token, "invalid-secret").then(function (valid) {
                expect(valid.success).to.be.false;
                expect(valid.message).to.be.an("string");
                expect(valid.payload).to.be.undefined;
                done();
            });
        });

        it("should be able to fail with an invalid issuer", function (done) {
            driver.validate(mock.valid_jwt.token, "invalid-secret", {
                issuer: "invalid-iss"
            }).then(function (valid) {
                expect(valid.success).to.be.false;
                expect(valid.message).to.be.an("string");
                expect(valid.payload).to.be.undefined;
                done();
            });
        });

        it("should be able to fail with an invalid audience", function (done) {
            driver.validate(mock.valid_jwt.token, "invalid-secret", {
                audience: "invalid-aud"
            }).then(function (valid) {
                expect(valid.success).to.be.false;
                expect(valid.message).to.be.an("string");
                expect(valid.payload).to.be.undefined;
                done();
            });
        });

        it("should fail with an crafted none token", function (done) {
            driver.validate(mock.invalid_jwt_none.token, "secret").then(function (valid) {
                expect(valid.success).to.be.false;
                expect(valid.message).to.be.an("string");
                expect(valid.payload).to.be.undefined;
                done();
            });
        });

        it("should fail when an non valid core is give", function () {
            expect(function () {
                new joseDriver({
                    validate: true
                });
            }).to.throw(TypeError);
        });
    });

    describe('JsonWebToken Driver', function () {
        var strategy, driver, validationSpy, secretOrKeyStub;

        before(function (done) {
            validationSpy = sinon.stub();
            validationSpy.resetHistory();

            if (!secretOrKeyStub) {
                secretOrKeyStub = sinon.stub();
                secretOrKeyStub.onCall(0).returns("invalid-secret");
                secretOrKeyStub.onCall(1).returns("secret");
            }

            driver = new jwtDriver(jsonwebtoken);
            strategy = new Strategy({
                jwtFromRequest: mock.jwtExtractor,
                secretOrKeyProvider: function (req, token, cb) {
                    var secret = secretOrKeyStub();
                    cb(null, secret);
                },
                jwtDriver: driver
            }, function (payload, next) {
                validationSpy();
                next(null, payload);
            });

            chai.passport.use(strategy).success(function (u, i) {
                done();
            }).fail(function (err) {
                done();
            }).error(function (err) {
                expect(err).to.not.exist;
                done();
            }).authenticate();
        });

        it("should fail in full when a non-valid JWT token is provided", function () {
            chai.passport.use(strategy).authenticate();
            sinon.assert.notCalled(validationSpy);
        });

        it("should work in full when a valid JWT token is provided", function () {
            chai.passport.use(strategy).authenticate();
            sinon.assert.calledOnce(validationSpy);
        });

        it("should be able to validate a valid JWT token", function (done) {
            driver.validate(mock.valid_jwt.token, mock.valid_jwt.secret).then(function (valid) {
                expect(valid.success).to.be.true;
                expect(valid.message).to.be.undefined;
                expect(valid.payload).to.be.deep.equal(mock.valid_jwt.payload);
                done();
            });
        });

        it("should be able to fail with an invalid secret", function (done) {
            driver.validate(mock.valid_jwt.token, "invalid-secret").then(function (valid) {
                expect(valid.success).to.be.false;
                expect(valid.message).to.be.an("string");
                expect(valid.payload).to.be.undefined;
                done();
            });
        });

        it("should be able to fail with an invalid issuer", function (done) {
            driver.validate(mock.valid_jwt.token, "invalid-secret", {
                issuer: "invalid-iss"
            }).then(function (valid) {
                expect(valid.success).to.be.false;
                expect(valid.message).to.be.an("string");
                expect(valid.payload).to.be.undefined;
                done();
            });
        });

        it("should be able to fail with an invalid audience", function (done) {
            driver.validate(mock.valid_jwt.token, "invalid-secret", {
                audience: "invalid-aud"
            }).then(function (valid) {
                expect(valid.success).to.be.false;
                expect(valid.message).to.be.an("string");
                expect(valid.payload).to.be.undefined;
                done();
            });
        });

        it("should fail with an crafted none token", function (done) {
            driver.validate(mock.invalid_jwt_none.token, "secret").then(function (valid) {
                expect(valid.success).to.be.false;
                expect(valid.message).to.be.an("string");
                expect(valid.payload).to.be.undefined;
                done();
            });
        });

        it("should fail when an non valid core is give", function () {
            expect(function () {
                new jwtDriver({});
            }).to.throw(TypeError);
        });
    });

    describe('NestJsJwt Driver Success', function () {
        var strategy, driver, validationSpy, secretOrKeyStub;

        before(function (done) {
            validationSpy = sinon.stub();
            validationSpy.resetHistory();

            if (!secretOrKeyStub) {
                secretOrKeyStub = sinon.stub();
                secretOrKeyStub.onCall(0).returns("invalid-secret");
                secretOrKeyStub.onCall(1).returns("secret");
            }

            driver = new nestDriver(new nestService({
                secret: "secret"
            }));

            strategy = new Strategy({
                jwtFromRequest: mock.jwtExtractor,
                jwtDriver: driver
            }, function (payload, next) {
                validationSpy();
                next(null, payload);
            });

            chai.passport.use(strategy).success(function (u, i) {
                done();
            }).fail(function (err) {
                console.log({
                    err
                });
                done();
            }).error(function (err) {
                expect(err).to.not.exist;
                done();
            }).authenticate();
        });

        it("should construct the strategy without keyOrSecret", function () {
            expect(strategy.name).to.be.string("jwt");
        });

        it("should work in full when a valid JWT token is provided", function () {
            chai.passport.use(strategy).authenticate();
            sinon.assert.calledOnce(validationSpy);
        });

        it("should be able to validate a valid JWT token", function (done) {
            driver.validate(mock.valid_jwt.token, mock.valid_jwt.secret).then(function (valid) {
                expect(valid.success).to.be.true;
                expect(valid.message).to.be.undefined;
                expect(valid.payload).to.be.deep.equal(mock.valid_jwt.payload);
                done();
            });
        });

        it("should fail when no core is passed", function () {
            expect(function () {
                new nestDriver();
            }).to.throw(TypeError);
        });
    });

    describe('NestJsJwt Driver Failure', function () {
        var strategy, driver, validationSpy, secretOrKeyStub;

        before(function (done) {
            validationSpy = sinon.stub();
            validationSpy.resetHistory();

            if (!secretOrKeyStub) {
                secretOrKeyStub = sinon.stub();
                secretOrKeyStub.onCall(0).returns("invalid-secret");
                secretOrKeyStub.onCall(1).returns("secret");
            }

            driver = new nestDriver(new nestService({
                secret: "invalid-secret"
            }));

            strategy = new Strategy({
                jwtFromRequest: mock.jwtExtractor,
                jwtDriver: driver
            }, function (payload, next) {
                validationSpy();
                next(null, payload);
            });

            chai.passport.use(strategy).success(function (u, i) {
                done();
            }).fail(function (err) {
                done();
            }).error(function (err) {
                expect(err).to.not.exist;
                done();
            }).authenticate();
        });

        it("should fail in full when a non-valid JWT token is provided", function () {
            chai.passport.use(strategy).authenticate();
            sinon.assert.notCalled(validationSpy);
        });

        it("should be able to fail with an invalid secret", function (done) {
            driver.validate(mock.valid_jwt.token, "invalid-secret").then(function (valid) {
                expect(valid.success).to.be.false;
                expect(valid.message).to.be.an("string");
                expect(valid.payload).to.be.undefined;
                done();
            });
        });

        it("should be able to fail with an invalid issuer", function (done) {
            driver.validate(mock.valid_jwt.token, "invalid-secret", {
                issuer: "invalid-iss"
            }).then(function (valid) {
                expect(valid.success).to.be.false;
                expect(valid.message).to.be.an("string");
                expect(valid.payload).to.be.undefined;
                done();
            });
        });

        it("should be able to fail with an invalid audience", function (done) {
            driver.validate(mock.valid_jwt.token, "invalid-secret", {
                audience: "invalid-aud"
            }).then(function (valid) {
                expect(valid.success).to.be.false;
                expect(valid.message).to.be.an("string");
                expect(valid.payload).to.be.undefined;
                done();
            });
        });

        it("should fail with an crafted none token", function (done) {
            driver.validate(mock.invalid_jwt_none.token, "secret").then(function (valid) {
                expect(valid.success).to.be.false;
                expect(valid.message).to.be.an("string");
                expect(valid.payload).to.be.undefined;
                done();
            });
        });
    });

    after(function () {
        sinon.restore();
    });
});