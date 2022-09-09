"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CacheNull = exports.CacheItem = exports.CacheDefault = exports.CacheBase = void 0;

var _locustjsException = require("locustjs-exception");

var _locustjsBase = require("locustjs-base");

class CacheItem {
  constructor(key, value, duration) {
    this.key = key;
    this.setValue(value, duration);
  }

  isValid() {
    const elapsed = new Date() - this.createdDate;
    return elapsed >= 0 && elapsed < this.duration;
  }

  setValue(value, duration) {
    this.value = value;
    this.createdDate = new Date();
    this.hits = 0;
    this.duration = (0, _locustjsBase.isNumeric)(duration) ? parseInt(duration) : this.duration;

    if (isNaN(this.duration) || (0, _locustjsBase.isEmpty)(this.duration)) {
      this.duration = 0;
    }
  }

  hit() {
    this.hits++;
    this.lastHit = new Date();
  }

  invalid() {
    this.createdDate.setFullYear(this.createdDate.getFullYear() + 100);
  }

}

exports.CacheItem = CacheItem;

class CacheBase {
  constructor(config) {
    (0, _locustjsException.throwIfInstantiateAbstract)(CacheBase, this);
    this.config = Object.assign({}, config);
  }

  getEntry(key) {
    (0, _locustjsException.throwNotImplementedException)('CacheBase.getEntry');
  }

  getItem(key, fnCondition) {
    (0, _locustjsException.throwNotImplementedException)('CacheBase.getItem');
  }

  getItemAsync(key, fnCondition) {
    (0, _locustjsException.throwNotImplementedException)('CacheBase.getItemAsync');
  }

  setItem(key, value, duration) {
    (0, _locustjsException.throwNotImplementedException)('CacheBase.setItem');
  }

  setItemAsync(key, value, duration) {
    (0, _locustjsException.throwNotImplementedException)('CacheBase.setItemAsync');
  }

  addOrUpdate(key, value, fnUpdate, duration) {
    (0, _locustjsException.throwNotImplementedException)('CacheBase.addOrUpdate');
  }

  addOrUpdateAsync(key, value, fnUpdate, duration) {
    (0, _locustjsException.throwNotImplementedException)('CacheBase.addOrUpdateAsync');
  }

  getOrSet(key, value, fnCondition, duration) {
    (0, _locustjsException.throwNotImplementedException)('CacheBase.getOrSet');
  }

  getOrSetAsync(key, value, fnCondition, duration) {
    (0, _locustjsException.throwNotImplementedException)('CacheBase.getOrSetAsync');
  }

  exists(key) {
    (0, _locustjsException.throwNotImplementedException)('CacheBase.exists');
  }

  remove(key) {
    (0, _locustjsException.throwNotImplementedException)('CacheBase.remove');
  }

  contains(value, fnEqualityComparer) {
    (0, _locustjsException.throwNotImplementedException)('CacheBase.contains');
  }

  clean() {
    (0, _locustjsException.throwNotImplementedException)('CacheBase.clean');
  }

  clear() {
    (0, _locustjsException.throwNotImplementedException)('CacheBase.clear');
  }

  getDuration(duration) {
    let result = 0;

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

  get length() {
    return 0;
  }

}

exports.CacheBase = CacheBase;

class CacheDefault extends CacheBase {
  constructor(config) {
    super(config);
    this._data = [];
  }

  get length() {
    return this._data.length;
  }

  getEntry(key) {
    return this._data.find(x => x.key === key);
  }

  getItem(key, fnCondition) {
    let result;
    const entry = this.getEntry(key);

    if (entry != null && entry.isValid()) {
      let ok = true;

      if ((0, _locustjsBase.isFunction)(fnCondition)) {
        ok = fnCondition(this, entry.value);

        if (!ok) {
          entry.invalid();
        }
      }

      if (ok) {
        entry.hit();
        result = entry.value;
      }
    }

    return result;
  }

  getItemAsync(key, fnCondition) {
    let result;
    let value;
    const entry = this.getEntry(key);

    if (entry != null && entry.isValid()) {
      if ((0, _locustjsBase.isFunction)(fnCondition)) {
        const isOk = fnCondition(this, entry.value);

        if (isOk && (0, _locustjsBase.isFunction)(isOk.then)) {
          result = new Promise((resolve, reject) => {
            isOk.then(r => {
              if (r) {
                entry.hit();
                resolve(entry.value);
              } else {
                entry.invalid();
                resolve(undefined);
              }
            }).catch(x => reject(x));
          });
        } else {
          if (isOk) {
            entry.hit();
            value = entry.value;
          } else {
            entry.invalid();
          }
        }
      } else {
        entry.hit();
        value = entry.value;
      }
    }

    if (!result) {
      result = new Promise(res => res(value));
    }

    return result;
  }

  _add(key, value, duration) {
    this._data.push(new CacheItem(key, value, duration));
  }

  setItem(key, value, duration) {
    let result;
    const entry = this.getEntry(key);

    if (entry == null) {
      const _duration = this.getDuration(duration);

      if ((0, _locustjsBase.isFunction)(value)) {
        result = value(this, key, duration);
      } else {
        result = value;
      }

      this._add(key, result, _duration);
    } else {
      if ((0, _locustjsBase.isFunction)(value)) {
        result = value(this, key, duration);
      } else {
        result = value;
      }

      entry.setValue(result);
    }

    return result;
  }

  setItemAsync(key, value, duration) {
    let result;
    const entry = this.getEntry(key);

    if (entry == null) {
      const _duration = this.getDuration(duration);

      if ((0, _locustjsBase.isFunction)(value)) {
        const _value = value(this, key, duration);

        if (_value && (0, _locustjsBase.isFunction)(_value.then)) {
          result = new Promise((resolve, reject) => {
            _value.then(r => {
              this._add(key, r, _duration);

              resolve(r);
            }).catch(x => reject(x));
          });
        } else {
          this._add(key, _value, _duration);

          result = Promise.resolve(_value);
        }
      } else {
        this._add(key, value, _duration);

        result = Promise.resolve(value);
      }
    } else {
      if ((0, _locustjsBase.isFunction)(value)) {
        const _value = value(this, key, duration);

        if (_value && (0, _locustjsBase.isFunction)(_value.then)) {
          result = new Promise((resolve, reject) => {
            _value.then(r => {
              entry.setValue(r);
              resolve(r);
            }).catch(x => reject(x));
          });
        } else {
          entry.setValue(_value);
          result = Promise.resolve(_value);
        }
      } else {
        entry.setValue(value);
        result = Promise.resolve(value);
      }
    }

    return result;
  }

  addOrUpdate(key, value, fnUpdate, duration) {
    const entry = this.getEntry(key);
    let result;

    if (entry == null) {
      const _duration = this.getDuration(duration);

      if ((0, _locustjsBase.isFunction)(value)) {
        result = value(this, key, duration);
      } else {
        result = value;
      }

      this._add(key, result, _duration);
    } else {
      if ((0, _locustjsBase.isFunction)(fnUpdate)) {
        result = fnUpdate(this, entry.value, value);
      } else {
        if ((0, _locustjsBase.isFunction)(value)) {
          result = value(this, key, duration);
        } else {
          result = value;
        }
      }

      entry.setValue(result);
    }

    return result;
  }

  addOrUpdateAsync(key, value, fnUpdate, duration) {
    const entry = this.getEntry(key);

    let _value;

    let result;

    if (entry == null) {
      const _duration = this.getDuration(duration);

      if ((0, _locustjsBase.isFunction)(value)) {
        _value = value(this, key, duration);

        if (_value && (0, _locustjsBase.isFunction)(_value.then)) {
          result = new Promise((resolve, reject) => {
            _value.then(r => {
              this._add(key, r, _duration);

              resolve(r);
            }).catch(x => reject(x));
          });
        } else {
          this._add(key, _value, _duration);

          result = Promise.resolve(_value);
        }
      } else {
        this._add(key, value, _duration);

        result = Promise.resolve(value);
      }
    } else {
      if ((0, _locustjsBase.isFunction)(fnUpdate)) {
        _value = fnUpdate(this, entry.value, value);

        if (_value && (0, _locustjsBase.isFunction)(_value.then)) {
          result = new Promise((resolve, reject) => {
            _value.then(r => {
              entry.setValue(r);
              resolve(r);
            }).catch(x => reject(x));
          });
        } else {
          entry.setValue(_value);
          result = Promise.resolve(_value);
        }
      } else {
        if ((0, _locustjsBase.isFunction)(value)) {
          _value = value(this, key, duration);

          if (_value && (0, _locustjsBase.isFunction)(_value.then)) {
            result = new Promise((resolve, reject) => {
              _value.then(r => {
                entry.setValue(r);
                resolve(r);
              }).catch(x => reject(x));
            });
          } else {
            entry.setValue(_value);
            result = Promise.resolve(_value);
          }
        } else {
          entry.setValue(value);
          result = Promise.resolve(value);
        }
      }
    }

    return result;
  }

  exists(key) {
    const entry = this.getEntry(key);
    return entry && entry.isValid() || false;
  }

  remove(key) {
    let result = false;
    const entry = this.getEntry(key);

    if (entry != null) {
      entry.invalid();
      result = true;
    }

    return result;
  }

  contains(value, fnEqualityComparer) {
    if (!(0, _locustjsBase.isFunction)(fnEqualityComparer)) {
      return this._data.find(x => x.value === value) != null;
    } else {
      return this._data.find(x => fnEqualityComparer(x.value, value)) != null;
    }
  }

  clean() {
    this._data = this._data.filter(x => x.isValid());
  }

  clear() {
    this._data = [];
  }

  getOrSet(key, fnCondition, value, duration) {
    let result;

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

  async getOrSetAsync(key, fnCondition, value, duration) {
    let result;

    if (this.exists(key)) {
      result = await this.getItemAsync(key, fnCondition);

      if (!this.exists(key)) {
        result = await this.setItemAsync(key, value, duration);
      }
    } else {
      result = await this.setItemAsync(key, value, duration);
    }

    return result;
  }

}

exports.CacheDefault = CacheDefault;

class CacheNull extends CacheBase {
  getEntry(key) {
    return undefined;
  }

  getItem(key, fnCondition) {
    return undefined;
  }

  getItemAsync(key, fnCondition) {
    return Promise.resolve(undefined);
  }

  setItem(key, value, duration) {
    if ((0, _locustjsBase.isFunction)(value)) {
      return value();
    } else {
      return value;
    }
  }

  setItemAsync(key, value, duration) {
    if ((0, _locustjsBase.isFunction)(value)) {
      return Promise.resolve(value());
    } else {
      return Promise.resolve(value);
    }
  }

  addOrUpdate(key, value, fnUpdate, duration) {
    if ((0, _locustjsBase.isFunction)(value)) {
      return value();
    } else {
      return value;
    }
  }

  addOrUpdateAsync(key, value, fnUpdate, duration) {
    if ((0, _locustjsBase.isFunction)(value)) {
      return Promise.resolve(value());
    } else {
      return Promise.resolve(value);
    }
  }

  exists(key) {
    return false;
  }

  remove(key) {
    return false;
  }

  contains(value) {
    return false;
  }

  clean() {}

  clear() {}

  getOrSet(key, fnCondition, value, duration) {
    if ((0, _locustjsBase.isFunction)(value)) {
      return value();
    } else {
      return value;
    }
  }

  getOrSetAsync(key, fnCondition, value, duration) {
    if ((0, _locustjsBase.isFunction)(value)) {
      return Promise.resolve(value());
    } else {
      return Promise.resolve(value);
    }
  }

}

exports.CacheNull = CacheNull;