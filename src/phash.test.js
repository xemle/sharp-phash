const expect = require('chai').expect;
const path = require('path');
const sharp = require('sharp');

const phash = require('./phash');

const readImage = (image) => {
  return sharp(path.resolve('img', image))
      .greyscale()
      .resize(32, 32, { fit: "fill" })
      .rotate()
      .raw()
      .toBuffer();
}

const phashHelper = (img, expectFn, done) => {
  readImage(img)
    .then(buf => phash([...buf]))
    .then(hash => {
      try {
        expectFn(hash);
        done();
      } catch (e) {
        done(e);
      }
    })
}

describe('phash', () => {
  it('should calculate the phash with high and low 32 bit ints', (done) => {
    phashHelper('fb.jpg', (hash) => {
      expect(hash.high).to.equal(1904791456);
      expect(hash.low).to.equal(1816071835);
    }, done);
  });

  it('should throw error on invalid inputs', () => {
    expect(() => phash('string')).to.throw().match(/Expect an array/);
    expect(() => phash(new Array(1023))).to.throw().match(/Expect array length of 1024/);
  });

  describe('toHex()', () => {
    it('should return hex format', (done) => {
      phashHelper('fb.jpg', (hash) => {
        expect(hash.toHex().length).to.equal(16);
        expect(hash.toHex()).to.match(/^[0-9a-f]+$/);
        expect(hash.toHex()).to.equal('7188cfa06c3f0e9b');
      }, done);
    });
  });

  describe('toDec()', () => {
    it('should return dec format', (done) => {
      phashHelper('fb.jpg', (hash) => {
        expect(hash.toDec().toString()).to.match(/^[0-9]+$/);
        expect(hash.toDec()).to.equal(8181017011036294811n);
      }, done);
    });
  });

  describe('toBin()', () => {
    it('should return binary format', (done) => {
      phashHelper('fb.jpg', (hash) => {
        expect(hash.toBin().length).to.equal(64);
        expect(hash.toBin()).to.match(/^[01]+$/);
        expect(hash.toBin()).to.equal('0111000110001000110011111010000001101100001111110000111010011011');
      }, done);
    });
  });

  describe('toString()', () => {
    it('should return bin format', (done) => {
      phashHelper('fb.jpg', (hash) => {
        expect(hash.toString().length).to.equal(hash.toBin().length);
        expect(hash.toString()).to.equal(hash.toBin());
      }, done);
    });
  });

});
