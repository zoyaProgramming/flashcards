const Express = require('express')
const AsyncHandler = require('express-async-handler')
const sqlite3 = require('sqlite3').verbose()
const cors = require('../cors/index.js')

let db = new sqlite3.Database('../blank.db')


exports.test = AsyncHandler(async (req, res, next) =>{
  let set = req.set;
  if(set == null || set == undefined) {
    set = "flashcardTesting"
  }
    const exp = ['1']

    db.run('CREATE TABLE if not exists ( front text, back text);')
   // db.run('DELETE FROM flashcards')
    let sql = `SELECT DISTINCT front, back FROM flashcards;`;
    db.all(sql, [], (err, rows) => {

      if (err) {
        throw err;
      }
      var i = 0;
        rows.forEach((row) => {
  
          console.log(i)
          console.log(row.front)
          console.log(row.back)
          

          exp.push({ front: row.front, back: row.back})
          i++;
        
      });
      res.send({data: exp})
    });
    console.log(exp)
  });
exports.add = AsyncHandler(async(req, res,next) => {
  const exp2 = ['']
  if(req.params.fetchId ==null) {
    console.log('null')
    return};
  const set = req.tablename;
  if(set === null) {
    throw new Error('set row id null')
  }
  db.run(`CREATE TABLE if not exists ${set}(front text, back text);`)
  const testFront = req.body.front;
  const testBack = req.body.back;
  if((!testFront || !testBack ) || (!testFront.length || !testBack.length)) {
    res.sendStatus(400)
    return;
  }
  
  let sql = `SELECT * FROM ${set} WHERE front='${req.body.front}' AND back='${req.body.back}';`;
  db.all(sql, [], (err, rows) => {

    if (err) {
      throw err;
    }
    var i = 0;
      rows.forEach((row) => {
        i++;
      });
      if(i> 0) {
        res.send({data: ['it already exists']})
        return;
      }

      db.run(`INSERT INTO ${set}(front,back) VALUES('${testFront}', '${testBack}');`)
      db.all(`SELECT * FROM ${set};`, [], (err, rows2) => {
        if(err){
          console.log('err')
          throw err;
          return;
        }
        rows2.forEach((row) => {
          console.log(row)
          exp2.push({
            front: row.front,
            back: row.back
          })
        })
        console.log('success adding, exp2: ' + exp2)
        res.send({data: exp2})

          console.log(exp2)
      })

  })
});

exports.clean = AsyncHandler(async(req, res, next) => {

  let set = req.body.set;
  console.log('cleaninggg.')
  db.run(`CREATE TABLE if not exists ${set}( front text, back text);`)
  /*const sql = `SELECT ID, front FROM flashcardTesting WHERE ID IN
  (SELECT ID FROM flashcardTesting GROUP BY ID HAVING COUNT(*) > 1);`
  db.all(sql,[], (err) => {
    if(err) {
      throw err;
    }

  })*/
 function sortFunctionForObjects(var1, var2){
    return var1.front - var2.front;
 }
 

  db.run(`DELETE FROM ${set} WHERE front IN
  (SELECT front FROM ${set} GROUP BY front HAVING COUNT(*) > 1);`)
  const b = [];
  const found =[];
  const selectSame = `SELECT rowid, front, back FROM ${set};`


  db.all(selectSame, [], (err, rows2) => {
    if(err){
      console.Console.log('errors')
      throw(err)
    }
    rows2.sort(sortFunctionForObjects).forEach((row) => {
      if((row.front =='undefined'||row.back=='undefined')||found.find((elem) => (elem.front === row.front && elem.back ===row.back))!==undefined){
        console.log('is this the problem')
        console.log(row.rowid)
        db.run(`DELETE FROM ${set} WHERE rowid=${row.rowid}`)
      } else {
        found.push({
          front: row.front,
          back: row.back
        })
        found.sort(sortFunctionForObjects)
      }
    })
    console.log('found:  ' + JSON.stringify(found))
    res.send({data: found})
    
  })
  
});

exports.handleOptions = function(req, res, next) {
  console.log(req.method)
  console.log(req.headers)
  console.log('hiiii')
  console.log(req.headers.origin)
  res.setHeader(
    'Access-Control-Allow-Methods', 'GET, POST, HEAD'
  )
  res.setHeader(

    'Access-Control-Allow-Origin', '*'
  )
  res.setHeader(
    'Access-Control-Allow-Content-Type', '*'
  )
  res.send({data: 'hiii'})
  

}
exports.save = function (req, res, next) {
  
  const exp2 = ['']
  
  const set = req.tablename
  if(set === null) {
    throw new Error('set row id null')
  }
  /*function fetchTableName(callback){
    let set = req.params.fetchId;
    if(set == null || set == undefined) {
      console.log('probleme')
      set = "flashcardTesting"
    }
    db.all(`SELECT tbl_name FROM sqlite_schema WHERE type='table';`, 
      callback
    )
  }*/



  db.run(`CREATE TABLE if not exists ${set}(front text, back text);`)
  const testFront = req.body.front;
  const testBack = req.body.back;
  const found = [];
  let sql = `SELECT rowid, * FROM ${set} WHERE front='${req.body.oldFront}' AND back='${req.body.oldBack}';`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    var i = 0;
      rows.forEach((row) => {
        i++;
        console.log('s')
        console.log(row.rowid)
        found.push(row.rowid)
      });
      if(i==0) {
        res.send({data: "not Found!!"})
        
        return;
      } else if (i == 1) {
          console.log(found[0])
          db.run(`UPDATE ${set} SET front= '${testFront}', back= '${testBack}' WHERE rowid= ${found[0]};`)
      } else if(i>1) {
        res.send({data: "too many found!"})
        return;
      }

    /*  db.run(`INSERT INTO flashcardTesting(front,back) VALUES('${testFront}', '${testBack}');`)*/
      db.all(`SELECT * FROM ${set}`, [], (err, rows2) => {
        if(err){
          console.log('err')
          throw err;
        }
        rows2.forEach((row) => {
          console.log("row was found")
          exp2.push({
            front: row.front,
            back: row.back
          })
        })
        console.log(exp2)
        res.send({data: exp2})
      })

    })

}
exports.fetchData = function(req, res, next) {
  console.log("id" +  req.tablename)
  const set = req.tablename
  if(set === undefined) {
    console.log('issue')
    res.sendStatus(404); 
    return;
  }
  
      db.run(`CREATE TABLE if not exists ${set}( front text, back text);`, (result, err) => {
        if(err){
          console.log("error creating table");
          console.log(err.msg);
    
          res.send({data: null})
          return;
        }
      })
      const data = []
      const sql = `SELECT * from ${set};`;
      db.all(sql, (err, rows) => {
        if(err) {
          console.log('error getting rows')
          console.log(err.message)
          res.sendStatus(404)
          return;
        }
        if(rows == null) {
          console.log('nulllllll')
          res.sendStatus(404)
          return;
        }

        rows.forEach((row, index) => {
          console.log(row)
          data[index] = row;
        })
        if (data.length == 0){
          console.log('bruh')
        }
        res.send(JSON.parse(JSON.stringify(data)))
      })
}


exports.delete = function(req, res, next) {
console.log('tryna delete the set')
console.log(req.body)
let set = req.tablename;
console.log(set)
  const front = req.body.front;
  const back = req.body.back;
  const sql = `DELETE FROM ${set} WHERE (front="${front}" AND back="${back}");`;
  try{
    
    db.run(sql)
    console.log('set deleting ')
    res.send({data: "OK"})

  } catch(err) {
    console.log('set didnt delete successfull')
    res.send({msg: 'Issue deleting flashcard', err: err.msg})
  }

  
}
exports.getSets=function(req, res, next) {
  console.log('getting sets')

  db.all(`SELECT rowid, tbl_name FROM sqlite_schema WHERE type='table';`, (err, response) => {
    res.send({data: JSON.parse(JSON.stringify(response))});
})
return;
  

}

exports.getTableName = function(req,res,next) {
  const sql = `SELECT tbl_name FROM sqlite_schema WHERE type='table' AND rowid='${req.params.fetchId}';`
  let finalVal = null;
  console.log(req.params.fetchId)
  db.all(sql, (err, response) => {
    if(err) { 
      console.log("res1" + err)
      res.Error("Not Found")
      
    } else if (Array.isArray(response) == false || response.length > 1 || response.length !== 1) {
      console.log(response)
      console.log(req.body.fetchId)
      console.log("res2" + response)
      res.send(404)
    } else {
      response.forEach(
        ( b) => {
        console.log("resonse: " + response[0].tbl_name)
      })
      console.log("res3")
      console.log(Array.isArray(response) )
      
      finalVal = response[0].tbl_name;

      req.tablename = response[0].tbl_name;
      console.log("tablename: " + req.tablename)
      console.log("tablename: " + response[0].tbl_name)
      next()
      
      
    }
    
  })
  

}

exports.deleteSet = function(req, res, next) {
  if(!req.params.fetchId) {
    res.sendStatus(404);
  }
  else{
    try{
      console.log('trying to delete')
      console.log(req.tablename)
      db.exec(`DROP TABLE IF EXISTS '${req.tablename}';`, 
        (result, err) => {
          if(err) {
            throw new Error(err.mssg)
          } else {
            res.sendStatus(200);
            return;
          }

        })
    } catch(err) {
      console.log(err.msg)
      res.sendStatus(404)
    }
    
  }
}

exports.createSet = function(req, res, next) {
  if(!req.params.fetchId) {
    res.sendStatus(404);
  }
  else{
      db.run(`CREATE TABLE if not exists ${req.body.name}( front text, back text);`, (result, err) => {
        if(err){
          console.log("error creating table");
          console.log(err.msg);
          res.sendStatus(404)
          return;
        }
        else {
          db.all(`SELECT rowid, tbl_name FROM sqlite_schema WHERE tbl_name=${req.body.name}`, [], (result, error)=>{
            if(error){
              res.sendStatus(500);
            } else {
              res.send(result)
            }
          })
  
        }
      })
    
  }
} 
