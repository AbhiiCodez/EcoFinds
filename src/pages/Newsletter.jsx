import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, CheckCircle, Leaf } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setIsSubscribed(true)
    setEmail('')
  }

  const benefits = [
    'Exclusive eco-friendly product alerts',
    'Early access to new arrivals',
    'Special discounts for subscribers',
    'Weekly sustainability tips',
    'Community updates and news'
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }} />
      </div>
      
      <motion.div
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
      />
      <motion.div
        animate={{ y: [20, -20, 20] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Stay in the Loop
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Get the latest updates on sustainable products, eco-friendly tips, and exclusive deals delivered to your inbox.
            </p>
          </motion.div>

          {/* Newsletter Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-white/90 border-white/20 focus:ring-white/50"
                    icon={<Mail className="w-5 h-5" />}
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    size="lg"
                    loading={isLoading}
                    disabled={!email || isLoading}
                    icon={<Send className="w-5 h-5" />}
                    className="px-8"
                  >
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto"
              >
                <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  Welcome to the Community!
                </h3>
                <p className="text-primary-100">
                  Thank you for subscribing. Check your email for a confirmation link.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Benefits List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="flex items-center space-x-3 text-left"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Leaf className="w-3 h-3 text-white" />
                </div>
                <span className="text-primary-100 font-medium">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 pt-8 border-t border-white/20"
          >
            <p className="text-primary-200 text-sm">
              Join 10,000+ eco-conscious subscribers. No spam, unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export { Newsletter }
