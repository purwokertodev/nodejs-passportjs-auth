var DocumentDBClient = require('documentdb').DocumentClient;
var docdbUtils = require('./docdbUtils');
var bcrypt = require('bcrypt');


function UserDao(documentDBClient, databaseId, collectionId) {
  this.client = documentDBClient;
  this.databaseId = databaseId;
  this.collectionId = collectionId;

  this.database = null;
  this.collection = null;
}

UserDao.prototype = {
  //create collection
  init: function(){
    var self = this;

    docdbUtils.getOrCreateDatabase(self.client, self.databaseId, function(err, db){
      if(err){
        throw(err);
      }
      self.database = db;

      docdbUtils.getOrCreateCollection(self.client, self.database._self, self.collectionId, function(err, coll) {
        if (err) {
          throw(err);
        }

        self.collection = coll;
      });
    });

  },

  addItem: function(item, callback){
    var self = this;
    item.createdAt = Date.now();
    item.status = 'ACTIVE';

    bcrypt.genSalt(10, function(err, salt){
      if(err){
        callback(err);
      }
      bcrypt.hash(item.password, salt, function(err, hash){
        if(err){
          callback(err);
        }

        item.password = hash;

        self.client.createDocument(self.collection._self, item, function(err, doc){
          if(err){
            callback(err);
          }else{
            callback(null);
          }
        });

      });
    });

  },

  findOne: function(itemId, callback){
    var self = this;

    var querySpec = {
      query: "SELECT * FROM root r WHERE r.id = @id",
      parameters: [{
        name: '@id',
        value: itemId
      }]
    };

    self.client.queryDocuments(self.collection._self, querySpec).toArray(function(err, results) {
      if (err) {
        callback(err);
      } else {
        callback(null, results[0]);
      }
    });
  },


  findByUsername: function(username, callback){
    var self = this;

    var querySpec = {
      query: "SELECT * FROM root r WHERE r.username = @username",
      parameters: [{
        name: '@username',
        value: username
      }]
    };

    self.client.queryDocuments(self.collection._self, querySpec).toArray(function(err, results) {
      if (err) {
        callback(err);
      } else {
        callback(null, results[0]);
      }
    });
  },

  comparePassword: function(passwordInput, passwordUser, callback){
    bcrypt.compare(passwordInput, passwordUser, function(err, isMatch){
      if(err){
        callback(err);
      }
      callback(null, isMatch);
    });
  }
};

module.exports = UserDao;
