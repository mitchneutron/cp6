var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

var users = require('../controllers/users_controller');

router.get('/', function(req, res){
    console.log("GET homepage called, session= ");
    console.log("/t" + req.session);
    
    if (req.session.user) {
      console.log("GET homepage called - with user, color= ", req.session.color);
      res.render('index', {username: req.session.username,  //this is where the EJS vars are passed to the HTML
                           msg:req.session.msg});              // fine maybe EJS is the best way to do this part. ugh   
    } else {
      console.log("GET homepage: user session not active");
      req.session.msg = 'Access denied! Please log in first';
      res.redirect('/login');
    }
});

// Maybe here have a function that gets a list of notes from the db and returns it, without redirecting to a new page
 
router.get('/notes', function(req, res){
  console.log("GET notes called");

  
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
