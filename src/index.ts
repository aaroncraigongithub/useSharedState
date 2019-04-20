import { useState } from 'react';

type StateUpdater<ValueType> = (value: ValueType) => void;
type StateEntry<ValueType> = {
  value?: ValueType;
  updaters: Set<StateUpdater<ValueType>>;
};

const states = new Map<string, StateEntry<any>>();

function ensureStateValue<ValueType>(key: string, defaultValue?: ValueType) {
  if (!states.has(key)) {
    states.set(key, {
      value: defaultValue,
      updaters: new Set<StateUpdater<ValueType>>(),
    });
  }
}

function getCurrentValue<ValueType>(key: string, defaultValue?: ValueType) {
  ensureStateValue<ValueType>(key, defaultValue);

  return states.get(key)!;
}

function getStateUpdater<ValueType>(key: string): StateUpdater<ValueType> {
  return (value: ValueType) => {
    update<ValueType>(key, value);
  };
}

export function useSharedState<ValueType>(
  key: string,
  defaultValue?: ValueType,
): [ValueType | undefined, StateUpdater<ValueType>] {
  const current = getCurrentValue<ValueType>(key, defaultValue);

  const state = useState<ValueType | undefined>(current.value) as [
    ValueType,
    StateUpdater<ValueType>
  ];

  current.updaters.add(state[1]);

  return [current.value, getStateUpdater<ValueType>(key)];
}

export function update<ValueType>(key: string, value: ValueType) {
  const current = getCurrentValue<ValueType>(key);

  current.value = value;
  current.updaters.forEach(listener => {
    listener(value);
  });
}
