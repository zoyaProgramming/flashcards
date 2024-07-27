const express = require("express");
const app = express();
var bodyParser = require('body-parser')
const session = require('express-session')
require('dotenv').config()
const middlewareWrapper = require('./cors/index.js');
console.log('test2')
const store = new session.MemoryStore();

app.use(middlewareWrapper({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(session({
  secret: process.env.SECRET_KEY,
  cookie: {maxAge: 1000 * 60 * 60* 24},
 resave: false,
  saveUninitialized: false,
  store
})
)




app.use(bodyParser.json())

const mainRouter = require('./routes/router.js')


app.use('/', mainRouter)

console.log('test4')
console.log('test2')



const port = process.env.PORT || 3500;



app.listen(port, () => console.log(`Listening on port ${port}`));
// sets, flashcards, users