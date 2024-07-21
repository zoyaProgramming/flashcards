const Express = require('express')
const AsyncHandler = require('express-async-handler')
const sqlite3 = require('sqlite3').verbose()
const cors = require('../cors/index.js')

let db = new sqlite3.Database('../blank.db')


exports.test = AsyncHandler(async (req, res, next) =>{
  
    const exp = ['1']

    db.run('CREATE TABLE if not exists flashcards( front text, back text);')
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
  db.run('CREATE TABLE if not exists flashcardTesting(front text, back text);')
  const testFront = req.body.front;
  const testBack = req.body.back;
  
  let sql = `SELECT * FROM flashcardTesting WHERE front='${req.body.front}' AND back='${req.body.back}';`;
  db.all(sql, [], (err, rows) => {
      
    if (err) {
      throw err;
    }
    var i = 0;
      rows.forEach((row) => {
        console.log('heyyyy')
        i++;
      });
      if(i> 0) {
        console.log('exist')
        res.send({data: ['it already exists']})
        return;
      }

      db.run(`INSERT INTO flashcardTesting(front,back) VALUES('${testFront}', '${testBack}');`)
      db.all(`SELECT * FROM flashcardTesting`, [], (err, rows2) => {
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
        res.send({data: exp2})

          console.log(exp2)
      })

  })
});

exports.clean = AsyncHandler(async(req, res, next) => {
  console.log('cleaninggg.')
  db.run('CREATE TABLE if not exists flashcardTesting( front text, back text);')
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

  db.run(`DELETE FROM flashcardTesting WHERE front IN
  (SELECT front FROM flashcardTesting GROUP BY front HAVING COUNT(*) > 1);`)
  const b = [];
  const found =[];
  const selectSame = `SELECT rowid, front, back FROM flashcardTesting;`


  db.all(selectSame, [], (err, rows2) => {
    if(err){
      console.Console.log('errors')
      throw(err)
    }
    rows2.sort(sortFunctionForObjects).forEach((row) => {
      if((row.front =='undefined'||row.back=='undefined')||found.find((elem) => (elem.front === row.front && elem.back ===row.back))!==undefined){
        console.log('is this the problem')
        console.log(row.rowid)
        db.run(`DELETE FROM flashcardTesting WHERE rowid=${row.rowid}`)
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
  console.log(req.body)
  const exp2 = ['']
  db.run('CREATE TABLE if not exists flashcardTesting(front text, back text);')
  const testFront = req.body.front;
  const testBack = req.body.back;
  const found = [];
  let sql = `SELECT * FROM flashcardTesting WHERE front='${req.body.front}' AND back='${req.body.back}';`;
  db.all(sql, [], (err, rows) => {
      
    if (err) {
      throw err;
    }
    var i = 0;
      rows.forEach((row) => {
        i++;
        found.push(row.rowid)
      });
      if(i==0) {
        res.send({data: "not Found!!"})
        
        return;
      } else if (i == 1) {
          db.run(`UPDATE flashcardTesting SET front = '${testFront}', back= '${testBack}' WHERE rowid= ${found[0]};`)
      } else if(i>1) {
        res.send({data: "too many found!"})
        return;
      }

    /*  db.run(`INSERT INTO flashcardTesting(front,back) VALUES('${testFront}', '${testBack}');`)*/
      db.all(`SELECT * FROM flashcardTesting`, [], (err, rows2) => {
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
exports.fetchData = async function(req, res, next) {
  db.run('CREATE TABLE if not exists flashcardTesting( front text, back text);')
  const data = []
  const sql = 'SELECT * from flashcardTesting;';
  db.all(sql, (err, rows) => {
    rows.forEach((row, index) => {
      data[index] = row;
    })
    res.send( JSON.parse(JSON.stringify(data)))
  })
}


exports.delete = function(req, res, next) {
  const front = req.body.front;
  const back = req.body.back;
  const sql = `DELETE * from flashcardTesting WHERE front="${front}" AND back="${back}";`;
  try{
    res.send("OK")

  } catch(err) {
    res.send({msg: 'Issue deleting flashcard', err: err.msg})
  }

  
}