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
        this.lastHit = new Date();
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
    getItemAsync(key, fnCondition) {
        throwNotImplementedException('CacheBase.getItemAsync');
    }
    setItem(key, value, duration) {
        throwNotImplementedException('CacheBase.setItem');
    }
    setItemAsync(key, value, duration) {
        throwNotImplementedException('CacheBase.setItemAsync');
    }
    addOrUpdate(key, value, fnUpdate, duration) {
        throwNotImplementedException('CacheBase.addOrUpdate');
    }
    addOrUpdateAsync(key, value, fnUpdate, duration) {
        throwNotImplementedException('CacheBase.addOrUpdateAsync');
    }
    getOrSet(key, value, fnCondition, duration) {
        throwNotImplementedException('CacheBase.getOrSet');
    }
    getOrSetAsync(key, value, fnCondition, duration) {
        throwNotImplementedException('CacheBase.getOrSetAsync');
    }
    exists(key) {
        throwNotImplementedException('CacheBase.exists');
    }
    remove(key) {
        throwNotImplementedException('CacheBase.remove');
    }
    contains(value, fnEqualityComparer) {
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
            let ok = true;

            if (isFunction(fnCondition)) {
                ok = fnCondition(this, entry.value);

                if (!ok) {
                    entry.invalid();
                }
            }

            if (ok) {
                entry.hit();

                result = entry.value
            }
        }

        return result;
    }
    getItemAsync(key, fnCondition) {
        let result;
        let value;
        const entry = this.getEntry(key);

        if (entry != null && entry.isValid()) {
            if (isFunction(fnCondition)) {
                const isOk = fnCondition(this, entry.value);

                if (isOk && isFunction(isOk.then)) {
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
        this._data.push(new CacheItem(key, value, duration))
    }
    setItem(key, value, duration) {
        let result;

        const entry = this.getEntry(key);

        if (entry == null) {
            const _duration = this.getDuration(duration);

            if (isFunction(value)) {
                result = value(this, key, duration);
            } else {
                result = value;
            }

            this._add(key, result, _duration);
        } else {
            if (isFunction(value)) {
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

            if (isFunction(value)) {
                const _value = value(this, key, duration);

                if (_value && isFunction(_value.then)) {
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
            if (isFunction(value)) {
                const _value = value(this, key, duration);

                if (_value && isFunction(_value.then)) {
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
            
            if (isFunction(value)) {
                result = value(this, key, duration);
            } else {
                result = value;
            }

            this._add(key, result, _duration);
        } else {
            if (isFunction(fnUpdate)) {
                result = fnUpdate(this, entry.value, value);
            } else {
                if (isFunction(value)) {
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
            
            if (isFunction(value)) {
                _value = value(this, key, duration);

                if (_value && isFunction(_value.then)) {
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
            if (isFunction(fnUpdate)) {
                _value = fnUpdate(this, entry.value, value);

                if (_value && isFunction(_value.then)) {
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
                if (isFunction(value)) {
                    _value = value(this, key, duration);
    
                    if (_value && isFunction(_value.then)) {
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
    contains(value, fnEqualityComparer) {
        if (!isFunction(fnEqualityComparer)) {
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
        if (isFunction(value)) {
            return value();
        } else {
            return value;
        }
    }
    setItemAsync(key, value, duration) {
        if (isFunction(value)) {
            return Promise.resolve(value());
        } else {
            return Promise.resolve(value);
        }
    }
    addOrUpdate(key, value, fnUpdate, duration) {
        if (isFunction(value)) {
            return value();
        } else {
            return value;
        }
    }
    addOrUpdateAsync(key, value, fnUpdate, duration) {
        if (isFunction(value)) {
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
    clean() { }
    clear() { }
    getOrSet(key, fnCondition, value, duration) {
        if (isFunction(value)) {
            return value();
        } else {
            return value;
        }
    }
    getOrSetAsync(key, fnCondition, value, duration) {
        if (isFunction(value)) {
            return Promise.resolve(value());
        } else {
            return Promise.resolve(value);
        }
    }
}

export { CacheItem, CacheBase, CacheDefault, CacheNull };