# express-jwt-mongoose

[![Travis CI status](https://travis-ci.org/danielrw7/express-jwt-mongoose.svg)](https://travis-ci.org/danielrw7/express-jwt-mongoose) [![npm version](https://badge.fury.io/js/express-jwt-mongoose.svg)](https://www.npmjs.com/package/express-jwt-mongoose)

Simple express [json web token](http://jwt.io/) authentication

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
