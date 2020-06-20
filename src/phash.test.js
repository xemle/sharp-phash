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
  it('should calculate the phash', (done) => {
    phashHelper('fb.jpg', (hash) => {
      expect(hash).to.equal('7188cfa06c3f0e9b');
    }, done);
  })
});
