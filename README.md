credible
========

Credible is a library for validating objects in node.js or the browser.  While it provides several validators out of the box, credible is very _unopinionated_; mostly, credible simply provides a framework for object validation.

## Installation

Credible has two dependencies:

- [underscore.js](http://underscorejs.org) or [lodash](http://lodash.com/)
- An A+ promise library, a la [bluebird](https://github.com/petkaantonov/bluebird) or [when.js](https://github.com/cujojs/when)

### Node.js

```sh
$ npm install credible --save
```

### Browser

```html
<script src="/lodash.js"></script>
<script src="/bluebird.js"></script>
<script src="/credible.js"></script>
```

### Example

```javascript
var person = {
  firstName: 'Noah',
  lastName: 'Portes Chaikin'
}

var credible = new Credible({
  firstName: 'alpha'
  lastName: 'alpha'
});

credible.run(person)
  .catch(function(err) {
    console.log(err);
  })

```

### API

```javascript
var rulesObject = {
  username: 'alpha',
  email: ['presence', 'email']
}

new Credible(rulesObject);
```

The most straightforward and "built to order" way to get started is by passing an object to the Credible constructor with the properties you'd like to validate and the rules you'd like to validate the property against.

Rules can either reference a native validator or be a function:

```javascript
var rulesObject = {
  username: 'alpha',
  email: function (model, attribute) {
    if (!email) throw 'No e-mail provided'
  }
}

new Credible(rulesObject);
```

`Credible.validate()` returns a chainable object.

```javascript
var credible = new Credible()
credible.validate('');
```

### To Do
- [ ] Write tests
- [ ] Finish this documentation
