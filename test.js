/* eslint-disable no-console */
"use strict";

const path = require("path");

const sharp = require('sharp');
const assert = require("assert");

const phash = require("./src/phash");
const dist = require("./src/distance");

const lenna_png = "Lenna.png";
const lenna_jpg = "Lenna.jpg";
const lenna_sepia = "Lenna-sepia.jpg";
const lenna_exif = "Lenna_exif-orientation-8.jpg";

const fb = "fb.jpg";
const xing = "xing.jpg";

const fb1 = "fb1.jpg";
const fb2 = "fb2.jpg";
const fb3 = "fb3.jpg";
const fb4 = "fb4.jpg";
const fb5 = "fb5.jpg";
const fb6 = "fb6.jpg";

function getPHash(img) {
  return sharp(path.join(".", "img", img))
      .greyscale()
      .resize(32, 32, { fit: "fill" })
      .rotate()
      .raw()
      .toBuffer()
      .then(buf => {
        return phash([...buf])
      })
}

function bitCount(hash) {
  const high = parseInt(hash.substring(0, 8), 16);
  const low = parseInt(hash.substr(8, 16), 16);
  const bin = (high).toString(2) + (low).toString(2);
  return bin.replace(/[^1]/g, '').length;
}

function testPHash(img, hash) {
  return getPHash(img).then(value => {
    assert.strictEqual(value, hash, `Missmatch at ${img} on hash ${value}. Expected ${hash}`)
    console.log("Test PASS", img, hash)
  });
}

function testDifference(img1, img2, cond) {
  return Promise.all([getPHash(img1), getPHash(img2)]).then(([hash1, hash2]) => {
    const d = dist(hash1, hash2);
    const text = `${img1} vs ${img2}
hash1: ${hash1} (${bitCount(hash1)})
hash2: ${hash2} (${bitCount(hash2)})
distance: ${d}
`;
    assert.ok(cond(d), text);
    console.log("Test PASS", img1, img2, cond.name);
  });
}

const SIMILAR = d => d <= 5;
const LIKELY_SIMILAR = d => d <= 10;
const NOT_SIMILAR = d => d > 10;

Promise.all([
  testPHash(lenna_png, '8da95aea66452c91'),
  testPHash(lenna_jpg, '8da95aea66452c91'),
  testPHash(fb, '7188cfa06c3f0e9b'),
  testDifference(lenna_png, lenna_jpg, SIMILAR),
  testDifference(lenna_jpg, lenna_sepia, SIMILAR),
  testDifference(lenna_jpg, lenna_exif, SIMILAR),
  testDifference(fb, xing, LIKELY_SIMILAR),
  testDifference(fb1, fb2, NOT_SIMILAR),
  testDifference(fb1, lenna_jpg, NOT_SIMILAR),
  testDifference(fb3, fb4, NOT_SIMILAR),
  testDifference(fb5, fb6, NOT_SIMILAR)
]).catch(err => {
  console.log("Test fail");
  console.log(err.message);
});
