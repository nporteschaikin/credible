var Credible = require('../')
  , should = require('should');

describe('constructor', function () {

  it('should create a validations array', function (ok) {
    var credible = new Credible();
    should(credible.validations).be.instanceof(Array);
    ok();
  });

  describe('arguments', function (){

    it('should create a rule if an object is passed', function (ok) {
      var credible = new Credible({
        name: {
          presence: true
        }
      });
      should(credible.validations.length).equal(1);
      ok();
    });

    it('should create a rule for a parameter', function (ok) {
      var credible = new Credible('name', {
        presence: true
      });
      should(credible.validations.length).equal(1);
      should(credible.validations[0]._props.name).be.type('object');
      ok();
    });

    it('should create a rule for a parameter if rule is passed as string', function (ok) {
      var credible = new Credible('name', 'presence');
      should(credible.validations.length).equal(1);
      should(credible.validations[0]._props.name).be.type('object');
      ok();
    });

    it('should create a rule if a function is passed', function (ok) {
      var credible = new Credible(function () {
        throw 'foo';
      });
      should(credible.validations.length).equal(1);
      ok();
    });

  });

});

describe('.rule', function () {

  it('should create a rule if an object is passed', function (ok) {
    var credible = new Credible();
    credible.rule({name: {presence: true}});
    should(credible.validations.length).equal(1);
    ok();
  });

  it('should create a rule if an object is passed with multiple parameters', function (ok) {
    var credible = new Credible();
    credible.rule({name: {presence: true}, address: {presence: true}});
    should(credible.validations.length).equal(2);
    ok();
  });

  it('should create a rule for a parameter', function (ok) {
    var credible = new Credible();
    credible.rule('name', {presence: true});
    should(credible.validations.length).equal(1);
    should(credible.validations[0]._props.name).be.type('object');
    ok();
  });

  it('should create a rule for a parameter if rule is passed as string', function (ok) {
    var credible = new Credible();
    credible.rule('name', 'presence', true);
    should(credible.validations.length).equal(1);
    should(credible.validations[0]._props.name).be.type('object');
    ok();
  });

  it('should create a rule if a function is passed', function (ok) {
    var credible = new Credible();
    credible.rule(function () {
      throw 'foo';
    });
    should(credible.validations.length).equal(1);
    ok();
  });

  it('should create a rule with an if property', function (ok) {
    var credible = new Credible();
    credible.rule({name: {presence: { if: function () { throw 'Foo' }}}});
    should(credible.validations.length).equal(1);
    should(credible.validations[0]._ifAll.length).equal(1);
    ok();
  });

});

describe('validators', function () {

  describe('length', function () {

    it('should test for length greater than number', function (ok) {
      var credible = new Credible()
      credible
        .rule('name', 'length', {greaterThan: 5})
        .run({name: 'bob'})
        .catch(function (e) {
          should(e.toString()).equal('name must be greater than 5 character(s)');
          ok();
        });
    });

    it('should test for length less than number', function (ok) {
      var credible = new Credible()
      credible
        .rule('name', 'length', {lessThan: 5})
        .run({name: 'christopher'})
        .catch(function (e) {
          should(e.toString()).equal('name must be less than 5 character(s)');
          ok();
        });
    });

    it('should test for length greater than or equal number', function (ok) {
      var credible = new Credible()
      credible
        .rule('name', 'length', {greaterThanOrEqualTo: 5})
        .run({name: 'foo'})
        .catch(function (e) {
          should(e.toString()).equal('name must be greater than or equal to 5 character(s)');
          ok();
        });
    });

    it('should test for length less than or equal to number', function (ok) {
      var credible = new Credible()
      credible
        .rule('name', 'length', {lessThanOrEqualTo: 5})
        .run({name: 'christopher'})
        .catch(function (e) {
          should(e.toString()).equal('name must be less than or equal to 5 character(s)');
          ok();
        });
    });

    it('should test for length equal to number', function (ok) {
      var credible = new Credible()
      credible
        .rule('name', 'length', {equalTo: 5})
        .run({name: 'noah'})
        .catch(function (e) {
          should(e.toString()).equal('name must have 5 character(s)');
          ok();
        });
    });

    it('should allow multiple keys', function (ok) {
      var credible = new Credible()
      credible
        .rule('name', 'length', {greaterThan: 3, lessThan: 10})
        .run({name: 'a'})
        .catch(function (e) {
          should(e.toString()).equal('name must be greater than 3 character(s)');
        })
        .then(function () {
          return credible.run({name: 'abcdefghijklmnop'});
        })
        .catch(function (e) {
          should(e.toString()).equal('name must be less than 10 character(s)');
          ok();
        });
    });

  });

  describe('presence', function () {

    it('should test for presence', function (ok) {
      var credible = new Credible()
      credible
        .rule('name', 'presence')
        .run({name: ''})
        .catch(function (e) {
          should(e.toString()).equal('name is required');
          ok();
        });
    });

  });

  describe('operator', function () {

    it('should test if property is greater than number', function (ok) {
      var credible = new Credible()
      credible
        .rule('number', 'operator', {greaterThan: 5})
        .run({number: 3})
        .catch(function (e) {
          should(e.toString()).equal('number must be greater than 5');
          ok();
        });
    });

    it('should test if property is less than number', function (ok) {
      var credible = new Credible()
      credible
        .rule('number', 'operator', {lessThan: 5})
        .run({number: 7})
        .catch(function (e) {
          should(e.toString()).equal('number must be less than 5');
          ok();
        });
    });

    it('should test if property is greater than or equal to number', function (ok) {
      var credible = new Credible()
      credible
        .rule('number', 'operator', {greaterThanOrEqualTo: 5})
        .run({number: 3})
        .catch(function (e) {
          should(e.toString()).equal('number must be greater than or equal to 5');
          ok();
        });
    });

    it('should test if property is less than or equal to number', function (ok) {
      var credible = new Credible()
      credible
        .rule('number', 'operator', {lessThanOrEqualTo: 5})
        .run({number: 7})
        .catch(function (e) {
          should(e.toString()).equal('number must be less than or equal to 5');
          ok();
        });
    });

    it('should test if property is equal to number', function (ok) {
      var credible = new Credible()
      credible
        .rule('number', 'operator', {equalTo: 5})
        .run({number: 6})
        .catch(function (e) {
          should(e.toString()).equal('number must be equal to 5');
          ok();
        });
    });

    it('should test if property is greater than property', function (ok) {
      var credible = new Credible()
      credible
        .rule('number', 'operator', {greaterThan: 'num'})
        .run({number: 3, num: 10})
        .catch(function (e) {
          should(e.toString()).equal('number must be greater than num');
          ok();
        });
    });

    it('should test if property is less than property', function (ok) {
      var credible = new Credible()
      credible
        .rule('number', 'operator', {lessThan: 'num'})
        .run({number: 7, num: 3})
        .catch(function (e) {
          should(e.toString()).equal('number must be less than num');
          ok();
        });
    });

    it('should test if property is greater than or equal to property', function (ok) {
      var credible = new Credible()
      credible
        .rule('number', 'operator', {greaterThanOrEqualTo: 'num'})
        .run({number: 3, num: 10})
        .catch(function (e) {
          should(e.toString()).equal('number must be greater than or equal to num');
          ok();
        });
    });

    it('should test if property is less than or equal to property', function (ok) {
      var credible = new Credible()
      credible
        .rule('number', 'operator', {lessThanOrEqualTo: 'num'})
        .run({number: 7, num: 3})
        .catch(function (e) {
          should(e.toString()).equal('number must be less than or equal to num');
          ok();
        });
    });

    it('should test if property is equal to property', function (ok) {
      var credible = new Credible()
      credible
        .rule('number', 'operator', {equalTo: 'num'})
        .run({number: 6, num: 2})
        .catch(function (e) {
          should(e.toString()).equal('number must be equal to num');
          ok();
        });
    });

    it('should allow multiple keys', function (ok) {
      var credible = new Credible()
      credible
        .rule('number', 'operator', {greaterThan: 3, lessThan: 10})
        .run({number: 2})
        .catch(function (e) {
          should(e.toString()).equal('number must be greater than 3');
        })
        .then(function () {
          return credible.run({number: 12});
        })
        .catch(function (e) {
          should(e.toString()).equal('number must be less than 10');
          ok();
        });
    });

  });

  describe('alpha', function () {

    it('should test that string is all letters', function (ok) {
      var credible = new Credible()
      credible
        .rule('name', 'alpha')
        .run({name: '1234adsf'})
        .catch(function (e) {
          should(e.toString()).equal('name must contain only letters');
          ok();
        });
    });

  });

  describe('alphaNumeric', function () {

    it('should test that string is all letters and numbers', function (ok) {
      var credible = new Credible()
      credible
        .rule('name', 'alphaNumeric')
        .run({name: 'asdfasf-42134'})
        .catch(function (e) {
          should(e.toString()).equal('name must contain only letters and numbers');
          ok();
        });
    });

  });

  describe('alphaNumericDash', function () {

    it('should test that string contains only letters, numbers, and dashes', function (ok) {
      var credible = new Credible()
      credible
        .rule('name', 'alphaNumericDash')
        .run({name: '!@#$!@#$asdfafs'})
        .catch(function (e) {
          should(e.toString()).equal('name must contain only letters, numbers, and dashes');
          ok();
        });
    });

  });

  describe('alphaNumericUnderscore', function () {

    it('should test that string is all letters, numbers and underscores', function (ok) {
      var credible = new Credible()
      credible
        .rule('name', 'alphaNumericUnderscore')
        .run({name: '1234ads$$f'})
        .catch(function (e) {
          should(e.toString()).equal('name must contain only letters, numbers, and underscores');
          ok();
        });
    });

  });

  describe('email', function () {

    it('should test that string is an email', function (ok) {
      var credible = new Credible()
      credible
        .rule('email', 'email')
        .run({email: 'noah'})
        .catch(function (e) {
          should(e.toString()).equal('email must be a valid e-mail address');
          ok();
        });
    });

  });

  describe('integer', function () {

    it('should test that a number is an integer', function (ok) {
      var credible = new Credible()
      credible
        .rule('num', 'integer')
        .run({num: -5.3})
        .catch(function (e) {
          should(e.toString()).equal('num must be a valid integer');
          ok();
        });
    });

  });

  describe('natural', function () {

    it('should test that a number is a natural number', function (ok) {
      var credible = new Credible()
      credible
        .rule('num', 'natural')
        .run({num: -5.3})
        .catch(function (e) {
          should(e.toString()).equal('num must be a positive number');
          ok();
        });
    });

  });

  describe('naturalNonZero', function () {

    it('should test that a number is a natural number not equal to zero', function (ok) {
      var credible = new Credible()
      credible
        .rule('num', 'naturalNonZero')
        .run({num: -5.3})
        .catch(function (e) {
          should(e.toString()).equal('num must be a positive number and not be zero');
          ok();
        });
    });

  });

  describe('url', function () {

    it('should test that a string is a URL', function (ok) {
      var credible = new Credible()
      credible
        .rule('url', 'url')
        .run({url: 'asdfasdfasfasdfasdfasdfasdfa'})
        .catch(function (e) {
          should(e.toString()).equal('url must be a valid URL');
          ok();
        });
    });

  });

})
