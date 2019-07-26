import { useEffect, useRef } from "react";

export function useTimeout(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setTimeout(tick, delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
}

export function useInterval(fn, interval) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(
    function() {
      if (interval) {
        const lastInterval = setInterval(function() {
          fnRef.current();
        }, interval);
        return () => clearInterval(lastInterval);
      }
    },
    [interval]
  );
}
