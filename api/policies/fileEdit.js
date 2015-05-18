/**
 * FileEdit
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
        req.user_id = data.user;
        if (req.param('id')) {
          File.findOne({id:req.param('id')}, function(err, file){
            if (err) return res.json({error: err}, 404);
            req.fileData = file;
            User.findOne(data.user).exec(function(err, user){
              // Admin
              if (user.admin || req.user_id == file.user) {
                return next();
              } else {
                return res.forbidden('You are not permitted to perform this action.');
              }
            });
          });
        } else {
          return res.forbidden('You are not permitted to perform this action.');
        }
      } else {
        return res.forbidden('You are not permitted to perform this action.');
      }
    });
  } else {
    return res.forbidden('You are not permitted to perform this action.');
  }
};