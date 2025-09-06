import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const Input = React.forwardRef(({ 
  className, 
  type = 'text', 
  variant = 'default',
  icon,
  iconPosition = 'left',
  error,
  ...props 
}, ref) => {
  const variants = {
    default: "input-modern",
    glass: "input-glass",
    minimal: "w-full px-3 py-2 bg-transparent border-b border-neutral-300 focus:border-primary-500 transition-colors duration-300",
    eco: "w-full px-4 py-3 bg-primary-50/50 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
  }
  
  const iconSizes = "w-5 h-5"
  
  return (
    <div className="relative">
      {icon && iconPosition === 'left' && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
          {React.cloneElement(icon, { className: iconSizes })}
        </div>
      )}
      
      <motion.input
        ref={ref}
        type={type}
        className={cn(
          variants[variant],
          icon && iconPosition === 'left' && "pl-10",
          icon && iconPosition === 'right' && "pr-10",
          error && "border-red-500 focus:ring-red-500 focus:border-red-500",
          className
        )}
        whileFocus={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      />
      
      {icon && iconPosition === 'right' && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
          {React.cloneElement(icon, { className: iconSizes })}
        </div>
      )}
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
})

Input.displayName = "Input"

const Textarea = React.forwardRef(({ 
  className, 
  variant = 'default',
  error,
  ...props 
}, ref) => {
  const variants = {
    default: "input-modern min-h-[80px] resize-none",
    glass: "input-glass min-h-[80px] resize-none",
    minimal: "w-full px-3 py-2 bg-transparent border-b border-neutral-300 focus:border-primary-500 transition-colors duration-300 min-h-[80px] resize-none",
    eco: "w-full px-4 py-3 bg-primary-50/50 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 min-h-[80px] resize-none"
  }
  
  return (
    <div className="relative">
      <motion.textarea
        ref={ref}
        className={cn(
          variants[variant],
          error && "border-red-500 focus:ring-red-500 focus:border-red-500",
          className
        )}
        whileFocus={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      />
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
})

Textarea.displayName = "Textarea"

export { Input, Textarea }
