import { Router } from "express";
const save = dataController.save;
const getTblName = dataController.getTableName;
const fetchFunction = dataController.fetchData;
const addCard = dataController.add;

const deleteSet = dataController.deleteSet;



const Router = new Router();

Router.use('/:fetchId', getTblName)
Router.get('/:fetchId', fetchFunction)
Router.post("/:fetchId/save", addCard);
Router.post('/:fetchId/update', save);
module.exports = Router;