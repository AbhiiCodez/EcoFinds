import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const Badge = React.forwardRef(({ 
  className, 
  variant = 'default',
  size = 'default',
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-primary-100 text-primary-800 border-primary-200",
    secondary: "bg-neutral-100 text-neutral-800 border-neutral-200",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
    eco: "bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-800 border-primary-200",
    glass: "glass text-primary-700 border-primary-200/50"
  }
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  }
  
  return (
    <motion.span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border font-medium transition-all duration-300",
        variants[variant],
        sizes[size],
        className
      )}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.span>
  )
})

Badge.displayName = "Badge"

export { Badge }
