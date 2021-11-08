export function arrayify<T>(x: T | T[]): T[] {
  return Array.isArray(x) ? x : [x]
}
