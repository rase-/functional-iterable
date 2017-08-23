export default function reduce<A, B>(f: (acc: B, arg: A) => B, val: B, it: Iterable<A>): B {
  let acc: B = val;
  for (const x of it) {
    acc = f(acc, x);
  }

  return acc;
}
