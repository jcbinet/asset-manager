/**
 * Debounce call of a function
 *
 * @param cb
 * @param wait
 */
export function debounce<T extends Function>(cb: T, wait = 20) {
  let h: NodeJS.Timeout;

  const callable = (...args: any) => {
    clearTimeout(h);
    h = setTimeout(() => cb(...args), wait);
  };

  return <T>(<any>callable);
}
