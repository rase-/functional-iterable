export default function map<A>(f: (arg: A) => void): Transform<A, A> {
  return (it: Iterable<A>) => {
    return {
      [Symbol.iterator]: function* () {
        for (const x of it) {
          f(x);
          yield x;
        }
      }
    }
  }
}
