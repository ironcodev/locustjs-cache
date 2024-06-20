# @locustjs/cache
This library provides a simple caching utility in an abstract manner.

It can be used independently in any `javascript` project, however, since the abstraction layer `locustjs-cache` provides, it is best used in conjuction with an `IoC container` or `DI container` such as [@locustjs/locator](https://github.com/ironcodev/locustjs-locator).

## Installation

NPM
```
npm i @locustjs/cache
```

Yarn
```
yarn add @locustjs/cache
```

## Classes
### `CacheBase`
This is the abstract class that defines structure/API of all Cache classes.

#### Constructor

```
constructor(config)
```

`config` is an optional configuration with the following structure that could be used by child classes based on their discretion:

```javascript
{
    "duration": number  // default validity duration of cahced items
}
```

#### Methods

| Method | Result | Description                   |
|--------|--------|-----------------------|
| `getEntry(key)` | `CacheItem` | returns cache item entry in the cache based on its key. |
| `getItem(key, fnCondition?)` | `any` (cached value) | returns a cached value based on its key. The get operation can be performed conditionally using the `fnCondition` function which is explained a little further.  |
| `setItem(key, value, duration?)` | `void` | adds a new cache item into cache with specified `duration`. if `duration` is not specified, `config.duration` will be used for given cache item. If an item already exists in the cache with the same key, it is overwritten unconditionally. In order to perform an add/update operation, developers should use `addOrUpdate` method. |
| `addOrUpdate(key, value, fnUpdate, duration)` | `any` (cached value) | adds a new item into the cache with given value and key if an item does not already exist with the given key; Otherwise, it updates the existing cache entry with the new value based on the `fnUpdate` function. |
| `getOrSet(key, fnCondition, value, duration?)` | `any` (cached value) | returns a cached value if it already exists in the cahe. It adds a new item into cache if such item does not exist. The get operation can be conditional by specifying `fnCondition` function. This is explained a little further. |
| `exists(key)` | `boolean` | checks whether an item with given `key` exists in the cache. |
| `remove(key)` | `boolean` | removes a cached item with given `key` and returns `true` if succeeded (item was existing) or `false` (otherwise) |
| `contains(value, fnEqualityComparer?)` | `boolean` | looks in the cache for the given `value` and returns `true` if it finds a cach entry with this value or `false` (otherwise). If `fnEqualityComparer` function specified, it uses that in order to find cached entry when comparing given `value` with a cached value upon iterating over cached entries. |
| `clean()` | `void` | cleans cache; removes items that are invalid (expired) and are wasting memory. |
| `clear()` | `void` | clears out the cache (removes all entries). |
| `getDuration(duration)` | `number` | This is a helper `protected` method that is inherited to sub-classes. It validates given `duation` value. a zero or lower than zero value indicates that the item is expired. |

#### Properties
| Property | Description                   |
|--------|-------------------------------|
| `config` | configuration passed to cache class constructor. |
| `length` | Number of items in the cache. |

#### Notes
1. There is no restriction in the format or type of cache keys. It is upon `CacheBase` sub-classes to approve/reject any value based on their implementaton. Normally, `string` values are used for cache keys, however, `number`s could also be used. It is important though to know that, in order for the application -that depends on `CacheBase` abstraction- to work correctly, cache implementations should have a consistent behavior (use the same key type/format) regarding cache entries' keys. This is a developer concern not a `locustjs-cache` concern.
2. Signature of `fnCondition` function in `getItem()` or `getOrSet()` is as follows:

```javascript
function fnCondition(cache: CacheBase, entry: CacheItem): boolean
```

The `fnCondition` function enables developer to conditionally get items based on a custom business. This way, validity of cached items are bound to the custom business logic. If `fnCondition` does not return `true`, cached item is assumed invalid.

<code>CacheBase</code> sub-classes are expected follow the following rules regrding <code>fnCondition</code> function.

- They should call this function upon finding a cached value when `getItem`/`getOrSet` is called.
- Upon invokation, they should pass their instance reference together with the found cached value to `fnCondition`.
- They should invalidate the cache entry if `fnCondition` returns `false`.

3. `fnEqualityComparer` function in `contains()` method has the following signature:

```javascript
function fnEqualityComparer(valueA, valueB): boolean
```

By default, `contains()` method should use `===` when comparing values.

5. In `addOrUpdate` method, `fnUpdate` has the following signature:

```javascript
function fnUpdate(cache: CacheBase, oldValue: any, currentValue: any): any
```

### `CacheDefault`
Default implementation of `CacheBase`. It stores cached items in an internal array in memory. Cache entries are stored as `CacheItem` instances.

### CacheItem
Defines structure of cache entries. Its structure is as follows:

```javascript
{
    "key": string,  // cache key
    "value": any,   // cached value
    "createdDate": date,    // date/time when cache entry was stored in the cache
    "lastHit": date,    // date/time when cache entry was last hit
    "hits": number, // how many times the item was last hit (requested)
    "duration": number  // how long cached value can be assumed valid and stay in the cache (in milliseconds)
}
```

`CacheItem` has the following methods:

| Method | Result | Description                   |
|--------|-------------------------------|-----|
| `isValid()` | `boolean` | Specifies whether cache entry is valid (not expired) or not. |
| `setValue(value, duration)` | `void` | sets value and duration of current entry to given `value` and `duration`. |
| `hit()` | `void` | updates current cache entry's number of hits and `lastHit` field. It is used by `CacheDefault` and is called whenever an existing cache item is requested by user in `getItem` or `getOrSet` methods. |
| `invalid()` | `void` | Invalidates cache entry. |

### `CacheNull`
This is a no-cache implementation of `CacheBase` that does not store anything and its `getItem` always returns null. It can be used for testing or when application intends to disable caching.

## Examples

### Example 1: Normal getItem/setItem, no condition

```javascript
const user = {
    id: '123',
    username: 'john.doe',
    email: 'john@doe.com'
}

const cache = new CacheDefault({ duration: 5000 });

cache.setItem(user.id, user);

const u = cache.getItem(user.id);

console.log(cache.length);     // 1
console.log(cache.exists(user.id));     // true
console.log(u);
```

### Example 2: contains()

```javascript
const user = {
    id: '123',
    username: 'john.doe',
    email: 'john@doe.com'
}

const cache = new CacheDefault({ duration: 5000 });

cache.setItem(user.id, user);

console.log(cache.contains(user));     // false
console.log(cache.contains(user, (ua, ub) => ua.id === ub.id));     // true
```

### Example 3: conditional getItem

```javascript
const cache = new CacheDefault({ duration: 5000 });

cache.setItem('key1', 2134);
cache.setItem('key2', 1001);

let x = cache.getItem('key2', c => c.exists('key1'));

console.log(cache.exists('key2'));     // true
console.log(x); // 1001

cache.remove('key1');

x = cache.getItem('key2', c => c.exists('key1'));

console.log(cache.exists('key2'));     // false
console.log(x); // undefined
```

One usecase that conditional `getItem()` is useful is when we have a parent/child relationship. We can get child entities from cache conditionally. The condition in such scenario would be if their parent is still in the cache and its lastupdate prop matches the local parent we already have in our child.

### Example 4: conditional getItem, async

```javascript
async function doSomething() {
    const cache = new CacheDefault({ duration: 5000 });

    async function getChildById(id) {
        const result = await cache.getItem(`child-${id}`, (c, child) => new Promise(res => {
            setTimeout(() => {
                const p = c.getItem(`parent-${child.parent.id}`)

                if (!p) {
                    res(false)
                } else {
                    if (p.lastUpdate != child.parent.lastUpdate) {
                        res(false)
                    } else {
                        res(true)
                    }
                }
            }, 2000);
        }));

        return result;
    }

    const parent = {
        id: 1001,
        name: 'Parent',
        lastUpdate: new Date()
    }
    const child = {
        id: 2134,
        name: 'Child',
        parent: { ...parent }
    }

    cache.setItem(`parent-${parent.id}`, parent);
    cache.setItem(`child-${child.id}`, child);

    // child's parent exists in cache and its lastUpdate matches child's parent lastUpdate.

    if (x) {
        console.log(`child ${x.id} is in cache`);   // this line will be executed
    } else {
        console.log(`child ${x.id} is not in cache`);
    }

    // Scenario 1: parent is removed from cache
    cache.remove(`parent-${parent.id}`);

    x = await getChildById(2134);

    if (x) {
        console.log(`child ${x.id} is in cache`);
    } else {
        console.log(`child ${x.id} is not in cache`);    // this line will be executed
    }

    // --------------------------------------------
    // Scenario 2: parent is updated and put again in cache

    parent.lastUpdate = new Date()

    cache.setItem(`parent-${parent.id}`, parent);

    x = await getChildById(2134);

    // parent exists in cache this time, however, its lastUpdate does not match with child's parent.

    if (x) {
        console.log(`child ${x.id} is in cache`);
    } else {
        console.log(`child ${x.id} is not in cache`);    // this line will be executed
    }

    // in both scenarios, child will not be returned by cache.
}
```