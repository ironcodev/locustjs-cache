# locustjs-cache
This library provides a simple caching utility in an abstract manner.

It can be used independently in any `javascript` project, however, since the abstraction layer `locustjs-cache` provides, it is best used in conjuction with an `IoC container` or `DI container` such as [locustjs-locator](https://github.com/ironcodev/locustjs-locator).

## Installation

NPM
```
npm i locustjs-cache
```

Yarn
```
yarn add locustjs-cache
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
| `getEntry(key)` | `CacheItem` | This method returns cache item entry in the cache based on its key. |
| `getItem(key, fnCondition?)` | `any` (cached value) | This method returns a cached value based on its key. The get operation can be performed conditionally using the `fnCondition` function which is explained a little further.  |
| `getItemAsync(key, fnCondition?)` | `Promise<any>` (cached value) | This method acts the same way as `getItem()`. It just returns a promise, since it supports asynchronous `fnCondition`.  |
| `setItem(key, value, duration?)` | `void` | This method adds a new cache item into cache with specified `duration`. if `duration` is not specified, `config.duration` will be used for given cache item. If an item already exists in the cache with the same key, it is overwritten unconditionally. In order to perform an add/update operation, developers should use `addOrUpdate` method. |
| `setItemAsync(key, value, duration?)` | `Promise<any>` | This method acts the same way as `setItem()`. It just returns a promise, since it supports asynchronous `value factory`. |
| `addOrUpdate(key, value, fnUpdate, duration)` | `any` (cached value) | This method adds a new item into the cache with given value and key if an item does not already exist with the given key; Otherwise, it updates the existing cache entry with the new value based on the `fnUpdate` function. |
| `addOrUpdateAsync(key, value, fnUpdate, duration)` | `Promise<any>` (cached value) | This method acts the same way as `addOrUpdate()`. It just returns a promise, since it supports asynchronous `value factory` and `fnUpdate`. |
| `getOrSet(key, fnCondition, value, duration?)` | `any` (cached value) | This method returns a cached value if it already exists in the cahe. It adds a new item into cache if such item does not exist. The get operation can be conditional by specifying `fnCondition` function. This is explained a little further. |
| `getOrSetAsync(key, fnCondition, value, duration?)` | `Promise<any>` (cached value) | This method acts the same way as `getOrSet()`. It just returns a promise, since it supports asynchronous `value factory`. |
| `exists(key)` | `boolean` | This method checks whether an item with given `key` exists in the cache. |
| `remove(key)` | `boolean` | This method removes a cached item with given `key` and returns `true` if succeeded (item was existing) or `false` (otherwise) |
| `contains(value, fnEqualityComparer?)` | `boolean` | This methods looks in the cache for the given `value` and returns `true` if it finds a cach entry with this value or `false` (otherwise). If `fnEqualityComparer` function specified, it uses that in order to find cached entry when comparing given `value` with a cached value upon iterating over cached entries. |
| `clean()` | `void` | This method cleans cache; removes items that are invalid (expired) but staying in the cache and wasting memory. |
| `clear()` | `void` | This method clears out the cache (removes all entries). |
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

For their async equivalent, i.e. `getItemAsync()` and `getOrSetAsync()`, the signature could be either of the followings:

```javascript
function fnCondition(cache: CacheBase, entry: CacheItem): boolean
function fnCondition(cache: CacheBase, entry: CacheItem): Promise<boolean>
```

That is, `getItemAsync` or `getOrSetAsync` should support both sync and async functions regarding `fnCondition`.

The `fnCondition` function enables developer to conditionally get items based on a custom business used in his `fnCondition`. This way, the developer is able to bind validity of cached items to his custom business logic.

<code>CacheBase</code> sub-classes are expected follow the following rules regrding <code>fnCondition</code> function.

- They should call this function upon finding a cached value when `getItem` or `getOrSet` or their async versions is called.
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

For the async equivalent, i.e. `addOrUpdateAsync()`, the signature could be either of the followings:

```javascript
function fnUpdate(cache: CacheBase, oldValue: any, currentValue: any): any
function fnUpdate(cache: CacheBase, oldValue: any, currentValue: any): Promise<any>
```

That is, `addOrUpdateAsync` should support both sync and async functions regarding `fnUpdate`.

### `CacheDefault`
This is a default working implementation of `CacheBase`. It stores cached items in an internal array. Cache entries are stored as `CacheItem` instances in the array.

### CacheItem
This class defines structure of cache entries. Its structure is as follows:

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
This is a no-cache implementation of `CacheBase` that does not store anything and its `getItem` always returns null. It can be used whenever application intends to disable caching.

## Examples

### Example 1: Normal getItem/setItem, no condition

```javascript
const user = { id: '123', username: 'john.doe', email: 'john@doe.com' }

const cache = new CacheDefault({ duration: 5000 });

cache.setItem(user.id, user);

const u = cache.getItem(user.id);

console.log(cache.length);     // 1
console.log(cache.exists(user.id));     // true
console.log(u);
```

### Example 2: contains()

```javascript
const user = { id: '123', username: 'john.doe', email: 'john@doe.com' }

const cache = new CacheDefault({ duration: 5000 });

cache.setItem(user.id, user);

console.log(cache.contains(user));     // false
console.log(cache.contains(user, (ua, ub) => ua.id === ub.id));     // true
```

### Example 3: conditional getItem

```javascript
const cache = new CacheDefault({ duration: 5000 });

cache.setItem('key1', 24);
cache.setItem('key2', 100);

let x = cache.getItem('key2', c => c.exists('key1'));

console.log(cache.exists('key2'));     // true
console.log(x); // 100

cache.remove('key1');

x = cache.getItem('key2', c => c.exists('key1'));

console.log(cache.exists('key2'));     // false
console.log(x); // undefined
```

Conditional `getItem()` is useful when we have a parent/child relationship between our entities. We can get child entities from cache conditionally, say. if their parent is still in the cache or its properties matches we already have in our child.

### Example 4: conditional getItem, async

```javascript
async function doSomething() {
    const cache = new CacheDefault({ duration: 5000 });

    async function getChild(childKey, parentKey) {
        const result = await cache.getItemAsync(childKey, c => new Promise(res => {
            setTimeout(() => {
                res(c.exists(parentKey));
            }, 2000);
        }));

        return result;
    }

    cache.setItem('key1', 24);
    cache.setItem('key2', 100);

    let x = await getChild('key1', 'key2');

    console.log(cache.exists('key2'));     // true
    console.log(x); // 100

    cache.remove('key1');

    x = await getChild('key1', 'key2');

    console.log(cache.exists('key2'));     // false
    console.log(x); // undefined
}
```