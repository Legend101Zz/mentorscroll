"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import {
  FaSearch, FaBell, FaChevronRight, FaPlay, FaUsers,
  FaClock, FaStar, FaCompass, FaGraduationCap,
  FaRegLightbulb, FaBrain, FaInfinity, FaRandom,
  FaShareAlt, FaRobot, FaHandSparkles, FaMobile,
  FaChartLine, FaHeart, FaBookOpen, FaLightbulb
} from 'react-icons/fa';
import ReelsDeck from '@/components/ReelsDeck';
import { deckReels } from '@/data/deckReels';
import { EXPERT_CONFIGS } from '@/data/experts';
import { contentGenerator } from '@/lib/contentGenerator';

// Hero stats that tell the story
const heroStats = [
  {
    value: '2.5hrs',
    label: 'Daily Scrolling',
    subtext: 'Average person',
    color: 'text-red-400',
    icon: <FaMobile className="text-lg" />
  },
  {
    value: '95%',
    label: 'Feel Guilty',
    subtext: 'After social media',
    color: 'text-orange-400',
    icon: <FaHeart className="text-lg" />
  },
  {
    value: '8sec',
    label: 'Attention Span',
    subtext: 'Modern humans',
    color: 'text-yellow-400',
    icon: <FaClock className="text-lg" />
  }
];

// Solution stats
const solutionStats = [
  {
    value: '340%',
    label: 'Learning Boost',
    subtext: 'vs traditional courses',
    color: 'text-green-400',
    icon: <FaChartLine className="text-lg" />
  },
  {
    value: '0%',
    label: 'Scroll Guilt',
    subtext: 'Transform mindless to mindful',
    color: 'text-blue-400',
    icon: <FaBrain className="text-lg" />
  },
  {
    value: '∞',
    label: 'AI Content',
    subtext: 'Personalized to you',
    color: 'text-purple-400',
    icon: <FaHandSparkles className="text-lg" />
  }
];

// Platform features focusing on the Sensay AI angle
const platformFeatures = [
  {
    title: "Real AI Experts, Real Conversations",
    description: "Chat with specialized AI replicas trained on expert knowledge. Not chatbots - actual digital experts.",
    icon: <FaRobot className="text-2xl" />,
    color: "from-[#8f46c1] to-[#a0459b]",
    demo: "Try asking Dr. Quantum about quantum physics!"
  },
  {
    title: "Generated Learning Content",
    description: "Every scroll generates fresh educational content tailored to your interests and learning style.",
    icon: <FaHandSparkles className="text-2xl" />,
    color: "from-[#a0459b] to-[#bd4580]",
    demo: "Watch content appear in real-time"
  },
  {
    title: "Psychology-First Design",
    description: "Built on research: same dopamine hits as social media, but every swipe builds knowledge.",
    icon: <FaBrain className="text-2xl" />,
    color: "from-[#bd4580] to-[#d56f66]",
    demo: "Works with your brain, not against it"
  }
];

// Success stories for social proof
const successStories = [
  {
    name: "Alex, Software Engineer",
    story: "I used to waste hours on TikTok. Now I'm learning quantum computing during my commute.",
    metric: "3x faster skill acquisition",
    avatar: "🧑‍💻"
  },
  {
    name: "Sarah, Medical Student",
    story: "MentorScroll makes complex topics stick. My retention improved dramatically.",
    metric: "340% better retention",
    avatar: "👩‍⚕️"
  },
  {
    name: "Marcus, High Schooler",
    story: "Finally, scrolling that my parents approve of! Physics is actually fun now.",
    metric: "Zero guilt, pure growth",
    avatar: "🎓"
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
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      setExpertStats({
        count: EXPERT_CONFIGS.length,
        topics: EXPERT_CONFIGS.reduce((total, expert) => total + expert.sampleTopics.length, 0)
      });
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % successStories.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const generateFreshContent = async () => {
    setIsGeneratingContent(true);
    try {
      await contentGenerator.initialize();
      setTimeout(() => {
        setIsGeneratingContent(false);
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
              <p className="text-white/60 mb-4">Loading AI Experts...</p>
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
              Transform Mindless → Mindful
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
                Live Demo
              </>
            )}
          </motion.button>
        </div>
      </motion.header>

      <main className="relative z-10 mt-2 px-6">
        {/* Hero Section - The Problem */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-16 text-center max-w-6xl mx-auto"
        >
          <motion.div
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-red-500/20 text-red-300 rounded-full text-sm font-medium mb-4">
              The Scroll Guilt Crisis
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight tracking-tight">
              <span className="block mb-2">
                You Spend 2.5 Hours Daily
              </span>
              <span className="text-red-400">
                Scrolling & Feeling Guilty
              </span>
            </h2>
          </motion.div>

          {/* Problem Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {heroStats.map((stat, i) => (
              <motion.div
                key={i}
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-white font-medium mb-1">{stat.label}</div>
                <div className="text-white/60 text-sm">{stat.subtext}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Transition to Solution */}
          <motion.div
            className="mb-16"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="text-2xl md:text-3xl font-bold mb-6">
              <span className="text-white/70">What if the same</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8f46c1] to-[#d56f66]">
                addictive scrolling could make you genius?
              </span>
            </div>
          </motion.div>
        </motion.section>

        {/* Solution Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mb-16 text-center max-w-6xl mx-auto"
        >
          <motion.div
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            <span className="inline-block px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-medium mb-4">
              The MentorScroll Solution
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight tracking-tight">
              <span className="block mb-2">
                Same Dopamine Hits
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8f46c1] to-[#d56f66]">
                Different Outcome
              </span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
              AI experts generate personalized educational content that feels like social media but builds real knowledge. Every scroll makes you smarter.
            </p>
          </motion.div>

          {/* Solution Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            {solutionStats.map((stat, i) => (
              <motion.div
                key={i}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 + i * 0.1 }}
                whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-white font-medium mb-1">{stat.label}</div>
                <div className="text-white/60 text-sm">{stat.subtext}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <Link href="/feed">
              <motion.div
                className="px-8 py-4 bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-full font-semibold text-white shadow-lg flex items-center justify-center text-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.4)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Transform Your Scrolling</span>
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
              className="px-8 py-4 bg-white/5 backdrop-blur-md rounded-full font-semibold text-white shadow-lg border border-white/10 text-lg"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center">
                <FaPlay className="mr-2" /> See How It Works
              </span>
            </motion.button>
          </motion.div>
        </motion.section>

        {/* Platform Features */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold mb-4">Powered by Sensay AI Experts</h3>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Real AI personalities trained on expert knowledge. Not chatbots - actual digital mentors who adapt to your learning style.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {platformFeatures.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`bg-gradient-to-br ${feature.color} bg-opacity-20 rounded-xl p-8 border border-white/10 hover:border-white/20 transition-colors relative overflow-hidden group`}
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
                  backgroundColor: "rgba(255, 255, 255, 0.08)"
                }}
              >
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
                <p className="text-white/70 mb-4">{feature.description}</p>
                <div className="text-sm bg-white/10 rounded-full px-3 py-1 inline-block">
                  {feature.demo}
                </div>

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

        {/* ReelsDeck Demo Section */}
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
            <span className="inline-block px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium mb-4">
              Live Demo
            </span>
            <h3 className="text-3xl font-bold mb-4">Experience the Magic</h3>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Swipe through AI-generated educational content. Chat with experts. Feel your brain getting smarter with every scroll.
            </p>
          </motion.div>

          <div className="relative flex justify-center">
            <ReelsDeck reels={deckReels} initialIndex={0} />
          </div>
        </motion.section>

        {/* Social Proof */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Real Results from Real Users</h3>
            <p className="text-white/70 text-lg">Join thousands transforming their daily scrolling into daily growth</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-6xl mb-4">{successStories[currentTestimonial].avatar}</div>
                <blockquote className="text-xl italic text-white/90 mb-4">
                  "{successStories[currentTestimonial].story}"
                </blockquote>
                <div className="text-lg font-semibold text-green-400 mb-2">
                  {successStories[currentTestimonial].metric}
                </div>
                <div className="text-white/70">
                  {successStories[currentTestimonial].name}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {successStories.map((_, i) => (
                <button
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${i === currentTestimonial ? 'bg-white' : 'bg-white/30'
                    }`}
                  onClick={() => setCurrentTestimonial(i)}
                />
              ))}
            </div>
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.section
          className="mb-24 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#0c0612] to-[#1a1522] rounded-3xl p-12 border border-white/10">
            <h2 className="text-4xl font-bold mb-6">
              Stop Feeling Guilty About Scrolling
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Transform your 2.5 daily hours into the most powerful learning experience ever created. Your future self will thank you.
            </p>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 justify-center items-center">
              <Link href="/feed">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-full text-white font-semibold text-lg shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Your Learning Journey
                </motion.button>
              </Link>

              <div className="text-white/60 text-sm">
                Free • No Download • Instant Access
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Enhanced Navigation */}
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
            <FaBookOpen className="text-xl" />
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
            <FaLightbulb className="text-xl" />
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