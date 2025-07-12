"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

// Progress indicators (currently unused but kept for future use)
// const getProgressEmoji = (percentage: number): string => {
//   if (percentage <= 15) return "🌱" // Just started
//   if (percentage <= 30) return "🚶‍♂️" // Walking
//   if (percentage <= 50) return "🏃‍♂️" // Running
//   if (percentage <= 70) return "💪" // Getting stronger
//   if (percentage <= 85) return "🔥" // On fire
//   if (percentage <= 97) return "🚀" // Almost there
//   return "🎉" // Completed!
// }

// const getProgressText = (percentage: number): string => {
//   if (percentage <= 10) return "刚开始"
//   if (percentage <= 25) return "起步中"
//   if (percentage <= 40) return "渐入佳境"
//   if (percentage <= 60) return "专注阅读"
//   if (percentage <= 80) return "马不停蹄"
//   if (percentage <= 95) return "即将完成"
//   return "阅读完成!"
// }

interface SimpleReadingProgressProps {
  targetSelector?: string // CSS selector for the target element
  className?: string
  showPercentage?: boolean
}

export default function SimpleReadingProgress({ 
  targetSelector = '.prose-stone', // Default to article content
  className
}: SimpleReadingProgressProps) {
  const progressBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const calculateProgress = () => {
      const targetElement = document.querySelector(targetSelector)
      if (!targetElement) return

      const rect = targetElement.getBoundingClientRect()
      const elementTop = rect.top + window.scrollY
      const elementHeight = rect.height
      const windowHeight = window.innerHeight
      const scrollTop = window.scrollY

      // Calculate when element starts entering viewport to when it completely leaves
      const startOffset = elementTop
      const endOffset = elementTop + elementHeight - windowHeight

      let progressValue = 0

      if (scrollTop <= startOffset) {
        // Before element enters viewport
        progressValue = 0
      } else if (scrollTop >= endOffset) {
        // After element completely leaves viewport
        progressValue = 1
      } else {
        // Element is in viewport - calculate progress
        progressValue = (scrollTop - startOffset) / (endOffset - startOffset)
      }

      // Clamp between 0 and 1
      progressValue = Math.max(0, Math.min(1, progressValue))

      // Update CSS custom property for smooth animation
      if (progressBarRef.current) {
        progressBarRef.current.style.setProperty('--progress', `${progressValue * 100}%`)
      }
    }

    // Initial calculation
    calculateProgress()

    // Add scroll listener with throttling for performance
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          calculateProgress()
          ticking = false
        })
        ticking = true
      }
    }

    // Add resize listener to recalculate on window resize
    const handleResize = () => {
      setTimeout(calculateProgress, 100) // Small delay to ensure layout is updated
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [targetSelector])

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 h-1 bg-white/10 backdrop-blur-sm",
      className
    )}>
      {/* Thermometer-style progress bar with connected bubble */}
      <div className="relative h-full">
        {/* Main progress bar with embedded bubble */}
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-[#e04b45] to-[#ff7b54] rounded-l-full transition-all duration-300 ease-out relative"
          style={{
            width: 'var(--progress, 0%)',
            boxShadow: '0 2px 8px rgba(224, 75, 69, 0.3)',
            borderTopRightRadius: '9999px',
            borderBottomRightRadius: '9999px'
          }}
        >
        </div>
      </div>
    </div>
  )
}

// Alternative version that tracks specific element by ref
export function SimpleReadingProgressWithRef({ 
  targetRef, 
  className
}: {
  targetRef: React.RefObject<HTMLElement>
  className?: string
}) {
  const progressBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const calculateProgress = () => {
      if (!targetRef.current) return

      const rect = targetRef.current.getBoundingClientRect()
      const elementTop = rect.top + window.scrollY
      const elementHeight = rect.height
      const windowHeight = window.innerHeight
      const scrollTop = window.scrollY

      const startOffset = elementTop
      const endOffset = elementTop + elementHeight - windowHeight

      let progressValue = 0

      if (scrollTop <= startOffset) {
        progressValue = 0
      } else if (scrollTop >= endOffset) {
        progressValue = 1
      } else {
        progressValue = (scrollTop - startOffset) / (endOffset - startOffset)
      }

      progressValue = Math.max(0, Math.min(1, progressValue))

      if (progressBarRef.current) {
        progressBarRef.current.style.setProperty('--progress', `${progressValue * 100}%`)
      }
    }

    calculateProgress()

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          calculateProgress()
          ticking = false
        })
        ticking = true
      }
    }

    const handleResize = () => {
      setTimeout(calculateProgress, 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [targetRef])

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 h-1 bg-white/10 backdrop-blur-sm",
      className
    )}>
      {/* Thermometer-style progress bar with connected bubble */}
      <div className="relative h-full">
        {/* Main progress bar with embedded bubble */}
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-[#e04b45] to-[#ff7b54] rounded-l-full transition-all duration-300 ease-out relative"
          style={{
            width: 'var(--progress, 0%)',
            boxShadow: '0 2px 8px rgba(224, 75, 69, 0.3)',
            borderTopRightRadius: '9999px',
            borderBottomRightRadius: '9999px'
          }}
        >
        </div>
      </div>
    </div>
  )
}