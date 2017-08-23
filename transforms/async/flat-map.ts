export default function flatMap<A, B>(f: (arg: A) => AsyncIterable<B>): AsyncTransform<A, B> {
  return (it: AsyncIterable<A>) => {
    return {
      [Symbol.asyncIterator]: async function* () {
        for await (const x of it) {
          for await (const y of f(x)) {
            yield y;
          }
        }
      }
    };
  };
}
