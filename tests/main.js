var test = require('tape')

test('It exists', function(t) {
   var jwtAuth = require('../')
   var expected = true
   var actual = (jwtAuth !== undefined && jwtAuth !== null)

   t.plan(1)
   t.equals(actual, expected)
});
