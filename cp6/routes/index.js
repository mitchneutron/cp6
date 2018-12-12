var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

var users = require('../controllers/users_controller');

router.get('/', function(req, res){
    console.log("GET homepage called, session= ");
    console.log("/t" + req.session);
    
    if (req.session.user) {
      console.log("GET homepage called - with user, note= ", req.session.note);
      res.render('index', {username: req.session.username,  //this is where the EJS vars are passed to the HTML
                           msg:req.session.msg});              // fine maybe EJS is the best way to do this part. ugh   
    } else {
      console.log("GET homepage: user session not active");
      req.session.msg = 'Access denied! Please log in first';
      res.redirect('/login');
    }
});

// Maybe here have a function that gets a list of notes from the db and returns it, without redirecting to a new page
 
router.get('/notes', function(req, res, next){
  console.log(">GET all notes called");
  
  User.find().lean().exec(function(err, usersResult){ //calling FIND on the mongoose schema obj
      if(err){ 
        console.log(">GET all notes: Error during User.find: ", err);
        return next(err); 
      } //pass execution forward in the call stack
    
    var usersJSON = JSON.stringify(usersResult);
    usersJSON = JSON.parse(usersJSON);
    
    //pull out each user's note and put into an array (mapping username: noteContent), then return that array 
    var notesArr = [];
    for (var u = 0; u < usersResult.length; u++) {
      notesArr.push( {username: usersJSON[u].username,  note: usersJSON[u].note} );
    }
    
    // console.log(">GET notes: returning JSON: ");
    // console.dir(notesArr);
    
    res.json(notesArr);
  });
  
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
