var express = require('express');
var router = express.Router();

// middleware specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

/* GET home page. */
// 渲染页面
router.get('/', function(req, res, next) {
  console.log("index");
  req.session.user;
  /*
  req.sessionID = "dzzE2tZ5hj24AY31BYfkoWDSAwt9ZeAk"
  req.session.reload(function(){
      console.log(req.session.user);
  });
  */
  res.render('index', { title: 'Express' });
});

router.get('/html', function(req, res, next) {
  // pass a local variable to the view
  console.log('index html');
  res.render('index', { title: 'Express' }, function(err, html) {
	 res.send(html);
  });
});

router.get('/', function(req, res, next) {
  res.render('index', { 
    title: req.__('Op System')
  });
});



module.exports = router;
