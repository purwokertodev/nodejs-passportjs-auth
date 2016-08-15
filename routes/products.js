var DocumentDBClient = require('documentdb').DocumentClient;
var async = require('async');

function Products(productDao) {
  this.productDao = productDao;
}

Products.prototype = {
  showAll: function(req, res) {
    var self = this;

    var querySpec = {
      query: 'SELECT * FROM root r WHERE r.active=@active',
      parameters: [{
        name: '@active',
        value: true
      }]
    };

    self.productDao.find(querySpec, function(err, items) {
      if (err) {
        throw (err);
      }

      res.render('index', {
        title: 'Product List ',
        productList: items
      });
    });
  },

  addProduct: function(req, res) {
    var self = this;
    var item = req.body;

    self.product.addItem(item, function(err) {
      if (err) {
        throw (err);
      }

      res.redirect('/');
    });
  },

  saveProductFinish: function(req, res) {
    var self = this;
    var savedProduct = Object.keys(req.body);

    async.forEach(savedProduct, function ProductIterator(savedProduct, callback) {
      self.productDao.updateItem(savedProduct, function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    }, function goHome(err) {
      if (err) {
        throw err;
      } else {
        res.redirect('/');
      }
    });
  },

// rest api
  showAllRest: function(req, res){
    var self = this;

    var querySpec = {
      query: 'SELECT * FROM root r WHERE r.active=@active',
      parameters: [{
        name: '@active',
        value: true
      }]
    };

    self.productDao.find(querySpec, function(err, items){
      if(err){
        throw(err);
      }

      res.status(200)
      .json({
          status: 'success',
          data: items,
          message: "get all product"
      });
    });

  },

  addProductRest: function(req, res){
    var self = this;
    var item = req.body;

    self.productDao.addItem(item, function(err){
      if(err){
        throw(err);
      }

      res.status(200)
      .json({
        status: 'success',
        message: 'product inserted'
      });

    });
  }
};

module.exports = Products;
