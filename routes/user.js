var express = require('express');
var router = express.Router();
var conf=require("../conf/base.js");
var util = require('../lib/util')
var user_model = require('../models/user');
var group_user_model = require('../models/group_user');

// middleware specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

/*
var cb0 = function (req, res, next) {
  console.log('CB0');
  next();
}

var cb1 = function (req, res, next) {
  console.log('CB1');
  next();
}

router.get('/:id', [cb0, cb1], function (req, res, next) {
  console.log('User id:'+req.params.id);
  next();
}, function (req, res) {
  res.send('Hello from D!');
});
*/

router.get('/signin', function (req, res) {
  res.render('user/login', { 
    title: req.__('Sign in') 
  });
});

router.post('/signin', function (req, res, next) {

  var email = req.body.email || '';
  email = email.trim();

  var password = req.body.password || '';
  var ret = util.pwd_encode(password);

  user_model.sign_in(email, ret['password'], function(err, user){

    if (err) {
      return next(err);
    }
    if(user){
      group_user_model.sign_in(user._id, function(err, group_user){
          if (err) {
            return next(err);
          }
          if (group_user){
            // 保存Session信息并跳转到首页
            req.session.regenerate(function(){
                req.session.user = user;
                req.session.perms = {
                  group_id: group_user.group_id
                };
                
                req.session.save();  //保存一下修改后的Session
                console.log(req.session.perms);
                res.redirect('/');
            });  
          }else{
            res.render('user/login', { 
              title: req.__('Sign in'),
              message: req.__('Email or password error.')
            });
          }
          
      });
      
    }else{
      res.render('user/login', { 
        title: req.__('Sign in'),
        message: req.__('Email or password error.')
      });
    }

  });
});

router.get('/signout', function (req, res) {
  req.session.user=null;
  req.session.regenerate(function(){
      //重新生成session之后后续的处理
      res.redirect('/user/signin');
  })
});

module.exports = router;
