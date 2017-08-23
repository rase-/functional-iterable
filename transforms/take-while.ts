export default function takeWhile<T>(predicate: (arg: T) => boolean): Transform<T, T> {
  return (it: Iterable<T>) => {
    return {
      [Symbol.iterator]: function* () {
        const gen = it[Symbol.iterator]();
        let itResult = gen.next();
        while (predicate(itResult.value)) {
          yield itResult.value;
          itResult = gen.next();
        }
      }
    };
  };
}
