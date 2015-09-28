var test = require('tape')

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
