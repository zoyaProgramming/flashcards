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
const deleteSet = dataController.deleteSet;
const save = dataController.save;
const getTblName = dataController.getTableName;
const fetchFunction = dataController.fetchData;
const deleteFunction = dataController.delete;
const sets = dataController.getSets;
const createSet = dataController.createSet
const checkForValidInput = dataController.checkForValidInput;

app.use('/', Router)

Router.use(function (req, res, next) {
  console.log('\n logging...')
  console.log('%s %s %s %s \n', req.method, req.url, req.path, req.body)
  next();
})

Router.post('/sets', createSet)
Router.get('/sets', sets)
Router.use('/:fetchId', getTblName)

Router.get('/:fetchId/delete', deleteSet)
Router.get('/:fetchId', fetchFunction)
Router.post("/:fetchId/save", test);
Router.post('/:fetchId/update', save);

Router.get('/fetch', (req, res, next) => {
  console.log('not found');
  res.send('Not found')})
  



Router.get("/clean", useCleaning);

Router.post("/api", test);
Router.post("/update", save);

Router.post('/:fetchId/delete', deleteFunction)
Router.post('', (req, res, next) => {
  res.send({data: 'Not deleting'})
})
const port = process.env.PORT || 3500;



app.listen(port, () => console.log(`Listening on port ${port}`));