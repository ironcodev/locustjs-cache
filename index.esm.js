import { throwIfInstantiateAbstract, throwNotImplementedException } from 'locustjs-exception';
import { isNumeric, isEmpty, isFunction } from 'locustjs-base';

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
        this.duration = isNumeric(duration) ? parseInt(duration) : this.duration;
        
        if (isNaN(this.duration) || isEmpty(this.duration)) {
            this.duration = 0;
        }
    }
    hit() {
        this.hits++;
    }
    invalid() {
        this.createdDate.setFullYear(this.createdDate.getFullYear() + 100);
    }
}

class CacheBase {
    constructor(config) {
        throwIfInstantiateAbstract(CacheBase, this);

        this.config = Object.assign({}, config);
    }
    getEntry(key) {
        throwNotImplementedException('CacheBase.getEntry');
    }
    getItem(key, fnCondition) {
        throwNotImplementedException('CacheBase.getItem');
    }
    setItem(key, value, duration) {
        throwNotImplementedException('CacheBase.setItem');
    }
    addOrUpdate(key, fnUpdate, value, duration) {
        throwNotImplementedException('CacheBase.addOrUpdate');
    }
    getOrSet(key, value, duration) {
        throwNotImplementedException('CacheBase.getOrSet');
    }
    exists(key) {
        throwNotImplementedException('CacheBase.exists');
    }
    remove(key) {
        throwNotImplementedException('CacheBase.remove');
    }
    contains(value, equalityComparer) {
        throwNotImplementedException('CacheBase.contains');
    }
    clean() {
        throwNotImplementedException('CacheBase.clean');
    }
    clear() {
        throwNotImplementedException('CacheBase.clear');
    }
    getDuration(duration) {
        let result = 0;

        if (isNumeric(duration)) {
            result = parseInt(duration);
        } else {
            if (this.config && isNumeric(this.config.duration)) {
                result = parseInt(this.config.duration);
            }
        }

        if (isNaN(result) || isEmpty(result)) {
            result = 0;
        }

        return result;
    }
    get length() { return 0 ; }
}

class CacheDefault extends CacheBase {
    constructor(config) {
        super(config);

        this._data = []
    }
    get length() { return this._data.length; }
    getEntry(key) {
        return this._data.find(x => x.key === key);
    }
    getItem(key, fnCondition) {
        let result;
        const entry = this.getEntry(key);

        if (entry != null && entry.isValid()) {
            const ok = true;

            if (isFunction(fnCondition)) {
                const _result = fnCondition(this, entry);

                if (_result && isFunction(_result.then)) {
                    result = new Promise((resolve, reject) => {
                        _result.then(r => {
                            if (r) {
                                entry.hit();

                                resolve(entry.value);
                            } else {
                                entry.invalid();

                                resolve(undefined);
                            }
                        }).catch(x => reject(x));
                    });

                    ok = false;
                } else {
                    ok = _result;

                    if (!ok) {
                        entry.invalid();
                    }
                }
            }

            if (ok) {
                entry.hit();

                result = entry.value
            }
        }

        return result;
    }
    setItem(key, value, duration) {
        const entry = this.getEntry(key);

        if (entry == null) {
            const _duration = this.getDuration(duration);

            this._data.push(new CacheItem(key, value, _duration))
        } else {
            entry.setValue(value);
        }

        return value;
    }
    addOrUpdate(key, fnUpdate, value, duration) {
        const entry = this.getEntry(key);
        let result;

        if (entry == null) {
            const _duration = this.getDuration(duration);

            this._data.push(new CacheItem(key, value, _duration))

            result = value;
        } else {
            const newValue = isFunction(fnUpdate) ? fnUpdate(entry.value): value;

            entry.setValue(newValue);

            result = newValue;
        }

        return result;
    }
    exists(key) {
        const entry = this.getEntry(key);

        return  (entry && entry.isValid()) || false;
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
    contains(value, equalityComparer) {
        if (!isFunction(equalityComparer)) {
            return this._data.find(x => x.value === value) != null;
        } else {
            return this._data.find(x => equalityComparer(x.value, value)) != null;
        }
    }
    clean() {
        this._data = this._data.filter(x => x.isValid());
    }
    clear() {
        this._data = [];
    }
    _setValue(key, value, duration, entry) {
        let result;
        const _duration = this.getDuration(entry ? entry.duration: duration);

        if (isFunction(value)) {
            const _result = value(this, entry);

            if (_result && isFunction(_result.then)) {
                const _this = this;

                result = new Promise((resolve, reject) => {
                    _result.then(r => {
                        if (entry) {
                            entry.setValue(r, _duration);
                        } else {
                            _this.setItem(key, r, _duration);
                        }

                        resolve(r);
                    }).catch(x => reject(x));
                });
            } else {
                if (entry) {
                    entry.setValue(_result, _duration)
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
    getOrSet(key, value, fnCondition, duration) {
        let result;
        let _fnCondition = arguments.length > 2 ? fnCondition : undefined;
        let _duration = arguments.length > 3 ? duration : fnCondition;

        const entry = this.getEntry(key);

        if (entry != null) {
            let setValue = false;

            if (entry.isValid()) {
                let ok = true;

                if (isFunction(_fnCondition)) {
                    const _result = _fnCondition(this, entry);

                    if (_result && isFunction(_result.then)) {
                        const _this = this;

                        result = new Promise((resolve, reject) => {
                            _result.then(r => {
                                if (r) {
                                    entry.hit();

                                    resolve(entry.value);
                                } else {
                                    entry.invalid();

                                    const finalResult = _this._setValue(key, value, _duration, entry);

                                    resolve(finalResult);
                                }
                            }).catch(x => reject(x));
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
}

class CacheNull extends CacheBase {
    getEntry(key) {
        return null;
    }
    getItem(key, fnCondition) {
        return null;
    }
    setItem(key, value, duration) { }
    addOrUpdate(key, fnUpdate, value, duration) {
        return null;
    }
    exists(key) {
        return false;
    }
    remove(key) {
        return true;
    }
    contains(value) {
        return false;
    }
    clean() { }
    clear() { }
    getOrSet(key, value, fnCondition, duration) {
        let result;

        if (isFunction(value)) {
            const _result = value(this);

            if (_result && isFunction(_result.then)) {
                result = new Promise((resolve, reject) => {
                    _result.then(r => {
                        resolve(r);
                    }).catch(x => reject(x));
                });
            } else {
                result = _result;
            }
        } else {
            result = value;
        }

        return result;
    }
}

export { CacheItem, CacheBase, CacheDefault, CacheNull };