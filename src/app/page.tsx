
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import {
  FaSearch, FaBell, FaChevronRight, FaPlay, FaUsers,
  FaClock, FaStar, FaCompass, FaGraduationCap,
  FaRegLightbulb, FaBrain, FaInfinity, FaRandom,
  FaShareAlt, FaRobot, FaHandSparkles
} from 'react-icons/fa';
import ReelsDeck from '@/components/ReelsDeck';
import { deckReels } from '@/data/deckReels';
import { EXPERT_CONFIGS } from '@/data/experts';
import { contentGenerator } from '@/lib/contentGenerator';

// Enhanced trending reels with MentorScroll branding
const trendingReels = [
  {
    id: 'mentorscroll-demo-1',
    title: '🧠 Your Brain on MentorScroll',
    subtitle: 'The neuroscience of guilt-free learning',
    color: 'from-[#8f46c1] to-[#a0459b]',
    image: '/test.jpeg',
    author: 'Dr. Mind',
    views: '2.8M',
    duration: '45 sec'
  },
  {
    id: 'mentorscroll-demo-2',
    title: '🚀 From TikTok to Einstein',
    subtitle: 'How micro-learning builds genius minds',
    color: 'from-[#a0459b] to-[#bd4580]',
    image: '/test.jpeg',
    author: 'Prof. Timeline',
    views: '1.9M',
    duration: '60 sec'
  },
  {
    id: 'mentorscroll-demo-3',
    title: '⚡ The 8-Second Attention Revolution',
    subtitle: 'Turning short attention spans into superpowers',
    color: 'from-[#bd4580] to-[#d56f66]',
    image: '/test.jpeg',
    author: 'Dr. Quantum',
    views: '3.4M',
    duration: '30 sec'
  }
];

// Platform features with enhanced MentorScroll messaging
const platformFeatures = [
  {
    title: "AI Expert Conversations",
    description: "Chat directly with specialized AI replicas trained on expert knowledge",
    icon: <FaRobot className="text-2xl" />,
    color: "from-[#8f46c1] to-[#a0459b]"
  },
  {
    title: "Guilt-Free Scrolling",
    description: "Transform mindless scrolling into mindful learning experiences",
    icon: <FaBrain className="text-2xl" />,
    color: "from-[#a0459b] to-[#bd4580]"
  },
  {
    title: "Real-Time Content Generation",
    description: "Personalized educational content created by AI experts in real-time",
    icon: <FaHandSparkles className="text-2xl" />,
    color: "from-[#bd4580] to-[#d56f66]"
  }
];

// The benefit stats for guilt-free section
const scrollBenefits = [
  {
    value: '340%',
    label: 'Learning Engagement',
    color: 'text-[#8f46c1]',
    icon: <FaBrain className="text-lg" />
  },
  {
    value: '8sec',
    label: 'To Expert Insights',
    color: 'text-[#a0459b]',
    icon: <FaClock className="text-lg" />
  },
  {
    value: '0%',
    label: 'Scroll Guilt',
    color: 'text-[#d56f66]',
    icon: <FaGraduationCap className="text-lg" />
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [expertStats, setExpertStats] = useState({ count: 0, topics: 0 });
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  useEffect(() => {
    // Simulate loading completion and get expert stats
    const timer = setTimeout(() => {
      setIsLoaded(true);
      setExpertStats({
        count: EXPERT_CONFIGS.length,
        topics: EXPERT_CONFIGS.reduce((total, expert) => total + expert.sampleTopics.length, 0)
      });
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Function to generate fresh content (for demo purposes)
  const generateFreshContent = async () => {
    setIsGeneratingContent(true);
    try {
      await contentGenerator.initialize();
      // In a real app, you'd update the reels with new generated content
      setTimeout(() => {
        setIsGeneratingContent(false);
        // Show success message or update UI
      }, 3000);
    } catch (error) {
      console.error('Content generation failed:', error);
      setIsGeneratingContent(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0c0612] via-[#131019] to-[#1a1522] text-white overflow-x-hidden font-sans">
      {/* Background animated shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-[#8f46c1]/10 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-[#d56f66]/10 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{ bottom: '10%', right: '10%' }}
        />
      </div>

      {/* Initial Loading Animation */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c0612]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 200
              }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-tr from-[#8f46c1] to-[#d56f66] rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl font-bold text-white">M</span>
              </div>
              <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#8f46c1] to-[#d56f66]">
                MentorScroll
              </h2>
              <p className="text-white/60 mb-4">Initializing AI Experts...</p>
              <motion.div
                className="h-1 bg-white/20 rounded-full w-32 mx-auto"
                initial={{ width: 0 }}
                animate={{ width: 128 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8 }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        className="relative z-10 px-6 py-4 flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center">
          <motion.div
            className="w-10 h-10 bg-gradient-to-tr from-[#8f46c1] to-[#d56f66] rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl font-bold">M</span>
          </motion.div>
          <motion.div
            className="ml-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8f46c1] to-[#d56f66] hidden md:block">
              MentorScroll
            </h1>
            <p className="text-xs text-white/60 hidden md:block">
              Guilt-Free Learning Platform
            </p>
          </motion.div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            className="w-10 h-10 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSearch className="text-lg" />
          </motion.button>

          <motion.button
            className="px-4 py-2 bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-full text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateFreshContent}
            disabled={isGeneratingContent}
          >
            {isGeneratingContent ? (
              <div className="flex items-center">
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                Generating...
              </div>
            ) : (
              <>
                <FaHandSparkles className="inline mr-2" />
                Generate Content
              </>
            )}
          </motion.button>
        </div>
      </motion.header>

      <main className="relative z-10 mt-2 px-6">
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12 text-center md:text-left max-w-4xl mx-auto md:mx-0"
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-4 leading-tight tracking-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="block mb-2">
              Transform Mindless Scrolling
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8f46c1] to-[#d56f66]">
              Into Expert Knowledge
            </span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-white/70 mb-6 max-w-2xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            MentorScroll uses AI expert replicas to turn your 2.5 hours of daily scrolling into a personalized learning journey. Same addictive experience, zero guilt.
          </motion.p>

          {/* Stats Row */}
          <motion.div
            className="flex flex-wrap justify-center md:justify-start gap-6 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-[#8f46c1]">{expertStats.count}</div>
              <div className="text-sm text-white/60">AI Experts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#a0459b]">{expertStats.topics}+</div>
              <div className="text-sm text-white/60">Topics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#d56f66]">∞</div>
              <div className="text-sm text-white/60">Personalized Content</div>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center md:justify-start"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Link href="/feed">
              <motion.div
                className="px-8 py-3 bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-full font-semibold text-white shadow-lg flex items-center justify-center"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.4)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Start Learning</span>
                <motion.span
                  initial={{ x: 0, opacity: 0 }}
                  whileHover={{ x: 5, opacity: 1 }}
                  className="ml-2"
                >
                  →
                </motion.span>
              </motion.div>
            </Link>

            <motion.button
              className="px-8 py-3 bg-white/5 backdrop-blur-md rounded-full font-semibold text-white shadow-lg border border-white/10"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center">
                <FaPlay className="mr-2 text-sm" /> Watch Demo
              </span>
            </motion.button>
          </motion.div>
        </motion.section>

        {/* Platform Features Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="flex justify-between items-center mb-8"
          >
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-full flex items-center justify-center mr-2">
                <FaRobot className="text-xs text-white" />
              </div>
              <h3 className="text-xl font-bold">Powered by Sensay AI Experts</h3>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {platformFeatures.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`bg-gradient-to-br ${feature.color} bg-opacity-20 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors relative overflow-hidden group`}
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
                  backgroundColor: "rgba(255, 255, 255, 0.08)"
                }}
              >
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-white/70">{feature.description}</p>

                {/* Animated background effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* AI Expert Showcase */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-8"
          >
            <h3 className="text-2xl font-bold mb-2">Meet Your AI Mentors</h3>
            <p className="text-white/70">Each expert is trained on specialized knowledge and has a unique personality</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {EXPERT_CONFIGS.map((expert, i) => (
              <motion.div
                key={expert.slug}
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all text-center group"
                whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-3 flex items-center justify-center">
                  <FaRobot className="text-white text-lg" />
                </div>
                <h4 className="font-semibold mb-1">{expert.name}</h4>
                <p className="text-xs text-white/70 mb-2">{expert.domain}</p>
                <div className="text-xs bg-white/10 rounded-full px-2 py-1">
                  {expert.sampleTopics.length} topics
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ReelsDeck Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="flex justify-between items-center mb-6"
          >
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-full flex items-center justify-center mr-2">
                <FaRandom className="text-xs text-white" />
              </div>
              <h3 className="text-xl font-bold">Interactive Learning Deck</h3>
            </div>
            <Link href="/feed">
              <motion.div
                className="flex items-center text-sm text-white/70 hover:text-white"
                whileHover={{ x: 3 }}
              >
                Explore All <FaChevronRight className="ml-1 text-xs" />
              </motion.div>
            </Link>
          </motion.div>

          <div className="relative flex justify-center">
            <ReelsDeck reels={deckReels} initialIndex={0} />
          </div>
        </motion.section>

        {/* Guilt-Free Learning Benefits */}
        <section className="relative mb-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="relative overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0c0612] to-[#1a1522] border border-white/10" />

              <div className="relative p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
                  <div className="md:w-1/2">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8f46c1] to-[#d56f66] flex items-center justify-center mr-3">
                          <FaRegLightbulb className="text-xl" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold">
                          Scrolling That <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8f46c1] to-[#d56f66]">Actually Works</span>
                        </h2>
                      </div>

                      <p className="text-white/70 mb-8 text-lg">
                        MentorScroll transforms the psychology of social media into a learning superpower. Same dopamine hits, but every scroll builds genuine expertise.
                      </p>

                      <div className="grid grid-cols-3 gap-4 mb-8">
                        {scrollBenefits.map((benefit, i) => (
                          <motion.div
                            key={i}
                            className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.1)" }}
                          >
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-2">
                                {benefit.icon}
                              </div>
                            </div>
                            <p className={`text-2xl font-bold ${benefit.color}`}>{benefit.value}</p>
                            <p className="text-sm text-white/70">{benefit.label}</p>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        className="flex space-x-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Link href="/feed">
                          <motion.button
                            className="px-6 py-3 bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-full text-white font-medium"
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Try MentorScroll
                          </motion.button>
                        </Link>

                        <motion.button
                          className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-white font-medium border border-white/20"
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Learn More
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  </div>

                  <div className="md:w-1/2">
                    <ScrollComparisonVisual />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Navigation */}
      <motion.nav
        className="fixed bottom-0 inset-x-0 h-16 bg-black/30 backdrop-blur-md border-t border-white/10 flex items-center justify-around z-20"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.2, type: "spring" }}
      >
        <Link href="/">
          <motion.div
            className="flex flex-col items-center text-white"
            whileHover={{ scale: 1.1, color: "#d56f66" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </motion.div>
        </Link>

        <Link href="/feed">
          <motion.div
            className="flex flex-col items-center text-white/70"
            whileHover={{ scale: 1.1, color: "#d56f66" }}
            whileTap={{ scale: 0.95 }}
          >
            <FaBrain className="text-xl" />
            <span className="text-xs mt-1">Learn</span>
          </motion.div>
        </Link>

        <Link href="/create">
          <motion.div
            className="w-12 h-12 bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-full flex items-center justify-center -mt-4 shadow-lg"
            whileHover={{ scale: 1.1, boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <FaHandSparkles className="text-xl" />
          </motion.div>
        </Link>

        <Link href="/explore">
          <motion.div
            className="flex flex-col items-center text-white/70"
            whileHover={{ scale: 1.1, color: "#d56f66" }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCompass className="text-xl" />
            <span className="text-xs mt-1">Explore</span>
          </motion.div>
        </Link>

        <Link href="/profile">
          <motion.div
            className="flex flex-col items-center text-white/70"
            whileHover={{ scale: 1.1, color: "#d56f66" }}
            whileTap={{ scale: 0.95 }}
          >
            <FaUsers className="text-xl" />
            <span className="text-xs mt-1">Profile</span>
          </motion.div>
        </Link>
      </motion.nav>
    </div>
  );
}

// Scroll Comparison Visual Component
function ScrollComparisonVisual() {
  return (
    <motion.div
      className="relative w-full h-96"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="absolute inset-0 flex flex-col md:flex-row">
        {/* Before: Traditional Social Media */}
        <div className="h-1/2 md:h-full md:w-1/2 border-b md:border-b-0 md:border-r border-white/10 p-6 relative">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-red-500/20 backdrop-blur-md rounded-full text-xs border border-red-500/30">
            Traditional Social Media
          </div>

          <div className="flex flex-col h-full items-center justify-center">
            <div className="relative w-32 h-56 bg-black rounded-3xl border-4 border-gray-800 overflow-hidden">
              <div className="absolute inset-2 rounded-2xl bg-gray-900 overflow-hidden">
                <motion.div
                  className="space-y-2 p-2"
                  animate={{ y: [0, -200, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-full h-16 bg-gray-800 rounded-md relative">
                      <div className="absolute inset-2 bg-gray-700 rounded opacity-50"></div>
                      <div className="absolute bottom-1 right-1 text-[8px] text-white/60">
                        {i % 2 ? 'Funny' : 'Dance'}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            <motion.div
              className="mt-4 px-4 py-2 bg-red-500/20 backdrop-blur-md rounded-full text-sm border border-red-500/30 flex items-center"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FaClock className="mr-2 text-red-400" /> Time Wasted
            </motion.div>
          </div>
        </div>

        {/* After: MentorScroll */}
        <div className="h-1/2 md:h-full md:w-1/2 p-6 relative">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-green-500/20 backdrop-blur-md rounded-full text-xs border border-green-500/30">
            MentorScroll
          </div>

          <div className="flex flex-col h-full items-center justify-center">
            <div className="relative w-32 h-56 bg-black rounded-3xl border-4 border-gray-800 overflow-hidden">
              <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-[#0c0612] to-[#1a1522] overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#8f46c1] to-[#d56f66] opacity-60"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                  <motion.div
                    className="w-8 h-8 rounded-full bg-white/20 mb-2 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <FaBrain className="text-white text-sm" />
                  </motion.div>

                  <div className="text-[10px] font-bold mb-1 text-white">Dr. Quantum</div>
                  <div className="text-[8px] mb-2 text-white/80">Quantum Physics</div>

                  <motion.div
                    className="w-12 h-1 bg-white/30 rounded-full overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: 48 }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  >
                    <motion.div
                      className="h-full bg-white"
                      animate={{ x: [0, 48, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Knowledge particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-green-400 rounded-full"
                  style={{
                    left: `${30 + i * 20}%`,
                    bottom: '10%'
                  }}
                  animate={{
                    y: [-60, 0],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>

            <motion.div
              className="mt-4 px-4 py-2 bg-green-500/20 backdrop-blur-md rounded-full text-sm border border-green-500/30 flex items-center"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FaBrain className="mr-2 text-green-400" /> Knowledge Gained
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}