const db = require('./data.js').db
const fs = require('fs/promises')

exports.getUser = function(user, pass, callback) {
  
  db.get(`SELECT * FROM user WHERE user_name = ? AND password = ?;`,[user, pass], (err, response) => {
    if(err) {
      
      callback(err)

      return;
    } else if (response ==null) {
      console.log(pass)
      console.log('no user found')
      callback(null, null)
      return;
    } else {
      console.log('user found')
      callback(null, {username:user, password:pass, id: response.id})
  
      return;
    }
  })
}

exports.getUserById = function(id, callback) {
  
  db.get(`SELECT * FROM user WHERE id= ?;`, [id], (err, response) => {
    if(err) {
      
      callback(err, null);
    }
    
    
    callback(null, response)
  })
}

exports.checkUsername = function(user) {
  console.log('siaufjosjf')
  const c=  new Promise((resolve, reject) => {
    

    
    const regex = /[^[:alnum:]]/
    const name = user;
    const check = name.match(regex);
    if(check === null) {
      
      db.get(`SELECT * FROM user WHERE user_name = ?`, [name], function (err, result) {
      if(err) {
        console.log(err)
        reject(err)
        return err;
      } else if (!result) {
        console.log('no result')
        resolve(name);
      } else {
        
        reject('user exists already')
      }
      })
    } else {
      console.log('ifsjiojfsio')
      reject('Invalid character in username')
    }
    
  })
  return c;
}

exports.createUser = function(user) {
  
  return new Promise((resolve, reject) => {
    console.log('wojdiofjoi')
    const username = user.username;
    const password = user.password
    if (password === null|| !password|| password.match(/^ *$/) !== null) {
      reject('password is empty or contains whitespace...')
      return;
    }
    db.run(`INSERT into user(user_name, password)
    VALUES(?, ?);`, [username, password], (err, response) => {
      if(err) {
        console.log('issue')
        reject('Error creating user')
      } else {
        console.log('booo')
        
        try{
          
          const test = fs.readFile('./public/defaultpic.png', {encoding: 'base64'}
          ).then((result) => {
            
            console.log('yayyy' + result)
            resolve(user)
             
          })
          

        } catch(err) {
          
          console.log('yayyy')
          reject('error creating profile picture of new user')
        }
          
        
      }
    })
  }
  )
}

exports.updateDescription = function(req, res, next) {
  const description = req.body.description;
  
  if(!description){
    res.sendStatus(404)
  } else {
    db.run('UPDATE user set profile_description=? WHERE id=?;', [req.body.description, req.user.id], (err, result) => {
      if(err){
        
        res.sendStatus(500)
      } else{
        next();
      }
    })
  }
}

exports.updateOptions = function(req, res, next) {
  const userBody = req.body;
  console.log('updating options')
  
  db.get('SELECT dark_mode, private FROM user WHERE id=?;', [req.user.id], (err, result) => {
    if(err) {
      
      res.sendStatus(500);
    } else {
      if(req.body.private) {
        db.run('UPDATE user SET private=? WHERE id=?;', [result.private==1?0:1, req.user.id])
        next()
      }
      if (req.body.darkMode){
        db.run('UPDATE user SET dark_mode=? WHERE id=?;', [result.dark_mode==1?0:1, req.user.id])
        
        next()
      }
    }
  })
}

exports.deleteUser = function(req, res, next) {
  const id = req.user.id;
  const pass = req.user.password;
  req.logout(null, (err)=>{
    if(err){
      res.status(500)
      res.setHeader('Content-Type', 'text/plain');
      res.send(err);
    } else {
      db.run('DELETE FROM user WHERE id=? AND password=?;', [id, pass], (err, response) => {
        if(err) {
          res.sendStatus(404)
        } else {
          res.sendStatus(200)
        }
      }) 

    }
  })
  
}