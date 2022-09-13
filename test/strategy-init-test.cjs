var Strategy = require("../dist/cjs/jwt_strategy.cjs").JwtStrategy;
var mock = require("./mock_data.cjs");
var sinon = require('sinon');
var msg = require("../dist/cjs/error_messages.cjs").ErrorMessages;

describe('Strategy Init', function () {
    var strategy = new Strategy({
        jwtFromRequest: mock.jwtExtractor,
        secretOrKey: 'secret',
        jwtDriver: mock.jwtDriver
    }, function () {});

    it('should be named jwt', function () {
        expect(strategy.name).to.equal('jwt');
    });

    it('should throw if constructed without a driver', function () {
        expect(function () {
            var s = new Strategy({
                jwtFromRequest: mock.jwtExtractor,
                secretOrKey: 'secret'
            }, function () {
            });
        }).to.throw(TypeError, msg["NO_DRIVER_PROVIDED"]);
    });

    it('should throw if constructed without a verify callback', function () {
        expect(function () {
            var s = new Strategy({
                jwtFromRequest: function (r) {
                },
                secretOrKey: 'secret',
                jwtDriver: mock.jwtDriver
            });
        }).to.throw(TypeError, msg["NO_VERIFY_CALLBACK"]);
    });

    it('should throw if constructed neither a secretOrKey or a secretOrKeyProvider arg', function () {
        expect(function () {
            var s = new Strategy({
                jwtFromRequest: function (r) {
                },
                secretOrKey: null,
                jwtDriver: mock.jwtDriver
            }, function () {
            });
        }).to.throw(TypeError, msg["NO_SECRET_KEY"]);
    });

    it('should throw if a driver with a buildin key and a secretOrKey is provided.', function () {
        expect(function () {
            var s = new Strategy({
                jwtFromRequest: function (r) {
                },
                secretOrKey: "sadf",
                jwtDriver: {
                    keyIsProvidedByMe: true,
                    validate: function () {
                    }
                }
            }, function () {
            });
        }).to.throw(TypeError, msg["DRIVER_PROVIDES_KEY"]);
    });

    it('should throw if constructed with both a secretOrKey and a secretOrKeyProvider', function () {
        expect(function () {
            var s = new Strategy({
                secretOrKey: 'secret',
                secretOrKeyProvider: function (req, token, done) {
                },
                jwtFromRequest: function (r) {
                },
                jwtDriver: mock.jwtDriver
            });
        }).to.throw(TypeError, msg["BOTH_KEY_AND_PROVIDER"]);
    });

    it('should throw if legacy options are passed', function () {
        expect(function () {
            var s = new Strategy({
                secretOrKey: 'secret',
                jwtFromRequest: function (r) {
                },
                jwtDriver: mock.jwtDriver,
                jsonWebTokenOptions: {
                    audience: "TestAudience"
                }
            });
        }).to.throw(TypeError, msg["LEGACY_OPTIONS_PASSED"]);
    });

    it('should throw if an invalid driver is passed', function () {
        expect(function () {
            var s = new Strategy({
                secretOrKey: 'secret',
                jwtFromRequest: mock.jwtExtractor,
                jwtDriver: {}
            });
        }).to.throw(TypeError, msg["INVALID_DRIVER"]);
    });

    it('should throw if constructed without a jwtFromRequest arg', function () {
        expect(function () {
            var s = new Strategy({
                secretOrKey: 'secret',
                jwtDriver: mock.jwtDriver
            }, function () {
            });
        }).to.throw(TypeError, msg["NO_EXTRACTOR_FOUND"]);
    });

    after(function () {
        sinon.restore();
    });
});
