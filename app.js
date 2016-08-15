var DocumentDBClient = require('documentdb').DocumentClient;
var config = require('./config/config');
var MyPassport = require('./config/myPassport');
var passport = require('passport');
var jwt = require('jsonwebtoken');

var express = require('express');
//var passport = require('passport');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var ProductDao = require('./models/productDao');
var Product = require('./routes/products');

var UserDao = require('./models/userDao');
var User = require('./routes/users');

var routes = require('./routes/index');

var app = express();

var docDbClient = new DocumentDBClient(config.host, {
    masterKey: config.authKey
});

var userDao = new UserDao(docDbClient, config.databaseId, config.userCollections);
var productDao = new ProductDao(docDbClient, config.databaseId, config.productCollections);

var myPassport = new MyPassport(userDao);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

//passport package init
app.use(myPassport.init());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//require('./config/myPassport')(passport);
//var requireAuth = passport.authenticate('jwt', {session: false});

var product = new Product(productDao);
productDao.init();

var user = new User(userDao);
userDao.init();

app.get('/', product.showAll.bind(product));
app.post('/addproduct', product.addProduct.bind(product));
app.post('/saveproductfinish', product.saveProductFinish.bind(product));

// product api
app.get('/api/product/getallproduct', product.showAllRest.bind(product));
app.post('/api/product/addproductrest', product.addProductRest.bind(product));

// user api
app.post('/api/user/signup', user.addUserRest.bind(user));
app.post('/api/user/authenticate', user.login.bind(user));
app.get('/api/user/userinfo', myPassport.authenticate(), user.userInfo.bind(user));

app.get('/api/user/home', myPassport.authenticate(), function(req, res){
  res.json({
    status: 'success',
    message: "Home"
  });
});

app.get('/api/user/findone/:id', user.getUser.bind(user));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
