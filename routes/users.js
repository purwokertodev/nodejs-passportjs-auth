var jwt = require('jsonwebtoken');
var config = require('../config/config');

function User(userDao){
  this.userDao = userDao;
}

// split token
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

User.prototype = {
  addUserRest: function(req, res){
    var self = this;
    var item = req.body;
    if(!item){
      res.json({
        status: 'failed',
        message: 'Field cannot be empty !!'
      });
    }else {
      self.userDao.addItem(item, function(err){
        if(err){
          throw(err);
        }

        res.status(200)
        .json({
          status: "success",
          message: "User inserted"
        });
      });
    }
  },

  getUser: function(req, res){
    var self = this;
    var id = req.params.id;
    self.userDao.findOne(id, function(err, item){
      if(err){
        throw(err);
      }

      res.status(200)
      .json({
          status: 'success',
          data: item,
          message: "get one user"
      });
    });
  },

  login: function(req, res){
    var self = this;
    var userLogin = req.body;
    if(!userLogin){
      res.json({
        status: 'failed',
        message: 'Field cannot be empty !!'
      });
    }else {
      self.userDao.findByUsername(userLogin.username, function(err, userResult){
        if(err){
          throw(err);
        }

        if(!userResult){
          res.status(403).json({
            status: 'failed',
            message: 'User not found !!'
          });
        }else {
          self.userDao.comparePassword(userLogin.password, userResult.password, function(err, isMatch){
            if(isMatch && !err){
              var token = jwt.sign(userResult, config.secret, {expiresIn: 180000});
              res.json({
                status: 'success',
                token: 'JWT '+token
              });
            }else {
              res.json({
                status: 'failed',
                 message: 'Authentication failed. Wrong password.'
               });
            }
          });
        }

      });
    }
  },

  userInfo: function(req, res){
    var token = getToken(req.headers);
    var self = this;
    if(token){
      var decoded = jwt.verify(token, config.secret);
      self.userDao.findByUsername(decoded.username, function(err, resultUser){
        if(err){
          throw(err);
        }

        if(!resultUser){
            res.status(403)
            .json({
              status: 'failed',
              message: 'Authentication failed'
            });
        }else {
          res.json({
            username: resultUser.username,
            status: 'success',
            message: 'Welcome '+resultUser.username
          });
        }
      });
    }else {
      return res.status(403).send({status:'failed', msg: 'No token provided.'});
    }
  }

};

module.exports = User;
