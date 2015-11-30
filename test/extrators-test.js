var extract_jwt = require('../lib/extract_jwt'),
    Request = require('./mock_request');

describe('Token extractor', function() {

    describe('fromHeader', function() {

        var extractor = extract_jwt.fromHeader('test_header');

        it('should return null no when token is present', function() {
            var req = new Request();

            var token = extractor(req);

            expect(token).to.be.null; 
        });


        it('should return the value from the specified header', function() {
            var req = new Request();
            req.headers['test_header'] = 'abcd123'

            var token = extractor(req)

            expect(token).to.equal('abcd123'); 
        });
    });


    describe('fromBodyField', function() {

        var extractor = extract_jwt.fromBodyField('test_field');

        it('should return null when no body is present', function() {
            var req = new Request();
            
            var token = extractor(req);

            expect(token).to.be.null;
        });


        it('should return null when the specified body field is not present', function() {
            var req = new Request();
            req.body = {};

            var token = extractor(req);

            expect(token).to.be.null;
        });


        it('should return the value from the specified body field', function() {
            var req = new Request();
            req.body = {};
            req.body.test_field = 'abcd123';

            var token = extractor(req);

            expect(token).to.equal('abcd123');
        });
    });


    describe('fromUrlQueryParameter', function() {

        var extractor = extract_jwt.fromUrlQueryParameter('test_param');


        it('should return null when the specified paramter is not present', function() {
            var req = new Request();

            var token = extractor(req);

            expect(token).to.be.null;
        });


        it('should return the value from the specified parameter', function() {
            var req = new Request();
            req.url += '?test_param=abcd123';

            var token = extractor(req);

            expect(token).to.equal('abcd123');
        });
    });


    describe('fromAuthHeaderWithScheme', function() {

        var extractor = extract_jwt.fromAuthHeaderWithScheme('TEST_SCHEME');

        it('should return null when no auth header is present', function() {
            var req = new Request();

            var token = extractor(req);

            expect(token).to.be.null;
        });


        it('should return null when the auth header is present but the auth scheme doesnt match', function() {
            var req = new Request()
            req.headers['authorization'] = "NOT_TEST_SCHEME abcd123";

            var token = extractor(req);

            expect(token).to.be.null;
        });


        it('should return the value from the authorization header with specified auth scheme', function() {
            var req = new Request()
            req.headers['authorization'] = "TEST_SCHEME abcd123";

            var token = extractor(req);

            expect(token).to.equal('abcd123');
        });

    });


    describe('fromAuthHeader', function() {
        
        var extractor = extract_jwt.fromAuthHeader();

        it('should return the value from the authorization header with default JWT auth scheme', function() {
            var req = new Request()
            req.headers['authorization'] = "JWT abcd123";

            var token = extractor(req);

            expect(token).to.equal('abcd123');
        });


    });

});

