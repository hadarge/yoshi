import { fn } from 'yoshi-server';

export const greet = fn(function(age: number) {
  return {
    name: `world! ${age}`,
    age,
  };
});
