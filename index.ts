import map from './transforms/map';
import filter from './transforms/filter';
import reduce from './transforms/reduce';
import flatMap from './transforms/flat-map';

import amap from './transforms/async/map';
import afilter from './transforms/async/filter';
import areduce from './transforms/async/reduce';
import aflatMap from './transforms/async/flat-map';


class FunctionalIterator<T> {
  it: Iterable<T>

  constructor(it: Iterable<T>) {
    this.it = it;
  }

  transform<A>(f: (arg: Iterable<T>) => Iterable<A>): FunctionalIterator<A> {
    return new FunctionalIterator(f(this.it));
  }

  map<A>(f: (arg: T) => A): FunctionalIterator<A> {
    return this.transform(map(f));
  }

  filter(f: (arg: T) => boolean): FunctionalIterator<T> {
    return this.transform(filter(f));
  }

  flatMap<A>(f: (arg: T) => Iterable<A>): FunctionalIterator<A> {
    return this.transform(flatMap(f));
  }

  reduce<A>(f: (acc: A, x: T) => A, val: A): A {
    return reduce(f, val, this.it);
  }

  apply(): Iterable<T> {
    return this.it;
  }
}

class FunctionalAsyncIterator<T> {
  it: AsyncIterable<T>

  constructor(it: AsyncIterable<T>) {
    this.it = it;
  }

  transform<A>(f: (arg: AsyncIterable<T>) => AsyncIterable<A>): FunctionalAsyncIterator<A> {
    return new FunctionalAsyncIterator(f(this.it));
  }

  map<A>(f: (arg: T) => A): FunctionalAsyncIterator<A> {
    return this.transform(amap(f));
  }

  filter(f: (arg: T) => boolean): FunctionalAsyncIterator<T> {
    return this.transform(afilter(f));
  }

  flatMap<A>(f: (arg: T) => AsyncIterable<A>): FunctionalAsyncIterator<A> {
    return this.transform(aflatMap(f));
  }

  reduce<A>(f: (acc: A, x: T) => A, val: A): Promise<A> {
    return areduce(f, val, this.it);
  }

  apply(): AsyncIterable<T> {
    return this.it;
  }
}

function isAsyncIterable<T>(it: AsyncIterable<T>|Iterable<T>): it is AsyncIterable<T> {
  return <AsyncIterable<T>>it[Symbol.asyncIterator] !== undefined;
}

function isIterable<T>(it: AsyncIterable<T>|Iterable<T>): it is Iterable<T> {
  return <Iterable<T>>it[Symbol.iterator] !== undefined;
}

export function chain<T>(it: AsyncIterable<T>): FunctionalAsyncIterator<T>;
export function chain<T>(it: Iterable<T>): FunctionalIterator<T>;
export default function chain<T>(it): any {
  if (isAsyncIterable<T>(it)) {
    return new FunctionalAsyncIterator<T>(it);
  } else if (isIterable<T>(it)) {
    return new FunctionalIterator<T>(it);
  }

  throw new TypeError('Argument not iterable');
}
