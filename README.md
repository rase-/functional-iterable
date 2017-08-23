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
    .transform(takeWhile((x: number) => x <= 5))
    .flatMap((x: number) => [x, x])
    .map((x: number) => x + 1)
    .apply()
)
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
