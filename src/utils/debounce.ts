type Func<T extends any[]> = (...args: T) => void;

function debounce<T extends any[]>(
  func: Func<T>,
  wait: number,
  immediate = false,
): Func<T> {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(this: any, ...args: T): void {
    const context = this;

    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && timeout === null;

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
}

export { debounce };
