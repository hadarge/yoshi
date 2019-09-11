import { fn } from 'yoshi-server';

export const greet = fn(function(age) {
  return {
    name: `world! ${age}`,
    age,
  };
});
