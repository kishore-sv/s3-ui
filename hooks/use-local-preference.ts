"use client";

import { useCallback, useEffect, useState } from "react";

export function useLocalPreference<T extends string>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setValue(stored as T);
      }
    } catch {
      // ignore
    }
  }, [key]);

  const setPreference = useCallback(
    (newValue: T) => {
      setValue(newValue);
      try {
        localStorage.setItem(key, newValue);
      } catch {
        // ignore
      }
    },
    [key]
  );

  return [value, setPreference];
}
