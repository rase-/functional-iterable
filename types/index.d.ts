type Transform<A, B> = (arg: Iterable<A>) => Iterable<B>
type AsyncTransform<A, B> = (arg: AsyncIterable<A>) => AsyncIterable<B>
