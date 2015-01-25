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
      var credible = new Credible('name', 'presence', true);
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
