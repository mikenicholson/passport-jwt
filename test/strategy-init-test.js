var Strategy = require('../lib/strategy');

describe('Strategy', function() {
    var strategy = new Strategy('secret', function() {});

    it('should be named jwt', function() {
        expect(strategy.name).to.equal('jwt');
    });


    it('should throw if constructed without a verify callback', function() {
        expect(function() {
            var s = new Strategy('secret');
        }).to.throw(TypeError, "JwtStrategy requires a verify callback");
    });


    it('should throw if constructed without a secretOrKey arg', function() {
        expect(function() {
            var s = new Strategy(null, function() {});
        }).to.throw(TypeError, 'JwtStrategy requires a secret or key');
    });
});
