import { MutableRefObject, useCallback, useRef, useState } from "react";

/** A `useState` that also creates a getter function for breaking through closures. */
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
 * Wraps a setter function and keeps a ref updated to follow the set value. Useful for making the most up-to-date value
 * of some state accessible to a closure that might be called after the value is updated.
 */
// TODO should this replace `useStateWithGetter`?
export function useRefWithSetter<T>(setter: (value: T) => void): [MutableRefObject<T | undefined>, (value: T) => void];
export function useRefWithSetter<T>(setter: (value: T) => void, init: T): [MutableRefObject<T>, (value: T) => void];
export function useRefWithSetter<T>(
  setter: (value: T) => void,
  init?: T
): [MutableRefObject<T | undefined>, (value: T) => void] {
  const value = useRef<T | undefined>(init);
  const wrappedSetter = useCallback(
    (newValue: T) => {
      value.current = newValue;
      setter(newValue);
    },
    [setter, value]
  );
  return [value, wrappedSetter];
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
