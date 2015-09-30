# express-jwt-mongoose v0.1.2

[![Travis CI status](https://travis-ci.org/danielrw7/express-jwt-mongoose.svg)](https://travis-ci.org/danielrw7/express-jwt-mongoose) [![npm version](https://badge.fury.io/js/express-jwt-mongoose.svg)](https://www.npmjs.com/package/express-jwt-mongoose)

Simple express [json web token](http://jwt.io/) user authentication

## Install
`npm install --save express-jwt-mongoose`

## Dependencies
`npm install --save express bodyParser mongoose`

## Usage

```
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var router = express.Router()

var mongoose = require('mongoose')
mongoose.connect("mongo database url...")

app.use(bodyParser.json())

var jwtAuth = require('express-jwt-mongoose')
var userModel = require('UserModel.js')

jwtAuth({
  router: router,
  secret: "super-secret",
  userModel: userModel
})

router.post('/protected', function(req, res) {
  res.json({
    success: true,
    message: "You are authorized"
  })
})

app.use('/', router)

app.listen(3001, function() {
  console.log("Listening!")
})
```

## Options
#### userModel
Your mongoose user model

------------
#### secret
The token secret

------------
#### usernameField
`username` default

The field you store the username in in the `userModel`

------------
#### passwordField
`password` default

The field you store the password in in the `userModel`

------------
#### tokenDuration
`1440` default (24 hours)

The length of time generated tokens will be active, in minutes

------------
#### tokenPayloadFields
`["_id", "username"]` default

Fields that will be stored in the token payload

------------
#### authenticatePaths
`["/authenticate", "/auth"]` default

Url paths where users can authenticate with the fields `username` and `password` (or whichever you set in `usernameField` and `passwordField`, respectively)

------------
#### verifyPassword
```
function(pass1, pass2) {
  return pass1 === pass2
}
```

A method which is used to compare two passwords. **Changing this to verify hashed passwords is highly recommended for your application's security.**

**Example using [`password-hash`](https://github.com/davidwood/node-password-hash)**
```
function(password, hashedPassword) {
  return require('password-hash').verify(password, hashedPassword)
}
```
