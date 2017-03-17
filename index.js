var express = require('express');
var app = express();
var path = require('path');
var routes = require('./routes/index');
var users = require('./routes/users');
var bodyParser = require('body-parser');
var multer = require('multer'); 
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(session({
    secret: 'mumian1992',
    name: 'NODESESSIONID',
    cookie: {maxAge: 7200000},
    resave: false,
    saveUninitialized: true
}));//use session

//database
var mongoose = require('mongoose');
var config = require('./config');
mongoose.connect(config.db.mongodb);

//router
app.get('/',routes);
app.get('/detail',routes);
app.get('/login',users);
app.post('/login',users);
app.get('/manager',users);
app.get('/manager/editor',users);
app.post('/manager/editor',users);

app.listen('8080');
