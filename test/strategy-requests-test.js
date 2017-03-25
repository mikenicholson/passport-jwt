var Strategy = require('../lib/strategy')
    , chai = require('chai')
    , sinon = require('sinon')
    , test_data= require('./testdata')
    , url = require('url');


describe('Strategy', function() {

    var mockVerifier = null;

    before(function() {
        // Replace the JWT Verfier with a stub to capture the value
        // extracted from the request
        mockVerifier = sinon.stub();
        mockVerifier.callsArgWith(3, null, test_data.valid_jwt.payload);
        Strategy.JwtVerifier = mockVerifier;
    });



    describe('handling request JWT present in request', function() {

        before(function(done) {
            var strategy = new Strategy({
                    jwtFromRequest: function () { return test_data.valid_jwt.token; },
                    secretOrKey: 'secret'
                },
                function(jwt_payload, next) {
                    // Return values aren't important in this case
                    return next(null, {}, {});
                }
            );

            mockVerifier.reset();

            chai.passport.use(strategy)
                .success(function() {
                    done();
                })
                .authenticate();
        });


        it("verifies the right jwt", function() {
            sinon.assert.calledOnce(mockVerifier);
            expect(mockVerifier.args[0][0]).to.equal(test_data.valid_jwt.token);
        });
    });



    describe('handling request with NO JWT', function() {

        var info;

        before(function(done) {
            var strategy = new Strategy({jwtFromRequest: function() {}, secretOrKey: 'secret'}, function(jwt_payload, next) {
                // Return values aren't important in this case
                return next(null, {}, {});
            });

            mockVerifier.reset();

            chai.passport.use(strategy)
                .fail(function(i) {
                    info = i
                    done();
                })
                .req(function(req) {
                    req.body = {}
                })
                .authenticate();
        });


        it('should fail authentication', function() {
            expect(info).to.be.an.object;
            expect(info.message).to.equal("No auth token");
        });


        it('Should not try to verify anything', function() {
            sinon.assert.notCalled(mockVerifier);
        });

    });

    describe('handling request with dynamic options', function() {

        var info, optionsCallback;

        before(function() {
            var strategy = new Strategy(function(req, callback) {
                optionsCallback = callback;
            }, function(jwt_payload, next) {
                // Return values aren't important in this case
                return next(null, {}, {});
            });

            mockVerifier.reset();

            chai.passport.use(strategy)
                .fail(function(i) {
                    info = i
                })
                .req(function(req) {
                    req.body = {}
                })
                .success(function() {})
                .authenticate();
        });


        it('should fail authentication when resolved as an error', function() {
            optionsCallback(new Error('expected error message'));

            expect(info).to.be.an.object;
            expect(info.message).to.equal('expected error message');
        });

        it('should fail authentication when resolved with undefined options', function() {
            optionsCallback(null, null);

            expect(info).to.be.an.object;
            expect(info.message).to.equal('options cannot be null');
        });

        it('should work when resolved with valid options', function() {
          var validOptions = {
              jwtFromRequest: function () { return test_data.valid_jwt.token; },
              secretOrKey: 'secret'
          };

          optionsCallback(null, validOptions);

          sinon.assert.calledOnce(mockVerifier);
          expect(mockVerifier.args[0][0]).to.equal(test_data.valid_jwt.token);
        });
    });

    describe('handling request url set to url.Url instead of string', function() {

        var info;

        before(function(done) {
            var strategy = new Strategy({jwtFromRequest: function() {}, secretOrKey: 'secret'}, function(jwt_payload, next) {
                // Return values aren't important in this case
                return next(null, {}, {});
            });

            mockVerifier.reset();

            chai.passport.use(strategy)
                .fail(function(i) {
                    info = i
                    done();
                })
                .req(function(req) {
                    req.body = {};
                    req.url = new url.Url('/');
                })
                .authenticate();
        });


        it('should fail authentication', function() {
            expect(info).to.be.an.object;
            expect(info.message).to.equal("No auth token");
        });

    });


});
