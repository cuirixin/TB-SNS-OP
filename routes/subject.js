var express = require('express');
var router = express.Router();
var config=require("../config");
var util = require('../lib/util');
//var validator = require('../lib/myValidator');
var validation = require('../lib/validation');

var restify = require("restify");
var rest_client = require("../bin/rest_client");

var CLIENT = rest_client.createClient(config.rest_client.options);

/*
 * 实时监控页面
 */
router.get('/monitor', function (req, res) {

  res.render('subject/monitor', { title: 'Exblorer', start: Date.now() });

});

/*
 * 话题管理页面, 对某话题进行回复等操作
 */
router.get('/operate', function (req, res) {

  console.log(req.query.id);

  CLIENT.get_subject(req.query.id, function(err, doc){

    if(err){
      console.error(err);
      return res.send({
        message: "Failed",
        code: -1,
        data: err
      });
    }

    console.log(doc);

    res.render('subject/operate', { title: 'Exblorer', subject: doc });

  });

});

/*
 * 添加话题回复
 */
router.post('/response/add', function (req, res) {

  console.log(req.body);

  params = {
    uid : req.body.uid,
    content : req.body.content
  };

  // TODO 更好的处理方式
  if (req.body.image){
    images = JSON.stringify(req.body.image);
    if (!validation.isJSON(images)){
      images = JSON.stringify([req.body.image]);
    }
    params['images'] = images;
  }
  
  // console.log(params['images']);
  CLIENT.add_subject_response(req.body.sbjid, params, function(err, data){

    if(err){
      console.error(err);
      return res.send({
        message: "Failed",
        code: -1,
        data: err
      });
    }

    // console.log(data);
    return res.status(200).send({
      message: "Success",
      code: 0,
      data: data
    });

  });

});


router.get('/recent', function (req, res){

  CLIENT.get_subjects(req.query, function(err, data){

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
