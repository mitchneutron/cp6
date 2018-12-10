var express = require('express');
var router = express.Router();

var users = require('../controllers/users_controller');

router.get('/', function(req, res){
    console.log("GET homepage called");
//    console.log(req);
    console.log(req.session);
    if (req.session.user) {
      console.log("GET homepage called - with user, color= ", req.session.color);
      res.render('index', {username: req.session.username,  //this is where the EJS vars are passed to the HTML
                           msg:req.session.msg,
                           color:req.session.color});
    } else {
      console.log("/ Route else user");
      req.session.msg = 'Access denied! Please log in first';
      res.redirect('/login');
    }
});


router.get('/user', function(req, res){
    console.log("GET user called");
    if (req.session.user) {
      res.render('user', {msg:req.session.msg});
    } else {
      req.session.msg = 'Access denied!';
      res.redirect('/login');
    }
});


router.get('/signup', function(req, res){
    console.log("GET signup called");
    if(req.session.user){
      res.redirect('/');
    }
    res.render('signup', {msg:req.session.msg});
});


router.get('/login',  function(req, res){
    console.log("GET login called");
    if(req.session.user){
      res.redirect('/');
    }
    res.render('login', {msg:req.session.msg});
});


router.get('/logout', function(req, res){
    console.log("GET logout called");
    req.session.destroy(function(){
      res.redirect('/login');
    });
  });
  
  
router.post('/signup', users.signup);
router.post('/user/update', users.updateUser);
router.post('/user/delete', users.deleteUser);
router.post('/login', users.login);
router.get('/user/profile', users.getUserProfile);
module.exports = router;
