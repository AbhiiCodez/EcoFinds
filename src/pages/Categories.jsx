import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Shirt, Home, Smartphone, Book, Gamepad2, Car } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

const Categories = () => {
  const categories = [
    {
      id: 'fashion',
      name: 'Fashion & Accessories',
      description: 'Sustainable clothing, shoes, and accessories',
      icon: Shirt,
      color: 'from-pink-400 to-rose-600',
      count: '2.5K+ items',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
    },
    {
      id: 'furniture',
      name: 'Furniture & Home',
      description: 'Eco-friendly furniture and home decor',
      icon: Home,
      color: 'from-amber-400 to-orange-600',
      count: '1.8K+ items',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
    },
    {
      id: 'electronics',
      name: 'Electronics',
      description: 'Refurbished tech and gadgets',
      icon: Smartphone,
      color: 'from-blue-400 to-indigo-600',
      count: '1.2K+ items',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop'
    },
    {
      id: 'books',
      name: 'Books & Media',
      description: 'Pre-loved books, magazines, and media',
      icon: Book,
      color: 'from-purple-400 to-violet-600',
      count: '3.1K+ items',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
    },
    {
      id: 'toys',
      name: 'Toys & Games',
      description: 'Sustainable toys and board games',
      icon: Gamepad2,
      color: 'from-green-400 to-emerald-600',
      count: '890+ items',
      image: 'https://images.unsplash.com/photo-1558060370-539c4b0b0b8c?w=400&h=300&fit=crop'
    },
    {
      id: 'automotive',
      name: 'Automotive',
      description: 'Car parts and accessories',
      icon: Car,
      color: 'from-gray-400 to-slate-600',
      count: '650+ items',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-eco mb-6">
            Shop by Category
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Find exactly what you're looking for in our carefully curated categories
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card variant="eco" className="overflow-hidden h-full group cursor-pointer">
                {/* Category Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Category Icon */}
                  <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Item Count */}
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white/90 text-neutral-700 px-3 py-1 rounded-full text-sm font-medium">
                      {category.count}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-neutral-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full group-hover:bg-primary-50 group-hover:text-primary-600 transition-all duration-300"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Explore Category
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl mb-6 mx-auto">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">
              Can't find what you're looking for?
            </h3>
            <p className="text-neutral-600 mb-6">
              Browse all categories or use our advanced search to find exactly what you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="eco" size="lg">
                Browse All Categories
              </Button>
              <Button variant="outline" size="lg">
                Advanced Search
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export { Categories }
