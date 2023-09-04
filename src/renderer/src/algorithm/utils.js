// 生成count个不重复的随机整数，范围[min, max]
function generateUniqueRandomInts(count, min = 0, max = Number.MAX_VALUE) {
  const set = new Set();
  while (set.size < count) {
    set.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return [...set];
}

function generateRandomUniqueIntsExcept(count, min = 0, max = Number.MAX_VALUE, except = []) {
  const set = new Set(except);
  while (set.size < count + except.length) {
    set.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return [...set].filter(item => !except.includes(item));
}

module.exports = { generateUniqueRandomInts, generateRandomUniqueIntsExcept };
