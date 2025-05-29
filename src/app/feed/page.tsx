/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import {
    FaHome, FaPlay, FaPlus, FaUser, FaCompass, FaHeart,
    FaComment, FaShare, FaBookmark, FaLightbulb, FaBrain,
    FaQuoteLeft, FaQuoteRight, FaChevronDown, FaChevronUp,
    FaChevronLeft, FaChevronRight, FaUsers, FaFire, FaGem,
    FaRobot, FaGraduationCap, FaMagic, FaAtom, FaClock,
    FaEye, FaThumbsUp, FaChartLine, FaTimes, FaQuestion,
    FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight
} from 'react-icons/fa';
import Link from 'next/link';

// Enhanced Learning Content Structure
interface LearningReel {
    id: string;
    title: string;
    hook: string;
    mainContent: string;
    keyInsight: string;
    expertName: string;
    expertRole: string;
    expertAvatar: string;
    tags: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    readTime: string;
    seriesId?: string;
    episodeNumber?: number;
    totalEpisodes?: number;
    stats: {
        views: number;
        likes: number;
        saves: number;
        discussions: number;
    };
    colorTheme: {
        primary: string;
        secondary: string;
        gradient: string;
    };
    visualElements: {
        icon: React.ReactNode;
        pattern: 'dots' | 'waves' | 'geometric' | 'particles';
        animation: 'float' | 'pulse' | 'rotate' | 'bounce';
    };
    interactiveElements: {
        quiz?: {
            question: string;
            options: string[];
            correct: number;
        };
        reflection?: {
            prompt: string;
            placeholder: string;
        };
        actionItems?: string[];
    };
}

// Comprehensive Mock Data
const mentorScrollReels: LearningReel[] = [
    {
        id: "quantum-tunneling-1",
        title: "Quantum Tunneling: Your Phone's Secret Superpower",
        hook: "🤯 Every time you unlock your phone, particles are literally teleporting through walls",
        mainContent: `Quantum tunneling sounds like science fiction, but it's happening in your pocket right now. Every transistor in your smartphone relies on electrons magically appearing on the other side of barriers they shouldn't be able to cross.

Here's the mind-bender: particles don't "break through" barriers—they exist as probability clouds. Sometimes that cloud extends beyond the barrier, and when we measure the particle, we might find it on the other side. It's like throwing a ball at a wall and occasionally finding it behind the wall without making a hole.

This isn't theoretical. Without quantum tunneling:
• Your phone wouldn't exist
• Flash memory couldn't store data
• Solar panels would be far less efficient
• Medical imaging would be primitive

The universe operates on probability, not certainty. What seems impossible becomes inevitable given enough opportunities. Every second, billions of quantum tunneling events are powering the device you're reading this on.`,
        keyInsight: "💡 Reality at the quantum level operates on probability, not certainty. The impossible becomes inevitable when you have billions of chances per second.",
        expertName: "Dr. Quantum",
        expertRole: "Quantum Physics Specialist",
        expertAvatar: "🔬",
        tags: ["quantum physics", "technology", "tunneling", "smartphones"],
        difficulty: "intermediate",
        readTime: "3 min",
        seriesId: "quantum-fundamentals",
        episodeNumber: 1,
        totalEpisodes: 5,
        stats: { views: 24500, likes: 1890, saves: 456, discussions: 78 },
        colorTheme: {
            primary: "#8B5CF6",
            secondary: "#06B6D4",
            gradient: "from-purple-600 via-blue-500 to-cyan-400"
        },
        visualElements: {
            icon: <FaAtom className="text-4xl" />,
            pattern: "particles",
            animation: "float"
        },
        interactiveElements: {
            quiz: {
                question: "What makes quantum tunneling possible in your smartphone?",
                options: [
                    "Particles break through with force",
                    "Wave-particle duality and probability clouds",
                    "High temperature melts barriers",
                    "Magnetic fields bend space"
                ],
                correct: 1
            },
            actionItems: [
                "Look at your phone and appreciate the quantum physics inside",
                "Research how flash memory uses tunneling",
                "Explore quantum computing breakthroughs",
                "Share this mind-blowing fact with someone"
            ]
        }
    },
    {
        id: "attention-residue-1",
        title: "Why Your Brain Feels Foggy After Task Switching",
        hook: "🧠 Every time you switch tasks, 30% of your brain gets stuck on the previous task like mental velcro",
        mainContent: `You know that foggy feeling when you switch from email to important work? That's attention residue, and it's killing your productivity.

Researcher Sophie Leroy discovered our brains don't have clean on/off switches. When you jump from checking Slack to writing a report, part of your attention remains tangled up in those unread messages. It's like trying to tune into a radio station while another station bleeds through.

Here's what happens in your brain:
• 15-30% of cognitive resources stay stuck on the previous task
• Mental performance drops significantly for the first few minutes
• The residue accumulates throughout the day
• By afternoon, you're running on 50% mental capacity

The solution isn't willpower—it's transition rituals. Elite performers use "closing ceremonies" for each task: write down where you left off, take three deep breaths, and consciously shift your mental context.

Athletes do this between plays. Surgeons do this between procedures. CEOs do this between meetings. Your brain needs clear boundaries to perform at its peak.`,
        keyInsight: "🎯 Peak performance isn't about multitasking—it's about monotasking with intentional transitions. Treat your attention like the precious resource it is.",
        expertName: "Dr. Mind",
        expertRole: "Cognitive Psychology Expert",
        expertAvatar: "🧠",
        tags: ["psychology", "productivity", "attention", "neuroscience", "focus"],
        difficulty: "beginner",
        readTime: "2.5 min",
        stats: { views: 31200, likes: 2340, saves: 678, discussions: 124 },
        colorTheme: {
            primary: "#F59E0B",
            secondary: "#EF4444",
            gradient: "from-amber-500 via-orange-500 to-red-500"
        },
        visualElements: {
            icon: <FaBrain className="text-4xl" />,
            pattern: "geometric",
            animation: "bounce"
        },
        interactiveElements: {
            quiz: {
                question: "What percentage of cognitive resources can remain stuck on previous tasks?",
                options: ["5-10%", "15-30%", "40-50%", "60-70%"],
                correct: 1
            },
            actionItems: [
                "Try task batching for one week",
                "Create a 'closing ceremony' for important tasks",
                "Notice when you feel attention residue building",
                "Set up distraction-free work blocks"
            ]
        }
    },
    {
        id: "sandwich-war-1",
        title: "The Sandwich That Started World War I",
        hook: "🥪 A wrong turn, a failed bomb, and a lunch break killed 17 million people and ended four empires",
        mainContent: `June 28, 1914. Archduke Franz Ferdinand was supposed to die that morning, but the universe had a twisted sense of humor.

The first assassination attempt failed spectacularly. A bomb bounced off Ferdinand's car and exploded behind him. The would-be assassin swallowed cyanide (it was expired and just made him vomit) and jumped into a river (it was 4 inches deep).

Meanwhile, the frustrated assassin Gavrilo Princip gave up and went to grab a sandwich at Schiller's Delicatessen.

Ferdinand's driver, unfamiliar with Sarajevo, took a wrong turn down Franz Joseph Street. Realizing his mistake, he stopped the car and began backing up—directly in front of Schiller's Delicatessen.

Princip looked up from his sandwich, saw his target sitting helplessly 5 feet away, and fired two shots.

One month later: World War I began
Four years later: 17 million dead, four empires collapsed, the world map redrawn

History isn't made by grand plans and great leaders alone. It pivots on absurd coincidences, human error, and lunch breaks. The most consequential events often hinge on the most mundane moments.`,
        keyInsight: "⚡ History pivots on butterfly effects. The sandwich you eat, the turn you take, the moment you pause—these tiny choices ripple across centuries.",
        expertName: "Prof. Timeline",
        expertRole: "Historical Causality Expert",
        expertAvatar: "📚",
        tags: ["history", "world war", "butterfly effect", "chaos theory", "causality"],
        difficulty: "beginner",
        readTime: "3 min",
        stats: { views: 45600, likes: 3420, saves: 890, discussions: 156 },
        colorTheme: {
            primary: "#DC2626",
            secondary: "#7C2D12",
            gradient: "from-red-600 via-red-700 to-amber-800"
        },
        visualElements: {
            icon: <FaClock className="text-4xl" />,
            pattern: "dots",
            animation: "rotate"
        },
        interactiveElements: {
            reflection: {
                prompt: "Think about a small, seemingly insignificant decision that led to major consequences in your life.",
                placeholder: "Consider the butterfly effects in your own story..."
            },
            actionItems: [
                "Research other historical butterfly effects",
                "Notice small decisions that could have big impacts today",
                "Study how chaos theory applies to human events",
                "Appreciate the randomness that shapes our world"
            ]
        }
    },
    {
        id: "climate-tech-1",
        title: "The Machine That Turns Air Into Stone",
        hook: "🌍 Scientists in Iceland are sucking CO2 from the air and turning it into permanent rock—forever",
        mainContent: `Imagine a machine that breathes in polluted air and exhales clean air, while turning carbon dioxide into stone. This isn't science fiction—it's happening right now in Iceland.

The Climeworks facility captures 4,000 tons of CO2 annually (equivalent to removing 900 cars from roads). Here's the magic: they mix captured CO2 with water and pump it underground into basalt rock formations. Within 2 years, it naturally mineralizes into stone. Forever.

The scale challenge is mind-boggling:
• We emit 36 billion tons of CO2 annually
• We'd need 9 million Climeworks facilities to go carbon neutral
• But costs have dropped 80% in just 5 years (from $600 to $120 per ton)

The breakthrough? Companies like Microsoft, Shopify, and Coca-Cola are already buying carbon removal credits, creating the world's first market for "negative emissions."

If cost trends continue, direct air capture could become economically viable worldwide by 2030. We're not just talking about reducing emissions anymore—we're talking about actively healing the atmosphere.`,
        keyInsight: "🚀 The climate crisis requires both emissions reduction AND atmospheric healing. We need to become a species that actively cleans up after itself.",
        expertName: "Eco Emma",
        expertRole: "Climate Solutions Specialist",
        expertAvatar: "🌱",
        tags: ["climate science", "technology", "carbon capture", "sustainability"],
        difficulty: "intermediate",
        readTime: "3 min",
        stats: { views: 28900, likes: 2100, saves: 567, discussions: 89 },
        colorTheme: {
            primary: "#059669",
            secondary: "#0D9488",
            gradient: "from-emerald-600 via-teal-600 to-cyan-600"
        },
        visualElements: {
            icon: <FaAtom className="text-4xl" />,
            pattern: "waves",
            animation: "float"
        },
        interactiveElements: {
            quiz: {
                question: "How much have direct air capture costs dropped in 5 years?",
                options: ["50%", "65%", "80%", "90%"],
                correct: 2
            },
            actionItems: [
                "Calculate your personal carbon footprint",
                "Research carbon removal companies",
                "Support businesses investing in climate tech",
                "Learn about natural carbon sequestration"
            ]
        }
    }
];

export default function MentorScrollFeed() {
    // Core state
    const [currentReelIndex, setCurrentReelIndex] = useState(0);
    const [showThread, setShowThread] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showDirectionHints, setShowDirectionHints] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);
    const [appReady, setAppReady] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);

    // Interaction state
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [showReflection, setShowReflection] = useState(false);
    const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
    const [reflectionText, setReflectionText] = useState("");
    const [longPressActive, setLongPressActive] = useState(false);

    // Animation state
    const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right' | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);

    // Refs
    const contentRef = useRef<HTMLDivElement>(null);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const progressTimer = useRef<NodeJS.Timeout | null>(null);

    const currentReel = mentorScrollReels[currentReelIndex];

    // Initialize app
    useEffect(() => {
        const initializeApp = async () => {
            // Check if first visit
            const hasVisited = localStorage.getItem('mentorscroll_visited');
            if (!hasVisited) {
                setShowWelcome(true);
                localStorage.setItem('mentorscroll_visited', 'true');
            }

            // Simulate loading time
            setTimeout(() => {
                setIsLoading(false);
                setTimeout(() => {
                    setAppReady(true);
                    if (!hasVisited) {
                        setTimeout(() => {
                            setShowDirectionHints(true);
                            setTimeout(() => setShowDirectionHints(false), 6000);
                        }, 2000);
                    }
                }, 300);
            }, 1500);
        };

        initializeApp();
    }, []);

    // Check if desktop
    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Reading progress simulation
    useEffect(() => {
        if (appReady && !isTransitioning) {
            setReadingProgress(0);
            const duration = parseInt(currentReel.readTime) * 60 * 1000;
            const increment = 100 / (duration / 100);

            progressTimer.current = setInterval(() => {
                setReadingProgress(prev => {
                    if (prev >= 100) {
                        if (progressTimer.current) clearInterval(progressTimer.current);
                        return 100;
                    }
                    return prev + increment;
                });
            }, 100);
        }

        return () => {
            if (progressTimer.current) clearInterval(progressTimer.current);
        };
    }, [currentReelIndex, appReady, isTransitioning, currentReel.readTime]);

    // Navigation function
    const navigateToReel = useCallback((newDirection: 'up' | 'down' | 'left' | 'right') => {
        if (isTransitioning) return;

        setDirection(newDirection);
        setIsTransitioning(true);
        setIsLiked(false);
        setIsSaved(false);
        setShowQuiz(false);
        setShowReflection(false);
        setSelectedQuizAnswer(null);
        setReflectionText("");

        let newIndex = currentReelIndex;

        if (newDirection === 'up' || newDirection === 'down') {
            if (newDirection === 'up') {
                newIndex = (currentReelIndex + 1) % mentorScrollReels.length;
            } else {
                newIndex = (currentReelIndex - 1 + mentorScrollReels.length) % mentorScrollReels.length;
            }
        } else {
            // Horizontal navigation - find related content or random
            const relatedReels = mentorScrollReels.filter((reel, index) =>
                index !== currentReelIndex &&
                reel.tags.some(tag => currentReel.tags.includes(tag))
            );

            if (relatedReels.length > 0) {
                const randomReel = relatedReels[Math.floor(Math.random() * relatedReels.length)];
                newIndex = mentorScrollReels.findIndex(reel => reel.id === randomReel.id);
            } else {
                newIndex = Math.floor(Math.random() * mentorScrollReels.length);
            }
        }

        setTimeout(() => {
            setCurrentReelIndex(newIndex);
            setTimeout(() => {
                setDirection(null);
                setIsTransitioning(false);
            }, 50);
        }, 300);
    }, [currentReelIndex, isTransitioning, currentReel]);

    // Swipe handlers
    const handlers = useSwipeable({
        onSwiped: (eventData) => {
            const { dir } = eventData;
            if (isTransitioning) return;

            switch (dir.toLowerCase()) {
                case 'up': navigateToReel('up'); break;
                case 'down': navigateToReel('down'); break;
                case 'left': navigateToReel('left'); break;
                case 'right': navigateToReel('right'); break;
            }
        },
        preventDefaultTouchmoveEvent: true,
        trackMouse: false,
        delta: 25,
        swipeDuration: 800,
    });

    // Long press handlers
    const handleTouchStart = () => {
        longPressTimer.current = setTimeout(() => {
            setLongPressActive(true);
            setShowThread(true);
        }, 800);
    };

    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
        setLongPressActive(false);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isTransitioning) return;

            switch (e.key) {
                case 'ArrowUp': navigateToReel('up'); break;
                case 'ArrowDown': navigateToReel('down'); break;
                case 'ArrowLeft': navigateToReel('left'); break;
                case 'ArrowRight': navigateToReel('right'); break;
                case 'l': case 'L': setIsLiked(!isLiked); break;
                case 'b': case 'B': setIsSaved(!isSaved); break;
                case 'q': case 'Q':
                    if (currentReel.interactiveElements.quiz) setShowQuiz(!showQuiz);
                    break;
                case 'r': case 'R':
                    if (currentReel.interactiveElements.reflection) setShowReflection(!showReflection);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigateToReel, isLiked, isSaved, showQuiz, showReflection, currentReel, isTransitioning]);

    return (
        <div className="h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Loading Overlay */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        className="absolute inset-0 z-50 bg-gradient-to-br from-slate-900 to-purple-900 flex flex-col items-center justify-center"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            className="relative w-24 h-24 mb-8"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                        >
                            <motion.div
                                className="absolute inset-0 border-4 border-purple-500/30 rounded-full"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 0, 0.3],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white relative">
                                <motion.span
                                    className="text-3xl font-bold"
                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    M
                                </motion.span>
                            </div>
                        </motion.div>

                        <motion.div
                            className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <motion.div
                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.5 }}
                            />
                        </motion.div>

                        <motion.p
                            className="text-white/70 mt-6 text-lg font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Transforming scrolling into learning...
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Welcome Guide */}
            <AnimatePresence>
                {showWelcome && (
                    <motion.div
                        className="absolute inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-md w-full border border-purple-400/30 shadow-2xl"
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                        >
                            <div className="text-center mb-6">
                                <motion.div
                                    className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                >
                                    <FaGraduationCap className="text-2xl text-white" />
                                </motion.div>
                                <h2 className="text-3xl font-bold text-white mb-2">Welcome to MentorScroll!</h2>
                                <p className="text-purple-200">Transform mindless scrolling into mindful learning</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="text-center">
                                    <h3 className="text-white font-semibold mb-4">Smart Multi-Dimensional Navigation</h3>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                                            <div className="flex items-center justify-center mb-2">
                                                <FaArrowUp className="text-purple-400 mr-2" />
                                                <FaArrowDown className="text-purple-400" />
                                            </div>
                                            <p className="text-white text-sm font-medium">Vertical</p>
                                            <p className="text-white/70 text-xs">Episode journey</p>
                                        </div>

                                        <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                                            <div className="flex items-center justify-center mb-2">
                                                <FaArrowLeft className="text-blue-400 mr-2" />
                                                <FaArrowRight className="text-blue-400" />
                                            </div>
                                            <p className="text-white text-sm font-medium">Horizontal</p>
                                            <p className="text-white/70 text-xs">Alt perspectives</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-4 border border-purple-400/30">
                                    <h4 className="text-white font-semibold mb-2 flex items-center">
                                        <FaUsers className="mr-2" />
                                        Long Press to Discuss
                                    </h4>
                                    <p className="text-white/80 text-sm">
                                        Hold anywhere to join live conversations with other learners and AI experts
                                    </p>
                                </div>
                            </div>

                            <motion.button
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-semibold text-lg shadow-lg"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowWelcome(false)}
                            >
                                Start Your Learning Journey
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <AnimatePresence>
                {!isLoading && currentReel && (
                    <motion.div
                        className="w-full h-full relative overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: appReady ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                        {...handlers}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleTouchStart}
                        onMouseUp={handleTouchEnd}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentReelIndex}
                                className="absolute inset-0 p-6 pb-24"
                                initial={{
                                    opacity: 0,
                                    scale: direction ? 1 : 0.95,
                                    x: direction === 'right' ? -100 : direction === 'left' ? 100 : 0,
                                    y: direction === 'down' ? -100 : direction === 'up' ? 100 : 0
                                }}
                                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.95,
                                    x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
                                    y: direction === 'up' ? -100 : direction === 'down' ? 100 : 0
                                }}
                                transition={{ type: "spring", damping: 25, stiffness: 350, duration: 0.3 }}
                            >
                                {/* Dynamic Background Pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    {currentReel.visualElements.pattern === 'particles' && (
                                        <div className="relative w-full h-full">
                                            {[...Array(50)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="absolute w-1 h-1 bg-white rounded-full"
                                                    style={{
                                                        left: `${Math.random() * 100}%`,
                                                        top: `${Math.random() * 100}%`,
                                                    }}
                                                    animate={{
                                                        y: [0, -20, 0],
                                                        opacity: [0.3, 1, 0.3],
                                                    }}
                                                    transition={{
                                                        duration: 3 + Math.random() * 2,
                                                        repeat: Infinity,
                                                        delay: Math.random() * 2,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Header */}
                                <div className="flex items-center justify-between mb-6 relative z-10">
                                    <div className="flex items-center space-x-3">
                                        <motion.div
                                            className={`w-12 h-12 rounded-full bg-gradient-to-r ${currentReel.colorTheme.gradient} flex items-center justify-center text-white shadow-lg`}
                                            animate={
                                                currentReel.visualElements.animation === 'float' ? { y: [0, -5, 0] } :
                                                    currentReel.visualElements.animation === 'pulse' ? { scale: [1, 1.1, 1] } :
                                                        currentReel.visualElements.animation === 'rotate' ? { rotate: 360 } :
                                                            { y: [0, -3, 0] }
                                            }
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            {currentReel.visualElements.icon}
                                        </motion.div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-2xl">{currentReel.expertAvatar}</span>
                                                <div>
                                                    <h3 className="text-white font-semibold text-lg">{currentReel.expertName}</h3>
                                                    <p className="text-white/70 text-sm">{currentReel.expertRole}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <motion.div
                                            className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${currentReel.colorTheme.gradient} text-white`}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {currentReel.difficulty.toUpperCase()}
                                        </motion.div>
                                        <p className="text-white/70 text-xs mt-1">{currentReel.readTime} read</p>
                                    </div>
                                </div>

                                {/* Episode Indicator */}
                                {currentReel.seriesId && (
                                    <motion.div
                                        className="flex items-center justify-center mb-4"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div className="bg-black/30 backdrop-blur-md rounded-full px-4 py-2 flex items-center space-x-2">
                                            <FaGraduationCap className="text-purple-400" />
                                            <span className="text-white text-sm font-medium">
                                                Episode {currentReel.episodeNumber} of {currentReel.totalEpisodes}
                                            </span>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Content */}
                                <div ref={contentRef} className="flex-1 overflow-y-auto space-y-6">
                                    {/* Hook */}
                                    <motion.div
                                        className="text-center"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <motion.h1
                                            className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
                                            animate={{
                                                textShadow: [
                                                    "0 0 10px rgba(139, 92, 246, 0.5)",
                                                    "0 0 20px rgba(139, 92, 246, 0.8)",
                                                    "0 0 10px rgba(139, 92, 246, 0.5)"
                                                ]
                                            }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        >
                                            {currentReel.title}
                                        </motion.h1>

                                        <motion.div
                                            className="text-xl text-purple-200 font-medium p-4 rounded-2xl bg-purple-500/20 backdrop-blur-sm border border-purple-400/30"
                                            whileHover={{ scale: 1.02, backgroundColor: "rgba(139, 92, 246, 0.3)" }}
                                        >
                                            {currentReel.hook}
                                        </motion.div>
                                    </motion.div>

                                    {/* Main Content */}
                                    <motion.div
                                        className="bg-black/20 backdrop-blur-md rounded-3xl p-6 border border-white/10"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <div className="flex items-start space-x-3 mb-4">
                                            <FaQuoteLeft className="text-purple-400 text-lg mt-1 flex-shrink-0" />
                                            <div className="flex-1">
                                                <div className="text-white/90 text-lg leading-relaxed whitespace-pre-line">
                                                    {currentReel.mainContent}
                                                </div>
                                            </div>
                                            <FaQuoteRight className="text-purple-400 text-lg mt-1 flex-shrink-0" />
                                        </div>
                                    </motion.div>

                                    {/* Key Insight */}
                                    <motion.div
                                        className={`bg-gradient-to-r ${currentReel.colorTheme.gradient} p-6 rounded-3xl text-white`}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.7 }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <FaLightbulb className="text-2xl mt-1 flex-shrink-0" />
                                            <div>
                                                <h3 className="font-bold text-lg mb-2">Key Insight</h3>
                                                <p className="text-lg leading-relaxed">{currentReel.keyInsight}</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Interactive Elements */}
                                    {currentReel.interactiveElements.quiz && (
                                        <motion.div
                                            className="bg-indigo-500/20 backdrop-blur-md rounded-3xl p-6 border border-indigo-400/30"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.9 }}
                                        >
                                            <button
                                                onClick={() => setShowQuiz(!showQuiz)}
                                                className="flex items-center space-x-2 text-indigo-200 font-semibold mb-4 hover:text-indigo-100 transition-colors"
                                            >
                                                <FaQuestion className="text-lg" />
                                                <span>Quick Knowledge Check</span>
                                                {showQuiz ? <FaChevronUp /> : <FaChevronDown />}
                                            </button>

                                            <AnimatePresence>
                                                {showQuiz && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="space-y-3"
                                                    >
                                                        <p className="text-white font-medium">{currentReel.interactiveElements.quiz.question}</p>
                                                        <div className="space-y-2">
                                                            {currentReel.interactiveElements.quiz.options.map((option, index) => (
                                                                <motion.button
                                                                    key={index}
                                                                    onClick={() => setSelectedQuizAnswer(index)}
                                                                    className={`w-full text-left p-3 rounded-xl transition-all ${selectedQuizAnswer === index
                                                                        ? index === currentReel.interactiveElements.quiz!.correct
                                                                            ? 'bg-green-500/30 border-green-400 text-green-100'
                                                                            : 'bg-red-500/30 border-red-400 text-red-100'
                                                                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                                                                        } border`}
                                                                    whileHover={{ scale: 1.02 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                >
                                                                    {option}
                                                                </motion.button>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    )}

                                    {/* Action Items */}
                                    {currentReel.interactiveElements.actionItems && (
                                        <motion.div
                                            className="bg-emerald-500/20 backdrop-blur-md rounded-3xl p-6 border border-emerald-400/30"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.1 }}
                                        >
                                            <h3 className="flex items-center space-x-2 text-emerald-200 font-semibold mb-4">
                                                <FaRobot className="text-lg" />
                                                <span>Try This Next</span>
                                            </h3>
                                            <div className="space-y-3">
                                                {currentReel.interactiveElements.actionItems.map((item, index) => (
                                                    <motion.div
                                                        key={index}
                                                        className="flex items-center space-x-3 text-white"
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 1.2 + index * 0.1 }}
                                                    >
                                                        <div className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0" />
                                                        <span>{item}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Stats */}
                                    <motion.div
                                        className="grid grid-cols-4 gap-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.3 }}
                                    >
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-white">{(currentReel.stats.views / 1000).toFixed(1)}K</div>
                                            <div className="text-white/70 text-xs">Views</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-white">{currentReel.stats.likes}</div>
                                            <div className="text-white/70 text-xs">Likes</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-white">{currentReel.stats.saves}</div>
                                            <div className="text-white/70 text-xs">Saves</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-white">{currentReel.stats.discussions}</div>
                                            <div className="text-white/70 text-xs">Talks</div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Reading progress */}
                                <div className="absolute bottom-28 left-0 right-0 px-6">
                                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full bg-gradient-to-r ${currentReel.colorTheme.gradient} rounded-full`}
                                            style={{ width: `${Math.min(readingProgress, 100)}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Action Buttons */}
                        <div className="absolute right-6 bottom-32 flex flex-col space-y-4 z-20">
                            <motion.button
                                className={`w-14 h-14 rounded-full ${isLiked ? 'bg-red-500' : 'bg-white/20'} backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsLiked(!isLiked)}
                            >
                                <FaHeart className={`text-xl ${isLiked ? 'text-white' : 'text-white/80'}`} />
                            </motion.button>

                            <motion.button
                                className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowThread(true)}
                            >
                                <FaComment className="text-xl text-white/80" />
                            </motion.button>

                            <motion.button
                                className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaShare className="text-xl text-white/80" />
                            </motion.button>

                            <motion.button
                                className={`w-14 h-14 rounded-full ${isSaved ? 'bg-purple-500' : 'bg-white/20'} backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsSaved(!isSaved)}
                            >
                                <FaBookmark className={`text-xl ${isSaved ? 'text-white' : 'text-white/80'}`} />
                            </motion.button>
                        </div>

                        {/* Navigation Hints */}
                        {appReady && showDirectionHints && (
                            <motion.div
                                className="absolute inset-0 pointer-events-none z-30"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Navigation directions with enhanced visuals */}
                                <motion.div
                                    className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center"
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <div className="bg-black/60 backdrop-blur-md rounded-2xl px-4 py-3 border border-purple-400/30 shadow-lg">
                                        <FaChevronUp className="text-2xl text-purple-400 mx-auto mb-1" />
                                        <div className="text-white text-sm font-medium">Next Episode</div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-center"
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                >
                                    <div className="bg-black/60 backdrop-blur-md rounded-2xl px-4 py-3 border border-purple-400/30 shadow-lg">
                                        <FaChevronDown className="text-2xl text-purple-400 mx-auto mb-1" />
                                        <div className="text-white text-sm font-medium">Previous</div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="absolute left-6 top-1/2 transform -translate-y-1/2 text-center"
                                    animate={{ x: [0, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                >
                                    <div className="bg-black/60 backdrop-blur-md rounded-2xl px-3 py-4 border border-blue-400/30 shadow-lg">
                                        <FaChevronLeft className="text-2xl text-blue-400 mx-auto mb-1" />
                                        <div className="text-white text-sm font-medium">Alt View</div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="absolute right-20 top-1/2 transform -translate-y-1/2 text-center"
                                    animate={{ x: [0, 10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                                >
                                    <div className="bg-black/60 backdrop-blur-md rounded-2xl px-3 py-4 border border-green-400/30 shadow-lg">
                                        <FaChevronRight className="text-2xl text-green-400 mx-auto mb-1" />
                                        <div className="text-white text-sm font-medium">Related</div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="absolute bottom-40 left-1/2 transform -translate-x-1/2 text-center"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                                >
                                    <div className="bg-gradient-to-r from-purple-500/80 to-blue-500/80 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/20 shadow-lg">
                                        <FaUsers className="text-xl text-white mx-auto mb-1" />
                                        <div className="text-white text-sm font-medium">Hold to Discuss</div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Long Press Indicator */}
                        <AnimatePresence>
                            {longPressActive && (
                                <motion.div
                                    className="absolute inset-0 bg-purple-500/20 backdrop-blur-md flex items-center justify-center z-40"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <motion.div
                                        className="w-32 h-32 border-4 border-purple-400 rounded-full flex items-center justify-center"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <FaUsers className="text-4xl text-purple-400" />
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation Transition Indicator */}
                        <AnimatePresence>
                            {direction && (
                                <motion.div
                                    className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/30 backdrop-blur-sm z-30"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.7 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <motion.div
                                        className="w-20 h-20 rounded-full bg-purple-500/40 backdrop-blur-md flex items-center justify-center"
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 1.2, opacity: 0 }}
                                    >
                                        {direction === 'up' && <FaArrowUp className="text-4xl text-white" />}
                                        {direction === 'down' && <FaArrowDown className="text-4xl text-white" />}
                                        {direction === 'left' && <FaArrowLeft className="text-4xl text-white" />}
                                        {direction === 'right' && <FaArrowRight className="text-4xl text-white" />}
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Navigation */}
            <motion.nav
                className="fixed bottom-0 inset-x-0 h-20 bg-black/40 backdrop-blur-xl border-t border-white/20 z-50"
                initial={{ y: 100 }}
                animate={{ y: appReady ? 0 : 100 }}
                transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.5 }}
            >
                <div className="flex items-center justify-around h-full px-4">
                    <Link href="/">
                        <motion.div
                            className="flex flex-col items-center text-white/70 hover:text-white transition-colors p-2"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaHome className="text-xl mb-1" />
                            <span className="text-xs">Home</span>
                        </motion.div>
                    </Link>

                    <Link href="/explore">
                        <motion.div
                            className="flex flex-col items-center text-white/70 hover:text-white transition-colors p-2"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaCompass className="text-xl mb-1" />
                            <span className="text-xs">Explore</span>
                        </motion.div>
                    </Link>

                    <Link href="/create">
                        <motion.div
                            className="flex flex-col items-center -mt-6"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-black/20">
                                <FaPlus className="text-xl text-white" />
                            </div>
                            <span className="text-xs text-purple-300 mt-1 font-medium">Create</span>
                        </motion.div>
                    </Link>

                    <div className="flex flex-col items-center text-purple-400 p-2">
                        <div className="relative">
                            <FaPlay className="text-xl mb-1" />
                            <motion.div
                                className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>
                        <span className="text-xs">Learn</span>
                    </div>

                    <Link href="/profile">
                        <motion.div
                            className="flex flex-col items-center text-white/70 hover:text-white transition-colors p-2"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaUser className="text-xl mb-1" />
                            <span className="text-xs">Profile</span>
                        </motion.div>
                    </Link>
                </div>
            </motion.nav>

            {/* Discussion Thread Modal */}
            <AnimatePresence>
                {showThread && (
                    <motion.div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowThread(false)}
                    >
                        <motion.div
                            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 max-w-md w-full border border-white/20"
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center">
                                    <FaUsers className="mr-2" />
                                    Join Discussion
                                </h3>
                                <button
                                    onClick={() => setShowThread(false)}
                                    className="text-white/70 hover:text-white"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="text-white/80 mb-6">
                                <p>Connect with other learners exploring:</p>
                                <p className="font-semibold text-purple-300 mt-2">&quot;{currentReel.title}&quot;</p>
                            </div>

                            <div className="space-y-3">
                                <motion.button
                                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-medium transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Start Live Discussion
                                </motion.button>
                                <motion.button
                                    className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    View Comments ({currentReel.stats.discussions})
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}