const User = require('./user');

module.exports = {
  createUser: function(req, res) {
    User.create(req.body)
      .then(function(result) {
        return res.status(200).json({
          message: 'success! created account for new user',
          id: result.user_id
        });
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },
  getSelfUser: function(req, res) {
    User.findOne({ id: req.decoded.sub })
      .then(function(result) {
        delete result.last_login_attempt;
        delete result.login_attempts;
        return res.status(200).json(result);
      })
      .catch(function(err) {
        return res.status(400).json({
          message: err
        });
      });
  },

};