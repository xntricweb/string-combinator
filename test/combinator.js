/* eslint-env mocha */
let {expect} = require('chai');
let combinator = require('../');
let combine = combinator.combine;

let simplePool = {key1: "value1", key2: "value2"};
let simplePool2 = {key3: "value3", key4: "value4"};
let tokenPool = {key5: "value({{key6}} - 1)", key6: "six"};
let expectedTokenPool = {key5: "value(six - 1)", key6: "six"};
let simpleString = "{{key1}}";
let doubleString = "{{key1}}, {{key2}}";
let invalidKey = "{{key1}}, {{key3}}, {{key2}}";
let specialTokenString = ":key1:{{key2}}:key1:";

let simpleObject = {
  sok1: 'sov1 - no tokens',
  sok2: 'sov2 - {{key1}}',
  sok3: 'sov3 - {{key2}}: {{key4}}',
  sok4: undefined,
  sok5: null,
  sok6: [
    'arr1 - {{key6}}',
    'arr2 - {{key1}}, {{key2}}'
  ],
  sok7: {
    ssok1: 'ssov1 - {{key4}}',
    ssok2: 'ssov2 - {{key3}}'
  }
};

let expectedObject = {
  sok1: 'sov1 - no tokens',
  sok2: 'sov2 - value1',
  sok3: 'sov3 - value2: value4',
  sok4: undefined,
  sok5: null,
  sok6: [
    'arr1 - six',
    'arr2 - value1, value2'
  ],
  sok7: {
    ssok1: 'ssov1 - value4',
    ssok2: 'ssov2 - value3'
  }
};

describe("string-combinator", function() {
  describe("combine", function() {
    it("should combine a simple string with a simple pool", function() {
      expect(combine(simpleString, simplePool))
      .to.equal("value1");
    });

    it("should combine a string with multiple pool tokens", function() {
      expect(combine(doubleString, simplePool))
      .to.equal("value1, value2");
    });

    it("should pass null and undefined straight through", function() {
      expect(combine(null, simplePool)).to.equal(null);
      expect(combine(undefined, simplePool)).to.equal(undefined);
    });

    it("should pass invalid keys unaltered", function() {
      expect(combine(invalidKey, simplePool))
      .to.equal(`${simplePool.key1}, {{key3}}, ${simplePool.key2}`);
    });
  });

  describe("combineObject", function() {
    it("should combine an object filled with strings with a pool", function() {
      let pool = Object.assign({}, simplePool, simplePool2, tokenPool);
      expect(combinator.combineObject(simpleObject, pool))
      .to.eql(expectedObject);
    });

    it("should combine a pool with itself.", function() {
      expect(combinator.combineObject(tokenPool, tokenPool))
      .to.eql(expectedTokenPool);
    });
  });

  describe("combinePools", function() {
    it("should combine two pools into one.", function() {
      let pool = combinator.combinePools(simplePool, simplePool2);
      expect(pool).to.eql(Object.assign({}, simplePool, simplePool2));
    });

    it("should combine pools and detokenize", function() {
      let pool = combinator.combinePools(true, simplePool, tokenPool);
      let expectedPool = Object.assign({}, simplePool, expectedTokenPool);
      expect(pool).to.eql(expectedPool);
    });
  });

  describe("default-pool", function() {
    it("should have a default pool configured as process.env", function() {
      expect(combinator.getDefaultPool()).to.equal(process.env);
    });

    it("should combine using the default pool, if one is not supplied",
    function() {
      process.env.COMBINATORTEST = "Hello combinator";
      expect(combine("{{COMBINATORTEST}}"))
      .to.equal(process.env.COMBINATORTEST);
    });

    it("should allow setting a new default pool, mixing pools as required",
    function() {
      let expectedPool = Object.assign({}, process.env, simplePool);
      let newPool = combinator.setDefaultPool(process.env, simplePool);
      expect(newPool)
      .to.eql(expectedPool)
      .and.to.eql(combinator.getDefaultPool());
    });
  });

  describe("delimitors", function() {
    it("should allow changing the delimitors", function() {
      expect(combinator.setDelimiters('#', '&'))
      .to.eql(['#', '&']);
    });

    it("should retrieve the current delimitors", function() {
      expect(combinator.getDelimiters()).to.eql(['#', '&']);
    });

    it("should use the start delimitor as the stop if stop is not provided",
    function() {
      expect(combinator.setDelimiters(':'))
      .to.eql([':', ':']);
    });

    it("should combine using the new delimitors", function() {
      expect(combine(specialTokenString, simplePool))
      .to.equal("value1{{key2}}value1");
    });
  });
});
