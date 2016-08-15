var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var UserDao = require('../models/userDao');
var config = require('./config');




var MyPassport = function(userDao){
  this.userDao = userDao;
}

MyPassport.prototype = {
  init: function(){
    var self = this;
    var opts = {
      jwtFromRequest: ExtractJwt.fromAuthHeader(),
      secretOrKey: config.secret
    };
    var strategy = new JwtStrategy(opts, function(jwt_payload, done){
      self.userDao.findOne(jwt_payload.id, function(err, resultUser){
        if(err){
          return done(err, false);
        }
        if(resultUser){
          done(null, resultUser);
        }else {
          done(null, false);
        }
      });
    });

    passport.use(strategy);

    return passport.initialize();
  },

  authenticate: function() {
    return passport.authenticate("jwt", {session: false});
  }

};

module.exports = MyPassport;
