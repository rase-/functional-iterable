export default async function reduce<A, B>(f: (acc: B, arg: A) => B, val: B, it: AsyncIterable<A>): Promise<B> {
  let acc: B = val;
  for await (const x of it) {
    acc = f(acc, x);
  }

  return acc;
}
