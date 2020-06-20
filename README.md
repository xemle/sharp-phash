# phash

Based implementation of perceptual hash (phash) algorithm described [there](http://www.hackerfactor.com/blog/?/archives/432-Looks-Like-It.html).

This forks [sharp-phash](https://github.com/btd/sharp-phash) with following difference

- Implements dct2d and idct2d according to https://www.mathworks.com/help/images/ref/dct2.html and https://www.mathworks.com/help/images/ref/idct2.html. This code is self contains and can be used for other purposes
- Returns the phash as 16 hex string code to reduce data instead of binary representation
- Compute the difference by lookup table with max value to skip further comparison
- Drop the dependency of sharp to support other graphic tools or browsers e.g. HTML canvas or Jimp

## How to use

```js
'use strict';

const fs = require('fs');
const Promise = require('bluebird');

const assert = require('assert');
const sharp = require('sharp');

const { phash, distance } = require('sharp-phash');

const img1 = './Lenna.png';
const img2 = './Lenna.jpg';
const img3 = './Lenna-sepia.jpg';

const sharpPhash = async (img) => {
  return sharp(img)
      .greyscale()
      .resize(32, 32, { fit: "fill" })
      .rotate()
      .raw()
      .toBuffer()
      .then(buf => {
        return phash([...buf])
      })
}

Promise.all([
  sharpPhash(img1),
  sharpPhash(img2),
  sharpPhash(img3)
])
  .then(([hash1, hash2, hash3]) => {
    // hash returned is 64 characters length string with 0 and 1 only
    assert(distance(hash1, hash2) < 5);
    assert(distance(hash2, hash3) < 5);
    assert(distance(hash3, hash1) < 5);
  });
```
