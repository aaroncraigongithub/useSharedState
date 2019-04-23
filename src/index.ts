import { useState } from 'react';

export type StateUpdater<ValueType> = (value: ValueType) => void;
export type SharedStateNext<ValueType> = (nextValue: ValueType) => void;
export type SharedStateMiddleware<ValueType> = (
  value: ValueType,
  next: SharedStateNext<ValueType>,
) => void;
type StateEntry<ValueType> = {
  value?: ValueType;
  updaters: Set<StateUpdater<ValueType>>;
};

const states = new Map<string, StateEntry<any>>();
const middlewares = new Map<string, Set<SharedStateMiddleware<any>>>();

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

function setDefaultValue<ValueType>(key: string, value?: ValueType) {
  const current = getCurrentValue(key);

  if (current.value === undefined && value !== undefined) {
    updateValue<ValueType>(key, value);
  }
}

export function useSharedState<ValueType = any>(
  key: string,
  defaultValue?: ValueType,
): [ValueType | undefined, StateUpdater<ValueType>] {
  setDefaultValue<ValueType>(key, defaultValue);

  const current = getCurrentValue<ValueType>(key, defaultValue);
  const state = useState<ValueType | undefined>(current.value) as [
    ValueType,
    StateUpdater<ValueType>
  ];

  current.updaters.add(state[1]);

  return [current.value, getStateUpdater<ValueType>(key)];
}

function resolveMiddlewares<ValueType>(key: string, value: ValueType) {
  const m = middlewares.get(key);

  if (!m) {
    return value;
  }

  let newValue: ValueType = value;

  function updateValue(value: ValueType) {
    newValue = value;
  }

  m.forEach(middleware => {
    middleware(newValue, updateValue);
  });

  return newValue;
}

function updateValue<ValueType = any>(key: string, value: ValueType) {
  const current = getCurrentValue<ValueType>(key);

  if (current.value === value) {
    return;
  }

  current.value = resolveMiddlewares<ValueType>(key, value);
}

function emitUpdate<ValueType = any>(key: string) {
  const current = getCurrentValue<ValueType>(key);

  current.updaters.forEach(listener => {
    listener(current.value);
  });
}

export function update<ValueType = any>(key: string, value: ValueType) {
  updateValue<ValueType>(key, value);
  emitUpdate<ValueType>(key);
}

export function registerMiddleware<ValueType = any>(
  key: string,
  middleware: SharedStateMiddleware<ValueType>,
) {
  const m = middlewares.get(key) || new Set<SharedStateMiddleware<ValueType>>();

  m.add(middleware);
  middlewares.set(key, m);
}

export function removeMiddleware<ValueType = any>(
  key: string,
  middleware: SharedStateMiddleware<ValueType>,
) {
  const m = middlewares.get(key);

  if (m) {
    m.delete(middleware);
  }
}
