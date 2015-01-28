// A portable validator for a very
// basic user object.

var Credible = require('../../');

var validator = new Credible();

credible
  // firstName, lastName, email,
  // and password are required.
  .rule(['firstName', 'lastName', 'email', 'password'], 'presence')

  // email must be a valid e-mail address.
  // Only checks if e-mail is present.
  .rule('email', 'email', { if: function (object) { return object.email; } } )

  // password must match passwordConfirmation.
  // Only checks if password is present.
  .rule('password', 'operator', { equalTo: 'passwordConfirmation', if: function (object) { return object.password; } })

module.exports = function (object) {
  // Run the validator on the object
  // passed above. Returns a promise.
  return credible.run(object);
}
