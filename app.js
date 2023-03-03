var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')

const carRouter = require('./routes/cars')
const recRouter = require('./routes/record')
const usersRouter = require('./routes/users')

const config = require('./config/index')
const passport = require('passport')

const errorHandler = require('./middleware/errorHandle')

var app = express();

mongoose.connect(config.MONGODB_URI ,{useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false})

app.use(logger('dev'));
app.use(express.json({
    limit: '50mb'
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize())


app.use('/car',carRouter);
app.use('/user', usersRouter);
app.use('/record',recRouter);

app.use(errorHandler)
module.exports = app;
