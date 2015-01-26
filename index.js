(function(root){

  function __(Promise) {

    ValidatorTypes = {
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

    Validators = {

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
        if (!b) throw new ValidatorMessage(m, {property: prop, num: n});
      },

      presence: function (obj, prop) {
        if (!obj[prop]) throw new ValidatorMessage('presence', {property: prop});
      },

      operator: function (obj, prop, options) {
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
        if (!b) throw new ValidatorMessage(m, {lh: lh, rh: 'string' === typeof rh ? rh : rhv});
      }

    },

    ValidationMatch = function (obj, prop, type) {
      if (!ValidatorTypes[type].test(obj[prop]))
        throw new ValidatorMessage(type, {property: prop});
    }

    for (var type in ValidatorTypes) {
      Validators[type] = (function (t) {
        return function (obj, prop) {
          ValidationMatch(obj, prop, t);
        }
      })(type);
    }

    var ValidatorMessages = {
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
      presence: {
        en: '{{property}} is required'
      },
      url: {
        en: '{{property}} must be a valid URL'
      }
    },

    Validation = function (validator, options) {
      if ('string' === typeof validator) {
        validator = Validators[validator];
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
          var props = arguments[0], fn = arguments[1], prop;
          if ('string' == typeof props) props = [props];
          for (var key in props) {
            prop = (this._props || {})[props[key]];
            if (prop) {
              if (!prop.if) prop.if = [];
              prop.if.push(fn);
              this._props[props[key]] = prop;
            }
          }
        } else {
          this._ifAll.push(arguments[0]);
        }
        return this;
      },

      unless: function () {
        if (arguments.length == 2) {
          var props = arguments[0], fn = arguments[1], prop;
          if ('string' == typeof props) props = [props];
          for (var key in props) {
            prop = (this._props || {})[props[key]];
            if (prop) {
              if (!prop.unless) prop.unless = [];
              prop.unless.push(fn);
              this._props[props[key]] = prop;
            }
          }
        } else {
          this._unlessAll.push(arguments[0]);
        }
        return this;
      },

      catch: function () {
        if (arguments.length == 2) {
          var props = arguments[0], fn = arguments[1], prop;
          if ('string' == typeof props) props = [props];
          for (var key in props) {
            prop = (this._props || {})[props[key]];
            if (prop) {
              prop.catch = fn;
              this._props[props[key]] = prop;
            }
          }
        } else {
          this._catchAll = arguments[0];
        }
        return this;
      },

      prop: function (props, options) {
        if ('string' === typeof props) props = [props];

        var name, prop;
        for (var key in props) {
          name = props[key];

          if (!this._props) this._props = {};
          if (!this._props[name]) this._props[name] = {};

          if ('object' === typeof options) {
            if (options.if) {
              this.if(name, options.if);
              delete options.if;
            }
            if (options.unless) {
              this.unless(name, options.unless);
              delete options.unless;
            }
            if (options.catch) {
              this.catch(name, options.catch);
              delete options.catch;
            }
          }

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
                .catch(function (name) {
                  return function (error){
                    if (prop.catch) {
                      try {
                        prop.catch(obj);
                      } catch (e) {
                        error = e;
                      }
                    } else if (th._catchAll) {
                      try {
                        th._catchAll(obj);
                      } catch (e) {
                        error = e;
                      }
                    }
                    errors.push(new ValidationError(error, name));
                  }
                }(name))
            }());
          }
          promise = Promise.all(promises);
        } else {
          promise = Promise.method(th._validator)(obj, th._options)
            .catch(function(error) {
              if (th._catchAll) {
                try {
                  th._catchAll(obj);
                } catch (e) {
                  error = e;
                }
              }
              errors.push(new ValidationError(error));
            })
        }
        return promise.then(function () {
          if (errors.length) throw errors;
          return th;
        });
      }

    }

    function ValidatorMessage (name, options) {
      this.name = name;
      this.options = options;
    }

    ValidatorMessage.prototype = {

      toString: function () {
        var th = this
          , message = ValidatorMessages[th.name][V.locale];
        return message.replace(/\{\{([a-zA-Z]+)\}\}/g, function (match, key) {
          return th.options[key];
        });
      }

    }

    var ValidationError = function (error, prop) {
      this.error = error;
      this.prop = prop;
    }

    ValidationError.prototype = {

      toString: function () {
        return this.error.toString();
      }

    }

    var ValidationErrors = function (errors, obj) {
      this.errors = errors;
      this.obj = obj;
    }

    ValidationErrors.prototype = {

      toString: function () {
        var strings = [], error;
        for (var key in this.errors) {
          error = this.errors[key];
          strings.push(error.toString());
        }
        return strings.join(', ');
      },

      toJSON: function () {
        var obj = {}, error, prop;
        for (var key in this.errors) {
          error = this.errors[key];
          if (prop = error.prop) {
            if (!obj[prop]) obj[prop] = [];
            obj[prop].push(error.toString());
          } else {
            if (!obj.base) obj.base = [];
            obj.base.push(error.toString());
          }
        }
        return obj;
      }

    }

    var V = function () {
      this.validations = [];
      this.propCatches = {};
      if (arguments[0]) this.rule.apply(this, arguments);
    }

    V.prototype = {

      rule: function () {
        var props, rule, options, validation;
        if (arguments.length > 1) {
          if ('function' === typeof arguments[0]) {
            rule = arguments[0];
            options = arguments[1];
          } else {
            props = arguments[0];
            if ('object' === typeof arguments[1]) {
              for (var name in arguments[1]) this.rule(props, name, arguments[1][name]);
              return this;
            } else {
              rule = arguments[1];
              options = arguments[2];
            }
          }
        } else {
          if ('object' === typeof arguments[0]) {
            for (var name in arguments[0]) this.rule(name, arguments[0][name]);
            return this;
          } else {
            rule = arguments[0];
          }
        }

        validation = new Validation(rule, options);
        if (props) validation.prop(props);
        this.validations.push(validation);

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
        var fn, props, prop;
        if (arguments.length == 2) {
          props = arguments[0];
          fn = arguments[1];
          if ('string' === typeof props) props = [props];
          for (var key in props) {
            prop = props[key];
            this.propCatches[prop] = fn;
          }
        } else {
          this._catch = fn;
        }
        return this;
      },

      run: function (obj) {
        var errors = []
          , th = this;

        return Promise.map(th.validations, function (validation) {
          return validation.run(obj)
            .catch (function (error) {
              if (error instanceof Array) {
                errors = errors.concat(error);
              } else {
                errors.push(error);
              }
            });
        }).then(function (){
          if (errors.length) {
            if (th._catch) {
              try {
                th._catch(name);
              } catch (e) {
                errors.push(e);
              }
            } else {
              for (var name in th.propCatches) {
                for (var key in errors) {
                  error = errors[key];
                  if (name == error.prop) errors.splice(key, 1);
                }
                try {
                  th.propCatches[name](obj);
                } catch (e) {
                  errors.push(e);
                }
              }

            }
            throw new ValidationErrors(errors, obj);
          }
          return th;
        });
      }

    }

    V.locale = 'en';

    return V;

  }

  if ('function' === typeof define && define.amd) {
    define(['bluebird'], __);
  } else if ('object' === typeof exports) {
    module.exports = __(require('bluebird'));
  } else {
    root.Credible = __(root.Promise);
  }

})(this);
