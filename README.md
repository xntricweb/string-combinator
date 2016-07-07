# string-combiner
A node.js module for combining strings

##usage
import the module
```javascript
let {combine} = require('combinator');
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

which would output::
    key1 is value1, and key2 is value2
