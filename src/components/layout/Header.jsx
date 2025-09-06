import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search, ShoppingCart, Heart, User, Leaf } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useCart } from '../../hooks/useCart.jsx'
import { cn } from '../../lib/utils'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, isAuthenticated, logout } = useAuth()
  const { count: cartCount } = useCart()

  const navigation = [
    { name: 'Home', href: '#home' },
    { name: 'Products', href: '#products' },
    { name: 'Categories', href: '#categories' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient-eco">EcoFinds</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-neutral-700 hover:text-primary-600 font-medium transition-colors duration-300"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {item.name}
              </motion.a>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <Input
              type="text"
              placeholder="Search sustainable products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-neutral-600 hover:text-primary-600 transition-colors duration-300"
            >
              <Heart className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-neutral-600 hover:text-primary-600 transition-colors duration-300 relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </motion.button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-neutral-600">Hi, {user?.first_name}</span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" icon={<User className="w-4 h-4" />}>
                Login
              </Button>
            )}

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 text-neutral-600 hover:text-primary-600 transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-white/20 bg-white/90 backdrop-blur-md"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Mobile Search */}
                <div className="px-3 py-2">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<Search className="w-5 h-5" />}
                    className="w-full"
                  />
                </div>
                
                {navigation.map((item) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {item.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export { Header }
