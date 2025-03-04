import { isFunction } from "@locustjs/base";
import CacheBase from "./CacheBase";
import CacheItem from "./CacheItem";
import { EqualityComparer } from "@locustjs/compare";
class CacheDefault extends CacheBase {
  constructor(config) {
    super(config);

    this._data = [];
  }
  get length() {
    return this._data.length;
  }
  getEntry(key) {
    return this._data.find((x) => x.key === key);
  }
  getItem(key, fnCondition) {
    let result;
    const entry = this.getEntry(key);

    if (entry != null && entry.isValid()) {
      if (isFunction(fnCondition)) {
        const ok = fnCondition(this, entry.value);

        if (ok && isFunction(ok.then)) {
          result = new Promise((resolve, reject) => {
            ok.then((r) => {
              if (r) {
                entry.hit();

                resolve(entry.value);
              } else {
                entry.invalid();

                resolve(undefined);
              }
            }).catch((x) => reject(x));
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
  _add(key, value, duration) {
    this._data.push(new CacheItem(key, value, duration));
  }
  setItem(key, value, duration) {
    let result;

    const entry = this.getEntry(key);

    if (entry == null) {
      const _duration = this.getDuration(duration);

      if (isFunction(value)) {
        const _value = value(this, key, duration);

        if (_value && isFunction(_value.then)) {
          result = new Promise((resolve, reject) => {
            _value
              .then((r) => {
                this._add(key, r, _duration);

                resolve(r);
              })
              .catch((x) => reject(x));
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
      if (isFunction(value)) {
        const _value = value(this, key, duration);

        if (_value && isFunction(_value.then)) {
          result = new Promise((resolve, reject) => {
            _value
              .then((r) => {
                entry.setValue(r);

                resolve(r);
              })
              .catch((x) => reject(x));
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

    return result;
  }
  addOrUpdate(key, value, fnUpdate, duration) {
    const entry = this.getEntry(key);
    let _value;
    let result;

    if (entry == null) {
      const _duration = this.getDuration(duration);

      if (isFunction(value)) {
        _value = value(this, key, duration);

        if (_value && isFunction(_value.then)) {
          result = new Promise((resolve, reject) => {
            _value
              .then((r) => {
                this._add(key, r, _duration);

                resolve(r);
              })
              .catch((x) => reject(x));
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
      if (isFunction(fnUpdate)) {
        _value = fnUpdate(this, entry.value, value);

        if (_value && isFunction(_value.then)) {
          result = new Promise((resolve, reject) => {
            _value
              .then((r) => {
                entry.setValue(r);

                resolve(r);
              })
              .catch((x) => reject(x));
          });
        } else {
          entry.setValue(_value);

          result = _value;
        }
      } else {
        if (isFunction(value)) {
          _value = value(this, key, duration);

          if (_value && isFunction(_value.then)) {
            result = new Promise((resolve, reject) => {
              _value
                .then((r) => {
                  entry.setValue(r);

                  resolve(r);
                })
                .catch((x) => reject(x));
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
  exists(key) {
    const entry = this.getEntry(key);

    return (entry && entry.isValid()) || false;
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
    if (fnEqualityComparer instanceof EqualityComparer) {
      return (
        this._data.find((x) => fnEqualityComparer.equals(x.value, value)) !=
        null
      );
    } else if (!isFunction(fnEqualityComparer)) {
      return this._data.find((x) => x.value === value) != null;
    } else {
      return this._data.find((x) => fnEqualityComparer(x.value, value)) != null;
    }
  }
  clean() {
    this._data = this._data.filter((x) => x.isValid());
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
}

export default CacheDefault;
