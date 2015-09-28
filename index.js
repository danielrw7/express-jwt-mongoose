var jwt     = require('jsonwebtoken')
var stampit = require('stampit')

module.exports = stampit()
  .refs({
    userModel: {},
    tokenSecret: "",
    usernameField: "username",
    passwordField: "password",
    tokenDuration: 1440, // 24 hours
    tokenPayloadFields: [
      "_id", "username"
    ],
  })
  .methods({
    verifyPassword: function(pass1, pass2) {
      return pass1 === pass2
    },
    verifyToken: function(token, callback) {
      jwt.verify(token, this.tokenSecret, callback)
    },
    sendError: function(res, errors) {
      if (errors) {
        if (!(typeof errors === 'object' && errors.length)) {
          errors = [errors]
        }
      } else {
        errors = []
      }
      res.json({
        success: false,
        errors: errors
      })
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
          var username = req.body.username,
              password = req.body.password
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
                var token = jwt.sign(tokenPayload, instance.tokenSecret, {
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
        }
      }
    }
  })
