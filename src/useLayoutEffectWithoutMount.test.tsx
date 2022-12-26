import '@testing-library/jest-dom'
import { render, act, screen } from '@testing-library/react'
import React, { useLayoutEffect, useState } from 'react'
import { useLayoutEffectWithoutMount } from './useLayoutEffectWithoutMount'

describe('useLayoutEffectWithoutMount', () => {
  it('uses React 18', () => {
    let numbersOfFired = 0

    const Component = () => {
      useLayoutEffect(() => {
        numbersOfFired += 1
      }, [])

      return <div></div>
    }

    render(
      <React.StrictMode>
        <Component></Component>
      </React.StrictMode>,
    )

    expect(numbersOfFired).toBe(2)
  })

  it('runs zero times on mount', () => {
    let numbersOfFired = 0

    const Component = () => {
      useLayoutEffectWithoutMount(() => {
        numbersOfFired += 1
      }, [])

      return <div></div>
    }

    render(
      <React.StrictMode>
        <Component></Component>
      </React.StrictMode>,
    )

    expect(numbersOfFired).toBe(0)
  })

  it('runs once with new state', () => {
    let numbersOfFired = 0

    const Component = () => {
      const [number, setNumber] = useState(0)

      useLayoutEffectWithoutMount(() => {
        numbersOfFired += 1
      }, [number])

      return (
        <button type="button" onClick={() => setNumber((oldNumber) => oldNumber + 1)}>
          Increase the number
        </button>
      )
    }

    render(
      <React.StrictMode>
        <Component></Component>
      </React.StrictMode>,
    )

    act(() => {
      screen.queryByRole('button')?.click()
    })

    expect(numbersOfFired).toBe(1)
  })
})
