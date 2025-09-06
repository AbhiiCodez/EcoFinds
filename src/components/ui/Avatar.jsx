import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const Avatar = React.forwardRef(({ 
  className, 
  size = 'default',
  src,
  alt,
  fallback,
  children,
  ...props 
}, ref) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    default: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
    "2xl": "w-20 h-20 text-xl"
  }
  
  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative flex items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-secondary-600 text-white font-medium overflow-hidden",
        sizes[size],
        className
      )}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-semibold">
          {fallback || children}
        </span>
      )}
    </motion.div>
  )
})

Avatar.displayName = "Avatar"

const AvatarGroup = React.forwardRef(({ 
  className, 
  children,
  max = 3,
  ...props 
}, ref) => {
  const childrenArray = React.Children.toArray(children)
  const visibleChildren = childrenArray.slice(0, max)
  const remainingCount = childrenArray.length - max
  
  return (
    <div
      ref={ref}
      className={cn("flex -space-x-2", className)}
      {...props}
    >
      {visibleChildren.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="ring-2 ring-white"
        >
          {child}
        </motion.div>
      ))}
      
      {remainingCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: visibleChildren.length * 0.1 }}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 text-neutral-600 text-sm font-medium ring-2 ring-white"
        >
          +{remainingCount}
        </motion.div>
      )}
    </div>
  )
})

AvatarGroup.displayName = "AvatarGroup"

export { Avatar, AvatarGroup }
