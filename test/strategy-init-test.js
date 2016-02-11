var Strategy = require('../lib/strategy');

describe('Strategy', function() {
    var strategy = new Strategy({jwtFromRequest: function(){}, secretOrKey: 'secret'}, function() {});

    it('should be named jwt', function() {
        expect(strategy.name).to.equal('jwt');
    });


    it('should throw if constructed without a verify callback', function() {
        expect(function() {
            var s = new Strategy({jwtFromRequest: function(r) {}, secretOrKey: 'secret'});
        }).to.throw(TypeError, "JwtStrategy requires a verify callback");
    });


    it('should throw if constructed without a secretOrKey arg', function() {
        expect(function() {
            var s = new Strategy({jwtFromRequest: function(r) {}, secretOrKey: null}, function() {});
        }).to.throw(TypeError, 'JwtStrategy requires a secret or key');
    });


    it('should throw if constructed without a jwtFromRequest arg', function() {
        expect(function() {
            var s = new Strategy({secretOrKey: 'secret'}, function() {});
        }).to.throw(TypeError);
    });
});
