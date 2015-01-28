// A custom validator for testing uniqueness
// in a Backbone (backbonejs.org) user model.

var uniquenessValidator = function (model, property) {

  // Get the property value in
  // the tested model.
  var value = model.get(property),

  // Create a new instance
  // of the same model.
  mod = new model.constructor();

  return mod

    // Set the new model to match
    // the property value of the
    // tested model.
    .set(property, value)

    // Attempt to fetch the first
    // matching model.
    .fetch()

    // If a matching model exists, the
    // tested model is not unique.
    .then(function (mod) {
      if (mo) throw property + ' is not unique.';
      return;
    });

}

// Example usage:
//
// var Credible = require('credible')
//   , user = new User({email: 'noah.porteschaikin@carrotcreative.com'});
//   , validator = new Credible();
//
// validator
//   .rule('email', uniquenessValidator)
//   .run(user);
