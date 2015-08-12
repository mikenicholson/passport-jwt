var auth_hdr = require('../lib/auth_header')


describe('Parsing Auth Header field-value', function() {

    it('Should handle single space separated values', function() {
        var res = auth_hdr.parse("SCHEME VALUE");
        expect(res).to.deep.equal({scheme: "SCHEME", value: "VALUE"});
    });


    it('Should handle CRLF separator', function() {
        var res = auth_hdr.parse("SCHEME\nVALUE");
        expect(res).to.deep.equal({scheme: "SCHEME", value: "VALUE"});
    });


    it('Should presume that the scheme is JWT', function() {
        var res = auth_hdr.parse("VALUE");
        expect(res).to.deep.equal({scheme: "JWT", value: "VALUE"});

    });


});
