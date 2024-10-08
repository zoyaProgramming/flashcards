const { Router } = require('express');
const dataController = require('../controllers/data');
const userController = require('../controllers/users.js')


const router = new Router();
const signupValidate = dataController.signupValidate;
const signup = dataController.signup;
const useCleaning = dataController.clean;
const deleteSet = dataController.deleteSet;
const save = dataController.save;
const getTblName = dataController.getTableName;
const fetchFunction = dataController.fetchData;
const deleteFunction = dataController.delete;
const sets = dataController.getSets;
const createSet = dataController.createSet
const addCard = dataController.add;
const checkForValidInput = dataController.checkForValidInput;




/*router.get('', (req, res, next) => {
    if(req.session.isNew === true){
      console.log('nahhh')
    } else if(!req.session.authenticated){
      console.log('nahhh')
      res.status(404)
      res.send("null")
    }
    else if(!req.session.set_id){
      console.log('aaaaaaaaa')
        res.send({user: req.session.user.username})
    } else {
      console.log('nahhh')
        next()
    }
    
}, dataController.fetchData);*/

router.post('/profilepic', dataController.uploadProfilePic, dataController.fetchData)
router.get('/profilepic', dataController.loadPic)

router.post('/logout', (req, res) => {
  req.logout(null, (err) => {
    if(err){
      res.status(500);
      res.setHeader('Content-Type', 'text/plain');
      res.send(err);
    } else {
      res.sendStatus(200)
    }
  });
})

router.post('/delete', userController.deleteUser)

router.get('/search/:term', dataController.search)
router.post('/selectset', dataController.selectSet, dataController.fetchData)
router.post('/createSet', createSet, dataController.fetchData)
router.get('/listSets', sets) // shouldn't be used anymore
router.get('/:fetchId', (req, res, next) => {
  console.log('re')
})
router.post('/deletecard', deleteFunction, fetchFunction)

router.post('/updateDescription', userController.updateDescription, fetchFunction)
//router.use('/:fetchId', getTblName)
router.get('/:fetchId', fetchFunction)
router.post("/save", addCard, dataController.fetchData);
router.post('/update', save, fetchFunction);
router.post('/options', userController.updateOptions, fetchFunction)
module.exports = router;



//Router.get("/clean", useCleaning);

//Router.post("/api", test);
//Router.post("/update", save);
