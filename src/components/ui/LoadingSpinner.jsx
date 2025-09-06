import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const LoadingSpinner = ({ 
  size = 'default', 
  className,
  color = 'primary' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colors = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    white: 'text-white',
    neutral: 'text-neutral-500'
  }

  return (
    <motion.div
      className={cn(
        "inline-block",
        sizes[size],
        colors[color],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <svg
        className="w-full h-full"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </motion.div>
  )
}

const LoadingDots = ({ className }) => {
  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-primary-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  )
}

const LoadingSkeleton = ({ 
  className,
  lines = 1,
  height = 'h-4'
}) => {
  return (
    <div className={cn("animate-pulse", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "bg-neutral-200 rounded mb-2",
            height,
            index === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  )
}

export { LoadingSpinner, LoadingDots, LoadingSkeleton }
