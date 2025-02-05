import {
  throwIfInstantiateAbstract,
  throwNotImplementedException,
} from "@locustjs/exception";
import { isNumeric, isEmpty } from "@locustjs/base";

class CacheBase {
  constructor(config) {
    throwIfInstantiateAbstract(CacheBase, this);

    this.config = Object.assign({}, config);
  }
  get name() {
    return this.constructor.name;
  }
  getEntry(key) {
    throwNotImplementedException(`${this.name}.getEntry`);
  }
  getItem(key, fnCondition) {
    throwNotImplementedException(`${this.name}.getItem`);
  }
  setItem(key, value, duration) {
    throwNotImplementedException(`${this.name}.setItem`);
  }
  addOrUpdate(key, value, fnUpdate, duration) {
    throwNotImplementedException(`${this.name}.addOrUpdate`);
  }
  getOrSet(key, value, fnCondition, duration) {
    throwNotImplementedException(`${this.name}.getOrSet`);
  }
  exists(key) {
    throwNotImplementedException(`${this.name}.exists`);
  }
  remove(key) {
    throwNotImplementedException(`${this.name}.remove`);
  }
  contains(value, fnEqualityComparer) {
    throwNotImplementedException(`${this.name}.contains`);
  }
  clean() {
    throwNotImplementedException(`${this.name}.clean`);
  }
  clear() {
    throwNotImplementedException(`${this.name}.clear`);
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
  get length() {
    return 0;
  }
}

export default CacheBase;
