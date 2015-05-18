/**
 * Open
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
            return goPwCheck(req, res, next);
          }
        });
      } else {
        return goPwCheck(req, res, next);
      }
    });
  } else {
    return goPwCheck(req, res, next);
  }
};

function goPwCheck(req, res, next) {
  File.findOne({id:req.param('id')}, function(err, file){
    if (err) return res.json({error: err}, 404);
    
    if (file.password) {
      if (req.param('code') && file.password == req.param('code')) {
        return next();
      } else {
        return res.redirect('/file/pwCheck/'+req.param('id'));
      }
    }
    return next();
  });
}