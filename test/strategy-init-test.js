var Strategy = require('../lib/strategy');

describe('Strategy', function() {

  describe('with options as an object', function() {

    it('should be named jwt', function() {
        var strategy = new Strategy({secretOrKey: 'secret'}, function() {});
        expect(strategy.name).to.equal('jwt');
    });


    it('should throw if constructed without a verify callback', function() {
        expect(function() {
            var s = new Strategy({secretOrKey: 'secret'});
        }).to.throw(TypeError, "JwtStrategy requires a verify callback");
    });


    it('should throw if constructed without a secretOrKey arg', function() {
        expect(function() {
            var s = new Strategy({secretOrKey: null}, function() {});
        }).to.throw(TypeError, 'JwtStrategy requires a secret or key');
    });


    it('should map all options in _getOptions result', function(done) {
        new Strategy({
          secretOrKey: 'expected secret',
          issuer: 'expected issuer',
          audience: 'expected audience',
          tokenBodyField: 'expected tokenBodyField',
          tokenQueryParameterName: 'expected tokenQueryParameterName',
          authScheme: 'expected authScheme',
          algorithms: ['expected algorithms'],
          ignoreExpiration: false,
          passReqToCallback: false
        }, function() {})._getOptions(function(err, options) {
          expect(options).to.deep.equal({
            _secretOrKey: 'expected secret',
            _tokenBodyField: 'expected tokenBodyField',
            _tokenQueryParameterName: 'expected tokenQueryParameterName',
            _authScheme: 'expected authScheme',
            _passReqToCallback: false,
            _verifOpts : {
              algorithms: ['expected algorithms'],
              issuer: 'expected issuer',
              audience: 'expected audience',
              ignoreExpiration: false
            }
          });
          done();
        });
    });
  });

  describe('with options as a function', function() {

    it('should throw if _getOptions is called and given options has no secretOrKey', function() {
        var verifier = function() {},
            optionsFinder = function(optionsFoundCallback) {
              optionsFoundCallback(null, {secretOrKey: null});
            },
            strategy = new Strategy(optionsFinder, verifier);

        expect(function() {
            strategy._getOptions();
        }).to.throw(TypeError, 'JwtStrategy requires a secret or key');
    });


    it('should map all options in _getJwtOptions result', function(done) {
      new Strategy(function(optionsFoundCallback) {
        optionsFoundCallback(null, {
          secretOrKey: 'expected secret',
          issuer: 'expected issuer',
          audience: 'expected audience',
          tokenBodyField: 'expected tokenBodyField',
          tokenQueryParameterName: 'expected tokenQueryParameterName',
          authScheme: 'expected authScheme',
          algorithms: ['expected algorithms'],
          ignoreExpiration: false,
          passReqToCallback: false
        });
      }, function() {})._getOptions(function(err, options) {
          expect(options).to.deep.equal({
            _secretOrKey: 'expected secret',
            _tokenBodyField: 'expected tokenBodyField',
            _tokenQueryParameterName: 'expected tokenQueryParameterName',
            _authScheme: 'expected authScheme',
            _passReqToCallback: false,
            _verifOpts : {
              algorithms: ['expected algorithms'],
              issuer: 'expected issuer',
              audience: 'expected audience',
              ignoreExpiration: false
            }
          });
          done();
        });
    });

  });

});
