import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]); // Robot moves 200px down on scroll

  return (
    <div className="min-h-screen bg-dark text-white">
      <Head>
        <title>CryptoVerse</title>
        <meta name="description" content="A futuristic cryptocurrency project" />
      </Head>

      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 w-full bg-dark/80 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex space-x-8 py-4">
            {['Home', 'About', 'Token', 'Roadmap', 'Contact'].map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="text-white hover:text-green-500 transition-colors duration-300"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center flex-col text-center pt-16">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to <span className="text-green-500">CryptoVerse</span>
        </motion.h1>
        <p className="text-lg md:text-xl max-w-2xl mb-6">
          A next-generation cryptocurrency powering the future of decentralized finance.
        </p>
        <Button className="bg-green-500 text-dark hover:bg-green-400 transition-colors">
          Learn More
        </Button>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-dark-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl font-bold mb-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            About Us
          </motion.h2>
          <p className="text-lg max-w-3xl mx-auto text-center">
            CryptoVerse is built on cutting-edge blockchain technology, delivering fast, secure, and scalable solutions for the DeFi ecosystem.
          </p>
        </div>
      </section>

      {/* Scroll-Following Robot */}
      <motion.div
        style={{ y }}
        className="fixed bottom-10 right-10 w-16 h-16 z-20"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <svg className="w-full h-full text-green-500 glow" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a5 5 0 015 5v2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v2h6V7a3 3 0 00-3-3zm-3 7a2 2 0 00-2 2v2h2v-2zm6 0a2 2 0 00-2 2v2h2v-2z" />
        </svg>
      </motion.div>
    </div>
  );
}