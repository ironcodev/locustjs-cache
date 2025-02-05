import { isFunction } from "@locustjs/base";
import CacheBase from "./CacheBase";

class CacheNull extends CacheBase {
  getEntry(key) {
    return undefined;
  }
  getItem(key, fnCondition) {
    return undefined;
  }
  setItem(key, value, duration) {
    if (isFunction(value)) {
      return value();
    } else {
      return value;
    }
  }
  addOrUpdate(key, value, fnUpdate, duration) {
    if (isFunction(value)) {
      return value();
    } else {
      return value;
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
    if (isFunction(value)) {
      return value();
    } else {
      return value;
    }
  }
}

export default CacheNull;
