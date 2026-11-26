import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number
) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latestCallback = useRef(callback);

  useLayoutEffect(() => {
    latestCallback.current = callback;
  });

  useEffect(() => () => clearTimeout(timer.current), []);

  return useCallback(
    (...args: Args) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => latestCallback.current(...args), delayMs);
    },
    [delayMs]
  );
}
