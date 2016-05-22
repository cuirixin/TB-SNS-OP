var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var session = require('express-session');
var i18n = require('i18n')
var redis = require('redis');
var RedisStore = require('connect-redis')(session);

var routes = require('./routes/index');
var user = require('./routes/user');
var users = require('./routes/users');
var system = require('./routes/system');
var subject = require('./routes/subject');

var app = express();

//配置i18n
i18n.configure({
    locales:['en', 'zh-CN'],  //声明包含的语言
    directory: __dirname + '/locales',  //翻译json文件的路径
    defaultLocale: 'zh-CN'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('.html', ejs.__express);
app.set('view engine', 'html');  //app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session
redis_client = redis.createClient('redis://root:UYdjD93@127.0.0.1:6379')

redis_store = new RedisStore({
    client: redis_client
    //"host": "127.0.0.1",
    //"port": "6379",
    //"pass": "UYdjD93",
});

var sess = {
  secret: 'keyboard cat',
  store: redis_store,
  cookie: {},
  resave: false,
  saveUninitialized: true,
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // 如果前端有代理如nginx，则需要设置
  sess.cookie.secure = true // 要求必须是https协议
}
app.use(session(sess));

app.use(i18n.init);

app.use(function (req, res, next) {
  console.log(req.getLocale());
  if (!req.session) {
    return next(new Error('Session Connect Error.')) // handle error 
  }
  // 
  res.locals.user=req.session.user;
  next() // otherwise continue 
});

app.use('/', routes);
app.use('/user', user);
app.use('/users', users);

app.use('/system', system);

app.use('/subject', subject);


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
  console.log(err.stack);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// important!!! 防止异常后中断
process.on('uncaughtException', function (err) {
  //打印出错误
  console.log(err.stack);
});

module.exports = app;

// Start Cmd: set DEBUG=Skeleton-Brower:* & npm start

// supervisor node main.js -p 3000
