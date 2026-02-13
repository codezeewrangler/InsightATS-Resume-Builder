export const debounce = <TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delay = 500,
) => {
  let timer: number | undefined;

  return (...args: TArgs) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
};
