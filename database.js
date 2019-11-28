const Promise = require('promise');
const pg = require('pg');
const USER = "postgres";
const PASSWORD = "pa55word";
const DBNAME = "public";
const connectionString = `postgres://${USER}:${PASSWORD}@localhost:5432/${DBNAME}`;

module.exports = {
  query: function(text, values) {
    return new Promise(function(resolve, reject) {
      pg.connect(connectionString, function(err, client, done) {
        client.query(text, values, function(err, result) {
          done();
          if (err) {
            handleErrorMessages(err)
              .then(function(message) {
                reject(message);
              })
              .catch(function() {
                reject();
              });
          }
          else {
            resolve(result);
          }
        });
      });
    });
  }
};

function handleErrorMessages(err) {
  return new Promise(function(resolve, reject) {
    if (err.code == '23505') {
      err = 'the email you supplied is already in use, please use a different one'
    }
    if (err.code == '22P02') {
      err = 'invalid user ID'
    }
    resolve(err);
  });
}