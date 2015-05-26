# Shary

__Shary__ is an open source file sharing platform created with __Sailsjs(Nodejs)__ and __Mongodb__, using __GridFS__ for file storing and streaming.

* Web Server: __Nginx__
* Web Programming Language: __Nodejs__
* Nodejs Framework: __Sailsjs__
* Database: __Mongodb__
* Frontend Javascript Framework: __Angularjs__
* Frontend Styling: __Bootstrap__

__Live Demo:__ http://sharydemo-hnasu.rhcloud.com/<br>
username: admin<br>
password: admin135

## Set Up

Will Need to install _Nodejs_ and _Mongodb_ in your environment.<br>
Clone or download source code from repository and install all the dependencies.
```
npm install
```
Create intial user inside _Mongodb_ (can set up db user as you wish)...<br>
Initial user account can be anything but here is just an example.
```javascript
use yourDatabase;

db.user.insert(
  { 
    "_id" : ObjectId("54b9f5ce2df9147127007652"), 
    "username" : "admin", 
    "password" : "$2a$10$VYm8D8gpt3lVKwtD7VHxL.PkFpWHBpJuISv4gLMRAFffp/mZ1YmlW", 
    "email" : "admin@admin.com", 
    "admin" : true, 
    "spaceLimit" : 2, 
    "totalUsage" : 0, 
    "user_id" : "54b9f5ce2df9147127007652" 
  }
);

// This will create...
{
  username: 'admin',
  password: 'admin'
}
```
Below is just an example of creating user for mongodb.
```javascript
db.createUser(
   {
     user: "username",
     pwd: "password",
     roles: [{role:"readWrite", db:"database"}]
   }
);
```
Below are some settings you can change depending on your environment.
```javascript
// config/connections.js
// mongodb config
someMongodbServer: {
  adapter: 'sails-mongo',
  host: 'localhost',
  port: 27017,
  user: '',
  password: '',
  database: ''
},

// config/session.js
// use mongodb config for session storage
adapter: 'mongo',
host: 'localhost',
port: 27017,
db: '',
collection: 'sessions',
username: '',
password: '',
auto_reconnect: true,

// config/local.js
// If need, running port can be changed from config/local.js.
port: some_port#

// confog/models.js
// When running the application for first time, please set the migration mode to 2 (alter).
// 2(alter) will create needed collections in mongodb for running the sails application.
// And change the migration to safe after...
migrate: 'safe'
```

If you using _Nginx_ or _Apache_ for proxy, max body limit for upload file need to be set.
```
# This is an example setting for Nginx
# /etc/nginx/nginx.conf

http {
  ...
  # Set the max body size limit
  # 1M -> 1 megabyte
  # 0 -> do not set the limit
  client_max_body_size 0
  ...
}
```
Start the application from terminal.
```
cd shary
sails lift
```
You can use _foreverjs_ and _nodemon_ to keep the application running.<br>
Make sure you create __.foreverignore__ in the root directory.
```
cd shary
vi .foreverignore

# insert below to .foreverignore
**/.tmp/**

# stop the application and re-run it with below command
forever -w -c nodemon app.js --exitcrash
```

You can access your site with...<br>
http://localhost:port/
