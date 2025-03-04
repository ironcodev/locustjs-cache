'use strict';

var exception = require('@locustjs/exception');
var base = require('@locustjs/base');
var compare = require('@locustjs/compare');

function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: true,
      configurable: true
    }
  }), Object.defineProperty(t, "prototype", {
    writable: false
  }), e && _setPrototypeOf(t, e);
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function () {
    return !!t;
  })();
}
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == typeof e || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (String )(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

var CacheBase = /*#__PURE__*/function () {
  function CacheBase(config) {
    _classCallCheck(this, CacheBase);
    exception.throwIfInstantiateAbstract(CacheBase, this);
    this.config = Object.assign({}, config);
  }
  return _createClass(CacheBase, [{
    key: "name",
    get: function get() {
      return this.constructor.name;
    }
  }, {
    key: "getEntry",
    value: function getEntry(key) {
      exception.throwNotImplementedException("".concat(this.name, ".getEntry"));
    }
  }, {
    key: "getItem",
    value: function getItem(key, fnCondition) {
      exception.throwNotImplementedException("".concat(this.name, ".getItem"));
    }
  }, {
    key: "setItem",
    value: function setItem(key, value, duration) {
      exception.throwNotImplementedException("".concat(this.name, ".setItem"));
    }
  }, {
    key: "addOrUpdate",
    value: function addOrUpdate(key, value, fnUpdate, duration) {
      exception.throwNotImplementedException("".concat(this.name, ".addOrUpdate"));
    }
  }, {
    key: "getOrSet",
    value: function getOrSet(key, value, fnCondition, duration) {
      exception.throwNotImplementedException("".concat(this.name, ".getOrSet"));
    }
  }, {
    key: "exists",
    value: function exists(key) {
      exception.throwNotImplementedException("".concat(this.name, ".exists"));
    }
  }, {
    key: "remove",
    value: function remove(key) {
      exception.throwNotImplementedException("".concat(this.name, ".remove"));
    }
  }, {
    key: "contains",
    value: function contains(value, fnEqualityComparer) {
      exception.throwNotImplementedException("".concat(this.name, ".contains"));
    }
  }, {
    key: "clean",
    value: function clean() {
      exception.throwNotImplementedException("".concat(this.name, ".clean"));
    }
  }, {
    key: "clear",
    value: function clear() {
      exception.throwNotImplementedException("".concat(this.name, ".clear"));
    }
  }, {
    key: "getDuration",
    value: function getDuration(duration) {
      var result = 0;
      if (base.isNumeric(duration)) {
        result = parseInt(duration);
      } else {
        if (this.config && base.isNumeric(this.config.duration)) {
          result = parseInt(this.config.duration);
        }
      }
      if (isNaN(result) || base.isEmpty(result)) {
        result = 0;
      }
      return result;
    }
  }, {
    key: "length",
    get: function get() {
      return 0;
    }
  }]);
}();

var CacheItem = /*#__PURE__*/function () {
  function CacheItem(key, value, duration) {
    _classCallCheck(this, CacheItem);
    this.key = key;
    this.setValue(value, duration);
  }
  return _createClass(CacheItem, [{
    key: "isValid",
    value: function isValid() {
      var elapsed = new Date() - this.createdDate;
      return elapsed >= 0 && elapsed < this.duration;
    }
  }, {
    key: "setValue",
    value: function setValue(value, duration) {
      this.value = value;
      this.createdDate = new Date();
      this.hits = 0;
      this.duration = base.isNumeric(duration) ? parseInt(duration) : this.duration;
      if (isNaN(this.duration) || base.isEmpty(this.duration)) {
        this.duration = 0;
      }
    }
  }, {
    key: "hit",
    value: function hit() {
      this.hits++;
      this.lastHit = new Date();
    }
  }, {
    key: "invalid",
    value: function invalid() {
      this.createdDate.setFullYear(this.createdDate.getFullYear() + 100);
    }
  }]);
}();

var CacheDefault = /*#__PURE__*/function (_CacheBase) {
  function CacheDefault(config) {
    var _this;
    _classCallCheck(this, CacheDefault);
    _this = _callSuper(this, CacheDefault, [config]);
    _this._data = [];
    return _this;
  }
  _inherits(CacheDefault, _CacheBase);
  return _createClass(CacheDefault, [{
    key: "length",
    get: function get() {
      return this._data.length;
    }
  }, {
    key: "getEntry",
    value: function getEntry(key) {
      return this._data.find(function (x) {
        return x.key === key;
      });
    }
  }, {
    key: "getItem",
    value: function getItem(key, fnCondition) {
      var result;
      var entry = this.getEntry(key);
      if (entry != null && entry.isValid()) {
        if (base.isFunction(fnCondition)) {
          var ok = fnCondition(this, entry.value);
          if (ok && base.isFunction(ok.then)) {
            result = new Promise(function (resolve, reject) {
              ok.then(function (r) {
                if (r) {
                  entry.hit();
                  resolve(entry.value);
                } else {
                  entry.invalid();
                  resolve(undefined);
                }
              })["catch"](function (x) {
                return reject(x);
              });
            });
          } else {
            if (ok) {
              entry.hit();
              result = entry.value;
            } else {
              entry.invalid();
            }
          }
        } else {
          entry.hit();
          result = entry.value;
        }
      }
      return result;
    }
  }, {
    key: "_add",
    value: function _add(key, value, duration) {
      this._data.push(new CacheItem(key, value, duration));
    }
  }, {
    key: "setItem",
    value: function setItem(key, value, duration) {
      var _this2 = this;
      var result;
      var entry = this.getEntry(key);
      if (entry == null) {
        var _duration = this.getDuration(duration);
        if (base.isFunction(value)) {
          var _value = value(this, key, duration);
          if (_value && base.isFunction(_value.then)) {
            result = new Promise(function (resolve, reject) {
              _value.then(function (r) {
                _this2._add(key, r, _duration);
                resolve(r);
              })["catch"](function (x) {
                return reject(x);
              });
            });
          } else {
            this._add(key, _value, _duration);
            result = _value;
          }
        } else {
          this._add(key, value, _duration);
          result = value;
        }
      } else {
        if (base.isFunction(value)) {
          var _value2 = value(this, key, duration);
          if (_value2 && base.isFunction(_value2.then)) {
            result = new Promise(function (resolve, reject) {
              _value2.then(function (r) {
                entry.setValue(r);
                resolve(r);
              })["catch"](function (x) {
                return reject(x);
              });
            });
          } else {
            entry.setValue(_value2);
            result = _value2;
          }
        } else {
          entry.setValue(value);
          result = value;
        }
      }
      return result;
    }
  }, {
    key: "addOrUpdate",
    value: function addOrUpdate(key, value, fnUpdate, duration) {
      var _this3 = this;
      var entry = this.getEntry(key);
      var _value;
      var result;
      if (entry == null) {
        var _duration = this.getDuration(duration);
        if (base.isFunction(value)) {
          _value = value(this, key, duration);
          if (_value && base.isFunction(_value.then)) {
            result = new Promise(function (resolve, reject) {
              _value.then(function (r) {
                _this3._add(key, r, _duration);
                resolve(r);
              })["catch"](function (x) {
                return reject(x);
              });
            });
          } else {
            this._add(key, _value, _duration);
            result = _value;
          }
        } else {
          this._add(key, value, _duration);
          result = value;
        }
      } else {
        if (base.isFunction(fnUpdate)) {
          _value = fnUpdate(this, entry.value, value);
          if (_value && base.isFunction(_value.then)) {
            result = new Promise(function (resolve, reject) {
              _value.then(function (r) {
                entry.setValue(r);
                resolve(r);
              })["catch"](function (x) {
                return reject(x);
              });
            });
          } else {
            entry.setValue(_value);
            result = _value;
          }
        } else {
          if (base.isFunction(value)) {
            _value = value(this, key, duration);
            if (_value && base.isFunction(_value.then)) {
              result = new Promise(function (resolve, reject) {
                _value.then(function (r) {
                  entry.setValue(r);
                  resolve(r);
                })["catch"](function (x) {
                  return reject(x);
                });
              });
            } else {
              entry.setValue(_value);
              result = _value;
            }
          } else {
            entry.setValue(value);
            result = value;
          }
        }
      }
      return result;
    }
  }, {
    key: "exists",
    value: function exists(key) {
      var entry = this.getEntry(key);
      return entry && entry.isValid() || false;
    }
  }, {
    key: "remove",
    value: function remove(key) {
      var result = false;
      var entry = this.getEntry(key);
      if (entry != null) {
        entry.invalid();
        result = true;
      }
      return result;
    }
  }, {
    key: "contains",
    value: function contains(value, fnEqualityComparer) {
      if (fnEqualityComparer instanceof compare.EqualityComparer) {
        return this._data.find(function (x) {
          return fnEqualityComparer.equals(x.value, value);
        }) != null;
      } else if (!base.isFunction(fnEqualityComparer)) {
        return this._data.find(function (x) {
          return x.value === value;
        }) != null;
      } else {
        return this._data.find(function (x) {
          return fnEqualityComparer(x.value, value);
        }) != null;
      }
    }
  }, {
    key: "clean",
    value: function clean() {
      this._data = this._data.filter(function (x) {
        return x.isValid();
      });
    }
  }, {
    key: "clear",
    value: function clear() {
      this._data = [];
    }
  }, {
    key: "getOrSet",
    value: function getOrSet(key, fnCondition, value, duration) {
      var result;
      if (this.exists(key)) {
        result = this.getItem(key, fnCondition);
        if (!this.exists(key)) {
          result = this.setItem(key, value, duration);
        }
      } else {
        result = this.setItem(key, value, duration);
      }
      return result;
    }
  }]);
}(CacheBase);

var CacheNull = /*#__PURE__*/function (_CacheBase) {
  function CacheNull() {
    _classCallCheck(this, CacheNull);
    return _callSuper(this, CacheNull, arguments);
  }
  _inherits(CacheNull, _CacheBase);
  return _createClass(CacheNull, [{
    key: "getEntry",
    value: function getEntry(key) {
      return undefined;
    }
  }, {
    key: "getItem",
    value: function getItem(key, fnCondition) {
      return undefined;
    }
  }, {
    key: "setItem",
    value: function setItem(key, value, duration) {
      if (base.isFunction(value)) {
        return value();
      } else {
        return value;
      }
    }
  }, {
    key: "addOrUpdate",
    value: function addOrUpdate(key, value, fnUpdate, duration) {
      if (base.isFunction(value)) {
        return value();
      } else {
        return value;
      }
    }
  }, {
    key: "exists",
    value: function exists(key) {
      return false;
    }
  }, {
    key: "remove",
    value: function remove(key) {
      return false;
    }
  }, {
    key: "contains",
    value: function contains(value) {
      return false;
    }
  }, {
    key: "clean",
    value: function clean() {}
  }, {
    key: "clear",
    value: function clear() {}
  }, {
    key: "getOrSet",
    value: function getOrSet(key, fnCondition, value, duration) {
      if (base.isFunction(value)) {
        return value();
      } else {
        return value;
      }
    }
  }]);
}(CacheBase);

exports.CacheBase = CacheBase;
exports.CacheDefault = CacheDefault;
exports.CacheItem = CacheItem;
exports.CacheNull = CacheNull;
