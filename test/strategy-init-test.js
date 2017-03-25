var sinon = require('sinon');
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


    it('should have _getOptions function to return qualified options', function() {
        var options = { jwtFromRequest: function() {}, secretOrKey: 'secret' };
        var qualifiedOptions = {
            _secretOrKey: options.secretOrKey,
            jwtFromRequest: options.jwtFromRequest,
            passReqToCallback: undefined,
            verifOpts: {}
        };
        var strategy = new Strategy(options, function() {});
        var callbackSpy = sinon.spy();

        strategy._getOptions(null, callbackSpy);

        expect(callbackSpy).to.have.been.calledWith(null, qualifiedOptions);
    });


    it('should accept options as a function', function() {
      var options = { jwtFromRequest: function() {}, secretOrKey: 'secret' };
      var getOptions = function(req, callback) { callback(null, options); };
      var qualifiedOptions = {
          _secretOrKey: options.secretOrKey,
          jwtFromRequest: options.jwtFromRequest,
          passReqToCallback: undefined,
          verifOpts: {}
      };

      var strategy = new Strategy(getOptions, function() {});
      var callbackSpy = sinon.spy();

      strategy._getOptions(null, callbackSpy);

      expect(callbackSpy).to.have.been.calledWith(null, qualifiedOptions);
    });

    it('should call callback with error if constructed without options', function(done) {
      var options = null;
      var strategy = new Strategy(options, function() {});

      strategy._getOptions(null, function(err) {
          expect(err.message).to.equal('options cannot be null');
          done();
      });
    });


    it('should call callback with error if constructed without a secretOrKey arg', function(done) {
      var options = { jwtFromRequest: function() {}, secretOrKey: null };
      var strategy = new Strategy(options, function() {});

      strategy._getOptions(null, function(err) {
          expect(err.message).to.equal('JwtStrategy requires a secret or key');
          done();
      });
    });


    it('should call callback with error if constructed without a jwtFromRequest arg', function(done) {
      var options = { secretOrKey: 'secret' };
      var strategy = new Strategy(options, function() {});

      strategy._getOptions(null, function(err) {
          expect(err.message).to.equal('JwtStrategy requires a function to retrieve jwt from requests (see option jwtFromRequest)');
          done();
      });
    });
});
