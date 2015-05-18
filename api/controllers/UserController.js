/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  
  login: function (req, res) {
    var bcrypt = require('bcrypt-nodejs');
    
    User.findOneByUsername(req.body.username, function (err, user) {
      if (err) res.json({ error: 'DB error' }, 500);

      if (user) {
        bcrypt.compare(req.body.password, user.password, function (err, match) {
          if (err) res.json({ error: 'Server error' }, 500);

          if (match) {
            // password match
            // req.session.user = user.id;
            Token.destroy({user:user.id}).exec(function(err){
              Token.create({user:user.id}).exec(function(err, data){
                user.token = data.token;
                res.json(user);
              });
            });
            // res.json(user);
          } else {
            // invalid password
            // if (req.session.user) req.session.user = null;
            res.json({ error: 'Invalid password' }, 400);
          }
        });
      } else {
        res.json({ error: 'User not found' }, 404);
      }
    });
  },
  
  logout: function (req, res) {
    if (req.param('token')) {
      Token.destroy({token:req.param('token')}).exec(function(err){
        if (err) return res.json({ error: 'No data' }, 404);
        return res.json({status: 'success'});
      });
    } else {
      return res.json({ error: 'Not Login' }, 404);
    }
  },
  
  loginCheck: function (req, res) {
    User.findOne({id: req.user_id}, function(err, user){
      user.token = req.param('token');
      return res.json(user);
    })
  },
  
  changePassword: function (req, res) {
    User.findOne({id: req.param('user_id')}, function(err, user){
      user.password = req.param('password');
      user.save(function(err, data){
        if (err) return res.json({error: err}, 404);
        return res.json(data);
      });
    })
  },
  
  changeAdmin: function (req, res) {
    User.update(req.param('user_id'), {admin: req.param('admin')})
    .exec(function(err, data){
      if (err) return res.json({error: err}, 404);
      return res.json(data);
    });
  },
  
};

