import { isNumeric, isEmpty } from "@locustjs/base";

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

export default CacheItem;
