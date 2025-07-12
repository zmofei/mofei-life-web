"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'glass' | 'minimal'
  className?: string
  text?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'default',
  className,
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }

  const variants = {
    default: 'border-white/30 border-t-white',
    glass: 'border-white/20 border-t-white/80 backdrop-blur-sm',
    minimal: 'border-gray-300 border-t-gray-600'
  }

  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2",
          sizeClasses[size],
          variants[variant]
        )}
      />
      {text && (
        <span className="text-white/80 text-sm font-medium animate-pulse">
          {text}
        </span>
      )}
    </div>
  )
}

// Glass-themed skeleton loader component
export function SkeletonLoader({ 
  className,
  children,
  isLoading = true
}: {
  className?: string
  children?: React.ReactNode
  isLoading?: boolean
}) {
  if (!isLoading && children) {
    return <>{children}</>
  }

  return (
    <div className={cn("loading-shimmer bg-white/10 rounded-lg", className)} />
  )
}

// Sophisticated loading overlay
export function LoadingOverlay({ 
  isLoading, 
  children, 
  text = "Loading..."
}: {
  isLoading: boolean
  children: React.ReactNode
  text?: string
}) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="glass-effect px-6 py-4 rounded-xl">
            <LoadingSpinner variant="glass" text={text} />
          </div>
        </div>
      )}
    </div>
  )
}