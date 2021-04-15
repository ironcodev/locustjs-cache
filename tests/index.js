import { CacheDefault } from '../index.esm.js';


const cache = new CacheDefault({ duration: 5000 });
new Promise(resolve => {

    cache.setItem('key1', 24, 500);
    cache.setItem('key2', 25);

    setTimeout(() => resolve(cache), 800)
}).then(c => {
    const x = c.getOrSet('key2', 26, () => c.exists('key1'));

    console.log(x)
})