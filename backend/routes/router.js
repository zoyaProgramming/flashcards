const { Router } = require('express');
const dataController = require('../controllers/data')


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


router.use(function (req, res, next) {
  console.log('\n logging...')
  console.log('%s %s %s %s \n', req.method, req.url, req.path, req.body)
  next();
})

router.use((req, res, next)=> {
  if (typeof req.session.isNew === "undefined") {
    req.session.isNew = true;
    //req.session.save(next);
     // req.session.save(next);
  } else {
    req.session.isNew = false;

  }
    next();
})


router.use((req, res, next) => {
  console.log("new" + req.session.isNew);
  next();
});

router.get('', (req, res, next) => {
    if(req.session.isNew === true){
      console.log('nahhh')
      res.status(404)
      res.send("null")
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
    
}, dataController.fetchData);



router.all('/signup', signupValidate)
router.post('/signup', signup)
router.post('/login', dataController.login)

router.use('/login/test', (req, res, next) => {
  console.log(req.session)
})
router.use('/',  (req, res, next) => {
  console.log(req.session)
  const session = req.session;
  if(!session.authenticated) {
    res.sendStatus(403)
  } else {
    next()
  }
})
router.post('/selectset', dataController.selectSet, dataController.fetchData)


router.post('/createSet', createSet, dataController.getSets)
router.get('/listSets', sets)
router.get('/:fetchId', (req, res, next) => {
  console.log('re')
})
router.post('/delete', deleteFunction, fetchFunction)


//router.use('/:fetchId', getTblName)
router.get('/:fetchId', fetchFunction)
router.post("/save", addCard, dataController.fetchData);
router.post('/update', save, fetchFunction);
module.exports = router;




//Router.get("/clean", useCleaning);

//Router.post("/api", test);
//Router.post("/update", save);
