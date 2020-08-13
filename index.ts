import Memoizer, {MemoizeOptions} from './lib/memoizer'
const { promisify } = require("util");
const redis = require("redis");
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const existsAsync = promisify(client.exists).bind(client);
const keysAsync = promisify(client.keys).bind(client);
const setAsync = promisify(client.set).bind(client);

// const memoizedMax = memoizeWith(opts, Math.max)


const {cache, memoize} = new Memoizer({
    cachePrefix: "node-test",
    cacheKeyResolver: function(identity: any, ...args: any[]) {return [this.cachePrefix, identity, ...args].join("::")},
    cache: {
        get: getAsync,
        has: async (key: string) => {
            return await existsAsync(key) !== 0 
        },
        keys: () => keysAsync("*"),
        set: setAsync
    }
})
const memoizedMax = memoize(Math.max)
memoizedMax(1, 2, 3, 5, 6, 7, 3, 22, 11, -12).then(x => {

    memoizedMax(1, 2, 3, 5, 6, 7, 3, 22, 11, -11).then(y => {
        console.log(x)
        console.log(y)
        cache().keys().then(console.log)
        client.quit()

    })
})

// // console.log(memoizer.cache().keys())
