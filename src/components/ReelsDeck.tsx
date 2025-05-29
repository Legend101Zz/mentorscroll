/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaVolumeUp, FaVolumeMute, FaPause, FaInfo, FaRandom, FaComments, FaLightbulb, FaEye, FaChevronLeft, FaChevronRight, FaHandSparkles, FaMagic } from 'react-icons/fa';
import InteractiveTextReel from './TextBasedReel';

interface ReelData {
    id: string;
    title: string;
    subtitle: string;
    videoUrl?: string;
    thumbnailUrl: string;
    tags: string[];
    instructor: string;
    instructorSlug?: string;
    duration: string;
    views: string;
    color: string;
    content?: string;
    expertUuid?: string;
    topic: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    type: "hook" | "explanation" | "practical";
    isGenerated?: boolean;
    seriesId?: string;
    episodeNumber?: number;
    totalEpisodes?: number;
}

interface ReelsDeckProps {
    reels: ReelData[];
    initialIndex?: number;
}

export default function EnhancedReelsDeck({ reels, initialIndex = 0 }: ReelsDeckProps) {
    // Core state
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState<null | 'left' | 'right' | 'shuffle'>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    // UI state
    const [isPlaying, setIsPlaying] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [isGeneratingContent, setIsGeneratingContent] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [showInfo, setShowInfo] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(true);

    // Touch handling state
    const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
    const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

    // Touch event handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.targetTouches[0];
        setTouchStart({ x: touch.clientX, y: touch.clientY });
        setTouchEnd(null);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const touch = e.targetTouches[0];
        setTouchEnd({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distanceX = touchStart.x - touchEnd.x;
        const distanceY = touchStart.y - touchEnd.y;
        const isLeftSwipe = distanceX > 50;
        const isRightSwipe = distanceX < -50;
        const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX);

        if (!isVerticalSwipe) {
            if (isLeftSwipe && !isShuffling && !isTransitioning) {
                navigateToReel('next');
            } else if (isRightSwipe && !isShuffling && !isTransitioning) {
                navigateToReel('prev');
            }
        }

        setTouchStart(null);
        setTouchEnd(null);
    };

    // Refs
    const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
    const deckRef = useRef<HTMLDivElement>(null);
    const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Check if we're on mobile
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Welcome screen timeout
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowWelcome(false);
            setIsPlaying(true); // Auto-start first reel
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // Auto-hide controls
    useEffect(() => {
        if (controlsTimerRef.current) {
            clearTimeout(controlsTimerRef.current);
        }

        if (controlsVisible && !showInfo && !isShuffling) {
            controlsTimerRef.current = setTimeout(() => {
                setControlsVisible(false);
            }, 5000);
        }

        return () => {
            if (controlsTimerRef.current) {
                clearTimeout(controlsTimerRef.current);
            }
        };
    }, [controlsVisible, showInfo, isShuffling]);

    // Handle card navigation 
    const navigateToReel = (direction: 'next' | 'prev') => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setSwipeDirection(direction === 'next' ? 'left' : 'right');
        setControlsVisible(true);
        setIsPlaying(false);

        setTimeout(() => {
            setCurrentIndex(prevIndex => {
                if (direction === 'next') {
                    return (prevIndex + 1) % reels.length;
                } else {
                    return (prevIndex - 1 + reels.length) % reels.length;
                }
            });

            setTimeout(() => {
                setIsTransitioning(false);
                setSwipeDirection(null);
                setIsPlaying(true);
            }, 100);
        }, 300);
    };

    // Enhanced shuffle with content generation
    const shuffleAndGenerate = async () => {
        if (isTransitioning || isShuffling) return;

        setIsShuffling(true);
        setIsGeneratingContent(true);
        setSwipeDirection('shuffle');
        setControlsVisible(true);

        try {
            // Simulate AI content generation
            await new Promise(resolve => setTimeout(resolve, 2000));

            const getRandomIndex = () => {
                if (reels.length <= 1) return currentIndex;
                let newIndex;
                do {
                    newIndex = Math.floor(Math.random() * reels.length);
                } while (newIndex === currentIndex);
                return newIndex;
            };

            const randomIndex = getRandomIndex();

            setTimeout(() => {
                setCurrentIndex(randomIndex);
                setIsGeneratingContent(false);

                setTimeout(() => {
                    setIsShuffling(false);
                    setSwipeDirection(null);
                    setIsPlaying(true);
                }, 400);
            }, 1000);

        } catch (error) {
            console.error('Error during shuffle:', error);
            setIsGeneratingContent(false);
            setIsShuffling(false);
            setSwipeDirection(null);
        }
    };

    // Swipe handling
    const handleContainerClick = () => {
        setControlsVisible(!controlsVisible);
        setIsPlaying(!isPlaying);
    };

    const currentReel = reels[currentIndex];

    // Enhanced card positioning
    const getCardTransform = (index: number) => {
        const distance = Math.min(
            Math.abs(index - currentIndex),
            Math.abs(index + reels.length - currentIndex),
            Math.abs(index - (currentIndex + reels.length))
        );

        if (distance > 2) return null;

        const isCurrentCard = index === currentIndex;

        const transform = {
            x: isCurrentCard ? 0 : (index < currentIndex ? -12 : 12) * distance,
            y: isCurrentCard ? 0 : -20 * distance,
            z: isCurrentCard ? 0 : -30 * distance,
            rotateZ: isCurrentCard ? 0 : (index < currentIndex ? -4 : 4) * distance,
            scale: isCurrentCard ? 1 : 1 - (0.05 * distance),
            opacity: isCurrentCard ? 1 : 1 - (0.2 * distance),
            zIndex: 10 - distance,
        };

        // Apply transition animations
        if (isCurrentCard && swipeDirection) {
            if (swipeDirection === 'left') {
                transform.x = -1000;
                transform.rotateZ = -20;
                transform.opacity = 0;
            } else if (swipeDirection === 'right') {
                transform.x = 1000;
                transform.rotateZ = 20;
                transform.opacity = 0;
            } else if (swipeDirection === 'shuffle') {
                transform.y = -400;
                transform.rotateZ = index % 2 ? 180 : -180;
                transform.scale = 0.6;
                transform.opacity = 0;
            }
        }

        return transform;
    };

    // Render individual card
    const renderCard = (reel: ReelData, index: number) => {
        const isCurrentCard = index === currentIndex;
        const transform = getCardTransform(index);

        if (!transform) return null;

        return (
            <motion.div
                key={reel.id}
                className={`absolute top-0 left-0 w-full h-full ${isCurrentCard ? 'z-10' : ''}`}
                style={{
                    zIndex: transform.zIndex,
                    willChange: 'transform'
                }}
                initial={false}
                animate={{
                    x: transform.x,
                    y: transform.y,
                    rotateZ: transform.rotateZ,
                    scale: transform.scale,
                    opacity: transform.opacity,
                }}
                transition={{
                    type: 'tween',
                    duration: isShuffling ? 1 : 0.5,
                    ease: "easeOut"
                }}
            >
                {reel.isGenerated || reel.content ? (
                    <InteractiveTextReel
                        reel={reel}
                        isActive={isCurrentCard && isPlaying}
                        onInteraction={handleContainerClick}
                    />
                ) : (
                    // Fallback for video reels
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl">
                        <video
                            ref={el => videoRefs.current[reel.id] = el}
                            src={reel.videoUrl}
                            poster={reel.thumbnailUrl}
                            className="w-full h-full object-cover"
                            playsInline
                            loop
                            muted={isMuted}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        <div className={`absolute inset-0 bg-gradient-to-br ${reel.color} opacity-30 mix-blend-overlay`} />

                        {isCurrentCard && (
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <h3 className="text-2xl font-bold mb-2 text-white">{reel.title}</h3>
                                <p className="text-white/80 text-sm mb-4">{reel.subtitle}</p>
                                <div className="flex flex-wrap gap-2">
                                    {reel.tags.map((tag, i) => (
                                        <span key={i} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>
        );
    };

    return (
        <>
            {/* Welcome screen */}
            <AnimatePresence>
                {showWelcome && (
                    <motion.div
                        className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="text-center space-y-4"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.1, opacity: 0 }}
                        >
                            <motion.div
                                className="text-6xl mb-4"
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                🤖
                            </motion.div>
                            <h2 className="text-2xl font-bold text-white">AI Learning Experience</h2>
                            <p className="text-white/80">Interactive content powered by Sensay</p>
                            <motion.div
                                className="flex items-center justify-center space-x-2 text-white/60"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <FaHandSparkles className="text-sm" />
                                <span className="text-sm">Tap anywhere to begin</span>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative h-[500px] md:h-[600px]" style={{ perspective: '1200px' }}>
                {/* Generation indicator */}
                <AnimatePresence>
                    {(isShuffling || isGeneratingContent) && (
                        <motion.div
                            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="px-8 py-6 bg-black/80 backdrop-blur-lg rounded-2xl border border-purple-500/30"
                                initial={{ scale: 0.8, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.8, y: 20 }}
                            >
                                <div className="flex items-center space-x-4">
                                    <motion.div
                                        className="w-8 h-8 border-3 border-purple-400/30 border-t-purple-400 rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    />
                                    <div className="text-white">
                                        <div className="font-semibold">
                                            {isGeneratingContent ? 'AI Generating Content...' : 'Shuffling Deck...'}
                                        </div>
                                        <div className="text-sm text-white/70">
                                            {isGeneratingContent ? 'Creating personalized learning experience' : 'Finding your next discovery'}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main container */}
                <div
                    ref={deckRef}
                    className="relative w-full h-full flex items-center justify-center"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onClick={handleContainerClick}
                >
                    {/* Card container */}
                    <div
                        className="relative w-80 h-[450px] md:w-96 md:h-[500px]"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Enhanced Navigation */}
                        {!isMobile && !isShuffling && !isTransitioning && (
                            <div className={`transition-opacity duration-300 ${controlsVisible ? 'opacity-100' : 'opacity-0'}`}>
                                <motion.button
                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 z-30 w-14 h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/30 hover:bg-black/80"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateToReel('prev');
                                    }}
                                    whileHover={{ scale: 1.05, x: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaChevronLeft className="text-white text-lg" />
                                </motion.button>

                                <motion.button
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 z-30 w-14 h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/30 hover:bg-black/80"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateToReel('next');
                                    }}
                                    whileHover={{ scale: 1.05, x: 2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaChevronRight className="text-white text-lg" />
                                </motion.button>
                            </div>
                        )}

                        {/* Enhanced Control Panel */}
                        {!isShuffling && !isTransitioning && (
                            <motion.div
                                className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-3"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: controlsVisible ? 1 : 0, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.button
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-sm font-medium shadow-lg border border-white/20"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        shuffleAndGenerate();
                                    }}
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: "0 10px 30px -5px rgba(147, 51, 234, 0.5)"
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={isGeneratingContent}
                                >
                                    <FaMagic className="inline mr-2" />
                                    {isGeneratingContent ? 'Generating...' : 'AI Shuffle'}
                                </motion.button>

                                <motion.button
                                    className="px-4 py-3 bg-black/60 backdrop-blur-md rounded-full text-white text-sm border border-white/30"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowInfo(!showInfo);
                                    }}
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.8)" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaInfo className="inline mr-2" />
                                    Info
                                </motion.button>
                            </motion.div>
                        )}

                        {/* Render all cards */}
                        {reels.map((reel, index) => renderCard(reel, index))}

                        {/* Mobile swipe hints */}
                        {isMobile && (
                            <motion.div
                                className="absolute inset-x-0 -bottom-16 flex justify-center space-x-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: controlsVisible ? 0.7 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center space-x-2 text-white/60">
                                    <motion.div
                                        animate={{ x: [-5, 5, -5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        ←
                                    </motion.div>
                                    <span className="text-xs">Swipe</span>
                                    <motion.div
                                        animate={{ x: [-5, 5, -5] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                    >
                                        →
                                    </motion.div>
                                </div>
                                <div className="flex items-center space-x-2 text-white/60">
                                    <span className="text-xs">Tap for controls</span>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Enhanced pagination */}
                <div className="absolute -bottom-12 left-0 right-0 flex justify-center z-20">
                    <div className="flex items-center space-x-3">
                        {reels.map((reel, i) => (
                            <motion.button
                                key={i}
                                className="relative focus:outline-none group"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isTransitioning && !isShuffling && i !== currentIndex) {
                                        setCurrentIndex(i);
                                        setIsPlaying(true);
                                    }
                                }}
                            >
                                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentIndex
                                    ? 'bg-white shadow-lg scale-125'
                                    : 'bg-white/40 hover:bg-white/70'
                                    }`} />

                                {/* Enhanced indicators */}
                                {reel.isGenerated && (
                                    <motion.div
                                        className="absolute -top-2 -right-1 w-2 h-2 bg-green-400 rounded-full"
                                        animate={{
                                            scale: i === currentIndex ? [1, 1.3, 1] : 1,
                                            opacity: [0.7, 1, 0.7]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                )}

                                {reel.type === 'hook' && (
                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full" />
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Info panel */}
                <AnimatePresence>
                    {showInfo && currentReel && (
                        <motion.div
                            className="absolute inset-x-0 -bottom-24 bg-black/90 backdrop-blur-md rounded-2xl p-6 z-40 border border-white/20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-lg font-semibold text-white">{currentReel.title}</h4>
                                    <p className="text-white/70 text-sm">{currentReel.subtitle}</p>
                                </div>
                                <button
                                    onClick={() => setShowInfo(false)}
                                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-white/60">Instructor:</span>
                                    <span className="text-white ml-2">{currentReel.instructor}</span>
                                </div>
                                <div>
                                    <span className="text-white/60">Duration:</span>
                                    <span className="text-white ml-2">{currentReel.duration}</span>
                                </div>
                                <div>
                                    <span className="text-white/60">Type:</span>
                                    <span className="text-white ml-2 capitalize">{currentReel.type}</span>
                                </div>
                                <div>
                                    <span className="text-white/60">Level:</span>
                                    <span className="text-white ml-2 capitalize">{currentReel.difficulty}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {currentReel.tags.map((tag, i) => (
                                    <span key={i} className="text-xs bg-white/20 px-2 py-1 rounded-full text-white/90">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}