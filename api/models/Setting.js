/**
* Setting.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    limitDiskSpace: {
      type: 'float',
      defaultsTo: 20 // Unit in GB
    },
  }
};

