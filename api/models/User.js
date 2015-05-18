/**
* Users.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    username : {
      type: 'string',
      unique: true,
      required: true
    },
    password : {
      type: 'string',
      required: true
    },
    email : {
      type: 'email',
      unique: true,
      required: true
    },
    spaceLimit: {
      type: 'float',
      defaultsTo: 1 // Unit in GB
    },
    totalUsage: {
      type: 'float',
      defaultsTo: 0 // Unit in GB
    },
    files: {
      collection: 'file',
      via: 'user'
    },
    admin: {
      type: 'boolean',
      defaultsTo: 0
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      obj.totalUsage = ConvertService.bytesToSize(typeof obj.totalUsage != 'undefined' ? obj.totalUsage*1000*1000*1000 : 0);
      return obj;
    }
  },
  
  beforeCreate: function (attrs, next) {
    if (attrs.token) delete attrs.token;
    if (attrs.password) {
      encryptPassword(attrs, next);
    } else {
      next();
    }
  },
  
  beforeUpdate: function (attrs, next) {
    if (attrs.token) delete attrs.token;
    if (attrs.password) {
      encryptPassword(attrs, next);
    } else {
      next();
    }
  },
  
  afterDestroy: function(destroyedRecords, cb) {
    File.destroy({user: _.pluck(destroyedRecords, 'id')}).exec(cb);
  }
};

function encryptPassword(attrs, next) {
  var bcrypt = require('bcrypt-nodejs');
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(attrs.password, salt, null, function(err, hash) {
      if (err) return next(err);
      attrs.password = hash;
      next();
    });
  });
}

