var test = require('tape')
var _    = require('lodash')

var model = {
  findOne: function(filters, callback) {
    var users = [
      {
        _id: '1',
        username: 'testUser',
        password: 'testPassword'
      },
      {
        _id: '2',
        username: 'testUser2',
        password: 'testPassword2'
      },
    ]
    var user = _.filter(users, filters)[0]
    if (user) {
      callback(false, user)
    } else {
      callback(true)
    }
  }
}

test('It exists', function(t) {
  var jwtAuth = require('../')
  var expected = true
  var actual = (jwtAuth !== undefined && jwtAuth !== null)

  t.plan(1)
  t.equals(actual, expected)
})

test('Send error', function(t) {
  t.plan(1)

  var errors = [
    "Error 1", "Error 2"
  ]
  var expected = {
    success: false,
    errors: errors
  }

  var res = {
    json: function(json) {
      var actual = json
      t.deepEquals(expected, actual)
    }
  }

  var jwtAuth = require('../')()
  jwtAuth.sendError(res, errors)
})
test('Send error', function(t) {
  t.plan(1)

  var errors = [
    "Error 1"
  ]
  var expected = {
    success: false,
    errors: errors
  }

  var res = {
    json: function(json) {
      var actual = json
      t.deepEquals(expected, actual)
    }
  }

  var jwtAuth = require('../')()
  jwtAuth.sendError(res, errors[0])
})

test('Authenticate route with valid body', function(t) {
  t.plan(3)

  var req = {
    body: {
      username: "testUser",
      password: "testPassword"
    }
  }
  var res = {
    json: function(json) {
      var expected = true
      var actual = (json.token !== undefined && json.token !== null)
      t.equals(actual, expected, 'Token exists')
      jwtAuth.verifyToken(json.token, function(error, payload) {
        t.equals(error, null, 'No error')

        var expected = {
          _id: '1',
          username: 'testUser'
        }
        var actual = _.pick(payload, jwtAuth.tokenPayloadFields)
        t.deepEquals(actual, expected, 'Token payload fields match config option')
      })
    }
  }

  var jwtAuth = require('../')({
    userModel: model,
    secret: "super-secret"
  })
  jwtAuth.authenticateRoute()(req, res)
})
test('Authenticate route with invalid body', function(t) {
  t.plan(2)

  var req = {
    body: {
      username: "testUser3",
      password: "testPassword"
    }
  }
  var res = {
    json: function(json) {
      t.equals(json.success, false, 'JSON response unsuccessful')
      t.ok(json.errors.length, 'JSON response has errors')
    }
  }


  var jwtAuth = require('../')({
    userModel: model,
    secret: "super-secret"
  })
  jwtAuth.authenticateRoute()(req, res)
})
