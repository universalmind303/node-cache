//@ts-ignore
export type MemoizeOptions = {
    cachePrefix: string,
    cacheKeyResolver?: (identity: any, ...args: any[]) => string;
    cache: MCache;
}
interface MCache {
    has: Function
    get: Function
    keys: Function
    set: Function
}
type MemoizeInternalOptions = {
    cacheKeyResolver: (identity: any, ...args: any[]) => string;
    cache: MCache;
}
export default class Memoizer {

    private options: MemoizeOptions;
    constructor(options?: MemoizeOptions) {
        this.options = options ?? {
            cachePrefix: "Memoizer::",
            cacheKeyResolver: function(identity: any, ...args: any[]) {return [this.cachePrefix, identity, ...args].join("::")},
            cache: new Map()
        };
    }

    public cache = () => this.options.cache;
    public memoize = f => memoizeWith(this.options, f)

}



const memoizeWith = function(options, f) {

    const memoized = async function (...args) {
        // const args: any = arguments
        const key = options.cacheKeyResolver?.(f.toString(), ...args)
        const hasKey = await options.cache.has(key)
        console.log(`hasKey: ${key}`, hasKey)
        if (await options.cache.has(key)) {
            return await options.cache.get(key);
        }
        const result = f(...args)
        console.log(result)
        await options.cache?.set(key, result);
        
        return result;
    };
    return memoized as Function;
}


// how do i want to interact wit this

// const {memoize, cache} = new NodeCache(options)