import React from 'react'
import { motion } from 'framer-motion'
import { 
  Leaf, 
  Shield, 
  Truck, 
  Heart, 
  Recycle, 
  Users, 
  Award, 
  Clock,
  CheckCircle
} from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

const WhyChooseUs = () => {
  const features = [
    {
      icon: Leaf,
      title: '100% Sustainable',
      description: 'Every product is verified for eco-friendliness and sustainability practices.',
      color: 'from-green-400 to-emerald-600'
    },
    {
      icon: Shield,
      title: 'Quality Guaranteed',
      description: 'All items are carefully inspected and come with our quality guarantee.',
      color: 'from-blue-400 to-indigo-600'
    },
    {
      icon: Truck,
      title: 'Carbon-Neutral Shipping',
      description: 'We offset all shipping emissions to keep our planet green.',
      color: 'from-purple-400 to-violet-600'
    },
    {
      icon: Heart,
      title: 'Community Impact',
      description: 'Support local sellers and contribute to the circular economy.',
      color: 'from-pink-400 to-rose-600'
    },
    {
      icon: Recycle,
      title: 'Circular Economy',
      description: 'Give items a second life and reduce waste in landfills.',
      color: 'from-amber-400 to-orange-600'
    },
    {
      icon: Users,
      title: 'Trusted Community',
      description: 'Join thousands of conscious consumers making a difference.',
      color: 'from-cyan-400 to-teal-600'
    }
  ]

  const stats = [
    { number: '50K+', label: 'Items Saved from Landfills', icon: Recycle },
    { number: '25K+', label: 'Happy Customers', icon: Heart },
    { number: '99%', label: 'Customer Satisfaction', icon: Award },
    { number: '24/7', label: 'Customer Support', icon: Clock }
  ]

  const benefits = [
    'Reduce your carbon footprint',
    'Save money on quality items',
    'Support sustainable practices',
    'Join a conscious community',
    'Get exclusive eco-friendly deals',
    'Contribute to circular economy'
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-eco mb-6">
            Why Choose EcoFinds?
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            We're more than just a marketplace. We're a movement towards a more sustainable future.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card variant="minimal" className="h-full text-center group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-primary-500 to-secondary-600 rounded-3xl p-8 md:p-12 mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Impact in Numbers
            </h3>
            <p className="text-primary-100 text-lg">
              Together, we're making a real difference for our planet
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-100 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold text-neutral-900 mb-6">
              Join the Sustainable Revolution
            </h3>
            <p className="text-lg text-neutral-600 mb-8">
              When you shop with EcoFinds, you're not just buying products – you're investing in a better future for our planet.
            </p>
            
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  <span className="text-neutral-700">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="eco" size="lg">
                Start Shopping Now
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop"
                alt="Sustainable lifestyle"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 w-20 h-20 bg-primary-200/30 rounded-full blur-xl"
            />
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 w-24 h-24 bg-secondary-200/30 rounded-full blur-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export { WhyChooseUs }
