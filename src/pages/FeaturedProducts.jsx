import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Filter, Grid, List } from 'lucide-react'
import { ProductCard } from '../components/ui/ProductCard'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useFeaturedProducts } from '../hooks/useProducts.jsx'
import { useCart } from '../hooks/useCart.jsx'
import { cn } from '../lib/utils'

const FeaturedProducts = () => {
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  // Use real data from API
  const { products, loading, error } = useFeaturedProducts(12)
  const { addToCart } = useCart()

  // Transform API data to match component expectations
  const transformedProducts = products.map(product => ({
    id: product.id,
    name: product.title,
    price: product.price,
    originalPrice: product.original_price,
    image: product.image_urls?.[0] || 'https://images.unsplash.com/photo-1551028719-001c4b5e2074?w=400&h=400&fit=crop',
    category: product.category_name,
    rating: 4.5, // Default rating since we don't have reviews yet
    reviewCount: 0,
    condition: product.condition,
    seller: { name: product.seller_name },
    isEcoFriendly: product.is_eco_friendly,
    timeLeft: '7 days left', // Default time left
    discount: product.original_price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0
  }))

  const categories = [
    { id: 'all', name: 'All Products', count: transformedProducts.length },
    { id: 'Fashion & Accessories', name: 'Fashion', count: transformedProducts.filter(p => p.category === 'Fashion & Accessories').length },
    { id: 'Furniture & Home', name: 'Furniture', count: transformedProducts.filter(p => p.category === 'Furniture & Home').length },
    { id: 'Home & Garden', name: 'Home & Garden', count: transformedProducts.filter(p => p.category === 'Home & Garden').length },
    { id: 'Electronics', name: 'Electronics', count: transformedProducts.filter(p => p.category === 'Electronics').length },
  ]

  const filteredProducts = selectedCategory === 'all' 
    ? transformedProducts 
    : transformedProducts.filter(product => product.category === selectedCategory)

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId, 1)
    if (result.success) {
      // Show success message or notification
      console.log('Added to cart successfully!')
    }
  }

  const handleViewDetails = (productId) => {
    console.log('View details:', productId)
    // Navigate to product detail page
  }

  const handleToggleFavorite = (productId) => {
    console.log('Toggle favorite:', productId)
    // Implement favorite functionality
  }

  return (
    <section className="py-20 bg-white/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-eco mb-6">
            Featured Products
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Discover amazing pre-loved treasures that are good for you and the planet
          </p>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6"
        >
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'eco' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-2"
              >
                <span>{category.name}</span>
                <Badge variant="secondary" size="sm">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              icon={<Filter className="w-4 h-4" />}
            >
              Filter
            </Button>
            <div className="flex border border-neutral-200 rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'eco' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'eco' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={cn(
            "grid gap-6",
            viewMode === 'grid' 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1 max-w-4xl mx-auto"
          )}
        >
          {loading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/70 rounded-2xl p-4 animate-pulse"
              >
                <div className="aspect-square bg-neutral-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-neutral-200 rounded"></div>
              </motion.div>
            ))
          ) : error ? (
            // Error state
            <div className="col-span-full text-center py-12">
              <div className="text-red-500 text-lg mb-4">Failed to load products</div>
              <p className="text-neutral-600">{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            // Empty state
            <div className="col-span-full text-center py-12">
              <div className="text-neutral-500 text-lg mb-4">No products found</div>
              <p className="text-neutral-600">Try adjusting your filters or check back later</p>
            </div>
          ) : (
            // Products
            filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onViewDetails={handleViewDetails}
                  onToggleFavorite={handleToggleFavorite}
                  className={viewMode === 'list' ? 'flex' : ''}
                />
              </motion.div>
            ))
          )}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            className="px-8"
          >
            View All Products
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export { FeaturedProducts }
