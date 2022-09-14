var Strategy = require("../dist/cjs/jwt_strategy.cjs").JwtStrategy;
var chai = require('chai');
var sinon = require('sinon');
var url = require('url');
var mock = require("./mock_data.cjs");
var msg = require("../dist/cjs/error_messages.cjs").ErrorMessages;

describe('Strategy Request', function () {
    var mockVerifier; //

    before(function () {
        // Replace the JWT Verfier with a stub to capture the value
        // extracted from the request
        mockVerifier = mockVerifier || sinon.spy(mock.jwtDriver, "validate");
    });

    describe('handling request with an unresolved extractor', function () {
        var strategy, error;

        before(function (done) {
            strategy = new Strategy({
                jwtFromRequest: function () {
                    return Promise.reject(new Error('Unrolved extractor'));
                },
                secretOrKey: 'secret',
                jwtDriver: mock.jwtDriver
            }, function (jwt_payload, next) {
                // Return values aren't important in this case
                next(null, jwt_payload);
            });

            chai.passport.use(strategy).error(function (err) {
                error = err;
                done();
            }).authenticate();
        });

        it("should error when the extractor errors", function () {
            expect(error).to.be.an.instanceof(Error);
        });
    });

    describe('handling request with an resolved extractor', function () {
        var strategy, user;

        before(function (done) {
            strategy = new Strategy({
                jwtFromRequest: function () {
                    return Promise.resolve(mock.valid_jwt.token);
                },
                secretOrKey: 'secret',
                jwtDriver: mock.jwtDriver
            }, function (jwt_payload, next) {
                // Return values aren't important in this case
                next(null, jwt_payload);
            });

            chai.passport.use(strategy).success(function (u) {
                user = u;
                done();
            }).authenticate();
        });

        it("should succeed when the extractor resolves", function () {
            expect(user).to.be.an('object');
        });
    });

    describe('handling request with an nulled extractor', function () {
        var strategy, message;

        before(function (done) {
            strategy = new Strategy({
                jwtFromRequest: function () {
                    return Promise.resolve(null);
                },
                secretOrKey: 'secret',
                jwtDriver: mock.jwtDriver
            }, function (jwt_payload, next) {
                // Return values aren't important in this case
                next(null, jwt_payload);
            });

            chai.passport.use(strategy).fail(function (msg) {
                message = msg;
                done();
            }).authenticate();
        });

        it("should fail when the extractor fails to resolves", function () {
            expect(message).to.be.equal(msg["NO_TOKEN_ASYNC"]);
        });
    });

    describe('handling request JWT present in request', function () {
        var strategy;

        before(function (done) {
            strategy = new Strategy({
                jwtFromRequest: mock.jwtExtractor,
                secretOrKey: 'secret',
                jwtDriver: mock.jwtDriver
            }, function (jwt_payload, next) {
                // Return values aren't important in this case
                next(null, jwt_payload);
            });

            mockVerifier.resetHistory();

            chai.passport.use(strategy).success(function (u, i) {
                done();
            }).authenticate();
        });

        it("verifies the right jwt", function () {
            sinon.assert.calledOnce(mockVerifier);
            expect(mockVerifier.args[0][0]).to.equal(mock.valid_jwt.token);
        });
    });

    describe('handling request with NO JWT', function () {
        var info;

        before(function (done) {
            var strategy = new Strategy({
                jwtFromRequest: function (r) {
                },
                secretOrKey: 'secret',
                jwtDriver: mock.jwtDriver
            }, function (jwt_payload, next) {
                // Return values aren't important in this case
                return next(null, {}, {});
            });

            mockVerifier.resetHistory();

            chai.passport.use(strategy).fail(function (i) {
                info = i;
                done();
            }).request(function (req) {
                req.body = {};
            }).authenticate();
        });

        it('should fail authentication', function () {
            // expect(info).to.be.an("object");
            expect(info).to.equal("No auth token");
        });

        it('Should not try to verify anything', function () {
            sinon.assert.notCalled(mockVerifier);
        });
    });

    describe('handling request url set to url.Url instead of string', function () {
        var info;

        before(function (done) {
            var strategy = new Strategy({
                jwtFromRequest: function (r) {
                },
                secretOrKey: 'secret',
                jwtDriver: mock.jwtDriver
            }, function (jwt_payload, next) {
                // Return values aren't important in this case
                return next(null, {}, {});
            });

            mockVerifier.resetHistory();

            chai.passport.use(strategy).fail(function (i) {
                info = i;
                done();
            }).request(function (req) {
                req.body = {};
                req.url = new url.Url('/');
            }).authenticate();
        });

        it('should fail authentication', function () {
            // expect(info).to.be.an.object;
            expect(info).to.equal("No auth token");
        });
    });

    after(function () {
        sinon.restore();
    });
});