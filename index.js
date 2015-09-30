var jwt        = require('jsonwebtoken')
var expressJwt = require('express-jwt')
var stampit    = require('stampit')

module.exports = stampit()
  .refs({
    userModel: {},
    secret: "",
    usernameField: "username",
    passwordField: "password",
    tokenDuration: 1440, // 24 hours
    tokenPayloadFields: [
      "_id", "username"
    ],
    authenticatePaths: [
      "/authenticate",
      "/auth",
    ],
    jwtOptions: {
      getToken: function (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] == 'Bearer') {
          return req.headers.authorization.split(' ')[1]
        } else if (req.query && req.query.token) {
          return req.query.token
        } else {
          return null
        }
      }
    },
    verifyPassword: function(pass1, pass2) {
      return pass1 === pass2
    },
  })
  .methods({
    verifyToken: function(token, callback) {
      jwt.verify(token, this.secret, callback)
    },
    sendError: function(res, errors, status) {
      if (errors) {
        if (!(typeof errors === 'object' && errors.length)) {
          errors = [errors]
        }
      } else {
        errors = []
      }
      if (status) {
        res.status(status).json({
          success: false,
          errors: errors
        })
      } else {
        res.json({
          success: false,
          errors: errors
        })
      }
    },
    requiresToken: function() {
      return function(req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'] || (req.headers.authorization||"").substr(7)
        if (token) {
          instance.verifyToken(token, function(error, payload) {
            if (error) {
              res.json({
                success: false,
                message: "Invalid token."
              })
            } else {
              req.payload = payload
              next()
            }
          })
        } else {
          res.status(403).json({
  					success: false,
  					message: "No token provided."
          })
        }
      }
    },
    authenticateRoute: function() {
      var instance = this
      return function(req, res) {
        if (req.body) {
          var username = req.body[instance.usernameField] || "",
              password = req.body[instance.passwordField] || ""
          if (username.length && password.length) {
            var query = {}
            query[instance.usernameField] = username
            instance.userModel.findOne(query, function(error, doc) {
              if (error || !doc || !instance.verifyPassword(password, doc[instance.passwordField])) {
                instance.sendError(res, [
                  "Invalid username/password combination"
                ])
              } else {
                var tokenPayload = {}
                instance.tokenPayloadFields.forEach(function(field) {
                  tokenPayload[field] = doc[field]
                })
                var token = jwt.sign(tokenPayload, instance.secret, {
                  expiresInMinutes: instance.tokenDuration
                })
                res.json({
                  success: true,
                  token: token
                })
              }
            })
          } else {
            instance.sendError(res, [
              "You must send the JSON fields \"username\" and \"password\""
            ])
          }
        } else {
          instance.sendError(res, [
            "You must send the JSON fields \"username\" and \"password\""
          ])
        }
      }
    }
  }).
  init(function() {
    var instance = this
    if (this.router && this.authenticatePaths.length) {
      for(var i in this.authenticatePaths) {
        this.router.post(this.authenticatePaths[i], this.authenticateRoute())
      }
    }
    if (this.router && this.jwtOptions) {
      this.jwtOptions.secret = this.secret
      this.router.use(expressJwt(this.jwtOptions)).use(function(err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
          instance.sendError(res, "Invalid token", 401)
        }
      })
    }
  })
