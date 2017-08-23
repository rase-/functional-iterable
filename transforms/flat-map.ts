export default function flatMap<A, B>(f: (arg: A) => Iterable<B>): Transform<A, B> {
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
