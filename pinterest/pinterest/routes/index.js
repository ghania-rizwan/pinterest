var express = require('express');
const passport = require('passport');
var router = express.Router();
const userModel = require("./users");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile', isLoggedIn, function(req, res, next) {
  res.render("profile");
});

router.get('/login', function(req,res){
  res.render("login")
});

router.get('/feed', function(req,res){
  res.render("feed")
});

//register route
router.post('/register',function(req,res){
  const { username, email, fullName, password } = req.body;
  const userData = new userModel({ username, email, fullName });

  userModel.register(userData, password).then(function(){
    passport.authenticate("local")(req,res, function(){
      res.redirect("/profile");
    });
  });
});

//login route
router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/"
}), function(req,res){  
});

//logout route
router.get('/logout', function(req,res){
 req.logout(function(err){
  if (err) {return next(err);}
  res.redirect('/login');
 });
});

//agar user authenticated hai to usko agey profile page pe leke jaoo
function isLoggedIn(req,res, next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = router;
