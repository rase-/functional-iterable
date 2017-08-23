export default function filter<A>(f: (arg: A) => boolean): AsyncTransform<A, A> {
  return (it: AsyncIterable<A>) => {
    return {
      [Symbol.asyncIterator]: async function* () {
        for await (const x of it) {
          const passed = f(x);
          if (passed) yield x;
        }
      }
    };
  };
}
