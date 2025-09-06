import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Eye, Star, Leaf, Clock } from 'lucide-react'
import { Card, CardContent, CardFooter } from './Card'
import { Button } from './Button'
import { Badge } from './Badge'
import { cn } from '../../lib/utils'

const ProductCard = ({ 
  product, 
  className,
  onAddToCart,
  onViewDetails,
  onToggleFavorite,
  isFavorite = false,
  ...props 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  const {
    id,
    name,
    price,
    originalPrice,
    image,
    category,
    rating,
    reviewCount,
    condition,
    seller,
    isEcoFriendly = true,
    timeLeft,
    discount
  } = product

  const discountPercentage = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn("group", className)}
      {...props}
    >
      <Card variant="eco" className="overflow-hidden h-full">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <motion.img
            src={image}
            alt={name}
            className={cn(
              "w-full h-full object-cover transition-all duration-500 group-hover:scale-110",
              !imageLoaded && "blur-sm"
            )}
            onLoad={() => setImageLoaded(true)}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
            <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onToggleFavorite?.(id)}
                className={cn(
                  "p-2 rounded-full backdrop-blur-sm transition-all duration-300",
                  isFavorite 
                    ? "bg-red-500 text-white" 
                    : "bg-white/80 text-neutral-600 hover:bg-red-500 hover:text-white"
                )}
              >
                <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onViewDetails?.(id)}
                className="p-2 rounded-full bg-white/80 text-neutral-600 hover:bg-primary-500 hover:text-white transition-all duration-300"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            {discountPercentage > 0 && (
              <Badge variant="error" size="sm">
                -{discountPercentage}%
              </Badge>
            )}
            {isEcoFriendly && (
              <Badge variant="eco" size="sm" className="flex items-center space-x-1">
                <Leaf className="w-3 h-3" />
                <span>Eco</span>
              </Badge>
            )}
            {timeLeft && (
              <Badge variant="warning" size="sm" className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{timeLeft}</span>
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Category */}
          <div className="mb-2">
            <Badge variant="secondary" size="sm">
              {category}
            </Badge>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-lg text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
            {name}
          </h3>

          {/* Condition */}
          <p className="text-sm text-neutral-600 mb-3">
            Condition: <span className="font-medium capitalize">{condition}</span>
          </p>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < Math.floor(rating) 
                      ? "text-yellow-400 fill-current" 
                      : "text-neutral-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-neutral-600">
              {rating} ({reviewCount} reviews)
            </span>
          </div>

          {/* Seller */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center text-white text-xs font-semibold">
              {seller?.name?.charAt(0) || 'S'}
            </div>
            <span className="text-sm text-neutral-600">
              by {seller?.name || 'Anonymous'}
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="w-full">
            {/* Price */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary-600">
                  ${price}
                </span>
                {originalPrice && (
                  <span className="text-lg text-neutral-400 line-through">
                    ${originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => onViewDetails?.(id)}
              >
                View Details
              </Button>
              <Button
                variant="eco"
                size="sm"
                className="flex-1"
                onClick={() => onAddToCart?.(id)}
                icon={<ShoppingCart className="w-4 h-4" />}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export { ProductCard }
