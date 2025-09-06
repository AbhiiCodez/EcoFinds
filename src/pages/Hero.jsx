import React from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowRight, Leaf, Recycle, Heart } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

const Hero = () => {
  const stats = [
    { number: '10K+', label: 'Products Sold', icon: Recycle },
    { number: '5K+', label: 'Happy Customers', icon: Heart },
    { number: '50+', label: 'Categories', icon: Leaf },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
      <div className="absolute inset-0 opacity-40">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }} />
      </div>
      
      {/* Floating Elements */}
      <motion.div
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-20 h-20 bg-primary-200/30 rounded-full blur-xl"
      />
      <motion.div
        animate={{ y: [20, -20, 20] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 right-20 w-32 h-32 bg-secondary-200/30 rounded-full blur-xl"
      />
      <motion.div
        animate={{ y: [-15, 15, -15] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-1/4 w-24 h-24 bg-primary-300/20 rounded-full blur-xl"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-gradient-eco">Sustainable</span>
              <br />
              <span className="text-neutral-900">Second-Hand</span>
              <br />
              <span className="text-gradient-eco">Marketplace</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover amazing pre-loved treasures while making a positive impact on the planet. 
              Join our community of conscious consumers.
            </motion.p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Search for sustainable products..."
                  className="w-full text-lg py-4 pl-6 pr-4"
                  icon={<Search className="w-6 h-6" />}
                />
              </div>
              <Button
                variant="eco"
                size="lg"
                className="w-full sm:w-auto px-8 py-4 text-lg"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Search
              </Button>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button
              variant="eco"
              size="xl"
              className="text-lg px-8 py-4"
              icon={<Recycle className="w-6 h-6" />}
            >
              Start Shopping
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="text-lg px-8 py-4"
            >
              Sell Your Items
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gradient-eco mb-2">
                  {stat.number}
                </div>
                <div className="text-neutral-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

    </section>
  )
}

export { Hero }
