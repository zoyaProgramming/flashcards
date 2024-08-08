const db = require('./data.js').db
const fs = require('fs/promises')

exports.getUser = function(user, pass, callback) {
  console.log('aaa')
  db.get(`SELECT * FROM user WHERE user_name = ? AND password = ?;`,[user, pass], (err, response) => {
    if(err) {
      console.log(err)
      callback(err)

      return;
    } else if (response ==null) {
      console.log(response)
      callback(null, null)
      return;
    } else {
      console.log('yeahhh')
      callback(null, {username:user, password:pass, id: response.id})
  
      return;
    }
  })
}

exports.getUserById = function(id, callback) {
  console.log('asdfjsidfjidfosj')
  db.get(`SELECT * FROM user WHERE id= ?;`, [id], (err, response) => {
    if(err) {
      console.log('error getting')
      callback(err, null);
    }
    console.log('response of selection')
    console.log(response)
    callback(null, response)
  })
}

exports.checkUsername = function(user) {
  console.log('checking username')
  const c=  new Promise((resolve, reject) => {
    console.log('aaa')

    console.log(user + ' user name')
    const regex = /[^[:alnum:]]/
    const name = user;
    const check = name.match(regex);
    if(check === null) {
      console.log('null')
      db.get(`SELECT * FROM user WHERE user_name = ?`, [name], function (err, result) {
      if(err) {
        console.log('rejected checking username because ' + err)
        reject(err)
        return err;
      } else if (!result) {
        console.log('no user with username '+ user + ' was found')
        resolve(name);
      } else {
        console.log(result + " was found")
        reject('user exists already')
      }
      })
    } else {
      console.log('invalid character in username')
      reject('Invalid character in username')
    }
    
  })
  return c;
}

exports.createUser = function(user) {
  console.log('creating user')
  return new Promise((resolve, reject) => {
    const username = user.username;
    const password = user.password
    if (password === null|| !password|| password.match(/^ *$/) !== null) {
      reject('password is empty or contains whitespace...')
      return;
    }
    db.run(`INSERT into user(user_name, password)
    VALUES(?, ?);`, [username, password], (err, response) => {
      if(err) {
        reject('Error creating user')
      } else {
        console.log('jjj') 
        try{
          console.log('reading file')
          const test = fs.readFile('./public/defaultpic.png', {encoding: 'base64'}
          ).then((result) => {
            console.log(result)
            console.log('picture done')
            resolve(user)
             
          })
          

        } catch(err) {
          console.log(err)
          console.log('error was found while creating new users profile pic')
          reject('error creating profile picture of new user')
        }
          
        
      }
    })
  }
  )
}

exports.updateDescription = function(req, res, next) {
  const description = req.body.description;
  console.log('update description')
  if(!description){
    res.sendStatus(404)
  } else {
    db.run('UPDATE user set profile_description=? WHERE id=?;', [req.body.description, req.user.id], (err, result) => {
      if(err){
        console.log(err)
        res.sendStatus(500)
      } else{
        next();
      }
    })
  }
}

exports.updateOptions = function(req, res, next) {
  const userBody = req.body;
  console.log(req.body)
  db.get('SELECT dark_mode, private FROM user WHERE id=?;', [req.user.id], (err, result) => {
    if(err) {
      console.log("error: " + err)
      res.sendStatus(500);
    } else {
      if(req.body.private) {
        db.run('UPDATE user SET private=? WHERE id=?;', [result.private==1?0:1, req.user.id])
        console.log(result.dark_mode==1?0:1)
        console.log('dark updated')
        next()
      }
      if (req.body.darkMode){
        db.run('UPDATE user SET dark_mode=? WHERE id=?;', [result.dark_mode==1?0:1, req.user.id])
        console.log('light')
        next()
      }
    }
  })
}