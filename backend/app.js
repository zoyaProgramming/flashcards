const express = require("express");
const app = express();
var bodyParser = require('body-parser')

console.log('test')
const middlewareWrapper = require('./cors/index.js');
console.log('test2')
app.use(bodyParser.json())
console.log('test3')

app.use(middlewareWrapper())


const Router = express.Router();
console.log('test4')
const dataController = require('./controllers/data')
console.log('test2')
const test = dataController.add;
const useCleaning = dataController.clean;
const save = dataController.save;
const fetchFunction = dataController.fetchData;
const deleteFunction = dataController.delete;

app.use('/', Router)

Router.use(function (req, res, next) {
  console.log('\n logging...')
  console.log('%s %s %s \n', req.method, req.url, req.path)
  next();
})

Router.get('/fetch', fetchFunction)
Router.get("/clean", useCleaning);

Router.post("/api", test);
Router.post("/update", save);
Router.post("/save", test);
Router.post('/delete', deleteFunction)
const port = process.env.PORT || 3500;



app.listen(port, () => console.log(`Listening on port ${port}`));