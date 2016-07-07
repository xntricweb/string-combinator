# string-combiner
A node.js module for combining strings

#usage
import the module
```javascript
let {combine} = require('string-combinator');
```

have a pool of key/value pairs
```javascript
let simplePool = {
  key1: "value1",
  key2: "value2"
};
```

combine a string with the pool
```javascript
let result = combine('key1 is {{key1}}, and key2 is {{key2}}');
console.log(result);
```

which would output
```bash
key1 is value1, and key2 is value2
```

#Details
##What's a pool?
A pool is an object which contains key/value pairs which will potentially be inserted into a string at some point.

#The Default Pool
```javascript
let combinator = require('string-combinator');
combinator.setDefaultPool(
  [recombine=false]  //indicates that the pool should be combined with itself after it has been collapsed
, ...pool            //a list of key/value pair objects to use for the default pool
)

combinator.getDefaultPool() //returns the current default pool object
```

The default Default pool is process.env... this allows combine to work out of the box with the environment variables on the system.

setDefaultPool will collapse the supplied pool list into a single pool and set it as the default pool to use when a pool is not specified for the combine function. The arguments are passed directly to the combinePools function. More detail on the recombine feature is supplied there.

getDefaultPool just returns the current default pool

#\#combinePools
```javascript
let {combinePools} = require('string-combinator');
combinePools(
  [recombine=false]  //indicates that the pool should be combined with itself after it has been collapsed
, ...pool            //a list of key/value pair objects to collapse into one
)
```

combinePools enables easy collapsing of multiple sets of pools.
If the first argument ===true the collapsed pool will be combined with itself... This allows a pool to have values which are dependent on other keys in the pool.

#\#combine
```javascript
let {combine} = require('string-combinator');
combine(
  string                //this is the string to parse
, [pool=Default Pool]   //the key/value pairs for substitution
, [index=0]             //the index within the string to begin looking for keys
)
```
Combine looks for keys from the pool (surrounded by delimiters) within in a string and replaces the occurences with the keys value.

#\#combinator
```javascript
let combinator = require('string-combinator');
let {combinator} = require('string-combinator');
let combinator = require('string-combainator').combinator;
```

#\#combineObject
see tests for usage

#\#Delimiters
see test for usage
