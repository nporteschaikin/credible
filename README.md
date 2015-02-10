credible
========

[![NPM version](https://badge.fury.io/js/credible.svg)](http://badge.fury.io/js/credible) [![Build Status](https://travis-ci.org/nporteschaikin/credible.svg)](https://travis-ci.org/nporteschaikin/credible)

Credible is a library for validating objects in node.js or the browser.  While it provides several validators out of the box, credible is very _unopinionated_; mostly, credible simply provides a framework for object validation.

## Installation

Credible has one dependency: An A+ promise library, i.e. [bluebird](https://github.com/petkaantonov/bluebird) or [when.js](https://github.com/cujojs/when).

#### Node.js

```sh
$ npm install credible --save
```

Node takes care of the dependency automatically.

#### Browser

```html
<script src="/bluebird.js"></script>
<script src="/credible.min.js"></script>
```

By default, Credible uses [bluebird](https://github.com/petkaantonov/bluebird); to use a different implementation, set `Credible.Promise` to the correct library.

## Usage

```javascript
var rules = {
  name: {
    presence: true
  },
  email: {
    email: true
  }
}

var obj = {
  name: 'Noah Portes Chaikin',
  email: 'noah.porteschaikin@carrotcreative.com'
}

var credible = new Credible(rules)
  .run(obj)
  .catch(function (errors) {
    console.log(errors.toJSON());
  })
```

See [examples](examples).

#### API

Every method in a `Credible` instance returns the instance _except_ `credible.run()`, which returns a promise.

##### `new Credible(arguments..)`

The main `Credible` constructor _optionally_ accepts the same arguments as `credible.rule()` (see below).

##### `credible.rule(arguments..)`

Used to set new rules.  `credible.rule()` is a variadic function; it accepts any of the following sets of arguments:

```javascript
credible
  .rule(properties, validator, options)
  .rule(properties, { validator1: options, validator2: options })
  .rule(validator, options)
```

`validator` is either an [available validator](#available-validators) or a function. To use an available validator, simply pass the validator's name as a string or an object key:

```javascript
credible
  .rule('name', 'presence', true)
  .rule('name', { length: { greaterThan: 5 } })
  .rule(['firstName', 'lastName'], { length: { greaterThan: 5 } })
  .rule({ name: { presence: true }, email: { email: { if: function (obj) { return obj.email; } } } })
```

On validation, a validator function is passed the object, the property key (if provided), and options.  Validator functions can return promises for asynchronous validation. This is an example validator:

```javascript
var emailValidator = function (object, property, options) {
  if ( /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,6}$/i.test(object[property])) {
    throw property + ' is an invalid e-mail address';
  }
}
```

Validators can be sent any number of settings in the `options` object; the following options are made available to every validator and are handled by the `credible` object:

| Key | Description |
| --- | ----------- |
| `if: fn` | Only validate if `fn` returns `true`. `fn` is a function; the object being validated is passed to `fn` as an argument. |
| `unless: fn` | Only validate if `fn` returns `false`. `fn` is a function; the object being validated is passed to `fn` as an argument. |
| `invalid: fn` | `fn` is a function to handle a failed validation; the object being validated is passed to `fn` as an argument. |

##### `credible.if([properties], fn)`

Only run validator if `fn` (a function) returns `true`.  `fn` is passed the object being validated.  Optionally, passing `properties` will only execute the test on validators executed on the specified properties.

```javascript
credible
  .if(function (object) {
    return object.foo == 'bar';
  });

credible
  .if('name', function (object) {
    return object.foo == 'bar';
  });

credible
  .if(['firstName', 'lastName'], function (object) {
    return object.foo == 'bar';
  });
```

##### `credible.unless([property], fn)`

Only run validator if `fn` (a function) returns `false`.  `fn` is passed the object being validated.  Optionally, passing `properties` will only execute the test on validators executed on the specified properties.

```javascript
credible
  .unless(function (object) {
    return object.foo == 'bar';
  });

credible
  .unless('name', function (object) {
    return object.foo == 'bar';
  });

credible
  .unless(['firstName', 'lastName'], function (object) {
    return object.foo == 'bar';
  });
```

##### `credible.invalid([property], fn)`

Pass `fn`, a function, for handling a failed validation. `fn` is passed the object being validated.  Optionally, passing `properties` will only execute the function for failed validations executed on the specified properties.

```javascript
credible
  .invalid(function (object) {
    throw 'This object is invalid.';
  });

credible
  .invalid('name', function (object) {
    throw 'This name is invalid.';
  });

credible
  .invalid(['firstName', 'lastName'], function (object) {
    throw 'This name is invalid.';
  });
```

##### `credible.run(object)`

Run validations on `object`; returns a promise.

```javascript
credible
  .run(obj)
  .then(function () {
    console.log('It\'s valid!');
  })
  .catch(function (errors) {
    console.log(errors.toJSON());
  })
```

## Available Validators

#### `alpha`

Property must contain only letters.

#### `alphaNumeric`

Property must contain only letters and numbers.

#### `alphaNumericDash`

Property must contain only letters, numbers and dashes.

#### `alphaNumericUnderscore`

Property must contain only letters, numbers and underscores.

#### `array`

Property must be an array.

#### `boolean`

Property must be a boolean (`true` or `false` only).

#### `contains`

Property must contain the string specified in the second argument.

#### `date`

Property must be a date (`Date` object).

#### `email`

Property must be a valid e-mail address.

#### `exists`

Property must exist (not be `undefined`).

#### `fn`

Property must be a function.

#### `in`

Property must be in specified array.

```javascript
credible
  .rule( { state: { in: ['approved', 'pending'] } } );
```

#### `integer`

Property must be an integer.

#### `json`

Property must be a valid JSON string.

#### `length`

Property must have a length matching specifications set in `options`.

##### Options

| Key | Description |
| --- | ----------- |
| `greaterThan: number` | Property must have a length greater than `number` |
| `lessThan: number` | Property must have a length less than `number` |
| `greaterThanOrEqualTo: number` | Property must have a length greater than or equal to `number` |
| `lessThanOrEqualTo: number` | Property must have a length less than or equal to `number` |
| `equalTo: number` | Property must have a length equal to `number` |

#### `lowercase`

Property must contain all lowercase letters.

#### `luhn`

Property must be a valid credit card number.

#### `matches`

Property must match `RegExp` object specified in second argument.

#### `natural`

Property must be a positive number.

#### `naturalNonZero`

Property must be a positive number greater than zero.

#### `NaN`

Property must not be a number (`isNaN(value)` returns `false`).

#### `number`

Property must be a number.

#### `presence`

Property must be defined and not empty.

#### `object`

Property must be an object.

#### `operator`

Compare property to a number or another property set in `options`.

##### Options

| Key | Description |
| --- | ----------- |
| `greaterThan: numberOrProperty` | Property must have a length greater than `numberOrProperty` |
| `lessThan: numberOrProperty` | Property must have a length less than `numberOrProperty` |
| `greaterThanOrEqualTo: numberOrProperty` | Property must have a length greater than or equal to `numberOrProperty` |
| `lessThanOrEqualTo: numberOrProperty` | Property must have a length less than or equal to `numberOrProperty` |
| `equalTo: numberOrProperty` | Property must have a length equal to `numberOrProperty` |

#### `regexp`

Property must be a regular expression (`RegExp` object).

#### `string`

Property must be a string.

#### `uppercase`

Property must contain all uppercase letters.

#### `url`

Property must be a valid URL.

## License & Contributing

- Details on the license [can be found here](LICENSE)
- Details on running tests and contributing [can be found here](CONTRIBUTING.md)
