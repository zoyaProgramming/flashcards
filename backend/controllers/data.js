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
  // user id is a foreign key
    db.run('CREATE TABLE if not exists users(userid INTEGER NOT NULL, username text NOT NULL, PRIMARY KEY(userid));')
    db.run('CREATE TABLE if not exists flashcardsets(setid INTEGER NOT NULL, setname text NOT NULL, setuser INTEGER NOT NULL, PRIMARY KEY (setid), FOREIGN KEY(setuser) REFERENCES users(userid));')
    db.run('CREATE TABLE if not exists flashcards(ID INTEGER NOT NULL, front text, back text, flashcardparentset INTEGER NOT NULL, FOREIGN KEY (flashcardparentset) REFERENCES flashcardsets(setid), PRIMARY KEY (ID));')
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
  console.log('adding')
  const exp2 = ['']
  const set = req.session.set_name;
  if(set === null) {
    res.status(404),
    res.setHeader('Content-Type', 'text/plain')
    res.send('error: flashcard set not currently selected')
    return;
  }
  const testFront = req.body.front;
  const testBack = req.body.back;
  if((!testFront || !testBack ) || (!testFront.length || !testBack.length)) {
    res.status(404),
    res.setHeader('Content-Type', 'text/plain')
    res.send('error: flashcard information not found. Please make sure that the request has a non-empty front and back')
    return;
  }

  db.run(`INSERT INTO flashcard(front, back, user_id , set_id) VALUES(?, ?, ?,?);`, [testFront, testBack, req.session.user.id, req.session.set_id], (err, result) => {
    if(err) {
      console.log(err)
      res.status(500),
      res.setHeader('Content-Type', 'text/plain')
      res.send('error: server unable to insert flashcard data')
      return;
    } else {
      next()
    }
  })
  
 /* let sql = `SELECT * FROM ${set} WHERE front='${req.body.front}' AND back='${req.body.back}';`;
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

  })*/
});

exports.clean = AsyncHandler(async(req, res, next) => {

  let set = req.body.set;
  console.log('cleaninggg.')
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
  console.log('updating')
  const exp2 = ['']
  
  const set = req.session.set_name
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



  const testFront = req.body.front;
  const testBack = req.body.back;
  const setId = req.session.set_id;
  if(!setId) {

    res.sendStatus(404)
    return;
  }
  const found = [];
  let sql = `SELECT rowid, * FROM ${set} WHERE front='${req.body.oldFront}' AND back='${req.body.oldBack}' AND user_id=?;`;
  db.all(`SELECT id, front, back FROM flashcard WHERE front=? AND back=? AND user_id=? AND set_id= ?;`, [req.body.oldFront,req.body.oldBack, req.session.user.id ,setId], (err, rows) => {
    if (err) {
      throw err;
    }
    var i = 0;
      rows.forEach((row) => {
        i++;
        console.log('s')
        console.log(row)
        found.push(row.id)
      });
      if(i==0) {
        res.status(500),
        res.setHeader('Content-Type', 'text/plain')
        res.send('error: flashcard information not found. either you entered something wrong, or its a server problme')
        return;
      } else if (i == 1) {
          console.log(found[0])
          db.run(`UPDATE flashcard SET front= ?, back= ? WHERE id= ?;`, [testFront, testBack, found[0]])
          next();
          return;
      } else if(i>1) {
        console.log(i + 'err')
        res.status(404),
        res.setHeader('Content-Type', 'text/plain')
        res.send('error: duplicate flashcards. can only update one!')
        return;
      }
    
    })
    /*  db.run(`INSERT INTO flashcardTesting(front,back) VALUES('${testFront}', '${testBack}');`)*/
   /*   db.all(`SELECT * FROM flashcard WHERE user_`, [], err, rows2) => {
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

    })*/

}


exports.selectSet = function(req, res, next)
 {
  console.log('SELECTING SET')
  const id = req.session.user.id;
  if(!id){
    res.status(404)
    res.setHeader('Content-Type', 'text/plain')
    res.send('error: not logged in')
  } else {
    const reg = req.body.setname.match(/[^[:alnum:]]/)
    if(reg){
      res.setHeader('Content-Type', 'text/plain')
      res.status(400)
      res.send('error: set contains non-alphanumeric characters. Please edit the set name')
    } else {
      const set = db.get(`SELECT id, set_name, description FROM flashcard_set WHERE user_id=? AND set_name = ?`, [id, req.body.setname], (err, result)=>{
        if(err){
          
          res.setHeader('Content-Type', 'text/plain')
          res.status(500)
          res.send('error fetching data')
        } else{

          req.session.set_name = result.set_name;
          req.session.set_id = result.id;
          req.session.set_description = result.description
          next();
        }
      })
      
    }
  }
 }  

// fetch data should be called after saving, selecting set, and deleting
exports.fetchData = function(req, res, next) {

  console.log('not currently in use')
  const set = req.session.set_name
  if(set === undefined) {
    console.log('err')
    res.status(500)
    res.setHeader('Content-Type', 'text/plain')
    res.send('error fetching data')
    return;
  }
      const data = []
      const sql = `SELECT * from ${set};`;
      db.all(`SELECT front, back from flashcard WHERE set_id= ? AND user_id= ?;`, [req.session.set_id, req.session.user.id], (err, rows) => {
        if(err) {
          console.log('error getting rows')
          console.log(err)
          res.status(500)
          res.setHeader('Content-Type', 'text/plain')
          res.send(err)
          return;
        }
        else if(rows == null) {
          console.log("null bitch")
          res.status()
          res.setHeader('Content-Type', 'application/json')
          res.send(JSON.stringify(
            {"current_set": []}))
          return;
        }

        rows.forEach((row, index) => {
          console.log(row)
          data[index] = row;
        })
        if (data.length == 0){
          console.log('null bitch')
        }
        res.send(JSON.stringify({current_set: data, user: req.session.user.username, set_name: req.session.set_name, set_description: req.session.set_description}))
      })
}


exports.delete = function(req, res, next) { // delete a flashcard
  console.log('trying to delete a flashcard with info: ' + req.body)
  let set = req.tablename;
  console.log(set)
  const front = req.body.front;
  const back = req.body.back;
  const sql = `DELETE FROM flashcard WHERE (front="${front}" AND back="${back}" AND user_id= ? AND set_id= ?);`;
  try{
    
    db.run("DELETE FROM flashcard WHERE (front=? AND back=? AND user_id= ? AND set_id= ?);", [front, back, req.session.user.id, req.session.set_id])
    console.log('flashcard deleting ')
    next()
    return;

  } catch(err) {
    console.log('flashcard didnt delete successfully')
    res.setHeader('Content-Type', 'text/plain')
    res.send(err)
    return;
  }
}

exports.getSets=function(req, res, next) {

  const id = req.session.user.id
  console.log(id)
  console.log(req.session)
  db.all(`SELECT set_name, description FROM flashcard_set WHERE  user_id='${id}';`, (err, response) => {
    console.log("resp" + JSON.stringify(response))
    if(!err) {
      console.log('aint no error here')
      res.send( JSON.stringify(response));
      
    } else {
      res.status(404)
      res.setHeader('Content-Type', 'text/plain')
      res.send(err);
    }
    console.log('bbb')
    return;
})
}


exports.getTableName = function(req,res,next) {

  const id = req.session.user.id.id
  const sql = `SELECT name FROM flashcard_sets WHERE  userid=${id};';`
  let finalVal = null;
  console.log(req.params.fetchId)
  db.all(sql, (err, response) => {
    if(err) { 
      console.log("res1" + err)
      res.status(500)
      res.send('Error getting table name')
    } else if (Array.isArray(response) == false || response.length > 1 || response.length !== 1) {
      res.status(500)
      res.send(null)
      console.log('asudfjiosjdioj')
    } else {
      response.forEach(
        ( b) => {
        console.log("resonse: " + response[0].tbl_name)
      })
      console.log(Array.isArray(response) )
      finalVal = response[0].tbl_name;

      req.session.tablename = response[0].tbl_name;
      console.log("tablename: " + req.tablename)
      console.log("tablename: " + response[0].tbl_name)
      next();
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
      db.exec(`DELETE FROM  '${req.tablename}';`, 
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
  console.log('testing testing')
      const id = req.session.user.id;
      const name = req.body.name;
      const description = req.body.description;
    
      if(!id) {
        res.Error('id not valid')
      } else {
        db.run(`INSERT INTO flashcard_set(set_name, description, user_id) VALUES(?, ?, ?);`,[name, description, id], (error, result) => {
          if(error){
            console.log("error creating table");
            console.log(err.msg);
            res.sendStatus(404)
            return;
          }
          else {
            next()
          }/*
            db.all(`SELECT set_name FROM flashcard_set WHERE user_id=?`, [name], (error, result)=>{
              if(error){
                console.log(error)
                res.sendStatus(500);
              } else {
                res.send(result)
              }
            })
    
          }*/
        })
      }
    
  }



exports.login = function(req, res, next) {
  const user = req.body.user;
  const pass = req.body.pass;
  const query = `SELECT id FROM user WHERE user_name = {user} AND password = ${pass}`
  if(req.session.authenticated && user===req.session.user.username){
    res.send(JSON.stringify({
      user
    }))
    return;
  }
  
  db.get(`SELECT id FROM user WHERE user_name = ? AND password = ?;`,[user, pass], (err, response) => {
    if(err) {
      console.log(err)
      res.status(500)
      res.send(err)
      return;
    } else if (response ==null) {
      console.log(response)
      res.status(404)
      res.setHeader('Content-Type', 'text/plain')
      res.send('login failed, please try again')
      return;
    } else {
      console.log('yeahhh')
      req.session.authenticated = true;
      req.session.user = {
        username: user,
        id: response.id
      }
      console.log(req.session.user)
      res.send(JSON.stringify({user}))
    }
  })
}

exports.signupCheck = function(req, res, next){
  
}


exports.signup = function(req, res, next) {
  const user = req.body.user;
  const pass = req.body.password;
  const query = `SELECT userid FROM user WHERE name = {user} AND password = ${pass}`
  const query2 = `INSERT into user(user_name, password)
  VALUES(?, ?)`
  
  db.get(`SELECT id FROM user WHERE user_name = ?;`,[user], (err, response) => {
    if(err) {
      console.log(err.message)
      res.status(500)
      res.setHeader('Content-Type', 'text/plain')
      res.send(err)
      return;
    } else if (!response) {
        console.log("null" + response)
        db.run(query2, [user, pass], (err, response) => {
          if(err)
          {
            console.log("error")
            console.log(err)
            res.status(500)
            res.setHeader('Content-Type', 'text/plain')
            res.send(err)
          }else {
            console.log('sucess')
            console.log(response)
            res.send(JSON.parse(JSON.stringify(response)))
          }        
          })
        
        return;
    } else if (typeof response === 'object'){
      console.log('balbasudfjiusj')
      console.log(response)
    /*  res.setHeader('Set-Cookie', 'sessionID=user; HTTPOnly; Secure; SameSite')*/

      res.setHeader('Content-Type', 'text/plain')
      res.status(404)
      res.send('username  taken')
    }
  })

}
exports.signupValidate = function(req, res, next){
  const name = req.body.user
  const reg = /[^[:alnum:]]/
  console.log(name)

  const pass = req.body.password
  if(!name) {
    res.status(404)
    res.setHeader('Content-Type', 'text/plain')
    res.send("name of user was blank")
    return;
  } else if(typeof name !== 'string') {
    res.setHeader('Content-Type', 'text/plain')
    res.status(404)
    res.send('somehow the username wasnt a string???')
    return;
  } else if(name.match(reg) !== null) {
    res.setHeader('Content-Type', 'text/plain')
    res.status(404)
    res.send('non alphanumeric characters detected. only use alphanumeric characters')
    return;
  }
  db.get(`SELECT ID, user_name FROM user WHERE user_name=?;`,[name], (error, result) => {
      if(error) {
        res.status(500)

        res.setHeader('Content-Type', 'text/plain')
        res.send("error selecting the user")
        return;

      } else if (result){
        res.status(404)
        res.setHeader('Content-Type', 'text/plain')
        res.send("cannot create user, that username already exists")
        return;
      } else {
        next();
        return;

      }
  })
}
