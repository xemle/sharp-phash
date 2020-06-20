const expect = require('chai').expect;
const distance = require('./distance');

describe('distance', () => {
  it('should return 4', () => {
    expect(distance('f', '0')).to.equal(4);
  });

  it('should count all bit toggle', () => {
    expect(distance('8da95aea66452c91', '7188cfa06c3f0e9b')).to.equal(26);
  });

  it('should only count max toggles', () => {
    expect(distance('8da95aea66452c91', '7188cfa06c3f0e9b', 12)).to.equal(12);
  });

  it('should handle only shortes input', () => {
    expect(distance('a', 'ab')).to.equal(0);
    expect(distance('ab', 'a')).to.equal(0);
  });

  it('should throw error on invalid codes', () => {
    expect(() => distance('/', '0')).to.throw();
    expect(() => distance(':', '0')).to.throw();
    expect(() => distance('@', '0')).to.throw();
    expect(() => distance('G', '0')).to.throw();
    expect(() => distance('`', '0')).to.throw();
    expect(() => distance('g', '0')).to.throw();
  })

});
