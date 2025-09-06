import React from 'react'
import { motion } from 'framer-motion'
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { Button } from '../ui/Button'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Our Mission', href: '#mission' },
      { name: 'Sustainability', href: '#sustainability' },
      { name: 'Careers', href: '#careers' },
    ],
    support: [
      { name: 'Help Center', href: '#help' },
      { name: 'Contact Us', href: '#contact' },
      { name: 'Shipping Info', href: '#shipping' },
      { name: 'Returns', href: '#returns' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'Accessibility', href: '#accessibility' },
    ],
  }

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#facebook' },
    { name: 'Twitter', icon: Twitter, href: '#twitter' },
    { name: 'Instagram', icon: Instagram, href: '#instagram' },
    { name: 'LinkedIn', icon: Linkedin, href: '#linkedin' },
  ]

  return (
    <footer className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">EcoFinds</span>
            </div>
            <p className="text-neutral-300 mb-6 leading-relaxed">
              Your sustainable marketplace for second-hand treasures. 
              Join us in creating a greener future through conscious consumption.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-neutral-300">
                <Mail className="w-4 h-4 text-primary-400" />
                <span>hello@ecofinds.com</span>
              </div>
              <div className="flex items-center space-x-3 text-neutral-300">
                <Phone className="w-4 h-4 text-primary-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-neutral-300">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-4 capitalize text-primary-400">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      className="text-neutral-300 hover:text-primary-400 transition-colors duration-300"
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-neutral-700"
        >
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
            <p className="text-neutral-300 mb-6">
              Get the latest eco-friendly products and sustainability tips delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 placeholder-neutral-400"
              />
              <Button variant="eco" size="default">
                Subscribe
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Social Links & Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-neutral-700 flex flex-col sm:flex-row justify-between items-center"
        >
          <div className="flex space-x-4 mb-4 sm:mb-0">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                className="p-2 bg-neutral-800 hover:bg-primary-600 rounded-lg transition-colors duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
          <p className="text-neutral-400 text-sm">
            © {currentYear} EcoFinds. All rights reserved. Made with 🌱 for the planet.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export { Footer }
