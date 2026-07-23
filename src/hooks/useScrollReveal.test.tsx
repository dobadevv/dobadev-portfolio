import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { useScrollReveal } from './useScrollReveal'

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  callback: IntersectionObserverCallback
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)
  }
}

function TestComponent() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()
  return <div ref={ref}>{isVisible ? 'visible' : 'hidden'}</div>
}

beforeEach(() => {
  MockIntersectionObserver.instances = []
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

describe('useScrollReveal', () => {
  it('is hidden before the observed element intersects', () => {
    render(<TestComponent />)
    expect(screen.getByText('hidden')).toBeInTheDocument()
  })

  it('becomes visible once the IntersectionObserver reports an intersection', () => {
    render(<TestComponent />)
    const instance = MockIntersectionObserver.instances[0]

    act(() => {
      instance.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        instance as unknown as IntersectionObserver,
      )
    })

    expect(screen.getByText('visible')).toBeInTheDocument()
  })

  it('disconnects the observer once visible', () => {
    render(<TestComponent />)
    const instance = MockIntersectionObserver.instances[0]

    act(() => {
      instance.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        instance as unknown as IntersectionObserver,
      )
    })

    expect(instance.disconnect).toHaveBeenCalledTimes(1)
  })
})
