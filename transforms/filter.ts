export default function filter<A>(f: (arg: A) => boolean): Transform<A, A> {
  return (it: Iterable<A>) => {
    return {
      [Symbol.iterator]: function* () {
        for (const x of it) {
          const passed = f(x);
          if (passed) yield x;
        }
      }
    };
  };
}
