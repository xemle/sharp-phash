const initDct2d = require('./dct2d');

const { dct2d } = initDct2d(32);

const cropRect = (src, srcSize, cropSize, offsetX, offsetY) => {
  const result = [];
  for (let x = 0; x < cropSize; x++) {
    for (let y = 0; y < cropSize; y++) {
      result.push(src[(x + offsetX) * srcSize + y + offsetY]);
    }
  }
  return result;
}

const getAverage = (signal) => {
  const sum = signal.reduce((result, value) => {
    result += value;
    return result;
  })
  return sum / signal.length;
}

const toNumber = (signal, avg) => {
  return signal.reduce((result, value) => (result * 2) + (value >= avg ? 1 : 0), 0);
}

const threshold = (signal, avg) => {
  const mid = signal.length / 2;
  const high = toNumber(signal.slice(0, mid), avg);
  const low = toNumber(signal.slice(mid, signal.length), avg);
  return [high, low];
}

const prefix = (s, len, char) => {
  while (s.length < len) {
    s = char + s;
  }
  return s;
}

const toHex = (high, low) => {
  return prefix((high).toString(16), 8, '0') + prefix((low).toString(16), 8, '0');
}

const phash = (data) => {
  if (!Array.isArray(data)) {
    throw new Error('Invalid data. Expect an array');
  } else if (data.length < 1024) {
    throw new Error('Invalid array length. Expect array length of 1024');
  }

  const freq = dct2d(data);
  const lowFreq = cropRect(freq, 32, 8, 1, 1);
  const avg = getAverage(lowFreq);
  const [high, low] = threshold(lowFreq, avg);

  return toHex(high, low);
}

module.exports = phash;
