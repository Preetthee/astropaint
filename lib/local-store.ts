'use client'

import { useSyncExternalStore } from 'react'

type Listener = () => void

export interface LocalStore<T> {
  get: () => T
  set: (updater: T | ((prev: T) => T)) => void
  subscribe: (listener: Listener) => () => void
  reset: () => void
  defaultValue: T
}

/**
 * Tiny localStorage-backed store compatible with useSyncExternalStore.
 * The parsed value is cached so snapshots stay referentially stable.
 */
export function createLocalStore<T extends object>(key: string, defaultValue: T): LocalStore<T> {
  const listeners = new Set<Listener>()
  let cache: T | undefined

  const read = (): T => {
    if (cache) return cache
    if (typeof window === 'undefined') return defaultValue
    try {
      const raw = window.localStorage.getItem(key)
      cache = raw ? { ...defaultValue, ...(JSON.parse(raw) as T) } : defaultValue
    } catch {
      cache = defaultValue
    }
    return cache
  }

  const emit = () => listeners.forEach((l) => l())

  const store: LocalStore<T> = {
    defaultValue,
    get: read,
    set(updater) {
      const next =
        typeof updater === 'function' ? (updater as (prev: T) => T)(read()) : updater
      cache = next
      try {
        window.localStorage.setItem(key, JSON.stringify(next))
      } catch {
        // Storage may be full or disabled (private mode); keep the in-memory value.
      }
      emit()
    },
    subscribe(listener) {
      listeners.add(listener)
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) {
          cache = undefined
          listener()
        }
      }
      window.addEventListener('storage', onStorage)
      return () => {
        listeners.delete(listener)
        window.removeEventListener('storage', onStorage)
      }
    },
    reset() {
      cache = defaultValue
      try {
        window.localStorage.removeItem(key)
      } catch {}
      emit()
    },
  }
  return store
}

export function useLocalStore<T extends object>(store: LocalStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, () => store.defaultValue)
}

const noopSubscribe = () => () => {}
/** True only after hydration on the client. */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
}
