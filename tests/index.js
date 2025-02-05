import { TestRunner } from "@locustjs/test";
import { CacheDefault } from "../src";

function factory() {
  return new CacheDefault({ duration: 8000 });
}

const tests = [
  [
    "Testing CacheDefault.length",
    function (expect) {
      const cache = factory();

      cache.setItem("key1", {});

      expect(cache.length).toBe(1);
    },
  ],
  [
    "Testing CacheDefault.getItem: non-conditional",
    function (expect) {
      const cache = factory();

      cache.setItem("key1", 24);

      const x = cache.getItem("key1");

      expect(x).toBe(24);
    },
  ],
  [
    "Testing CacheDefault.getItem: conditional",
    function (expect) {
      const cache = factory();

      cache.setItem("key1", 24);
      cache.setItem("key2", 100);

      let x = cache.getItem("key2", (c) => c.exists("key1"));

      expect(x).toBe(100);

      cache.remove("key1");

      x = cache.getItem("key2", (c) => c.exists("key1"));

      expect(x).toBe(undefined);
    },
  ],
  [
    "Testing CacheDefault.getItem: non-conditional",
    async function (expect) {
      const cache = factory();

      cache.setItem("key1", 24);

      const x = await cache.getItem("key1");

      expect(x).toBe(24);
    },
  ],
  [
    "Testing CacheDefault.getItem: conditional",
    async function (expect) {
      const cache = factory();

      cache.setItem("key1", 24);
      cache.setItem("key2", 100);

      let x = await cache.getItem("key2", (c) => c.exists("key1"));

      expect(x).toBe(100);

      cache.remove("key1");

      x = await cache.getItem("key2", (c) => c.exists("key1"));

      expect(x).toBe(undefined);
    },
  ],
  [
    "Testing CacheDefault.getItem: conditional, async",
    async function (expect) {
      const cache = factory();

      cache.setItem("key1", 24);
      cache.setItem("key2", 100);

      let x = await cache.getItem(
        "key2",
        (c) =>
          new Promise((res) => setTimeout(() => res(c.exists("key1")), 1000))
      );

      expect(x).toBe(100);

      cache.remove("key1");

      x = await cache.getItem(
        "key2",
        (c) =>
          new Promise((res) => setTimeout(() => res(c.exists("key1")), 1000))
      );

      expect(x).toBe(undefined);
    },
  ],
  [
    "Testing CacheDefault.setItem",
    function (expect) {
      const cache = factory();

      cache.setItem("key1", 24);
      cache.setItem("key1", 34);

      let x = cache.getItem("key1");

      expect(x).toBe(34);

      cache.setItem("key1", () => 40);

      x = cache.getItem("key1");

      expect(x).toBe(40);
    },
  ],
  [
    "Testing CacheDefault.setItem",
    async function (expect) {
      const cache = factory();

      await cache.setItem("key1", 24);
      await cache.setItem("key1", 34);

      let x = cache.getItem("key1");

      expect(x).toBe(34);

      await cache.setItem("key1", () => 40);

      x = cache.getItem("key1");

      expect(x).toBe(40);
    },
  ],
  [
    "Testing CacheDefault.setItem: async mode",
    async function (expect) {
      const cache = factory();

      await cache.setItem(
        "key1",
        () => new Promise((res) => setTimeout(() => res(40), 1000))
      );

      const x = cache.getItem("key1");

      expect(x).toBe(40);
    },
  ],
  [
    "Testing CacheDefault.addOrUpdate: add",
    async function (expect) {
      const cache = factory();

      cache.addOrUpdate("key1", 30, (x) => x + 1);

      const x = cache.getItem("key1");

      expect(x).toBe(30);
    },
  ],
  [
    "Testing CacheDefault.addOrUpdate: add, valueFactory",
    async function (expect) {
      const cache = factory();

      cache.addOrUpdate(
        "key1",
        () => 30,
        (c, oldValue) => oldValue + 1
      );

      const x = cache.getItem("key1");

      expect(x).toBe(30);
    },
  ],
  [
    "Testing CacheDefault.addOrUpdate: update",
    async function (expect) {
      const cache = factory();

      cache.setItem("key1", 24);
      cache.addOrUpdate("key1", 30, (c, oldValue) => oldValue + 1);

      const x = cache.getItem("key1");

      expect(x).toBe(25);
    },
  ],
  [
    "Testing CacheDefault.addOrUpdate: add",
    async function (expect) {
      const cache = factory();

      await cache.addOrUpdate("key1", 30, (c, oldValue) => oldValue + 1);

      const x = cache.getItem("key1");

      expect(x).toBe(30);
    },
  ],
  [
    "Testing CacheDefault.addOrUpdate: add, valueFactory (sync)",
    async function (expect) {
      const cache = factory();

      await cache.addOrUpdate(
        "key1",
        () => 30,
        (c, oldValue) => oldValue + 1
      );

      const x = cache.getItem("key1");

      expect(x).toBe(30);
    },
  ],
  [
    "Testing CacheDefault.addOrUpdate: add, valueFactory (async)",
    async function (expect) {
      const cache = factory();

      await cache.addOrUpdate(
        "key1",
        () => new Promise((res) => setTimeout(() => res(30), 1000)),
        (c, oldValue) => oldValue + 1
      );

      const x = cache.getItem("key1");

      expect(x).toBe(30);
    },
  ],
  [
    "Testing CacheDefault.addOrUpdate: update, sync",
    async function (expect) {
      const cache = factory();

      cache.setItem("key1", 24);

      await cache.addOrUpdate("key1", 30, (c, oldValue) => oldValue + 1);

      const x = cache.getItem("key1");

      expect(x).toBe(25);
    },
  ],
  [
    "Testing CacheDefault.addOrUpdate: update, async",
    async function (expect) {
      const cache = factory();

      cache.setItem("key1", 24);

      await cache.addOrUpdate(
        "key1",
        30,
        (c, oldValue, currentValue) =>
          new Promise((res) => setTimeout(() => res(oldValue + 1), 1000))
      );

      const x = cache.getItem("key1");

      expect(x).toBe(25);
    },
  ],
  [
    "Testing CacheDefault.exists",
    async function (expect) {
      const cache = factory();

      cache.setItem("key1", 24);

      const x1 = cache.exists("key1");
      const x2 = cache.exists("key2");

      expect(x1).toBe(true);
      expect(x2).toBe(false);
    },
  ],
  [
    "Testing CacheDefault.contains",
    async function (expect) {
      const cache = factory();

      cache.setItem("key1", 24);

      const x = cache.contains(24);

      expect(x).toBe(true);
    },
  ],
  [
    "Testing CacheDefault.contains: custom equalityComparator",
    async function (expect) {
      const cache = factory();

      const item = { name: "John Doe" };
      const itemCopy = { ...item };

      cache.setItem("key1", item);

      let x = cache.contains(itemCopy);

      expect(x).toBe(false);

      x = cache.contains(itemCopy, (x, y) => x.name == y.name);

      expect(x).toBe(true);
    },
  ],
  [
    "Testing CacheDefault.remove",
    async function (expect) {
      const cache = factory();

      cache.setItem("key1", 24);

      cache.remove("key1");
      const x = cache.exists("key1");

      expect(x).toBe(false);
    },
  ],
  [
    "Testing CacheDefault.clear",
    async function (expect) {
      const cache = factory();

      cache.setItem("key1", 24);
      cache.setItem("key2", 24);
      cache.setItem("key3", 24);

      expect(cache.length).toBe(3);

      cache.clear();

      expect(cache.length).toBe(0);
    },
  ],
  [
    "Testing CacheDefault.clean",
    function (expect) {
      return new Promise((resolve) => {
        const cache = factory();

        cache.setItem("key1", 24);
        cache.setItem("key2", 25, 500);
        cache.setItem("key3", 26, 500);

        setTimeout(() => resolve(cache), 1000);
      }).then((cache) => {
        cache.clean();

        expect(cache.length).toBe(1);
      });
    },
  ],
  [
    "Testing CacheDefault.getOrSet",
    async function (expect) {
      const cache = factory();

      cache.setItem("key1", 24);

      const x = cache.getOrSet("key1", null, 25);

      expect(x).toBe(24);
    },
  ],
  [
    "Testing CacheDefault.getOrSet: set mode",
    async function (expect) {
      const cache = factory();

      const x = cache.getOrSet("key1", null, 24);

      expect(x).toBe(24);
    },
  ],
  [
    "Testing CacheDefault.getOrSet: set mode (valueFactory)",
    async function (expect) {
      const cache = factory();

      const x = cache.getOrSet("key1", null, () => 24);

      expect(x).toBe(24);
    },
  ],
  [
    "Testing CacheDefault.getOrSet: get mode",
    async function (expect) {
      const cache = factory();

      cache.setItem("key1", 24);

      const x = await cache.getOrSet("key1", null, 25);

      expect(x).toBe(24);
    },
  ],
  [
    "Testing CacheDefault.getOrSet: set mode",
    async function (expect) {
      const cache = factory();

      const x = await cache.getOrSet("key1", null, 24);

      expect(x).toBe(24);
    },
  ],
  [
    "Testing CacheDefault.getOrSet: set mode (valueFactory: sync)",
    async function (expect) {
      const cache = factory();

      const x = await cache.getOrSet("key1", null, () => 24);

      expect(x).toBe(24);
    },
  ],
  [
    "Testing CacheDefault.getOrSet: set mode (valueFactory: async)",
    async function (expect) {
      const cache = factory();

      const x = await cache.getOrSet(
        "key1",
        null,
        () => new Promise((res) => setTimeout(() => res(24), 1000))
      );

      expect(x).toBe(24);
    },
  ],
];

TestRunner.start(tests, true);
