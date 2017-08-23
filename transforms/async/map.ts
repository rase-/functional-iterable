export default function map<A, B>(f: (arg: A) => B): AsyncTransform<A, B> {
  return (it: AsyncIterable<A>) => {
    return {
      [Symbol.asyncIterator]: async function* () {
        for await (const x of it) {
          yield f(x);
        }
      }
    }
  }
}
