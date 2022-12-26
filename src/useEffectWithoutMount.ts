import { useEffect, EffectCallback, DependencyList, useRef } from 'react'

export function useEffectWithoutMount(effect: EffectCallback, deps?: DependencyList) {
  const mountedRef = useRef(false)
  const currentMounted = mountedRef.current

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (currentMounted) {
      return effect()
    }
  }, deps)
}
