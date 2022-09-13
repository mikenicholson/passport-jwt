var Strategy = require("../dist/cjs/auto/index.cjs").Strategy;
var mock = require("./mock_data.cjs");
var chai = require("chai");

describe('Strategy Auto', function () {

    describe('Strategy auto works without driver', function () {
        var strategy, message;

        before(function (done) {
            strategy = new Strategy({
                jwtFromRequest: mock.jwtExtractor,
                secretOrKey: mock.valid_jwt.secret
            }, function (jwt_payload, next) {
                // Return values aren't important in this case
                next(null, jwt_payload);
            });

            chai.passport.use(strategy).success(function (msg) {
                message = msg;
                done();
            }).authenticate();
        });

        it("should be able to grant access without an given driver", function () {
            expect(message).to.be.deep.equal(mock.valid_jwt.payload);
        });
    });

    describe('Strategy auto validates without driver', function () {
        var strategy, message, options;

        before(function (done) {
            function TestDriver(jsonwebtoken, givenOptions) {
                options = givenOptions;

                TestDriver.prototype.validate = function () {
                    return Promise.resolve({
                        success: false,
                        message: "test"
                    });
                };
            }

            Strategy.OverrideAutoDriver = TestDriver;
            strategy = new Strategy({
                jwtFromRequest: mock.jwtExtractor,
                secretOrKey: 'secret',
                issuer: "TestIssuer",
                ignoreExpiration: false,
                jsonWebTokenOptions: {
                    audience: "TestAudience",
                    algorithms: ["HS256", "HS384"],
                    maxAge: "1h",
                    clockTolerance: 10
                }
            }, function (jwt_payload, next) {
                // Return values aren't important in this case
                next(null, jwt_payload);
            });

            chai.passport.use(strategy).fail(function (msg) {
                message = msg;
                done();
            }).authenticate();
        });

        it('should call with the right issuer option', function () {
            expect(options).to.be.an("object");
            expect(options.issuer).to.equal('TestIssuer');
        });

        it('should call with the right audience option', function () {
            expect(options).to.be.an("object");
            expect(options.audience).to.equal('TestAudience');
        });

        it('should call with the right algorithms option', function () {
            expect(options).to.be.an("object");
            expect(options.algorithms).to.eql(["HS256", "HS384"]);
        });

        it('should call with the right ignoreExpiration option', function () {
            expect(options).to.be.an("object");
            expect(options.ignoreExpiration).to.be.false;
        });

        it('should call with the right maxAge option', function () {
            expect(options).to.be.an("object");
            expect(options.maxAge).to.equal('1h');
        });

        it('should call with the right clockTolerance option', function () {
            expect(options).to.be.an("object");
            expect(options.clockTolerance).to.equal(10);
        });
    });
});
