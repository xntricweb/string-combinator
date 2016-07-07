module.exports.combinator = module.exports = combinator;
module.exports.combine = combine;
module.exports.combineObject = combineObject;
module.exports.setDelimiters = setDelimiters;
module.exports.getDelimiters = getDelimiters;
module.exports.combinePools = combinePools;
module.exports.setDefaultPool = setDefaultPool;
module.exports.getDefaultPool = getDefaultPool;

let defaultPool = process.env;
/**
 * Returns the default pool.
 * @return {object} the current default pool
 */
function getDefaultPool() {
  return defaultPool;
}

/**
 * Set the default pool.
 * Allows a common pool to be shared between combine statements. The pool will
 * be passed through combinePools before being set as the default.
 * @param {...object} pools A list of pools to pass to the combine statement.
 * @return {object}         The new default pool.
 */
function setDefaultPool(...pools) {
  defaultPool = combinePools(...pools);
  return getDefaultPool();
}

let [dStart, dStop, szdStart, szdStop] = ["{{", "}}", 2, 2];
/**
 * Used to set or get the token deliminators for parsing functions.
 *
 * @param  {string} start If provided, changes the start token to start
 * @param  {string} stop If provided, changes the stop token to stop. If start
 * is provided but stop isn't stop is set to start by default
 * @return {void}
 */
function setDelimiters(start, stop = start) {
  [dStart, dStop, szdStart, szdStop] =
  [start, stop, start.length, stop.length];
  return getDelimiters();
}

/**
 * Gets the current deliminators which are in use.
 * @return {Array} An array with 2 indexes, constains the start & stop
 * deliminators in that order.
 */
function getDelimiters() {
  return [dStart, dStop];
}

/**
 *
 * Parses the components of options for tokens and replaces the occurrences of
 * the tokens with named values from the pool object. The results are copied
 * to a new object and returned.
 *
 * @param  {object} obj An object containing strings that may have tokens to
 * replace.
 * @param  {object} pool  Key value pairs to replace in options.
 * @return {object}         A deep copy of the options object with the tokens
 * filtered.
 */
function combineObject(obj, pool) {
  let res = obj instanceof Array ? [] : {};
  for (let i in obj) if (obj.hasOwnProperty(i)) {
    let val = obj[i];
    if (val === undefined || val === null) {
      res[i] = val;
    } else if (typeof val === "object") {
      if (val === obj) res[i] = val;
      else res[i] = combineObject(val, pool);
    } else res[i] = combine(val, pool);
  }
  return res;
}

/**
 * Parses a string for token occurrences, which will be replaced by the named
 * value in pool.
 * A token looks like %key%.
 * The pool object looks like { key: value }
 *
 * @param  {object} str    A string that may have tokens to replace.
 * @param  {object} pool Key value pairs to replace in options.
 * @param  {Number} si    The index to begin searching from within the string
 * @return {object}        A copy of the string detokenized.
 */
function combine(str, pool = defaultPool, si = 0) {
  // check to make sure val is a string... if
  if (str === undefined || str === null) return str;
  if (str.toString) str = str.toString();
  else return str;

  if (typeof pool === 'number') {
    si = pool;
    pool = defaultPool;
  }

  while (si > -1) {
    si = str.indexOf(dStart, si);
    if (si < 0) break;

    let se = str.indexOf(dStop, si + szdStart);
    if (se < 0) break;

    let key = str.slice(si + szdStart, se);
    let val = pool[key] || dStart + key + dStop;

    str = str.slice(0, si) + val + str.slice(se + szdStop);
    si += val.length;
  }

  return str;
}

/**
 * Parses a string for token occurrences, which will be replaced by the named
 * value in pool.
 * A token looks like %key%.
 * The pool object looks like { key: value }
 *
 * @param  {object} str    A string that may have tokens to replace.
 * @param  {object} pool Key value pairs to replace in options.
 * @param  {Number} si    The index to begin searching from within the string
 * @return {object}        A copy of the string detokenized.
 */
function combinator(str, pool, si = 0) {
  if (typeof str === 'object') return combineObject(str, pool);
  return combine(str, pool, si);
}

/**
 * Combines the provided pools into a new pool and returns it.
 * @param  {boolean} recombine  If provided and truthy will combine the
 * result pool with itself.
 * @param  {object}  pools      The pools to combine
 * @return {object}             A new combined pool object.
 */
function combinePools(...pools) {
  let pool_ = {};
  let recombine = pools[0] === true;
  if (recombine) pools = pools.slice(1);

  pools.forEach(function(pool) {
    for (var i in pool) if (pool.hasOwnProperty(i))
      pool_[i] = pool[i].toString();
  });

  return recombine ? combineObject(pool_, pool_) : pool_;
}
