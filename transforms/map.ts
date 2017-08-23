export default function map<A, B>(f: (arg: A) => B): Transform<A, B> {
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
