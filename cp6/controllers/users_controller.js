var crypto = require('crypto');
var mongoose = require('mongoose'),
    User = mongoose.model('User');
function hashPW(pwd){
  return crypto.createHash('sha256').update(pwd).
         digest('base64').toString();
}

exports.signup = function(req, res){
  var user = new User({username:req.body.username});
  user.set('hashed_password', hashPW(req.body.password));
  user.set('email', req.body.email);
  user.set('note', ' '); // until they set one, they don't have one
  user.save(function(err) {
    if (err){
      console.log(">USR_CTRL: Error during user.save: ", err);
      res.session.error = err;
      res.redirect('/signup');
    } else {
      req.session.user = user.id;
      req.session.username = user.username;
      req.session.note= user.note;
      req.session.msg = 'Logged in as ' + user.username;
      res.redirect('/');
    }
  });
};

exports.login = function(req, res){
  User.findOne({ username: req.body.username })
  .exec(function(err, user) {
    if (!user){
      err = 'User not found!';
    } else if (user.hashed_password ===
               hashPW(req.body.password.toString())) {
      req.session.regenerate(function(){
        req.session.user = user.id;
        req.session.username = user.username;
        req.session.msg = 'Logged in as ' + user.username;
        req.session.note = user.note;
        res.redirect('/');
      });
    }else{
      err = 'Authentication failed.';
    }
    if(err){
      req.session.regenerate(function(){
        req.session.msg = err;
        res.redirect('/login');
      });
    }
  });
};

exports.getUserProfile = function(req, res) {
  User.findOne({ _id: req.session.user })
  .exec(function(err, user) {
    if (!user){
      res.json(404, {err: 'User not found! Please sign up'});
    } else {
      res.json(user);
    }
  });
};

exports.updateUser = function(req, res){
  User.findOne({ _id: req.session.user })
  .exec(function(err, user) {
    user.set('note', req.body.note);
    user.save(function(err) {
      if (err){
        res.sessor.error = err;
      } else {
        req.session.msg = 'Note saved!';
        req.session.note = req.body.note;
      }
      res.redirect('/user');
    });
  });
};

exports.deleteUser = function(req, res){
  User.findOne({ _id: req.session.user })
  .exec(function(err, user) {
    if(user){
      user.remove(function(err){
        if (err){
          req.session.msg = err;
        }
        req.session.destroy(function(){
          res.redirect('/login');
        });
      });
    } else{
      req.session.msg = "User not found!";
      req.session.destroy(function(){
        res.redirect('/login');
      });
    }
  });
};