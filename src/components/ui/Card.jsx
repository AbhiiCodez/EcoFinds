import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const Card = React.forwardRef(({ 
  className, 
  variant = 'default',
  hover = true,
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "card-modern",
    glass: "card-glass",
    eco: "bg-gradient-to-br from-white/90 via-primary-50/50 to-secondary-50/50 border border-primary-200/50 shadow-eco",
    minimal: "bg-white/50 border border-neutral-200/50 shadow-sm",
    elevated: "bg-white shadow-lg border border-neutral-200/50"
  }
  
  return (
    <motion.div
      ref={ref}
      className={cn(
        "rounded-2xl transition-all duration-300",
        variants[variant],
        hover && "hover-lift",
        className
      )}
      whileHover={hover ? { y: -2 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.div>
  )
})

Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight text-gradient-eco", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-neutral-600", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
