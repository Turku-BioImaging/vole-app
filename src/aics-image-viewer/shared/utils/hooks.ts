import { useState, useRef, useCallback } from "react";

/** A `useState` that also creates a getter function for breaking through closures */
export function useStateWithGetter<T>(initialState: T | (() => T)): [T, (value: T) => void, () => T] {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(state);
  const wrappedSetState = useCallback((value: T) => {
    stateRef.current = value;
    setState(value);
  }, []);
  const getState = useCallback(() => stateRef.current, []);
  return [state, wrappedSetState, getState];
}

/**
 * For objects which are persistent for the lifetime of the component, not
 * a member of state, and require a constructor to create. Wraps `useRef`.
 */
export function useConstructor<T>(constructor: () => T): T {
  const value = useRef<T | null>(null);
  if (value.current === null) {
    value.current = constructor();
  }
  return value.current;
}
