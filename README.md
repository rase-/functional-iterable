# functional-iterable

Simple, chainable functional operations on any type of Iterables. Even async iterators!

## Usage
### With array
```js
chain([5,5,2,2,3])
  .map((x: number) => x + 1)
  .reduce((acc: number, x: number) => acc + x, 0)
```

### With generator:
```js
const sourceB: () => Iterable<number> = function*(){
  for (let i = 0; i < 10; i++) {
    yield i;
  }
};

Array.from(
  chain(sourceB())
    .map((x: number) => x * 2)
    .map((x: number) => x - 10)
    .filter((x: number) => x >= 0)
    .flatMap((x: number) => [x, x])
    .map((x: number) => x + 1)
    .apply()
)
```

### With custom transform:
```js
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

Array.from(chain([2,3,4,5,6])
  .map((x: number) => x + 1)
  .transform(takeWhile(x => x < 5))
  .apply()
)
// => [3,4]
```

### With async generator
```js
const sourceC: () => AsyncIterable<number> = async function*(){
  for (let i = 0; i < 10; i++) {
    yield await new Promise<number>((resolve, reject) => {
      setTimeout(resolve(i), 1000);
    });
  }
};

chain<number>(sourceC())
  .map((x: number) => x + 1)
  .reduce((acc: number, x: number) => acc + x, 0)
  .then((sum) => console.log('promised sum', sum));
```
