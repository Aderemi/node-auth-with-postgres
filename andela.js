// Dependencies

const express = require('express');
const colors = require('colors');
const usersController = require('./users.controller');
const User = require('./user');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

// Create server
const app = express();
const SECRET = "h3sqq%pb#dHh^XcU8&Uj8brVS_*$LGHW";
const PORT = 3001;
const JWT_EXPIRATION = 36500;

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// Authentication to obtain a token
app.post('/api/login', function(req, res) {
    User.authenticate(req.body)
        .then(function(result) {
            if (result.isAuthorized === true) {
                jwt.sign({ sub: result.id }, SECRET, { expiresIn: JWT_EXPIRATION, issuer: 'andela' }, function(token) {
                    return res.status(200).json({
                        message: 'authenticated, token attached',
                        token: token
                    });
                });
            }
            else {
                return res.status(401).json({
                    message: 'bad credentials'
                });
            }
        })
        .catch(function(err) {
            return res.status(400).json({
                message: err
            });
        });
});
app.post('/api/signup', usersController.createUser);

app.use(function(req, res, next) {
    const token = req.body.token || req.query.token || req.headers['authorization'];

    if (token) {
        jwt.verify(token, SECRET, function(err, decoded) {
            if (err) {
                return res.status(401).json({
                    message: 'failed authentication: invalid token'
                });
            }
            console.log(decoded);
            User.findOne({ 'id': decoded.sub })
                .then(function(user) {
                    req.decoded = decoded;
                    next();
                })
                .catch(function(err) {
                    return res.status(401).json({
                        message: 'failed authentication: ' + err
                    });
                });
        });
    }
    else {
        return res.status(401).json({
            message: 'failed authentication: no token provided.'
        });
    }
});

app.get('/api/me',  usersController.getSelfUser);


// Start listening
app.listen(PORT, function() {
  console.log(colors.green('Listening on port ' + PORT));
});

