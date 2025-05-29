/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
    FaRobot, FaLightbulb, FaGraduationCap, FaAtom, FaCode, FaClock,
    FaBrain, FaLeaf, FaHeart, FaEye, FaShare, FaBookmark, FaPlay,
    FaPause, FaMagic, FaHandSparkles, FaFire, FaZap, FaGem
} from 'react-icons/fa';

interface ReelData {
    id: string;
    title: string;
    subtitle: string;
    content?: string;
    instructor: string;
    instructorSlug?: string;
    duration: string;
    views: string;
    color: string;
    topic: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    type: "hook" | "explanation" | "practical";
    tags: string[];
    isGenerated?: boolean;
}

interface TextBasedReelProps {
    reel: ReelData;
    isActive: boolean;
    onInteraction?: () => void;
}

// Expert icons and themes
const EXPERT_THEMES = {
    'dr-quantum': {
        icon: FaAtom,
        bgPattern: 'quantum',
        accentColor: '#8B5CF6',
        particles: '⚛️🔬🌌',
        animation: 'float'
    },
    'codemaster-alex': {
        icon: FaCode,
        bgPattern: 'matrix',
        accentColor: '#10B981',
        particles: '💻⚡🔧',
        animation: 'typing'
    },
    'prof-timeline': {
        icon: FaClock,
        bgPattern: 'timeline',
        accentColor: '#F59E0B',
        particles: '📜⏳🏛️',
        animation: 'slide'
    },
    'dr-mind': {
        icon: FaBrain,
        bgPattern: 'neural',
        accentColor: '#EC4899',
        particles: '🧠💭✨',
        animation: 'pulse'
    },
    'eco-emma': {
        icon: FaLeaf,
        bgPattern: 'organic',
        accentColor: '#059669',
        particles: '🌱🌍💚',
        animation: 'grow'
    }
};

// Animated background patterns
const BackgroundPattern = ({ pattern, accentColor }: { pattern: string; accentColor: string }) => {
    const patterns = {
        quantum: (
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full opacity-20"
                        style={{
                            width: `${20 + Math.random() * 40}px`,
                            height: `${20 + Math.random() * 40}px`,
                            background: `radial-gradient(circle, ${accentColor}40, transparent)`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, 15, 0],
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{
                            duration: 4 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    />
                ))}
            </div>
        ),

        matrix: (
            <div className="absolute inset-0 overflow-hidden font-mono text-xs opacity-10">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute whitespace-nowrap"
                        style={{
                            left: `${i * 15}%`,
                            color: accentColor,
                            fontSize: `${8 + Math.random() * 4}px`
                        }}
                        animate={{
                            y: ['-100%', '100vh'],
                        }}
                        transition={{
                            duration: 8 + Math.random() * 4,
                            repeat: Infinity,
                            ease: 'linear',
                            delay: Math.random() * 3
                        }}
                    >
                        {Array.from({ length: 20 }, () =>
                            Math.random() > 0.5 ? '1' : '0'
                        ).join('')}
                    </motion.div>
                ))}
            </div>
        ),

        timeline: (
            <div className="absolute inset-0 overflow-hidden">
                <svg className="w-full h-full opacity-10">
                    {[...Array(6)].map((_, i) => (
                        <motion.circle
                            key={i}
                            cx={`${20 + i * 15}%`}
                            cy={`${30 + (i % 2) * 40}%`}
                            r="3"
                            fill={accentColor}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                                opacity: [0, 0.5, 0],
                                scale: [0, 1, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.5
                            }}
                        />
                    ))}
                    <motion.path
                        d="M 10% 50% Q 50% 20% 90% 50%"
                        stroke={accentColor}
                        strokeWidth="1"
                        fill="none"
                        strokeDasharray="5,5"
                        animate={{
                            strokeDashoffset: [0, -20]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'linear'
                        }}
                    />
                </svg>
            </div>
        ),

        neural: (
            <div className="absolute inset-0 overflow-hidden">
                <svg className="w-full h-full opacity-15">
                    {[...Array(15)].map((_, i) => {
                        const x = Math.random() * 100;
                        const y = Math.random() * 100;
                        return (
                            <g key={i}>
                                <motion.circle
                                    cx={`${x}%`}
                                    cy={`${y}%`}
                                    r="2"
                                    fill={accentColor}
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.3, 0.8, 0.3]
                                    }}
                                    transition={{
                                        duration: 2 + Math.random(),
                                        repeat: Infinity,
                                        delay: Math.random() * 2
                                    }}
                                />
                                {i < 14 && (
                                    <motion.line
                                        x1={`${x}%`}
                                        y1={`${y}%`}
                                        x2={`${Math.random() * 100}%`}
                                        y2={`${Math.random() * 100}%`}
                                        stroke={accentColor}
                                        strokeWidth="0.5"
                                        animate={{
                                            opacity: [0, 0.4, 0]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            delay: i * 0.2
                                        }}
                                    />
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>
        ),

        organic: (
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-2xl opacity-20"
                        style={{
                            left: `${15 + i * 12}%`,
                            top: `${20 + (i % 3) * 25}%`,
                            color: accentColor
                        }}
                        animate={{
                            rotate: [0, 360],
                            scale: [0.8, 1.2, 0.8],
                            opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{
                            duration: 6 + Math.random() * 2,
                            repeat: Infinity,
                            delay: i * 0.8
                        }}
                    >
                        🌿
                    </motion.div>
                ))}
            </div>
        )
    };

    return patterns[pattern as keyof typeof patterns] || null;
};

// Interactive text reveal with different effects
const InteractiveText = ({
    content,
    isActive,
    animationType,
    accentColor
}: {
    content: string;
    isActive: boolean;
    animationType: string;
    accentColor: string;
}) => {
    const [currentSection, setCurrentSection] = useState(0);
    const [revealedChars, setRevealedChars] = useState(0);
    const [showCursor, setShowCursor] = useState(true);

    // Parse content into sections
    const sections = content.split('\n').filter(line => line.trim());
    const currentText = sections[currentSection] || '';

    useEffect(() => {
        if (!isActive) {
            setCurrentSection(0);
            setRevealedChars(0);
            return;
        }

        // Auto-advance through sections
        const sectionTimer = setInterval(() => {
            if (currentSection < sections.length - 1) {
                setCurrentSection(prev => prev + 1);
                setRevealedChars(0);
            }
        }, 4000);

        return () => clearInterval(sectionTimer);
    }, [isActive, currentSection, sections.length]);

    useEffect(() => {
        if (!isActive || !currentText) return;

        // Typewriter effect
        if (animationType === 'typing') {
            const typeTimer = setInterval(() => {
                if (revealedChars < currentText.length) {
                    setRevealedChars(prev => prev + 1);
                }
            }, 50);
            return () => clearInterval(typeTimer);
        } else {
            // Instant reveal for other animations
            setRevealedChars(currentText.length);
        }
    }, [currentText, isActive, animationType, revealedChars]);

    // Cursor blink effect
    useEffect(() => {
        const cursorTimer = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);
        return () => clearInterval(cursorTimer);
    }, []);

    const getTextAnimation = () => {
        switch (animationType) {
            case 'typing':
                return {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                };
            case 'slide':
                return {
                    initial: { x: -50, opacity: 0 },
                    animate: { x: 0, opacity: 1 },
                };
            case 'pulse':
                return {
                    initial: { scale: 0.8, opacity: 0 },
                    animate: { scale: 1, opacity: 1 },
                };
            case 'grow':
                return {
                    initial: { scale: 0, opacity: 0 },
                    animate: { scale: 1, opacity: 1 },
                };
            default:
                return {
                    initial: { y: 20, opacity: 0 },
                    animate: { y: 0, opacity: 1 },
                };
        }
    };

    const formatText = (text: string) => {
        // Enhanced text formatting with visual elements
        return text
            .replace(/🤯|💰|🏛️|🧠|🌍/g, (emoji) => `<span class="text-4xl inline-block animate-bounce">${emoji}</span>`)
            .replace(/Step \d+:/g, (match) => `<span class="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm font-bold mb-2">${match}</span>`)
            .replace(/(\d+\.\s)/g, '<span class="text-lg font-bold" style="color: ' + accentColor + '">$1</span>')
            .replace(/([A-Z]{2,})/g, '<span class="font-bold tracking-wide">$1</span>');
    };

    return (
        <div className="space-y-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSection}
                    className="min-h-[200px]"
                    {...getTextAnimation()}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {/* Section Progress Dots */}
                    <div className="flex justify-center space-x-2 mb-6">
                        {sections.map((_, i) => (
                            <motion.div
                                key={i}
                                className={`w-2 h-2 rounded-full ${i === currentSection ? 'bg-white' : 'bg-white/30'
                                    }`}
                                animate={i === currentSection ? {
                                    scale: [1, 1.3, 1],
                                    opacity: [0.7, 1, 0.7]
                                } : {}}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="text-lg leading-relaxed">
                        {currentText.split('').map((char, i) => {
                            const isRevealed = i < revealedChars;
                            const isEmoji = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/u.test(char);

                            return (
                                <motion.span
                                    key={i}
                                    className={`${isEmoji ? 'text-2xl' : ''} ${char === ' ' ? '' : isRevealed ? 'text-white' : 'text-transparent'
                                        }`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{
                                        opacity: isRevealed ? 1 : 0.1,
                                        y: isRevealed ? 0 : 10,
                                        scale: isEmoji && isRevealed ? [1, 1.2, 1] : 1
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        delay: animationType === 'typing' ? 0 : i * 0.02,
                                        scale: { repeat: isEmoji ? Infinity : 0, duration: 2 }
                                    }}
                                >
                                    {char}
                                </motion.span>
                            );
                        })}

                        {/* Typing cursor */}
                        {animationType === 'typing' && revealedChars < currentText.length && (
                            <motion.span
                                className="inline-block w-0.5 h-6 bg-white ml-1"
                                animate={{ opacity: showCursor ? 1 : 0 }}
                            />
                        )}
                    </div>

                    {/* Interactive elements for engagement */}
                    <div className="mt-6 space-y-3">
                        {currentText.includes('Try this') && (
                            <motion.div
                                className="bg-white/10 rounded-lg p-4 border-l-4 border-yellow-400"
                                initial={{ scale: 0, rotate: -5 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 2, type: "spring" }}
                            >
                                <div className="flex items-center space-x-2">
                                    <FaLightbulb className="text-yellow-400 animate-pulse" />
                                    <span className="font-semibold">Try This Challenge!</span>
                                </div>
                            </motion.div>
                        )}

                        {currentText.includes('Step') && (
                            <motion.div
                                className="flex space-x-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5 }}
                            >
                                {[1, 2, 3].map(num => (
                                    <motion.div
                                        key={num}
                                        className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold"
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            boxShadow: ['0 0 0 0 rgba(147, 51, 234, 0.4)', '0 0 0 10px rgba(147, 51, 234, 0)', '0 0 0 0 rgba(147, 51, 234, 0)']
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: num * 0.3
                                        }}
                                    >
                                        {num}
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Reading Progress */}
            <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-white/60 mb-2">
                    <span>Section {currentSection + 1} of {sections.length}</span>
                    <span>{Math.round((currentSection + 1) / sections.length * 100)}%</span>
                </div>
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                        animate={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>
        </div>
    );
};

// Interactive engagement elements
const EngagementElements = ({
    reel,
    isActive,
    accentColor
}: {
    reel: ReelData;
    isActive: boolean;
    accentColor: string;
}) => {
    const [reactions, setReactions] = useState<string[]>([]);
    const [showHearts, setShowHearts] = useState(false);

    const addReaction = (emoji: string) => {
        setReactions(prev => [...prev, emoji]);
        setTimeout(() => {
            setReactions(prev => prev.slice(1));
        }, 3000);
    };

    const triggerHearts = () => {
        setShowHearts(true);
        setTimeout(() => setShowHearts(false), 2000);
    };

    if (!isActive) return null;

    return (
        <>
            {/* Floating reactions */}
            <AnimatePresence>
                {reactions.map((emoji, i) => (
                    <motion.div
                        key={i}
                        className="absolute right-4 bottom-20 text-2xl pointer-events-none"
                        initial={{ opacity: 1, y: 0, x: 0 }}
                        animate={{
                            opacity: 0,
                            y: -100,
                            x: Math.random() * 40 - 20
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3, ease: "easeOut" }}
                    >
                        {emoji}
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Heart animation */}
            <AnimatePresence>
                {showHearts && (
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute text-red-500 text-xl"
                                style={{
                                    left: `${30 + Math.random() * 40}%`,
                                    top: `${30 + Math.random() * 40}%`
                                }}
                                initial={{ opacity: 0, scale: 0, rotate: 0 }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    scale: [0, 1.5, 0],
                                    rotate: [0, 180, 360],
                                    y: [0, -50]
                                }}
                                transition={{
                                    duration: 2,
                                    delay: i * 0.1,
                                    ease: "easeOut"
                                }}
                            >
                                ❤️
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* Interactive reaction buttons */}
            <motion.div
                className="absolute right-4 bottom-32 space-y-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
            >
                {[
                    { emoji: '🤯', action: () => addReaction('🤯') },
                    { emoji: '❤️', action: () => { addReaction('❤️'); triggerHearts(); } },
                    { emoji: '🔥', action: () => addReaction('🔥') },
                    { emoji: '💡', action: () => addReaction('💡') }
                ].map(({ emoji, action }, i) => (
                    <motion.button
                        key={emoji}
                        className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-xl hover:bg-black/70 transition-colors"
                        onClick={action}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        animate={{
                            y: [0, -5, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3
                        }}
                    >
                        {emoji}
                    </motion.button>
                ))}
            </motion.div>
        </>
    );
};

// Knowledge particles effect
const KnowledgeParticles = ({ isActive, accentColor }: { isActive: boolean; accentColor: string }) => {
    if (!isActive) return null;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-xs font-bold opacity-60"
                    style={{
                        left: `${Math.random() * 80 + 10}%`,
                        top: `${Math.random() * 80 + 10}%`,
                        color: accentColor
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0, 0.6, 0],
                        scale: [0.8, 1.2, 0.8],
                        rotate: [0, 360]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 0.8,
                        ease: "easeInOut"
                    }}
                >
                    {['💡', '🧠', '⚡', '✨', '🔬', '📚'][i]}
                </motion.div>
            ))}
        </div>
    );
};

export default function InteractiveTextReel({ reel, isActive, onInteraction }: TextBasedReelProps) {
    const theme = EXPERT_THEMES[reel.instructorSlug as keyof typeof EXPERT_THEMES] || EXPERT_THEMES['dr-quantum'];
    const ExpertIcon = theme.icon;

    return (
        <motion.div
            className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
            onClick={onInteraction}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {/* Dynamic background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${reel.color}`} />
            <BackgroundPattern pattern={theme.bgPattern} accentColor={theme.accentColor} />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

            {/* Knowledge particles */}
            <KnowledgeParticles isActive={isActive} accentColor={theme.accentColor} />

            {/* Main content */}
            <div className="relative h-full p-6 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <motion.div
                            className={`w-14 h-14 rounded-full bg-gradient-to-br ${reel.color} flex items-center justify-center shadow-lg border-2 border-white/20`}
                            animate={isActive ? {
                                scale: [1, 1.05, 1],
                                boxShadow: [
                                    "0 0 20px rgba(255,255,255,0.3)",
                                    "0 0 40px rgba(255,255,255,0.5)",
                                    "0 0 20px rgba(255,255,255,0.3)"
                                ]
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <ExpertIcon className="text-white text-xl" />
                        </motion.div>
                        <div>
                            <h3 className="font-bold text-white text-lg">{reel.instructor}</h3>
                            <div className="flex items-center space-x-2 text-sm">
                                <span className="text-white/70">{reel.duration}</span>
                                <span className="text-white/70">•</span>
                                <div className="flex items-center space-x-1">
                                    <FaEye className="text-white/70 text-xs" />
                                    <span className="text-white/70">{reel.views}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Live AI indicator */}
                    <motion.div
                        className="bg-red-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-red-500/30"
                        animate={isActive ? {
                            boxShadow: [
                                "0 0 0 0 rgba(239, 68, 68, 0.4)",
                                "0 0 0 10px rgba(239, 68, 68, 0)",
                                "0 0 0 0 rgba(239, 68, 68, 0)"
                            ]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                            <span className="text-xs text-red-300 font-medium">LIVE AI</span>
                        </div>
                    </motion.div>
                </div>

                {/* Content area */}
                <div className="flex-1 overflow-hidden">
                    {isActive && reel.content ? (
                        <InteractiveText
                            content={reel.content}
                            isActive={isActive}
                            animationType={theme.animation}
                            accentColor={theme.accentColor}
                        />
                    ) : (
                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0.7 }}
                            animate={{ opacity: 1 }}
                        >
                            <h2 className="text-3xl font-bold text-white leading-tight">
                                {reel.title}
                            </h2>
                            <p className="text-white/80 text-lg leading-relaxed">
                                {reel.subtitle}
                            </p>

                            {/* Tap to start indicator */}
                            <motion.div
                                className="flex items-center justify-center mt-8 space-x-2 text-white/60"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <FaPlay className="text-sm" />
                                <span className="text-sm">Tap to start learning</span>
                            </motion.div>
                        </motion.div>
                    )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {reel.tags.slice(0, 3).map((tag, i) => (
                        <motion.span
                            key={i}
                            className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white/90 border border-white/10"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.3)" }}
                        >
                            #{tag}
                        </motion.span>
                    ))}
                </div>
            </div>

            {/* Engagement elements */}
            <EngagementElements
                reel={reel}
                isActive={isActive}
                accentColor={theme.accentColor}
            />

            {/* Bottom interaction hint */}
            {isActive && (
                <motion.div
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 }}
                >
                    <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2">
                        <FaHandSparkles className="text-yellow-400 text-sm animate-pulse" />
                        <span className="text-xs text-white/80">Interactive content by Sensay AI</span>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}