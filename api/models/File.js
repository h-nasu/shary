/**
* File.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    size: {
      type: 'integer'
    },
    user: {
      model: 'user'
    },
    tags: {
      type: 'array',
      defaultsTo: []
    },
    password : {
      type: 'string',
      defaultsTo: ''
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      obj.size = ConvertService.bytesToSize(obj.size);
      return obj;
    }
  }
};

