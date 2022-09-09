var extract_jwt = require('../dist/cjs/extract_jwt').ExtractJwt;
var Request = require('./mock_data').Request;
var sinon = require('sinon');

describe('Token extractor', function () {

    describe('fromSessionKey', function () {

        var extractor = extract_jwt.fromSessionKey('token');

        it('should return the value from a session key', function () {
            var req = new Request()
            req.session['token'] = 'abcd123';

            var token = extractor(req);

            expect(token).to.equal('abcd123');
        });

        it('should return null if there is no session', function () {
            var req = new Request()

            var token = extractor(req);

            expect(token).to.be.null;
        });
    });

    describe('fromSignedCookie', function () {

        var extractor = extract_jwt.fromSignedCookie('token');

        it('should return the value from signed cookie', function () {
            var req = new Request()
            req.signedCookies['token'] = 'abcd123';

            var token = extractor(req);

            expect(token).to.equal('abcd123');
        });

        it('should return null if no signed cookie is present', function () {
            var req = new Request()

            var token = extractor(req);

            expect(token).to.be.null;
        });

        it('should return null if specified cookie name not present but other signed cookies are', function () {
            var req = new Request()
            req.signedCookies['othertoken'] = 'abcd123';

            var token = extractor(req);

            expect(token).to.be.null;
        });
    });

    describe('fromCookie', function () {

        var extractor = extract_jwt.fromCookie('token');

        it('should return the value from cookie', function () {
            var req = new Request()
            req.cookies['token'] = 'abcd123';

            var token = extractor(req);

            expect(token).to.equal('abcd123');
        });

        it('should return null if no cookie is present', function () {
            var req = new Request()

            var token = extractor(req);

            expect(token).to.be.null;
        });

        it('should return null if specified cookie name not present but other cookies are', function () {
            var req = new Request()
            req.cookies['othertoken'] = 'abcd123';

            var token = extractor(req);

            expect(token).to.be.null;
        });
    });

    describe('fromRequestProperty', function () {

        var extractor = extract_jwt.fromRequestProperty('test_property');

        it('should return null no when token is present', function () {
            var req = new Request();

            var token = extractor(req);

            expect(token).to.be.null;
        });


        it('should return the value from the specified property', function () {
            var req = new Request();
            req["test_property"] = "abcd123";
            var token = extractor(req)

            expect(token).to.equal('abcd123');
        });
    });

    describe('fromHeader', function () {

        var extractor = extract_jwt.fromHeader('test_header');

        it('should return null no when token is present', function () {
            var req = new Request();

            var token = extractor(req);

            expect(token).to.be.null;
        });


        it('should return the value from the specified header', function () {
            var req = new Request();
            req.headers['test_header'] = 'abcd123'

            var token = extractor(req)

            expect(token).to.equal('abcd123');
        });
    });


    describe('fromBodyField', function () {

        var extractor = extract_jwt.fromBodyField('test_field');

        it('should return null when no body is present', function () {
            var req = new Request();

            var token = extractor(req);

            expect(token).to.be.null;
        });


        it('should return null when the specified body field is not present', function () {
            var req = new Request();
            req.body = {};

            var token = extractor(req);

            expect(token).to.be.null;
        });


        it('should return the value from the specified body field', function () {
            var req = new Request();
            req.body = {};
            req.body.test_field = 'abcd123';

            var token = extractor(req);

            expect(token).to.equal('abcd123');
        });


        it('should work properly with querystring', function () {
            var req = new Request();
            const querystring = require('querystring');
            req.body = querystring.parse('test_field=abcd123')

            var token = extractor(req);

            expect(token).to.equal('abcd123')
        });
    });


    describe('fromUrlQueryParameter', function () {

        var extractor = extract_jwt.fromUrlQueryParameter('test_param');


        it('should return null when the specified paramter is not present', function () {
            var req = new Request();

            var token = extractor(req);

            expect(token).to.be.null;
        });


        it('should return the value from the specified parameter', function () {
            var req = new Request();
            req.url += '?test_param=abcd123';

            var token = extractor(req);

            expect(token).to.equal('abcd123');
        });
    });


    describe('fromAuthHeaderWithScheme', function () {

        var extractor = extract_jwt.fromAuthHeaderWithScheme('TEST_SCHEME');

        it('should return null when no auth header is present', function () {
            var req = new Request();

            var token = extractor(req);

            expect(token).to.be.null;
        });


        it('should return null when the auth header is present but the auth scheme doesnt match', function () {
            var req = new Request()
            req.headers['authorization'] = "NOT_TEST_SCHEME abcd123";

            var token = extractor(req);

            expect(token).to.be.null;
        });


        it('should return the value from the authorization header with specified auth scheme', function () {
            var req = new Request()
            req.headers['authorization'] = "TEST_SCHEME abcd123";

            var token = extractor(req);

            expect(token).to.equal('abcd123');
        });


        it('should perform a case-insensivite string comparison', function () {
            var req = new Request()
            req.headers['authorization'] = 'test_scheme abcd123';

            var token = extractor(req);

            expect(token).to.equal('abcd123');
        });
    });


    describe('fromAuthHeader', function () {

        var extractor = extract_jwt.fromAuthHeaderAsBearerToken();

        it('should return the value from the authorization header with default JWT auth scheme', function () {
            var req = new Request()
            req.headers['authorization'] = "bearer abcd123";

            var token = extractor(req);

            expect(token).to.equal('abcd123');
        });


    });

    describe('fromExtractors', function () {

        it('should raise a type error when the extractor is constructed with a non-array argument', function () {
            this_should_throw = function () {
                var extractor = extract_jwt.fromExtractors({})
            }

            expect(this_should_throw).to.throw(TypeError)
        });


        var extractor = extract_jwt.fromExtractors([extract_jwt.fromAuthHeaderAsBearerToken(), extract_jwt.fromHeader('authorization')]);

        it('should return null when no extractor extracts token', function (done) {
            var req = new Request();

            extractor(req).then(function (token) {
                expect(token).to.be.null;
                done();
            });
        });


        it('should return token found by least extractor', function (done) {
            var req = new Request()
            req.headers['authorization'] = "abcd123";

            extractor(req).then(function (token) {
                expect(token).to.equal('abcd123');
                done();
            });
        });


        it('should return token found by first extractor', function (done) {
            var req = new Request()
            req.headers['authorization'] = "bearer abcd123";

            extractor(req).then(function (token) {
                expect(token).to.equal('abcd123');
                done();
            });

        });


        var extractorAsync = extract_jwt.fromExtractors([
            function () {
                return null
            },
            function () {
                return Promise.resolve(null)
            },
            function () {
                return Promise.resolve("abcd123")
            }
        ]);

        it('should work with async extractors', function (done) {
            var req = new Request()
            req.headers['authorization'] = "bearer abcd123";

            extractorAsync(req).then(function (token) {
                expect(token).to.equal('abcd123');
                done();
            });


        });

    });

    after(function () {
        sinon.restore();
    })
});

