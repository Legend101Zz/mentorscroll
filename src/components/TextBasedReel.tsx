
"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaLightbulb, FaGraduationCap, FaAtom, FaCode, FaClock, FaBrain, FaLeaf } from 'react-icons/fa';
import { ReelData } from '../data/deckReels';

interface TextBasedReelProps {
    reel: ReelData;
    isActive: boolean;
    onInteraction?: () => void;
}

// Icon mapping for different expert types
const EXPERT_ICONS = {
    'dr-quantum': FaAtom,
    'codemaster-alex': FaCode,
    'prof-timeline': FaClock,
    'dr-mind': FaBrain,
    'eco-emma': FaLeaf
};

// Background patterns for visual interest
const BACKGROUND_PATTERNS = {
    'dr-quantum': 'radial-gradient(circle at 20% 80%, rgba(120, 80, 255, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(80, 120, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(143, 70, 193, 0.2) 0%, transparent 50%)',
    'codemaster-alex': 'linear-gradient(45deg, rgba(34, 197, 94, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%), radial-gradient(circle at 30% 70%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)',
    'prof-timeline': 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 146, 60, 0.1) 100%), radial-gradient(circle at 70% 30%, rgba(245, 158, 11, 0.2) 0%, transparent 50%)',
    'dr-mind': 'linear-gradient(45deg, rgba(236, 72, 153, 0.1) 0%, rgba(244, 114, 182, 0.1) 100%), radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)',
    'eco-emma': 'linear-gradient(45deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%), radial-gradient(circle at 40% 60%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)'
};

// Animated background elements based on expert domain
const BackgroundElements = ({ expertSlug }: { expertSlug: string }) => {
    const elements = {
        'dr-quantum': (
            <>
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
                        style={{
                            left: `${20 + i * 10}%`,
                            top: `${15 + (i % 3) * 25}%`
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 0.7, 0.3],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.3
                        }}
                    />
                ))}
            </>
        ),
        'codemaster-alex': (
            <>
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-green-400/20 font-mono text-xs"
                        style={{
                            left: `${10 + i * 15}%`,
                            top: `${20 + (i % 2) * 40}%`
                        }}
                        animate={{
                            opacity: [0.1, 0.4, 0.1],
                            y: [0, -10, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: i * 0.5
                        }}
                    >
                        {['{}', '()', '[]', '<>', '&&', '||'][i]}
                    </motion.div>
                ))}
            </>
        ),
        'prof-timeline': (
            <>
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 bg-amber-400/20 origin-bottom"
                        style={{
                            left: `${20 + i * 15}%`,
                            bottom: '20%',
                            height: `${30 + i * 10}px`
                        }}
                        animate={{
                            scaleY: [0.5, 1, 0.5],
                            opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.4
                        }}
                    />
                ))}
            </>
        ),
        'dr-mind': (
            <>
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-8 h-8 border border-pink-400/20 rounded-full"
                        style={{
                            left: `${25 + i * 20}%`,
                            top: `${25 + (i % 2) * 30}%`
                        }}
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: i * 0.6
                        }}
                    />
                ))}
            </>
        ),
        'eco-emma': (
            <>
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-green-400/20 text-lg"
                        style={{
                            left: `${15 + i * 12}%`,
                            top: `${20 + (i % 3) * 20}%`
                        }}
                        animate={{
                            rotate: [0, 360],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            delay: i * 0.8
                        }}
                    >
                        🌱
                    </motion.div>
                ))}
            </>
        )
    };

    return elements[expertSlug as keyof typeof elements] || null;
};

// Format content with better typography and spacing
const FormattedContent = ({ content }: { content: string }) => {
    // Split content into paragraphs and format
    const paragraphs = content.split('\n').filter(line => line.trim());

    return (
        <div className="space-y-4">
            {paragraphs.map((paragraph, i) => {
                // Check if it's a title/header (starts with emoji or is all caps)
                const isTitle = /^[🤯💰🏛️🧠🌍]/.test(paragraph) || paragraph === paragraph.toUpperCase();

                // Check if it's a step or bullet point
                const isStep = /^Step \d+:|^\d+\./.test(paragraph);
                const isBullet = /^[-•]/.test(paragraph);

                if (isTitle) {
                    return (
                        <motion.h2
                            key={i}
                            className="text-2xl md:text-3xl font-bold text-white leading-tight"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            {paragraph}
                        </motion.h2>
                    );
                }

                if (isStep) {
                    return (
                        <motion.div
                            key={i}
                            className="bg-white/10 rounded-lg p-3 border-l-4 border-purple-400"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <p className="text-white font-medium">{paragraph}</p>
                        </motion.div>
                    );
                }

                if (isBullet) {
                    return (
                        <motion.div
                            key={i}
                            className="flex items-start space-x-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <span className="text-purple-400 mt-1">•</span>
                            <p className="text-white/90">{paragraph.replace(/^[-•]\s*/, '')}</p>
                        </motion.div>
                    );
                }

                // Regular paragraph
                return (
                    <motion.p
                        key={i}
                        className="text-white/90 leading-relaxed"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        {paragraph}
                    </motion.p>
                );
            })}
        </div>
    );
};

export default function TextBasedReel({ reel, isActive, onInteraction }: TextBasedReelProps) {
    const ExpertIcon = EXPERT_ICONS[reel.instructorSlug as keyof typeof EXPERT_ICONS] || FaRobot;
    const backgroundPattern = BACKGROUND_PATTERNS[reel.instructorSlug as keyof typeof BACKGROUND_PATTERNS];

    return (
        <motion.div
            className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
            onClick={onInteraction}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {/* Background */}
            <div
                className={`absolute inset-0 bg-gradient-to-br ${reel.color}`}
                style={{ background: backgroundPattern }}
            />

            {/* Animated background elements */}
            <BackgroundElements expertSlug={reel.instructorSlug || 'dr-quantum'} />

            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

            {/* Content */}
            <div className="relative h-full p-6 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <motion.div
                            className={`w-12 h-12 rounded-full bg-gradient-to-br ${reel.color} flex items-center justify-center shadow-lg`}
                            animate={isActive ? {
                                scale: [1, 1.1, 1],
                                boxShadow: ["0 0 20px rgba(255,255,255,0.2)", "0 0 30px rgba(255,255,255,0.4)", "0 0 20px rgba(255,255,255,0.2)"]
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <ExpertIcon className="text-white text-xl" />
                        </motion.div>
                        <div>
                            <h3 className="font-bold text-white">{reel.instructor}</h3>
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-white/70">{reel.duration}</span>
                                <span className="text-xs text-white/70">•</span>
                                <span className="text-xs text-white/70">{reel.views}</span>
                            </div>
                        </div>
                    </div>

                    {/* AI Generated Badge */}
                    <motion.div
                        className="bg-green-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-green-500/30"
                        animate={isActive ? { opacity: [0.7, 1, 0.7] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-xs text-green-300 font-medium">AI Generated</span>
                        </div>
                    </motion.div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {isActive && reel.content && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5, staggerChildren: 0.1 }}
                            >
                                <FormattedContent content={reel.content} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!isActive && (
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                                {reel.title}
                            </h2>
                            <p className="text-white/80 text-lg">
                                {reel.subtitle}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {reel.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white/90"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                {isActive && (
                    <motion.div
                        className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <motion.div
                            className="h-full bg-gradient-to-r from-white/60 to-white/90 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 15, ease: "linear" }}
                        />
                    </motion.div>
                )}

                {/* Interaction Hints */}
                {isActive && (
                    <motion.div
                        className="absolute bottom-6 right-6 space-y-2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 }}
                    >
                        <motion.div
                            className="bg-white/10 backdrop-blur-sm rounded-full p-2 flex items-center space-x-1"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                        >
                            <FaRobot className="text-white text-sm" />
                            <span className="text-xs text-white/90">Tap to chat</span>
                        </motion.div>
                    </motion.div>
                )}

                {/* Knowledge Particles Effect */}
                {isActive && (
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-white/60 rounded-full"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`
                                }}
                                animate={{
                                    y: [0, -100],
                                    opacity: [0, 1, 0],
                                    scale: [0.5, 1, 0.5]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: i * 0.5,
                                    ease: "easeOut"
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}