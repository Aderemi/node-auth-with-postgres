const Promise = require('promise');
const db = require('./database');
const bcrypt = require('bcrypt-nodejs');

module.exports = {
  create: function(data) {
    return new Promise(function(resolve, reject) {
      validateUserData(data)
        .then(function() {
          return hashPassword(data.password);
        })
        .then(function(hash) {
          return db.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) returning id',
            [data.name, data.email, hash]);
        })
        .then(function(result) {
          resolve(result.rows[0]);
        })
        .catch(function(err) {
          reject(err);
        });
    });
  },
  authenticate: function(data) {
    return new Promise(function(resolve, reject) {
      if (!data.email || !data.password) {
        reject('error: email and/or password missing')
      }
      else {
        // change all of this to one transaction?
        findOneByEmail(data.email)
          .then(function(user) {
            // Reset login attempts if more than 15 minutes have passed
            if (Date.now() - user.last_login_attempt >= 900000) {
              user.login_attempts = -1;
            }
            return db.query(
              'UPDATE users SET last_login_attempt = now(), login_attempts = $2 WHERE email = $1 returning *',
              [data.email, user.login_attempts + 1]
            );
          })
          .then(function(result) {
            if (result.rows[0].login_attempts < 10) {
              return result.rows[0];
            }
            else {
              reject('error: attempting to login too frequently, try again in 15 minutes');
            }
          })
          .then(function(user) {
            return verifyPassword(data.password, user);
          })
          .then(function(result) {
            resolve({ isAuthorized: result.isValid, id: result.id });
          })
          .catch(function(err) {
            reject(err);
          });
      }
    });
  }
};

function hashPassword(password) {
  return new Promise(function(resolve, reject) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        reject(err);
      }
      else {
        bcrypt.hash(password, salt, function(err, hash) {
          if (err) {
            reject(err);
          }
          else {
            resolve(hash);
          }
        });
      }
    });
  });
}

function findOneByEmail(email) {
    return new Promise(function(resolve, reject) {
        db.query('SELECT * FROM users WHERE email = $1', [email])
            .then(function(result) {
                if (result.rows[0]) {
                    resolve(result.rows[0]);
                }
                else {
                    reject('no user found')
                }
            })
            .catch(function(err) {
                reject(err);
            });
    });
}

function validateUserData(data) {
  return new Promise(function(resolve, reject) {
    if (!data.password || !data.email) {
      reject('email and/or password missing')
    }
    else {
      validatePassword(data.password, 6)
        .then(function() {
          return validateEmail(data.email);
        })
        .then(function() {
          resolve();
        })
        .catch(function(err) {
          reject(err);
        });
    }
  });
}

function validateEmail(email) {
  return new Promise(function(resolve, reject) {
    if (typeof (email) !== 'string') {
      reject('email must be a string');
    }
    else {
      const re = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
      if (re.test(email)) {
        resolve();
      }
      else {
        reject('provided email does not match proper email format');
      }
    }
  });
}

function validatePassword(password, minCharacters) {
  return new Promise(function(resolve, reject) {
    if (typeof (password) !== 'string') {
      reject('password must be a string');
    }
    else if (password.length < minCharacters) {
      reject('password must be at least ' + minCharacters + ' characters long');
    }
    else {
      resolve();
    }
  });
}

function verifyPassword(password, user) {
  return new Promise(function(resolve, reject) {
    bcrypt.compare(password, user.password, function(err, result) {
      if (err) {
        reject(err);
      }
      else {
        resolve({ isValid: result, id: user.id });
      }
    });
  });
}