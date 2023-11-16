export const isPromise = (p: any): boolean => {
  if (typeof p === 'object' && typeof p.then === 'function') {
    return true;
  }

  return false;
};

export const returnsPromise = (f: any): boolean => {
  if (
    f.constructor.name === 'AsyncFunction' ||
    (typeof f === 'function' && isPromise(f()))
  ) {
    return true;
  }
  return false;
};
