"use client"

import { motion, AnimatePresence } from "motion/react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export default function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname()

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 1.02
    }
  }

  const pageTransition = {
    type: "tween",
    ease: [0.4, 0, 0.2, 1], // Custom cubic-bezier for smooth feel
    duration: 0.4
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className={cn("min-h-screen", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Staggered container for animating children
export function StaggerContainer({ 
  children, 
  className,
  staggerDelay = 0.1 
}: { 
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Individual item for stagger animations
export function StaggerItem({ 
  children, 
  className,
  index = 0 
}: { 
  children: React.ReactNode
  className?: string
  index?: number
}) {
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.05 // Additional delay based on index
      }
    }
  }

  return (
    <motion.div
      variants={itemVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}