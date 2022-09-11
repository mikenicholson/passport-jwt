var Strategy = require('../dist/cjs/jwt_strategy').JwtStrategy;
var mock = require('./mock_data');
var sinon = require('sinon');

describe('Strategy Init', function () {
    var strategy = new Strategy({
        jwtFromRequest: mock.jwtExtractor,
        secretOrKey: 'secret',
        jwtDriver: mock.jwtDriver
    }, function () {
    });

    it('should be named jwt', function () {
        expect(strategy.name).to.equal('jwt');
    });

    it('should throw if constructed without a driver', function () {
        expect(function () {
            var s = new Strategy({jwtFromRequest: mock.jwtExtractor, secretOrKey: 'secret'}, function () {
            });
        }).to.throw(TypeError, "JwtStrategy requires a driver to function (see option jwtDriver) or alternatively import the strategy from 'passport-jwt/auto' to auto register the driver");
    });

    it('should throw if constructed without a verify callback', function () {
        expect(function () {
            var s = new Strategy({
                jwtFromRequest: function (r) {
                }, secretOrKey: 'secret', jwtDriver: mock.jwtDriver
            });
        }).to.throw(TypeError, "JwtStrategy requires a verify callback");
    });


    it('should throw if constructed neither a secretOrKey or a secretOrKeyProvider arg', function () {
        expect(function () {
            var s = new Strategy({
                jwtFromRequest: function (r) {
                }, secretOrKey: null, jwtDriver: mock.jwtDriver
            }, function () {
            });
        }).to.throw(TypeError, 'JwtStrategy requires a secret or key');
    });

    it('should throw if a driver with a buildin key and a secretOrKey is provided.', function () {
        expect(function () {
            var s = new Strategy({
                jwtFromRequest: function (r) {
                }, secretOrKey: "sadf", jwtDriver: {keyIsProvidedByMe: true}
            }, function () {
            });
        }).to.throw(TypeError, 'SecretOrKey is provided by the driver and cannot be given as an option.');
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
        }).to.throw(TypeError);
    });

    it('should throw if legacy options are passed', function () {
        expect(function () {
            var s = new Strategy({
                secretOrKey: 'secret',
                secretOrKeyProvider: function (req, token, done) {
                },
                jwtFromRequest: function (r) {
                },
                jwtDriver: mock.jwtDriver,
                jsonWebTokenOptions: {
                    audience: "TestAudience"
                }
            });
        }).to.throw(TypeError);
    });


    it('should throw if constructed without a jwtFromRequest arg', function () {
        expect(function () {
            var s = new Strategy({secretOrKey: 'secret', jwtDriver: mock.jwtDriver}, function () {
            });
        }).to.throw(TypeError);
    });

    after(function () {
        sinon.restore();
    })
});
