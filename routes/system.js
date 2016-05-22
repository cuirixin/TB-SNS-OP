var express = require('express');
var router = express.Router();
var config=require("../config");
var util = require('../lib/util');

var restify = require("restify");

var rest_client = require("../bin/rest_client");

var CLIENT = rest_client.createClient(config.rest_client.options);
// middleware specific to this router

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/total', function (req, res) {

  var fields = ["user_num", "user_poi_num", "sys_poi_num", "subject_num", "response_num"];

  CLIENT.get_statistic_dynamic_total(fields, function(err, data){

    if(err){
      console.error(err);
      res.send({
        message: "Failed",
        code: -1,
        data: null
      });
    }

    // console.log(data);
    res.status(200).send({
      message: "Success",
      code: 0,
      data: data
    });

  });

});

module.exports = router;
