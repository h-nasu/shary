/**
 * upload
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */

var UNIT = 1000 * 1000 * 1000; // Unit for disk space -> GB
// var maxLimitSpace = 100 * 1000 * 1000 * 1000;
// var maxLimitSpaceByUser = 1 * 1000 * 1000 * 1000;
// var maxLimitSpace = 300;
var ObjectID = require('mongodb').ObjectID;

module.exports = function(req, res, next) {
  if (req.param('token')) {
    Token.findOne({token: req.param('token')}).exec(function(err, data){
      if (err) return res.json({ error: 'DB error' }, 500);
      if (data) {
        req.user_id = data.user;
        User.findOne(data.user).exec(function(err, user){
          if (user) {
            if (user.password) delete user.password;
            req.user = user;
            File.native(function(err, collection) {
              if (err) return res.serverError(err);
              collection.aggregate(
                [
                  { $group: { _id: null, totalData: { $sum: "$size" } } }
                ], function(err, result){
                  if (err) return res.serverError(err);
                  
                  // limit by limitDiskSpace
                  Setting.find().exec(function(err, settings){
                    if (settings[0]) {
                      var maxLimitSpace = settings[0].limitDiskSpace * UNIT;
                      if (typeof result[0] == 'undefined' || result[0].totalData < maxLimitSpace) {
                        limitSpaceByUser(req, res, next, user);
                      } else {
                        res.send(400, 'Over Service limit!');
                      }
                    } else {
                      res.send(400, 'Please set the max disk space limit!');
                    }
                  });
                  
                }
              );
            });
          
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

function limitSpaceByUser(req, res, next, data) {
  File.native(function(err, collection) {
    if (err) return res.serverError(err);
    collection.aggregate(
      [
        { $match: { user: new ObjectID(req.user_id) } },
        { $group: { _id: null, totalData: { $sum: "$size" } } }
      ], function(err, result){
        if (err) return res.serverError(err);
        if (typeof result[0] == 'undefined') {
          if (req.file('up_file')._files[0].stream.byteCount < (data.spaceLimit * UNIT)) {
            next();
          } else {
            res.send(400, 'Over limit!');
          }
        } else {
          var userTotalData = result[0].totalData + req.file('up_file')._files[0].stream.byteCount;
          //if (userTotalData < maxLimitSpaceByUser) {
          if (userTotalData < (data.spaceLimit * UNIT)) {
            req.newTotalData = userTotalData / UNIT;
            return next();
          } else {
            res.send(400, 'Over limit!');
          }
        }
      }
    );
  });

}

