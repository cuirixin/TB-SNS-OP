var util = require('util');
var mongoose = require('mongoose');
var conf=require("../conf/base.js");
var Schema = mongoose.Schema;

var dburl = conf.mongodb_url.op;
var db = mongoose.createConnection(dburl);

//定义Group User对象模型
var GroupUserScheme = new Schema({
    uid : String,
    group_id: String
});

//访问Group User对象模型
db.model('group_users', GroupUserScheme);
var group_user = db.model('group_users');

var sign_in = exports.sign_in = function(uid, callback){
    
    var query = {
        uid: uid
    };
    var projection = {
        uid: 1,
        group_id: 1
    };
    group_user.findOne(query, projection, function(err, entity){
        if (err) {
            callback(err, null);
        }
        callback(null, entity);
    });
}


