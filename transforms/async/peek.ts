export default function map<A>(f: (arg: A) => void): AsyncTransform<A, A> {
  return (it: AsyncIterable<A>) => {
    return {
      [Symbol.asyncIterator]: async function* () {
        for await (const x of it) {
          f(x);
          yield x;
        }
      }
    }
  }
}
