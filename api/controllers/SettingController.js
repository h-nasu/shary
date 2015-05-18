/**
 * SettingController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  
  create: function(req, res) {
    if (req.param('limitDiskSpace')) {
      Setting.find().exec(function(err, settings){
        if (err) res.json({ error: err }, 404);
        if (settings[0]) {
          Setting.update(settings[0].id, {limitDiskSpace: req.param('limitDiskSpace')}).exec(function(err, data){
            if (err) res.json({ error: err }, 404);
            return res.json(data);
          });
        } else {
          Setting.create({limitDiskSpace: req.param('limitDiskSpace')}).exec(function(err, data){
            if (err) res.json({ error: err }, 404);
            return res.json(data);
          });
        }
      });
    } else {
      res.send(404,'Not Found');
    }
  }
  
};

