/*
  Plans:
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

type Transform<A, B> = (arg: Iterable<A>) => Iterable<B>

function map<A, B>(f: (arg: A) => B): Transform<A, B> {
  return (it: Iterable<A>) => {
    return {
      [Symbol.iterator]: function* () {
        for (const x of it) {
          yield f(x);
        }
      }
    }
  }
}

function filter<A>(f: (arg: A) => boolean): Transform<A, A> {
  return (it: Iterable<A>) => {
    return {
      [Symbol.iterator]: function* () {
        for (const x of it) {
          const passed = f(x);
          if (passed) yield x;
        }
      }
    };
  };
}

function reduce<A, B>(f: (acc: B, arg: A) => B, val: B, it: Iterable<A>): B {
  let acc: B = val;
  for (const x of it) {
    acc = f(acc, x);
  }

  return acc;
}

function flatMap<A, B>(f: (arg: A) => Iterable<B>): Transform<A, B> {
  return (it: Iterable<A>) => {
    return {
      [Symbol.iterator]: function* () {
        for (const x of it) {
          for (const y of f(x)) {
            yield y;
          }
        }
      }
    };
  };
}

class FunctionalIterator<T> {
  it: Iterable<T>
  folded: boolean

  constructor(it: Iterable<T>) {
    this.it = it;
    this.folded = false;
  }

  transform<A>(f: (arg: Iterable<T>) => Iterable<A>): FunctionalIterator<A> {
    return new FunctionalIterator(f(this.it));
  }

  apply() {
    return this.it;
  }
}

function chain<T>(it: Iterable<T>): FunctionalIterator<T> {
  return new FunctionalIterator(it);
}

// Examples
const sourceA = [1,2,3,4,5];
const sourceB = function*(){
  for (let i = 0; i < 10; i++) {
    yield i;
  }
};

function takeWhile<T>(predicate: (arg: T) => boolean): Transform<T, T> {
  return (it: Iterable<T>) => {
    return {
      [Symbol.iterator]: function* () {
        const gen = it[Symbol.iterator]();
        let itResult = gen.next();
        while (predicate(itResult.value)) {
          yield itResult.value;
          itResult = gen.next();
        }
      }
    };
  };
}

console.log(Array.from(map((x: number) => x + 1)(sourceA)));
console.log(Array.from(map((x: number) => x + 1)(sourceB())));

console.log(Array.from(filter(x => x > 3)(sourceA)));
console.log(Array.from(filter(x => x <= 3)(sourceB())));

console.log(reduce((acc: number, x: number) => acc + x, 0, sourceA));
console.log(reduce((acc: number, x: number) => acc * x, 1, sourceB()));

console.log(
  Array.from(
    chain(sourceB())
      .transform(map((x: number) => x * 2))
      .transform(map((x: number) => x - 10))
      .transform(filter((x: number) => x >= 0))
      .transform(takeWhile((x: number) => x <= 5))
      .transform(flatMap((x: number) => [x, x]))
      .transform(map((x: number) => x + 1))
      .apply()
  )
);
