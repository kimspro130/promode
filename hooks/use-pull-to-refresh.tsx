import { useState, useEffect, useRef, useCallback } from 'react'

interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void
  threshold?: number
  resistance?: number
  enabled?: boolean
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  enabled = true
}: PullToRefreshOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [startY, setStartY] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled || isRefreshing) return
    
    const container = containerRef.current
    if (!container || container.scrollTop > 0) return

    setStartY(e.touches[0].clientY)
    setIsPulling(true)
  }, [enabled, isRefreshing])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling || !enabled || isRefreshing) return

    const currentY = e.touches[0].clientY
    const distance = Math.max(0, (currentY - startY) / resistance)
    
    if (distance > 0) {
      e.preventDefault()
      setPullDistance(distance)
    }
  }, [isPulling, enabled, isRefreshing, startY, resistance])

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || !enabled) return

    setIsPulling(false)

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } catch (error) {
        console.error('Refresh failed:', error)
      } finally {
        setIsRefreshing(false)
      }
    }

    setPullDistance(0)
  }, [isPulling, enabled, pullDistance, threshold, isRefreshing, onRefresh])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  const refreshIndicatorStyle = {
    transform: `translateY(${Math.min(pullDistance, threshold)}px)`,
    opacity: Math.min(pullDistance / threshold, 1),
    transition: isPulling ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out'
  }

  return {
    containerRef,
    isRefreshing,
    pullDistance,
    isPulling,
    refreshIndicatorStyle,
    isThresholdReached: pullDistance >= threshold
  }
}
