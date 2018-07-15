const myArray = [1, 2, 3];
const nodes = { a: 1, b: 2 };

myArray.reduce((memo, item, index) => {
  memo[item] = index;
}, {});

Array.from(nodes, node => {
  if (node === 1) {
    return true;
  }
});
