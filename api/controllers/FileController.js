/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

// https://github.com/danialfarid/angular-file-upload
// https://www.npmjs.org/package/gridfs-stream
// https://gist.github.com/psi-4ward/7099001

var db = sails.config.connections.someMongodbServer;
var mongo = require('mongodb');
// var Grid = require('gridfs-stream');
var uriMongo = 'mongodb://';
    uriMongo += db.user ? db.user+':' : '';
    uriMongo += db.password ? db.password+'@' : '';
    uriMongo += db.host+':'+db.port;
    uriMongo += '/'+db.database;
    
var GridStore = require('mongodb').GridStore;
var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
// var Server = require('mongodb').Server;
var maxLimitSpace = 20 * 1000 * 1000 * 1000;
var contentDisposition = require('content-disposition');

module.exports = {
	find: function(req, res) {
    File.find().populate('user').exec(function(err, files){
      return res.json(files);
    });
  },
  
  upload: function(req, res) {
    UploadStreamGridFile(req, res);
  },
  
  download: function(req, res) {
    var id = req.param('id');
    File.findOne({id:id}).exec(function(err, file){
      if (err) {
        res.json({ error: err }, 404);
      }
      
      MongoClient.connect(uriMongo, function(err, condb) {
        new GridStore(condb, new ObjectID(file.fileId.id), null, 'r', {root:'file'}).open(function(err, GridFile) {
          if(!GridFile) {
            res.send(404,'Not Found');
            condb.close();
            return;
          }
          DownloadStreamGridFile(req, res, GridFile, file)
        });
      });
      
    });
  },
  
  
  destroy: function(req, res) {
    
    MongoClient.connect(uriMongo, function(err, condb) {
      new GridStore(condb, new ObjectID(req.fileData.fileId.id), null, 'r', {root:'file'}).open(function(err, GridFile) {
        if(!GridFile) {
          res.send(404,'Not Found');
          condb.close();
          return;
        }
        
        GridFile.unlink(function(err, result) {
          if (err) {
            console.log(err);
            res.json({ error: err }, 404);
          }
          condb.close();
          File.destroy({id:req.fileData.id}, function(err, result){
            if (result[0].user) {
              File.native(function(err, collection) {
                if (err) return res.serverError(err);
                collection.aggregate(
                  [
                    { $match: { user: new ObjectID(result[0].user) } },
                    { $group: { _id: null, totalData: { $sum: "$size" } } }
                  ], function(err, resData){
                    if (err) return res.serverError(err);
                    var userTotalData = 0;
                    if (typeof resData[0] != 'undefined') {
                      userTotalData = resData[0].totalData / (1000 * 1000 * 1000);
                    }
                    User.update(result[0].user, {totalUsage: userTotalData}, function(err,res){});
                  }
                );
              });
            }
            return res.json({result:'deleted'});
          });
        });
      });
    });
  },
  
  myFiles: function(req, res) {
    File.find({user:req.user_id}, function(err, files){
      return res.json(files);
    });
  },
  
  addTag: function(req, res) {
    req.fileData.tags.push(req.param('tag'));
    req.fileData.save(function(err, data){
      if (err) return res.json({error: err}, 404);
      return res.json(data);
    });
  },
  
  deleteTag: function(req, res) {
    var index = req.fileData.tags.indexOf(req.param('tag'));
    if (index > -1) {
      req.fileData.tags.splice(index, 1);
    }
    req.fileData.save(function(err, data){
      if (err) return res.json({error: err}, 404);
      return res.json(data);
    });
  },
  
  autoTags: function(req, res) {
    if (req.param('query')) {
      var regQuery = new RegExp('^'+req.param('query'), 'i');
      File.native(function(err, collection) {
        if (err) return res.serverError(err);
        collection.distinct('tags',{'tags': regQuery}, function(err, tags){
          if (err) return res.json({error: err}, 404);
          function filterSearch (val) {
            return val.match(regQuery);
          }
          var filteredTag = tags.filter(filterSearch);
          return res.json(filteredTag);
        });
      });
    }
  },
  
  allTags: function(req, res) {
    var query = {};
    if (req.param('user_id')) {
      query.user = new ObjectID(req.param('user_id'));
    }
    File.native(function(err, collection) {
      if (err) return res.serverError(err);
      collection.distinct('tags', query, function(err, tags){
        if (err) return res.json({error: err}, 404);
        return res.json(tags);
      });
    });
  },
  
  addPassword: function(req, res) {
    req.fileData.password = req.param('password');
    req.fileData.save(function(err, data){
      if (err) return res.json({error: err}, 404);
      return res.json(data);
    });
  },
  
  pwCheck:  function(req, res) {
    if (!req.param('id')) return res.json({ error: 'File not found'}, 404);
    res.view('pwCheck.ejs', { fileId: req.param('id'), error: false, layout: false });
  },
  
};

// streaming function for upload
function UploadStreamGridFile(req, res) {
  var blobAdapter = require('skipper-gridfs')({
    uri: uriMongo+'.file'
  });
  var receiving = blobAdapter.receive();
  
  req.file('up_file').upload(
    receiving,
    function (err, file) {
      if (err) {
        return res.serverError(err);
      } else {
        // save to file
        File.create({
          filename: file[0].filename,
          fileId: file[0].extra.fileId,
          type: file[0].type,
          size: file[0].size,
          user: req.user_id
        }, function(err,data){
          if(err){console.log(err)}
          req.user.totalUsage = req.newTotalData;
          req.user.save(function(err, data){
            //if (err) return res.json({error: err}, 404);
            //return res.json(data);
          });
        });

        return res.json({
          message: file.length + ' file(s) uploaded successfully!',
          file: file
        });
      }
  });
}


// streaming function for download
function DownloadStreamGridFile(req, res, GridFile, file) {
  if(req.headers['range']) {
 
    // Range request, partialle stream the file
    // console.log('Range Reuqest');
    var parts = req.headers['range'].replace(/bytes=/, "").split("-");
    var partialstart = parts[0];
    var partialend = parts[1];
 
    var start = parseInt(partialstart, 10);
    var end = partialend ? parseInt(partialend, 10) : GridFile.length -1;
    var chunksize = (end-start)+1;
 
    //console.log('Range ',start,'-',end);
 
    res.writeHead(206, {
      'Content-Range': 'bytes ' + start + '-' + end + '/' + GridFile.length,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': file.type
    });
 
    // Set filepointer
    GridFile.seek(start, function() {
      // get GridFile stream
      var stream = GridFile.stream(true);
 
      // write to response
      stream.on('data', function(buff) {
        // count data to abort streaming if range-end is reached
        // perhaps theres a better way?
        start += buff.length;
        if(start >= end) {
          // enough data send, abort
          GridFile.close();
          res.end();
        } else {
          res.write(buff);
        }
      });
    });
 
  } else {
 
    // stream back whole fileres.header('Content-disposition', 'filename=' + file.filename);
    if (!file.type.match(/audio|video|image/)) {
      res.header('Content-disposition', contentDisposition(file.filename));
    }
    
    res.header('Content-Type', file.type);
    res.header('Content-Length', GridFile.length);
    var stream = GridFile.stream(true);
    stream.pipe(res);
  }
}

