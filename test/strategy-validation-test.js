var Strategy = require('../dist/cjs/jwt_strategy').JwtStrategy;
var chai = require('chai');
var mock = require('./mock_data');
var sinon = require('sinon');
var extract_jwt = require('../dist/cjs/extract_jwt').ExtractJwt;

describe('Strategy Validation', function () {
    var mockVerifier;

    describe('calling JWT validation function', function () {
        var strategy;

        before(function (done) {
            verifyStub = sinon.stub();
            verifyStub.callsArgWith(1, null, {}, {});
            options = {};
            options.secretOrKey = 'secret';
            options.jwtDriver = mock.jwtDriver
            options.jwtFromRequest = extract_jwt.fromAuthHeaderAsBearerToken();
            strategy = new Strategy(options, verifyStub);

            mockVerifier = mockVerifier || sinon.spy(mock.jwtDriver, "validate");
            mockVerifier.resetHistory();

            chai.passport.use(strategy)
                .success(function (u, i) {
                    done();
                })
                .request(function (req) {
                    req.headers['authorization'] = "bearer " + mock.valid_jwt.token;
                })
                .authenticate();
        });


        it('should call with the right secret as an argument', function () {
            expect(mockVerifier.calledWith(mock.valid_jwt.token, "secret")).to.be.true;
        });

    });


    describe('handling valid jwt', function () {
        var strategy, payload;

        before(function (done) {
            strategy = new Strategy({
                jwtFromRequest: extract_jwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: 'secret',
                jwtDriver: mock.jwtDriver
            }, function (jwt_payload, next) {
                payload = jwt_payload;
                next(null, {}, {});
            });

            mockVerifier = mockVerifier || sinon.spy(mock.jwtDriver, 'validate')
            mockVerifier.resetHistory();

            chai.passport.use(strategy)
                .success(function (u, i) {
                    done();
                })
                .request(function (req) {
                    req.headers['authorization'] = "bearer " + mock.valid_jwt.token;
                })
                .authenticate();
        });


        it('should call verify with the correct payload', function () {
            expect(payload).to.deep.equal(mock.valid_jwt.payload);
        });


    });


    describe('handling failing jwt', function () {
        var strategy, info;
        var verify_spy = sinon.spy();

        before(function (done) {

            strategy = new Strategy({
                jwtFromRequest: extract_jwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: 'secret',
                jwtDriver: {
                    validate: function () {
                        return Promise.resolve({success: false, message: "jwt expired"})
                    }
                }
            }, verify_spy);

            chai.passport.use(strategy)
                .fail(function (i) {
                    info = i;
                    done();
                })
                .request(function (req) {
                    req.headers['authorization'] = "bearer " + mock.valid_jwt.token;
                })
                .authenticate();
        });


        it('should not call verify', function () {
            sinon.assert.notCalled(verify_spy);
        });


        it('should fail with error message.', function () {
            // expect(info).to.be.an("object");
            expect(info).to.equal('jwt expired');
        });

    });


    describe('handling an invalid authentication header', function () {
        var strategy, info;
        var verify_spy = sinon.spy();

        before(function (done) {

            strategy = new Strategy({
                jwtFromRequest: extract_jwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: 'secret',
                jwtDriver: mock.jwtDriver
            }, verify_spy);

            chai.passport.use(strategy)
                .fail(function (i) {
                    info = i;
                    done();
                })
                .request(function (req) {
                    req.headers['authorization'] = "malformed";
                })
                .authenticate();
        });


        it('should not call verify', function () {
            sinon.assert.notCalled(verify_spy);
        });


        it('should fail with error message.', function () {
            // expect(info).to.be.an("object");
            // expect(info).to.be.an.instanceof(Error);
            expect(info).to.be.equal("No auth token");
        });

    });

    after(function () {
        sinon.restore();
    })

});
