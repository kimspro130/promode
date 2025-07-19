import { useState, useEffect, useRef } from 'react'

interface SwipeInput {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
}

interface TouchPosition {
  x: number
  y: number
}

export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50
}: SwipeInput) {
  const [touchStart, setTouchStart] = useState<TouchPosition | null>(null)
  const [touchEnd, setTouchEnd] = useState<TouchPosition | null>(null)

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isLeftSwipe = distanceX > threshold
    const isRightSwipe = distanceX < -threshold
    const isUpSwipe = distanceY > threshold
    const isDownSwipe = distanceY < -threshold

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      // Horizontal swipe
      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft()
      }
      if (isRightSwipe && onSwipeRight) {
        onSwipeRight()
      }
    } else {
      // Vertical swipe
      if (isUpSwipe && onSwipeUp) {
        onSwipeUp()
      }
      if (isDownSwipe && onSwipeDown) {
        onSwipeDown()
      }
    }
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  }
}

// Hook for adding swipe functionality to a ref element
export function useSwipeRef<T extends HTMLElement>({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50
}: SwipeInput) {
  const ref = useRef<T>(null)
  
  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe({
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold
  })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    element.addEventListener('touchstart', onTouchStart, { passive: true })
    element.addEventListener('touchmove', onTouchMove, { passive: true })
    element.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', onTouchStart)
      element.removeEventListener('touchmove', onTouchMove)
      element.removeEventListener('touchend', onTouchEnd)
    }
  }, [onTouchStart, onTouchMove, onTouchEnd])

  return ref
}
