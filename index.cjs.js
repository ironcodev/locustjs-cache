"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CacheNull = exports.CacheDefault = exports.CacheBase = exports.CacheItem = void 0;

var _locustjsException = require("locustjs-exception");

var _locustjsBase = require("locustjs-base");

function _readOnlyError(name) { throw new TypeError("\"" + name + "\" is read-only"); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CacheItem = /*#__PURE__*/function () {
  function CacheItem(key, value, duration) {
    _classCallCheck(this, CacheItem);

    this.key = key;
    this.setValue(value, duration);
  }

  _createClass(CacheItem, [{
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
      this.duration = (0, _locustjsBase.isNumeric)(duration) ? parseInt(duration) : this.duration;

      if (isNaN(this.duration) || (0, _locustjsBase.isEmpty)(this.duration)) {
        this.duration = 0;
      }
    }
  }, {
    key: "hit",
    value: function hit() {
      this.hits++;
    }
  }, {
    key: "invalid",
    value: function invalid() {
      this.createdDate.setFullYear(this.createdDate.getFullYear() + 100);
    }
  }]);

  return CacheItem;
}();

exports.CacheItem = CacheItem;

var CacheBase = /*#__PURE__*/function () {
  function CacheBase(config) {
    _classCallCheck(this, CacheBase);

    (0, _locustjsException.throwIfInstantiateAbstract)(CacheBase, this);
    this.config = Object.assign({}, config);
  }

  _createClass(CacheBase, [{
    key: "getEntry",
    value: function getEntry(key) {
      (0, _locustjsException.throwNotImplementedException)('CacheBase.getEntry');
    }
  }, {
    key: "getItem",
    value: function getItem(key, fnCondition) {
      (0, _locustjsException.throwNotImplementedException)('CacheBase.getItem');
    }
  }, {
    key: "setItem",
    value: function setItem(key, value, duration) {
      (0, _locustjsException.throwNotImplementedException)('CacheBase.setItem');
    }
  }, {
    key: "addOrUpdate",
    value: function addOrUpdate(key, fnUpdate, value, duration) {
      (0, _locustjsException.throwNotImplementedException)('CacheBase.addOrUpdate');
    }
  }, {
    key: "getOrSet",
    value: function getOrSet(key, value, duration) {
      (0, _locustjsException.throwNotImplementedException)('CacheBase.getOrSet');
    }
  }, {
    key: "exists",
    value: function exists(key) {
      (0, _locustjsException.throwNotImplementedException)('CacheBase.exists');
    }
  }, {
    key: "remove",
    value: function remove(key) {
      (0, _locustjsException.throwNotImplementedException)('CacheBase.remove');
    }
  }, {
    key: "contains",
    value: function contains(value, equalityComparer) {
      (0, _locustjsException.throwNotImplementedException)('CacheBase.contains');
    }
  }, {
    key: "clean",
    value: function clean() {
      (0, _locustjsException.throwNotImplementedException)('CacheBase.clean');
    }
  }, {
    key: "clear",
    value: function clear() {
      (0, _locustjsException.throwNotImplementedException)('CacheBase.clear');
    }
  }, {
    key: "getDuration",
    value: function getDuration(duration) {
      var result = 0;

      if ((0, _locustjsBase.isNumeric)(duration)) {
        result = parseInt(duration);
      } else {
        if (this.config && (0, _locustjsBase.isNumeric)(this.config.duration)) {
          result = parseInt(this.config.duration);
        }
      }

      if (isNaN(result) || (0, _locustjsBase.isEmpty)(result)) {
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

  return CacheBase;
}();

exports.CacheBase = CacheBase;

var CacheDefault = /*#__PURE__*/function (_CacheBase) {
  _inherits(CacheDefault, _CacheBase);

  var _super = _createSuper(CacheDefault);

  function CacheDefault(config) {
    var _this2;

    _classCallCheck(this, CacheDefault);

    _this2 = _super.call(this, config);
    _this2._data = [];
    return _this2;
  }

  _createClass(CacheDefault, [{
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
        var ok = true;

        if ((0, _locustjsBase.isFunction)(fnCondition)) {
          var _result = fnCondition(this, entry);

          if (_result && (0, _locustjsBase.isFunction)(_result.then)) {
            result = new Promise(function (resolve, reject) {
              _result.then(function (r) {
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
            ok = (_readOnlyError("ok"), false);
          } else {
            ok = (_readOnlyError("ok"), _result);

            if (!ok) {
              entry.invalid();
            }
          }
        }

        if (ok) {
          entry.hit();
          result = entry.value;
        }
      }

      return result;
    }
  }, {
    key: "setItem",
    value: function setItem(key, value, duration) {
      var entry = this.getEntry(key);

      if (entry == null) {
        var _duration = this.getDuration(duration);

        this._data.push(new CacheItem(key, value, _duration));
      } else {
        entry.setValue(value);
      }

      return value;
    }
  }, {
    key: "addOrUpdate",
    value: function addOrUpdate(key, fnUpdate, value, duration) {
      var entry = this.getEntry(key);
      var result;

      if (entry == null) {
        var _duration = this.getDuration(duration);

        this._data.push(new CacheItem(key, value, _duration));

        result = value;
      } else {
        var newValue = (0, _locustjsBase.isFunction)(fnUpdate) ? fnUpdate(entry.value) : value;
        entry.setValue(newValue);
        result = newValue;
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
    value: function contains(value, equalityComparer) {
      if (!(0, _locustjsBase.isFunction)(equalityComparer)) {
        return this._data.find(function (x) {
          return x.value === value;
        }) != null;
      } else {
        return this._data.find(function (x) {
          return equalityComparer(x.value, value);
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
    key: "_setValue",
    value: function _setValue(key, value, duration, entry) {
      var result;

      var _duration = this.getDuration(entry ? entry.duration : duration);

      if ((0, _locustjsBase.isFunction)(value)) {
        var _result = value(this, entry);

        if (_result && (0, _locustjsBase.isFunction)(_result.then)) {
          var _this = this;

          result = new Promise(function (resolve, reject) {
            _result.then(function (r) {
              if (entry) {
                entry.setValue(r, _duration);
              } else {
                _this.setItem(key, r, _duration);
              }

              resolve(r);
            })["catch"](function (x) {
              return reject(x);
            });
          });
        } else {
          if (entry) {
            entry.setValue(_result, _duration);
          } else {
            this.setItem(key, _result, _duration);
          }

          result = _result;
        }
      } else {
        if (entry) {
          entry.setValue(value, _duration);
        } else {
          this.setItem(key, value, _duration);
        }

        result = value;
      }

      return result;
    }
  }, {
    key: "getOrSet",
    value: function getOrSet(key, value, fnCondition, duration) {
      var result;

      var _fnCondition = arguments.length > 2 ? fnCondition : undefined;

      var _duration = arguments.length > 3 ? duration : fnCondition;

      var entry = this.getEntry(key);

      if (entry != null) {
        var setValue = false;

        if (entry.isValid()) {
          var ok = true;

          if ((0, _locustjsBase.isFunction)(_fnCondition)) {
            var _result = _fnCondition(this, entry);

            if (_result && (0, _locustjsBase.isFunction)(_result.then)) {
              var _this = this;

              result = new Promise(function (resolve, reject) {
                _result.then(function (r) {
                  if (r) {
                    entry.hit();
                    resolve(entry.value);
                  } else {
                    entry.invalid();

                    var finalResult = _this._setValue(key, value, _duration, entry);

                    resolve(finalResult);
                  }
                })["catch"](function (x) {
                  return reject(x);
                });
              });
              ok = false;
            } else {
              ok = _result;

              if (!ok) {
                entry.invalid();
                setValue = true;
              }
            }
          }

          if (ok) {
            entry.hit();
            result = entry.value;
          }
        } else {
          setValue = true;
        }

        if (setValue) {
          result = this._setValue(key, value, _duration, entry);
        }
      } else {
        result = this._setValue(key, value, _duration);
      }

      return result;
    }
  }]);

  return CacheDefault;
}(CacheBase);

exports.CacheDefault = CacheDefault;

var CacheNull = /*#__PURE__*/function (_CacheBase2) {
  _inherits(CacheNull, _CacheBase2);

  var _super2 = _createSuper(CacheNull);

  function CacheNull() {
    _classCallCheck(this, CacheNull);

    return _super2.apply(this, arguments);
  }

  _createClass(CacheNull, [{
    key: "getEntry",
    value: function getEntry(key) {
      return null;
    }
  }, {
    key: "getItem",
    value: function getItem(key, fnCondition) {
      return null;
    }
  }, {
    key: "setItem",
    value: function setItem(key, value, duration) {}
  }, {
    key: "addOrUpdate",
    value: function addOrUpdate(key, fnUpdate, value, duration) {
      return null;
    }
  }, {
    key: "exists",
    value: function exists(key) {
      return false;
    }
  }, {
    key: "remove",
    value: function remove(key) {
      return true;
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
    value: function getOrSet(key, value, fnCondition, duration) {
      var result;

      if ((0, _locustjsBase.isFunction)(value)) {
        var _result = value(this);

        if (_result && (0, _locustjsBase.isFunction)(_result.then)) {
          result = new Promise(function (resolve, reject) {
            _result.then(function (r) {
              resolve(r);
            })["catch"](function (x) {
              return reject(x);
            });
          });
        } else {
          result = _result;
        }
      } else {
        result = value;
      }

      return result;
    }
  }]);

  return CacheNull;
}(CacheBase);

exports.CacheNull = CacheNull;
