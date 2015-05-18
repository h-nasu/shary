/**
* Token.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    token : {
      type: 'string'
    },
    user : {
      model: 'user'
    }
  },
  
  beforeCreate: function (attrs, next) {
    attrs.token = makeToken();
    next();
  },
  
  beforeUpdate: function (attrs, next) {
    attrs.token = makeToken();
    next();
  }
  
};

function makeToken() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 40; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}