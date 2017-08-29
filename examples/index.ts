/*
  Sketches:
  ex 1: build then apply to any iterator
  chain()
    .map(x => x * x)
    .filter(x => x < 2042)
    .reduce((acc, x) => acc + x)
    .apply(myIterator)

  ex 2: build functions for reuse
  const sumSmallPowers = chain()
  .map(x => x * x)
  .filter(x => x < 2042)
  .reduce((acc, x) => acc + x)
  .build()

  sumSmallPowers([1,2,3,4,5]);

  ex 3: custom transforms
  chain()
  .map(x => x * x)
  .do(takeWhile(x => x < 2042))
  .apply(function* () {
    for (let i = 0; ;i++) {
       yield i;
    }
  });

	FUTURE: https://github.com/tc39/proposal-async-iteration
  */

// Examples
// polyfill asyncIterator
(Symbol as any).asyncIterator = Symbol.asyncIterator || Symbol("Symbol.asyncIterator");

import chain from '../index';
import map from '../transforms/map';
import filter from '../transforms/filter';
import reduce from '../transforms/reduce';
import takeWhile from '../transforms/take-while';
import asyncTakeWhile from '../transforms/async/take-while';

const sourceA: Iterable<number> = [1,2,3,4,5];
const sourceB: () => Iterable<number> = function*(){
  for (let i = 0; i < 10; i++) {
    yield i;
  }
};

const sourceC: () => AsyncIterable<number> = async function*(){
  for (let i = 0; ; i++) {
    yield await new Promise<number>((resolve, reject) => {
      setTimeout(resolve(i), 1000);
    });
  }
};

console.log(Array.from(map((x: number) => x + 1)(sourceA)));
console.log(Array.from(map((x: number) => x + 1)(sourceB())));

console.log(Array.from(filter(x => x > 3)(sourceA)));
console.log(Array.from(filter(x => x <= 3)(sourceB())));

console.log(reduce((acc: number, x: number) => acc + x, 0, sourceA));
console.log(reduce((acc: number, x: number) => acc * x, 1, sourceB()));

console.log(
  Array.from(
    chain<number>(sourceB())
      .map((x: number) => x * 2)
      .map((x: number) => x - 10)
      .filter((x: number) => x >= 0)
      .transform(takeWhile((x: number) => x <= 5))
      .flatMap((x: number) => [x, x])
      .map((x: number) => x + 1)
      .apply()
  )
);

console.log(
  chain<number>([5,5,2,2,3])
    .map((x: number) => x + 1)
    .reduce((acc: number, x: number) => acc + x, 0)
);

chain<number>(sourceC())
  .peek(x => console.log('source', x))
  .map((x: number) => x + 1)
  .transform(asyncTakeWhile((x: number) => x <= 100))
  .peek(x => console.log('mapped', x))
  .reduce((acc: number, x: number) => acc + x, 0)
  .then((sum) => console.log('promised sum', sum))
  .catch((e) => console.error(e));
