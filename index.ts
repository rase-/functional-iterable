import map from './transforms/map';
import filter from './transforms/filter';
import reduce from './transforms/reduce';
import flatMap from './transforms/flat-map';

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

  apply() {
    return this.it;
  }
}

export default function chain<T>(it: Iterable<T>): FunctionalIterator<T> {
  return new FunctionalIterator(it);
}


