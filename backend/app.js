
const dbFunctions = require('./controllers/users.js')
const dataFunctions = require('./controllers/data.js')
const getUser= dbFunctions.getUser
const getUserById= dbFunctions.getUserById
const express = require("express");
const app = express();
var bodyParser = require('body-parser')
const session = require('express-session')
require('dotenv').config()
const middlewareWrapper = require('./cors/index.js');
console.log('test2')
const store = new session.MemoryStore();

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const path = require('path')
app.use(express.static('public'))
app.use(bodyParser.json({limit: '50mb'}));
app.use(middlewareWrapper({
  origin: 'http://localhost:3000',
  credentials: true
}))

app.use(express.static(path.join(__dirname + 'public')))

app.use(session({
  secret: process.env.SECRET_KEY,
  cookie: {maxAge: 1000 * 60 * 60* 24},
  resave: true,
  saveUninitialized: true ,

  store
})
)
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser((user, done) => {
  console.log(user)
  done(null, user.id)
});
passport.deserializeUser((id, done) => {
  getUserById(id, function (err, user) {
    if(err) 
      {
        console.log('err')
        return done(err, false);
      }
    return done(null, user);
  })
})

app.use(function (req, res, next) {
  console.log('\n logging...')
  console.log('%s %s %s %s \n', req.method, req.url, req.path)
  console.log(req.sessionID)
  next();
})


passport.use(new LocalStrategy(function (username, password, cb) {
 getUser(username, password, function (err, user){
    if(err){
      console.log('error found in callback')
      return cb(err);
    }
    else if(!user){
      console.log('no user')
      return cb(null,false);
    } else if (user.password != password) {
       return cb(null,false);
    } else {
      console.log('no error found!!!');
    return cb(null, user);}
  })
}
));


app.post('/login',
  passport.authenticate("local"), 
  (req, res, next) =>{
    console.log(res.getHeaderNames())
    console.log(req.sessionID)
  console.log('wtf why this not work')
  if(req.user) {
    console.log("user found")
    next()
    return;
  } else {
    console.log('user not logged in successfully')
    res.sendStatus(404)
    return;
  }
}, dataFunctions.fetchData)
app.use('/', (req, res, next) => {
  if(!req.isAuthenticated()) {
    res.sendStatus(404)
  } else {
    next()
  }
})

app.get('/users/:user', dataFunctions.fetchDataFromOtherUser)
app.get('/', (req, res, next) => {

  
  if(req.user){
    console.log('user exists: '+ req.user.user_name)
    console.log(req.user)
    next()
  } else {
    res.sendStatus(404)
  }
}, dataFunctions.fetchData)

const mainRouter = require('./routes/router.js');
const { auth } = require('../flashcards/src/functions/userReducer.js');
const { fetchData } = require('./controllers/data.js');


app.use('/', mainRouter);


console.log('test4');
console.log('test2');



const port = process.env.PORT || 3500;



app.listen(port, () => console.log(`Listening on port ${port}`));
// sets, flashcards, users