import { EffectCallback, DependencyList, useRef, useLayoutEffect, useEffect } from 'react'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function useLayoutEffectWithoutMount(effect: EffectCallback, deps?: DependencyList) {
  const mountedRef = useRef(false)
  const currentMounted = mountedRef.current

  useIsomorphicLayoutEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
    }
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (currentMounted) {
      return effect()
    }
  }, deps)
}
