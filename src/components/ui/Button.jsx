import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'default', 
  children, 
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "btn-primary focus:ring-primary-500",
    secondary: "btn-secondary focus:ring-primary-500",
    ghost: "btn-ghost focus:ring-primary-500",
    outline: "border border-primary-300 text-primary-700 hover:bg-primary-50 focus:ring-primary-500",
    glass: "glass text-primary-700 hover:bg-white/20 focus:ring-primary-500",
    eco: "bg-gradient-to-r from-primary-500 to-secondary-600 text-white hover:from-primary-600 hover:to-secondary-700 focus:ring-primary-500 shadow-eco hover:shadow-eco-lg"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    default: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-xl",
    xl: "px-10 py-5 text-xl rounded-2xl"
  }
  
  const iconSizes = {
    sm: "w-4 h-4",
    default: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-7 h-7"
  }
  
  return (
    <motion.button
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {loading && (
        <motion.div
          className={cn("mr-2", iconSizes[size])}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </motion.div>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className={cn("mr-2", iconSizes[size])}>
          {icon}
        </span>
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className={cn("ml-2", iconSizes[size])}>
          {icon}
        </span>
      )}
    </motion.button>
  )
})

Button.displayName = "Button"

export { Button }
