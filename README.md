# Shary

Shary is an open source file sharing platform created with Sailsjs(Nodejs) and Mongodb, using GridFS for file storing and streaming.

__Live Demo:__ http://sharydemo.cyber-th.com
username: 'admin'
password: 'admin'

## Set Up

Will Need to install Nodejs and Mongodb in your environment.
Clone or download source code from repository and install all the dependencies.
```
npm install
```
Create intial user inside Mongodb (can set up db user as you wish)...
Initial user account can be anything but here is just an example.
```javascript
{
  username: 'admin',
  password: 'admin'
}
```

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
```
If need, running port can be changed from config/local.js.
If you using Nginx or Apache for proxy, max body limit for upload file need to be set.
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
You can use foreverjs and nodemon to keep the application running.
Make sure you create __.foreverignore__ in the root directory.
```
cd shary
vi .foreverignore

# insert below to .foreverignore
**/.tmp/**

# stop the application and re-run it with below command
forever -w -c nodemon app.js --exitcrash
```

You can access your site with...
http://localhost:port/
