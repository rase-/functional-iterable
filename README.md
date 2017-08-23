# functional-iterable

Simple, chainable functional operations on any type of Iterables. Async Iterables coming soon (before publishing)!

## Usage

```js
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

```js
chain([5,5,2,2,3])
  .map((x: number) => x + 1)
  .reduce((acc: number, x: number) => acc + x, 0)
```
