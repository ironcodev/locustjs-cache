const { CacheDefault } = require('../index.cjs');

(function (...configs) {
    for (let config of configs) {
        describe('Testing ' + config.name, () => {
            // --------------------- length -------------------

            test('length: returns number of items in cache', () => {
                const cache = config.factory();

                cache.setItem('key1', {});

                expect(cache.length).toBe(1)
            });

            // --------------------- getItem -------------------

            test('getItem: returns an item based on its key', () => {
                const cache = config.factory();

                cache.setItem('key1', 24);

                const x = cache.getItem('key1');

                expect(x).toBe(24)
            });

            // --------------------- setItem -------------------

            test('setItem: set cached item based on its key <value = none-function>', () => {
                const cache = config.factory();

                cache.setItem('key1', 24);
                cache.setItem('key1', 34);

                const x = cache.getItem('key1');

                expect(x).toBe(34)
            });

            // --------------------- exists -------------------

            test('exists: checks whether an item is inside in cahce based on its key and returns true/false', () => {
                const cache = config.factory();

                cache.setItem('key1', 24);

                const x = cache.exists('key1');

                expect(x).toBe(true)
            });

            // --------------------- remove -------------------

            test('remove: remove an item from cache based on its key', () => {
                const cache = config.factory();

                cache.setItem('key1', 24);

                cache.remove('key1');
                const x = cache.exists('key1');

                expect(x).toBe(false)
            });

            // --------------------- clear -------------------

            test('clear: clears all cached items', () => {
                const cache = config.factory();

                cache.setItem('key1', 24);
                cache.setItem('key2', 24);
                cache.setItem('key3', 24);

                expect(cache.length).toBe(3);

                cache.clear();

                expect(cache.length).toBe(0);
            });

            // --------------------- clean -------------------

            test('clean: removes items that are invalid and frees up memory', () => {

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

            test('getOrSet: retrieves item from cache or adds a new item in the cache <value = none-function>', () => {
                const cache = config.factory();

                cache.setItem('key1', 24);

                const x = cache.getOrSet('key1', 25);

                expect(x).toBe(24)
            });

            test('getOrSet: retrieves item from cache or adds a new item in the cache <value = none-function>', () => {
                const cache = config.factory();

                const x = cache.getOrSet('key1', 24);

                expect(x).toBe(24)
            });

            test('getOrSet: retrieves item from cache or adds a new item in the cache <value = function>', () => {
                const cache = config.factory();

                const x = cache.getOrSet('key1', () => 24);

                expect(x).toBe(24)
            });

            test('getOrSet: retrieves item from cache or adds a new item in the cache <value = none-function, conditional>', () => {
                return new Promise(resolve => {
                    const cache = config.factory();

                    cache.setItem('key1', 24, 500);
                    cache.setItem('key2', 25);

                    setTimeout(() => resolve(cache), 800)
                }).then(cache => {
                    const x = cache.getOrSet('key2', 26, () => cache.exists('key1'));

                    expect(x).toBe(26)
                })
            });

            test('getOrSet: retrieves item from cache or adds a new item in the cache <value = function, conditional>', () => {
                return new Promise(resolve => {
                    const cache = config.factory();

                    cache.setItem('key1', 24, 500);
                    cache.setItem('key2', 25);

                    setTimeout(() => resolve(cache), 800)
                }).then(cache => {
                    const x = cache.getOrSet('key2', () => 26, () => cache.exists('key1'));

                    expect(x).toBe(26)
                })
            });
        });
    }
})({    // factory config item to test CacheDefault class
    name: 'CacheDefault',
    factory: function () {
        return new CacheDefault({ duration: 5000 });
    }
});