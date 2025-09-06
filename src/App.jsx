import React from 'react'
import { motion } from 'framer-motion'
import { AuthProvider } from './hooks/useAuth.jsx'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Hero } from './pages/Hero'
import { FeaturedProducts } from './pages/FeaturedProducts'
import { Categories } from './pages/Categories'
import { WhyChooseUs } from './pages/WhyChooseUs'
import { Newsletter } from './pages/Newsletter'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-eco-subtle">
        <Header />
        
        <main>
          <Hero />
          <FeaturedProducts />
          <Categories />
          <WhyChooseUs />
          <Newsletter />
        </main>
        
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
