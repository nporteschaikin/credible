// A portable validator for a
// very basic user object.

var Credible = require('../../');

var validator = new Credible();

credible

  // Validate `email` is a valid
  // e-mail address.
  .rule('email', 'email')

  // `firstName`, `lastName`, `email`,
  // and password are required.
  .rule(['firstName', 'lastName', 'password', 'passwordConfirmation'], 'presence')

  // Validate `email` if `email`
  // is present.
  .if('email', function (object) { return object.email; })

  // Validate `passwordConfirmation` unless
  // `password` is undefined.
  .unless('passwordConfirmation', function (object) { return !object.password; })

  // Catch all errors on `email`
  // and `name` properties.
  .invalid(['firstName', 'lastName', 'email'], function (object) { throw 'You\'re missing personal information!'; })

  // Only run validator if `email`
  // is present.
  .if(function (object) { return object.email; })

module.exports = function (object) {
  // Run the validator on the object
  // passed above. Returns a promise.
  return credible.run(object);
}
