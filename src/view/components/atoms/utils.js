export function join() {
  return Array.from(arguments).reduce((acc, val) => acc.concat(val), []).join(' ');
}