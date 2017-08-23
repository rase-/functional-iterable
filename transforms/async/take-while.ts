export default function takeWhile<T>(predicate: (arg: T) => boolean): AsyncTransform<T, T> {
  return (it: AsyncIterable<T>) => {
    return {
      [Symbol.asyncIterator]: async function* () {
        const gen = it[Symbol.asyncIterator]();
        let itResult = await gen.next();
        while (predicate(itResult.value)) {
          yield itResult.value;
          itResult = await gen.next();
        }
      }
    };
  };
}
