const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('../testData.sqlite')

exports.test = function() {
  let exp = {}
  db.run('CREATE TABLE if not exists flashcardTable(ID integer NOT NULL, front text, back text, PRIMARY KEY(ID));')

  let sql = `SELECT front FROM flashcardTable`;

  db.all(sql, [], (err, rows) => {
    
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row.front);
      exp[row] = row.front;
    });
  });
  return exp;
}