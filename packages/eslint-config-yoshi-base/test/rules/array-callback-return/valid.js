const myArray = [1, 2, 3];

myArray.reduce((memo, item, index) => {
  memo[item] = index;
  return memo;
}, {});
