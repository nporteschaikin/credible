(function(root){

  function __(_, Promise) {

    var _LOCALE_ = 'en',

    _TYPES_ = {
      alpha: /^[a-z]+$/i,
      alphaDash: /^[a-z0-9_\-]+$/i,
      alphaNumeric: /^[a-z0-9]+$/i,
      alphaUnderscore: /^[a-z0-9_]+$/i,
      email: /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,6}$/i,
      integer: /^\-?[0-9]+$/,
      natural: /^[0-9]+$/i,
      naturalNonZero: /^[1-9][0-9]*$/i,
      url: /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/
    },

    _VALIDATORS_ = {

      length: function (obj, prop, options) {
        var v = obj[prop].length, b, n, m;
        if (options.greaterThan) {
          b = v > (n = options.greaterThan);
          m = 'lengthGreaterThan';
        } else if (options.lessThan) {
          b = v < (n = options.lessThan);
          m = 'lengthLessThan';
        } else if (options.greaterThanOrEqualTo) {
          b = v >= (n = options.greaterThanOrEqualTo);
          m = 'lengthGreaterThanOrEqualTo';
        } else if (options.lessThanOrEqualTo) {
          b = v <= (n = options.lessThanOrEqualTo);
          m = 'lengthLessThanOrEqualTo';
        } else {
          b = v == (n = options.equalTo);
          m = 'lengthEqualTo';
        }
        if (!b) throw _MESSAGE_(m, {property: prop, num: n})
      },

      presence: function (obj, prop) {
        if (!obj[prop]) throw _MESSAGE_('presence', {property: prop});
      },

      operator: function (obj, lh, o, rh) {
        var lhv = obj[lh]
          , rhv = 'string' === typeof rh ? obj[rh] : rh
          , b, m;
        if (options.greaterThan) {
          b = lhv > rhv;
          m = 'greaterThan';
        } else if (options.lessThan) {
          b = lhv < rhv;
          m = 'lessThan';
        } else if (options.greaterThanOrEqualTo) {
          b = lhv >= rhv;
          m = 'greaterThanOrEqualTo';
        } else if (options.lessThanOrEqualTo) {
          b = lhv <= rhv;
          m = 'lessThanOrEqualTo';
        } else {
          b = lhv == rhv;
          m = 'equalTo';
        }
        if (!b) throw _MESSAGE_(m, {lh: lh, rh: 'string' === typeof rh ? rh : rhv});
      }

    },

    _MATCH_ = function (obj, prop, type) {
      if (!_TYPES_[type].test(obj[prop]))
        throw _MESSAGE_(type, {property: prop});
    }

    for (var type in _TYPES_) {
      _VALIDATORS_[type] = function (obj, prop, bool) {
        if (bool) {
          _MATCH_(obj, prop, type);
        }
      }
    }

    var _MESSAGES_ = {
      alpha: {
        en: '{{property}} must contain only letters'
      },
      alphaDash: {
        en: '{{property}} must contain only letters and dashes'
      },
      alphaNumeric: {
        en: '{{property}} must contain only letters and numbers'
      },
      alphaUnderscore: {
        en: '{{property}} must contain only letters and underscores'
      },
      equalTo: {
        en: '{{lh}} must be equal to {{rh}}'
      },
      email: {
        en: '{{property}} must be a valid e-mail address'
      },
      greaterThan: {
        en: '{{lh}} must be greater than {{rh}}'
      },
      greaterThanOrEqualTo: {
        en: '{{lh}} must be greater than or equal to {{rh}}'
      },
      integer: {
        en: '{{property}} must be a valid integer'
      },
      lengthEqualTo: {
        en: '{{property}} must have {{num}} character(s)'
      },
      lengthGreaterThan: {
        en: '{{property}} must be greater than {{num}} character(s)'
      },
      lengthGreaterThanOrEqualTo: {
        en: '{{property}} must be greater than or equal to {{num}} character(s)'
      },
      lengthLessThan: {
        en: '{{property}} must be less than {{num}} character(s)'
      },
      lengthLessThanOrEqualTo: {
        en: '{{property}} must be less than or equal to {{num}} character(s)'
      },
      lessThan: {
        en: '{{lh}} must be less than {{rh}}'
      },
      lessThanOrEqualTo: {
        en: '{{lh}} must be less than or equal to {{rh}}'
      },
      natural: {
        en: '{{property}} must be a positive number'
      },
      naturalNonZero: {
        en: '{{property}} must be a positive number and not be zero'
      },
      url: {
        en: '{{property}} must be a valid URL'
      },
      presence: {
        en: '{{property}} is required'
      }
    },

    Validation = function (name, options) {
      if ('function' === typeof name) {
        validator = props;
      } else {
        validator = _VALIDATOR_(name);
      }

      this._validator = validator;
      this._options = options;
      this._ifAll = [];
      this._unlessAll = [];

      if ('object' === typeof options) {
        if (options.if) {
          this.if(options.if);
          delete options.if;
        }
        if (options.unless) {
          this.unless(options.unless);
          delete options.unless;
        }
        if (options.catch) {
          this.catch(options.catch);
          delete options.catch;
        }
      }
    };

    Validation.prototype = {

      if: function () {
        if (arguments.length == 2) {
          var props = arguments[0]
            , fn = arguments[1]
            , prop;
          if ('string' === typeof props) props = [props];
          for (var key in props) {
            prop = props[key];
            this.prop(prop, {if: fn});
          }
        } else {
          this._ifAll.push(arguments[0]);
        }
        return this;
      },

      unless: function () {
        if (arguments.length == 2) {
          var props = arguments[0]
            , fn = arguments[1]
            , prop;
          if ('string' === typeof props) props = [props];
          for (var key in props) {
            prop = props[key];
            this.prop(prop, {unless: fn});
          }
        } else {
          this._unlessAll.push(arguments[0]);
        }
        return this;
      },

      catch: function () {
        if (arguments.length == 2) {
          var props = arguments[0]
            , fn = arguments[1]
            , prop;
          if ('string' === typeof props) props = [props];
          for (var key in props) {
            prop = props[key];
            this.prop(prop, {catch: fn});
          }
        } else {
          this._catchAll = arguments[0];
        }
        return this;
      },

      of: function (props, options) {
        return this.prop(props, options);
      },

      prop: function (props, options) {
        if ('string' === typeof props) props = [props]

        var name, prop;
        for (var key in props) {
          name = props[key];

          if (!this._props) this._props = {};
          if (!(prop = this._props[name])) prop = {};

          if ('object' === typeof options) {
            if (options.if) {
              if (!prop.if) prop.if = [];
              prop.if.push(options.if);
              delete options.if;
            }
            if (options.unless) {
              if (!prop.unless) prop.unless = [];
              prop.unless.push(options.unless);
              delete options.unless;
            }
            if (options.catch) {
              prop.catch = options.catch;
              delete options.catch;
            }
          }
          this._props[name] = prop;
        }

        return this;
      },

      run: function (obj) {
        var th = this
          , errors = []
          , options = th._options || {}
          , fn
          , promise;
        for (var key in this._ifAll) {
          fn = th._ifAll[key];
          if (!!!fn(obj)) return th;
        }
        for (var key in this._unlessAll) {
          fn = th._unlessAll[key];
          if (!!fn(obj)) return th;
        }
        if (th._props) {
          var promises = [], prop;
          for (name in th._props) {
            prop = th._props[name];
            promises.push(function(){
              if (prop.if) {
                for (var key in prop.if) {
                  fn = prop.if[key];
                  if (!!!fn(obj)) return;
                }
              }
              if (prop.unless) {
                for (var key in prop.unless) {
                  fn = prop.unless[key];
                  if (!!fn(obj)) return;
                }
              }
              return Promise.method(th._validator)(obj, name, th._options)
                .catch(function (error){
                  if (prop.catch) {
                    error = prop.catch(obj);
                  } else {
                    if (th._catchAll) th._catchAll(obj);
                  }
                  errors.push(error);
                })
            }());
          }
          promise = Promise.all(promises);
        } else {
          promise = Promise.method(th._validator)(obj, th._options)
            .catch(function(error) {
              if (th._catchAll) th._catchAll(obj);
              errors.push(error);
            })
        }
        return promise.then(function () {
          if (errors.length) throw errors;
          return th;
        });
      }

    }

    function PropertyValidation (props) {
      if ('string' === typeof props) props = [props];
      this.props = props;
      this.validations = {};
    }

    PropertyValidation.prototype = {

      rule: function (name, options) {
        var validation = (new Validation(name, options))
          .of(this.props);
        this.validations[name] = validation;
        return this;
      },

      if: function () {
        var validation;
        for (var key in this.validations) {
          validation = this.validations[key];
          validation.if.apply(validation, arguments);
        }
        return this;
      },

      unless: function () {
        var validation;
        for (var key in this.validations) {
          validation = this.validations[key];
          validation.unless.apply(validation, arguments);
        }
        return this;
      },

      catch: function () {
        var validation;
        for (var key in this.validations) {
          validation = this.validations[key];
          validation.catch.apply(validation, arguments);
        }
        return this;
      }

    }

    function _VALIDATOR_ (name) {
      return _VALIDATORS_[name];
    }

    function _MESSAGE_ (name, options) {
      var message = _MESSAGES_[name][_LOCALE_]
      return message.replace(/\{\{([a-zA-Z]+)\}\}/g, function (match, key) {
        return options[key];
      });
    }

    var V = function (props) {
      this.validations = [];
      this.propertyValidations = [];
      if (props) {
        var rules, propertyValidation, options;
        for (var prop in props) {
          propertyValidation = this.validateOf(prop);
          rules = props[prop];
          for (var rule in rules) {
            options = rules[rule];
            propertyValidation.rule(rule, options);
          }
        }
      }
    }

    V.prototype = {

      validate: function (name, options) {
        var validation = new Validation(name, options);
        this.validations.push(validation);
        return validation;
      },

      validateOf: function (props) {
        var propertyValidation = new PropertyValidation(props);
        this.propertyValidations.push(propertyValidation);
        return propertyValidation;
      },

      run: function (obj) {
        var errors = []
          , th = this
          , validations = th.validations
          , propertyValidation;

        for (var key in this.propertyValidations) {
          propertyValidation = this.propertyValidations[key];
          for (var k in propertyValidation.validations) {
            validations.push(propertyValidation.validations[k]);
          }
        }

        return Promise.map(validations, function (validation) {
          return validation.run(obj)
            .catch (function (error) {
              errors.push(error);
            });
        }).then(function (){
          var errs = [];
          if (errors.length) {
            var error;
            for (key in errors) {
              error = errors[key];
              if (error instanceof Array) {
                errs = errs.concat(error);
              } else {
                errs.push(error);
              }
            }
            throw errs;
          }
          return th;
        });
      }

    }

    V.setLocale = function (locale) {
      _LOCALE_ = locale;
    }

    return V;

  }

  if (typeof define === 'function' && define.amd) {
    define(['lodash', 'bluebird'], __);
  } else if (typeof exports == 'object') {
    module.exports = __(require('lodash'), require('bluebird'));
  } else {
    root.V = __(root._, root.Promise);
  }

})(this);
