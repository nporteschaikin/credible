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

      length: function (obj, prop, o, num) {
        var m = function () {
          switch (o) {
            case '>':
              return 'lengthGreaterThan';
            case '<':
              return 'lengthLessThan';
            case '>=':
              return 'lengthGreaterThanOrEqualTo';
            case '<=':
              return 'lengthLessThanOrEqualTo';
            case '=':
              return 'lengthEqualTo';
          }
        }();
        if (!_COMPARE(obp[prop], o, num)) throw __MESSAGE__(m, {property: prop, num: num})
      },

      match: function (obj, prop, type) {
        if (!_TYPES_[type].test(obj[prop]))
          throw _MESSAGE_(type, {property: prop});
      },

      presence: function (obj, prop) {
        if (!obj[prop]) throw _MESSAGE_('presence', {property: prop});
      },

      operator: function (obj, lh, o, rh) {
        var lhv = obj[lh]
          , rhv = 'string' === typeof rh ? obj[rh] : rh
          , m;
        m = function () {
          switch (o) {
            case '>':
              return 'greaterThan';
            case '<':
              return 'lessThan';
            case '>=':
              return 'greaterThanOrEqualTo';
            case '<=':
              return 'lessThanOrEqualTo';
            case '=':
              return 'equalTo';
          }
        }()
        if (!_COMPARE_(lhv, o, rhv)) throw _MESSAGE_(m, {lh: lh, rh: 'string' === typeof rh ? rh : rhv});
      }

    },

    _MESSAGES_ = {
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
      }
      url: {
        en: '{{property}} must be a valid URL'
      },
      presence: {
        en: '{{property}} is required'
      }
    },

    Validation = function (name, args) {
      if ('function' === typeof name) {
        validator = props;
      } else {
        validator = _VALIDATOR_(name);
      }

      this._validator = validator;
      this._args = args;
      this._ifAll = {};
      this._unlessAll = {};
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
            this.prop(prop, {if: fn});
          }
        } else {
          this._catchAll = arguments[0];
        }
        return this;
      },

      of: function (props, args) {
        return this.prop(props, args);
      },

      prop: function (props, args) {
        args = args || {};
        if ('string' === typeof props) props = [props]

        var name, prop;
        for (var key in props) {
          name = props[key];

          if (!this._props) this._props = {};
          if (!(prop = this._props[name])) prop = {};

          if (args.if) {
            if (!prop.if) prop = [];
            prop.if.push(args.if);
          }
          if (args.unless) {
            if (!prop.unless) unless = [];
            prop.unless.push(args.unless);
          }
          if (args.catch) {
            prop.catch = args.catch;
          }
          this._props[name] = prop;
        }

        return this;
      },

      run: function (obj) {
        var th = this
          , errors = []
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
            prop = th._props[name], args = th._args || [];
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
              args.unshift(obj, name);
              return Promise.method(th._validator).apply(null, args)
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
          args = th._args || []
          args.unshift(obj);
          promise = Promise.method(th._validator).apply(null, args)
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

    function _VALIDATOR_ (name) {
      return _VALIDATORS_[name];
    }

    function _MESSAGE_ (name, options) {
      var message = _MESSAGES_[name][_LOCALE_]
      return message.replace(/\{\{([a-zA-Z]+)\}\}/g, function (match, key) {
        return options[key];
      });
    }

    function _COMPARE_ (lh, o, rh) {
      switch (o) {
        case '>':
          return lh > rh;
        case '<':
          return lh < rh;
        case '>=':
          return lh >= rh;
        case '<=':
          return lh <= rh;
        case '='
          return lh == rh;
      }
    }

    var V = function (rules) {
      this.validations = [];
      if (rules) {
        var rule;
        for (var prop in rules) {
          rule = rules[prop];
          this.validateOf(prop, rule);
        }
      }
    }

    V.prototype = {

      validate: function (name) {
        var args = Array.prototype.splice.call(arguments, 1)
          , validation = new Validation(name, args);
        this.validations.push(validation);
        return validation;
      },

      validateOf: function (props, name) {
        return this.validate.apply(this, Array.prototype.splice.call(arguments, 1)).of(props);
      },

      run: function (obj) {
        var errors = [], th = this;
        return Promise.map(this.validations, function (validation) {
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
