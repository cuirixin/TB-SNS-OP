var util = require('util');
var mongoose = require('mongoose');
var conf=require("../conf/base.js");
var Schema = mongoose.Schema;

var dburl = conf.mongodb_url.main;
var db = mongoose.createConnection(dburl);

//定义User对象模型
var UserScheme = new Schema({
    realname : Array,
    email: String,
    sex: Number,
    status: Number,
    icon: Number
});

//访问User对象模型
db.model('users', UserScheme);
var user = db.model('users');

var sign_in = exports.sign_in = function(email, password, callback){
    var query = {
        email: email, 
        password: password, 
        status: 2
    };
    var projection = {
        _id: 1,
        email: 1,
        realname: 1,
        sex: 1,
        status: 1,
        alias: 1
    };
    user.findOne(query, projection, function(err, entity){
        if (err) {
            callback(err, null);
        }
        callback(null, entity);
    });
}


