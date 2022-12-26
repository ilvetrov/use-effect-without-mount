# useEffectWithoutMount

React Hook useEffect without running on mount.

:boom: **Compatible with React 18.** And below and adove.

## Usage

Just use like default `useEffect`.

```tsx
import { useEffectWithoutMount } from './useEffectWithoutMount'

useEffectWithoutMount(() => {
  // your code
}, [yourDeps])
```

Even when React starts preserving state after a remount, `useEffectWithoutMount` will **not** run on every mount.

There is also `useLayoutEffectWithoutMount`:

```tsx
import { useLayoutEffectWithoutMount } from './useEffectWithoutMount'
```

## How it works?

- React 18 does **not** remount and mount your components in development mode.

- React 18 only destroys your useEffect and useLayoutEffect and creates them again. Nothing more.

And since all the data in one render is immutable, we can look at it to check if there was another render and that out render is not mounting render.

```tsx
import { useEffect, EffectCallback, DependencyList, useRef } from 'react'

export function useEffectWithoutMount(effect: EffectCallback, deps?: DependencyList) {
  const mountedRef = useRef(false)
  // It's the key to solve our problem
  const currentMounted = mountedRef.current

  useEffect(() => {
    mountedRef.current = true

    return () => {
      // Today we don't need it, but in the future of React — we will need.
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (currentMounted) {
      return effect()
    }
  }, deps)
}
```

1. Before running the top `useEffect` `mountedRef` is `false`.
1. Then `currentMounted` is `false` and preserves `false` for the lifetime of the current render.
1. The top `useEffect` sets `mountedRef` to `true` for the next renders.
1. Even after recreating `useEffect` in React 18 the state is preserved and `currentMounted` equals `false`
1. Our bottom `useEffect` looks at `currentMounted`, sees `false` and does not run our `effect()`.
1. On the next renders, `mountedRef` is `true`, so `currentMounted` is also `true`.
1. **Our bottom `useEffect` looks at `currentMounted`, sees `true` and run our `effect()`.**
1. For the future of React, `return () => {...` sets `mountedRef` to `false` for the next mount.

So our bottom `useEffect` will only work on the next renders (not the first "mounting render") and even in the future of React.

## My Links

- [GitHub](https://github.com/ilvetrov)
- [Telegram](https://t.me/ilvetrov)
- [contact@ilve.site](mailto:contact@ilve.site)