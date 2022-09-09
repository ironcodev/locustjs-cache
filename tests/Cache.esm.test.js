import { CacheDefault } from '../index.esm';

(function (...configs) {
    for (let config of configs) {
        describe('Testing ' + config.name, () => {
            // --------------------- length -------------------

            test('length', () => {
                const cache = config.factory();

                cache.setItem('key1', {});

                expect(cache.length).toBe(1)
            });

            // --------------------- getItem -------------------

            test('getItem: non-conditionally', () => {
                const cache = config.factory();

                cache.setItem('key1', 24);

                const x = cache.getItem('key1');

                expect(x).toBe(24)
            });

            test('getItem: conditionally', () => {
                const cache = config.factory();

                cache.setItem('key1', 24);
                cache.setItem('key2', 100);

                let x = cache.getItem('key2', c => c.exists('key1'));

                expect(x).toBe(100);

                cache.remove('key1');

                x = cache.getItem('key2', c => c.exists('key1'));

                expect(x).toBe(undefined);
            });

            // --------------------- getItemAsync -------------------

            test('getItemAsync: non-conditionally', async () => {
                expect.assertions(1);

                const cache = config.factory();

                cache.setItem('key1', 24);

                const x = await cache.getItemAsync('key1');

                expect(x).toBe(24)
            });

            test('getItemAsync: conditionally, sync', async () => {
                expect.assertions(2);

                const cache = config.factory();

                cache.setItem('key1', 24);
                cache.setItem('key2', 100);

                let x = await cache.getItemAsync('key2', c => c.exists('key1'));

                expect(x).toBe(100);

                cache.remove('key1');

                x = await cache.getItemAsync('key2', c => c.exists('key1'));

                expect(x).toBe(undefined);
            });

            test('getItemAsync: conditionally, async', async () => {
                expect.assertions(2);

                const cache = config.factory();

                cache.setItem('key1', 24);
                cache.setItem('key2', 100);

                let x = await cache.getItemAsync('key2', c => new Promise(res => setTimeout(() => res(c.exists('key1')), 1000)));

                expect(x).toBe(100);

                cache.remove('key1');

                x = await cache.getItemAsync('key2', c => new Promise(res => setTimeout(() => res(c.exists('key1')), 1000)));

                expect(x).toBe(undefined);
            });

            // --------------------- setItem -------------------

            test('setItem', () => {
                const cache = config.factory();

                cache.setItem('key1', 24);
                cache.setItem('key1', 34);

                let x = cache.getItem('key1');

                expect(x).toBe(34);

                cache.setItem('key1', () => 40);

                x = cache.getItem('key1');

                expect(x).toBe(40);
            });

            // --------------------- setItemAsync -------------------

            test('setItemAsync: like setItem', async () => {
                expect.assertions(2);

                const cache = config.factory();

                await cache.setItemAsync('key1', 24);
                await cache.setItemAsync('key1', 34);

                let x = cache.getItem('key1');

                expect(x).toBe(34);

                await cache.setItemAsync('key1', () => 40);

                x = cache.getItem('key1');

                expect(x).toBe(40);
            });

            test('setItemAsync: async mode', async () => {
                expect.assertions(1);

                const cache = config.factory();

                await cache.setItemAsync('key1', () => new Promise(res => setTimeout(() => res(40), 1000)));

                const x = cache.getItem('key1');

                expect(x).toBe(40);
            });

            // --------------------- addOrUpdate -------------------

            test('addOrUpdate: add', () => {
                const cache = config.factory();

                cache.addOrUpdate('key1', 30, x => x + 1);

                const x = cache.getItem('key1');

                expect(x).toBe(30);
            });

            test('addOrUpdate: add, valueFactory', () => {
                const cache = config.factory();

                cache.addOrUpdate('key1', () => 30, (c, oldValue) => oldValue + 1);

                const x = cache.getItem('key1');

                expect(x).toBe(30);
            });

            test('addOrUpdate: update', () => {
                const cache = config.factory();

                cache.setItem('key1', 24);
                cache.addOrUpdate('key1', 30, (c, oldValue) => oldValue + 1);

                const x = cache.getItem('key1');

                expect(x).toBe(25);
            });

            // --------------------- addOrUpdateAsync -------------------

            test('addOrUpdateAsync: add', async () => {
                expect.assertions(1);

                const cache = config.factory();

                await cache.addOrUpdateAsync('key1', 30, (c, oldValue) => oldValue + 1);

                const x = cache.getItem('key1');

                expect(x).toBe(30);
            });

            test('addOrUpdateAsync: add, valueFactory (sync)', async () => {
                expect.assertions(1);

                const cache = config.factory();

                await cache.addOrUpdateAsync('key1', () => 30, (c, oldValue) => oldValue + 1);

                const x = cache.getItem('key1');

                expect(x).toBe(30);
            });

            test('addOrUpdateAsync: add, valueFactory (async)', async () => {
                expect.assertions(1);

                const cache = config.factory();

                await cache.addOrUpdateAsync('key1', () => new Promise(res => setTimeout(() => res(30), 1000)), (c, oldValue) => oldValue + 1);

                const x = cache.getItem('key1');

                expect(x).toBe(30);
            });

            test('addOrUpdateAsync: update, sync', async () => {
                expect.assertions(1);

                const cache = config.factory();

                cache.setItem('key1', 24);

                await cache.addOrUpdateAsync('key1', 30, (c, oldValue) => oldValue + 1);

                const x = cache.getItem('key1');

                expect(x).toBe(25);
            });

            test('addOrUpdateAsync: update, async', async () => {
                expect.assertions(1);

                const cache = config.factory();

                cache.setItem('key1', 24);

                await cache.addOrUpdateAsync('key1', 30, (c, oldValue, currentValue) => new Promise(res => setTimeout(() => res(oldValue + 1), 1000)));

                const x = cache.getItem('key1');

                expect(x).toBe(25);
            });

            // --------------------- exists -------------------

            test('exists', () => {
                const cache = config.factory();

                cache.setItem('key1', 24);

                const x1 = cache.exists('key1');
                const x2 = cache.exists('key2');

                expect(x1).toBe(true);
                expect(x2).toBe(false);
            });

            // --------------------- contains -------------------

            test('contains', () => {
                const cache = config.factory();

                cache.setItem('key1', 24);

                const x = cache.contains(24);

                expect(x).toBe(true);
            });

            test('contains: custom equalityComparator', () => {
                const cache = config.factory();
                const item = { name: 'John Doe'};
                const itemCopy = { ...item }

                cache.setItem('key1', item);

                let x = cache.contains(itemCopy);

                expect(x).toBe(false);

                x = cache.contains(itemCopy, (x, y) => x.name == y.name);

                expect(x).toBe(true);
            });

            // --------------------- remove -------------------

            test('remove', () => {
                const cache = config.factory();

                cache.setItem('key1', 24);

                cache.remove('key1');
                const x = cache.exists('key1');

                expect(x).toBe(false);
            });

            // --------------------- clear -------------------

            test('clear', () => {
                const cache = config.factory();

                cache.setItem('key1', 24);
                cache.setItem('key2', 24);
                cache.setItem('key3', 24);

                expect(cache.length).toBe(3);

                cache.clear();

                expect(cache.length).toBe(0);
            });

            // --------------------- clean -------------------

            test('clean', () => {
                return new Promise(resolve => {
                    const cache = config.factory();

                    cache.setItem('key1', 24);
                    cache.setItem('key2', 25, 500);
                    cache.setItem('key3', 26, 500);

                    setTimeout(() => resolve(cache), 1000)
                }).then(cache => {
                    cache.clean();

                    expect(cache.length).toBe(1);
                })
            });

            // --------------------- getOrSet -------------------

            test('getOrSet: get mode', () => {
                const cache = config.factory();

                cache.setItem('key1', 24);

                const x = cache.getOrSet('key1', null, 25);

                expect(x).toBe(24);
            });

            test('getOrSet: set mode', () => {
                const cache = config.factory();

                const x = cache.getOrSet('key1', null, 24);

                expect(x).toBe(24);
            });

            test('getOrSet: set mode (valueFactory)', () => {
                const cache = config.factory();

                const x = cache.getOrSet('key1', null, () => 24);

                expect(x).toBe(24);
            });

            // --------------------- getOrSetAsync -------------------

            test('getOrSet: get mode', async () => {
                expect.assertions(1);

                const cache = config.factory();

                cache.setItem('key1', 24);

                const x = await cache.getOrSetAsync('key1', null, 25);

                expect(x).toBe(24);
            });

            test('getOrSetAsync: set mode', async () => {
                expect.assertions(1);

                const cache = config.factory();

                const x = await cache.getOrSetAsync('key1', null, 24);

                expect(x).toBe(24);
            });

            test('getOrSetAsync: set mode (valueFactory: sync)', async () => {
                expect.assertions(1);

                const cache = config.factory();

                const x = await cache.getOrSetAsync('key1', null, () => 24);

                expect(x).toBe(24);
            });

            test('getOrSetAsync: set mode (valueFactory: async)', async () => {
                expect.assertions(1);

                const cache = config.factory();

                const x = await cache.getOrSetAsync('key1', null, () => new Promise(res => setTimeout(() => res(24), 1000)));

                expect(x).toBe(24);
            });
        });
    }
})({    // factory config item to test CacheDefault class
    name: 'CacheDefault',
    factory: function () {
        return new CacheDefault({ duration: 8000 });
    }
});