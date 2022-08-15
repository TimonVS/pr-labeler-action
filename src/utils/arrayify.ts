export function arrayify<T>(x: T | T[]): T[] {
  if (x) {
    return Array.isArray(x) ? x : [x];
  } else {
    return [];
  }
}
