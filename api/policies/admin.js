/**
 * admin
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
  if (req.param('token')) {
    Token.findOne({token: req.param('token')}).exec(function(err, data){
      if (err) return res.json({ error: 'DB error' }, 500);
      if (data) {
        User.findOne(data.user).exec(function(err, user){
          if (user.admin) {
            return next();
          } else {
            return res.forbidden('You are not permitted to perform this action.');
          }
        });
      } else {
        return res.forbidden('You are not permitted to perform this action.');
      }
    });
  } else {
    return res.forbidden('You are not permitted to perform this action.');
  }
};