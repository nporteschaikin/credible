credible
========

[![Build Status](https://travis-ci.org/nporteschaikin/credible.svg)](https://travis-ci.org/nporteschaikin/credible)

Credible is a library for validating objects in node.js or the browser.  While it provides several validators out of the box, credible is very _unopinionated_; mostly, credible simply provides a framework for object validation.

## Installation

Credible has one dependency: An A+ promise library, (i.e. [bluebird](https://github.com/petkaantonov/bluebird) or [when.js](https://github.com/cujojs/when))

### Node.js

```sh
$ npm install credible --save
```

### Browser

```html
<script src="/bluebird.js"></script>
<script src="/credible.js"></script>
```

### Example

```javascript
var person = {
  firstName: '',
  lastName: 'Portes Chaikin'
  email: 'foo'
}

var credible = new Credible({
  firstName: {
    presence: true
  },
  lastName: {
    presence: true
  },
  email: {
    email: true
  }
});

credible.run(person)
  .catch(function(err) {
    console.log(err); // [ 'firstName is required', 'email must be a valid e-mail address' ]
  })

```

### API

```javascript
var validator = new Credible();
```

The most straightforward and "built to order" way to get started is by passing an object to the Credible constructor with the properties you'd like to validate and the rules you'd like to validate the property against.

```javascript
validator.rule()
```

A variadic function.

```javascript
validator
  .rule(properties, rule, options)
  .rule(properties, { rule1: options, rule2: options })
  .rule({ property: { rule1: options, rule2: options }, property2: { rule1: options, rule2: options } })
  .rule(fn)
```

All rules have `if`, `unless`, and `catch` options -- pass functions.

```javascript
validator
  .if([properties], fn);
  .unless([properties], fn);
  .catch([properties], fn);
```

| Name  | Description | Options
| ------------- | ------------- |
| length | |
| presence | |
| operator | |
| alpha | |
| alphaDash | |
| alphaNumeric | |
| alphaUnderscore | |
| email | |
| integer | |
| natural | |
| naturalNonZero | |
| url | |
