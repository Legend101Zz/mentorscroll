
"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaVolumeUp, FaVolumeMute, FaPause, FaInfo, FaRandom, FaComments, FaLightbulb, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useSwipeable } from 'react-swipeable';
import ExpertChat from './ExpertChat';
import TextBasedReel from './TextBasedReel';
import { contentGenerator } from '../lib/contentGenerator';
import { ReelData } from '../data/deckReels';

interface ReelsDeckProps {
    reels: ReelData[];
    initialIndex?: number;
}

export default function ReelsDeck({ reels, initialIndex = 0 }: ReelsDeckProps) {
    // Core state
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState<null | 'left' | 'right' | 'shuffle'>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    // UI state
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [showInfo, setShowInfo] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(true);

    // Enhanced Sensay features
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [alternativePerspectives, setAlternativePerspectives] = useState<ReelData[]>([]);
    const [showAlternatives, setShowAlternatives] = useState(false);
    const [isLoadingAlternatives, setIsLoadingAlternatives] = useState(false);
    const [isGeneratingNew, setIsGeneratingNew] = useState(false);

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

    // Auto-hide controls for better text reading experience
    useEffect(() => {
        if (controlsTimerRef.current) {
            clearTimeout(controlsTimerRef.current);
        }

        if (controlsVisible && !showInfo && !isChatOpen && !isShuffling) {
            controlsTimerRef.current = setTimeout(() => {
                setControlsVisible(false);
            }, 4000); // Longer timeout for text reading
        }

        return () => {
            if (controlsTimerRef.current) {
                clearTimeout(controlsTimerRef.current);
            }
        };
    }, [controlsVisible, showInfo, isChatOpen, isShuffling]);

    // Handle card navigation 
    const navigateToReel = (direction: 'next' | 'prev') => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setSwipeDirection(direction === 'next' ? 'left' : 'right');
        setControlsVisible(true);
        setShowAlternatives(false);

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
                // Auto-show content for text-based reels
                if (reels[currentIndex]?.isGenerated) {
                    setIsPlaying(true);
                }
            }, 100);
        }, 300);
    };

    // Enhanced shuffle with AI generation
    const shuffleAndGenerate = async () => {
        if (isTransitioning || isShuffling) return;

        setIsShuffling(true);
        setIsGeneratingNew(true);
        setSwipeDirection('shuffle');
        setControlsVisible(true);
        setShowAlternatives(false);

        try {
            // Generate new content while shuffling
            await contentGenerator.initialize();

            // Random shuffle
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
                setIsGeneratingNew(false);

                setTimeout(() => {
                    setIsShuffling(false);
                    setSwipeDirection(null);
                    setIsPlaying(true);
                }, 400);
            }, 1500);

        } catch (error) {
            console.error('Error during shuffle and generate:', error);
            setIsGeneratingNew(false);
            setIsShuffling(false);
            setSwipeDirection(null);
        }
    };

    // Generate alternative perspectives using Sensay
    const generateAlternatives = async () => {
        const currentReel = reels[currentIndex];
        if (!currentReel || isLoadingAlternatives) return;

        setIsLoadingAlternatives(true);
        setShowAlternatives(true);

        try {
            await contentGenerator.initialize();
            const alternatives = await contentGenerator.generateAlternativePerspectives(currentReel.topic);
            setAlternativePerspectives(alternatives);
        } catch (error) {
            console.error('Error generating alternatives:', error);
            setAlternativePerspectives([]);
        } finally {
            setIsLoadingAlternatives(false);
        }
    };

    // Open chat with current expert
    const openExpertChat = () => {
        setIsChatOpen(true);
        setControlsVisible(true);
    };

    // Swipe handling optimized for text content
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => !isShuffling && !isTransitioning && navigateToReel('next'),
        onSwipedRight: () => !isShuffling && !isTransitioning && navigateToReel('prev'),
        onTap: () => {
            setControlsVisible(!controlsVisible);
            // For text reels, tapping also toggles reading mode
            if (reels[currentIndex]?.isGenerated) {
                setIsPlaying(!isPlaying);
            }
        },
        preventDefaultTouchmoveEvent: true,
        trackMouse: false,
        trackTouch: true,
        delta: 15,
        swipeDuration: 500,
    });

    // UI event handlers
    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPlaying(!isPlaying);
        setControlsVisible(true);
    };

    const toggleInfo = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowInfo(!showInfo);
        setControlsVisible(true);
    };

    const handleContainerClick = () => {
        setControlsVisible(!controlsVisible);
    };

    const currentReel = reels[currentIndex];

    // Enhanced card positioning for text-based content
    const getCardTransform = (index: number) => {
        const distance = Math.min(
            Math.abs(index - currentIndex),
            Math.abs(index + reels.length - currentIndex),
            Math.abs(index - (currentIndex + reels.length))
        );

        if (distance > 2) return null;

        const isCurrentCard = index === currentIndex;

        let transform = {
            x: isCurrentCard ? 0 : (index < currentIndex ? -8 : 8) * distance,
            y: isCurrentCard ? 0 : -15 * distance,
            z: isCurrentCard ? 0 : -25 * distance,
            rotateZ: isCurrentCard ? 0 : (index < currentIndex ? -3 : 3) * distance,
            scale: isCurrentCard ? 1 : 1 - (0.03 * distance),
            opacity: isCurrentCard ? 1 : 1 - (0.15 * distance),
            zIndex: 10 - distance,
        };

        // Apply transition animations
        if (isCurrentCard && swipeDirection) {
            if (swipeDirection === 'left') {
                transform.x = -1000;
                transform.rotateZ = -15;
            } else if (swipeDirection === 'right') {
                transform.x = 1000;
                transform.rotateZ = 15;
            } else if (swipeDirection === 'shuffle') {
                transform.y = -300;
                transform.rotateZ = index % 2 ? 180 : -180;
                transform.scale = 0.7;
                transform.opacity = 0;
            }
        }

        return transform;
    };

    // Render individual card with enhanced text support
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
                    duration: isShuffling ? 0.8 : 0.4,
                    ease: "easeOut"
                }}
            >
                {reel.isGenerated ? (
                    <TextBasedReel
                        reel={reel}
                        isActive={isCurrentCard && isPlaying}
                        onInteraction={handleContainerClick}
                    />
                ) : (
                    // Traditional video reel (fallback)
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
            <div className="relative h-[500px] md:h-[600px]" style={{ perspective: '1000px' }}>
                {/* Loading/Generating indicator */}
                <AnimatePresence>
                    {(isShuffling || isGeneratingNew) && (
                        <motion.div
                            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="px-8 py-4 bg-black/70 backdrop-blur-lg rounded-2xl border border-white/20"
                                initial={{ scale: 0.8, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.8, y: 20 }}
                            >
                                <div className="flex items-center space-x-3">
                                    <motion.div
                                        className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    />
                                    <span className="text-white font-medium">
                                        {isGeneratingNew ? 'Generating AI Content...' : 'Shuffling Deck...'}
                                    </span>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main container */}
                <div
                    ref={deckRef}
                    className="relative w-full h-full flex items-center justify-center"
                    onClick={handleContainerClick}
                    {...swipeHandlers}
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
                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 z-30 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-black/70"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateToReel('prev');
                                    }}
                                    whileHover={{ scale: 1.05, x: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaChevronLeft className="text-white" />
                                </motion.button>

                                <motion.button
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 z-30 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-black/70"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateToReel('next');
                                    }}
                                    whileHover={{ scale: 1.05, x: 2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaChevronRight className="text-white" />
                                </motion.button>
                            </div>
                        )}

                        {/* Enhanced Control Panel */}
                        {!isShuffling && !isTransitioning && (
                            <motion.div
                                className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-3"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: controlsVisible ? 1 : 0, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.button
                                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-sm font-medium shadow-lg"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        shuffleAndGenerate();
                                    }}
                                    whileHover={{ scale: 1.05, boxShadow: "0 8px 25px -5px rgba(147, 51, 234, 0.4)" }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={isGeneratingNew}
                                >
                                    <FaRandom className="inline mr-2" />
                                    {isGeneratingNew ? 'Generating...' : 'AI Shuffle'}
                                </motion.button>

                                <motion.button
                                    className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm border border-white/20"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openExpertChat();
                                    }}
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.7)" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaComments className="inline mr-2" />
                                    Chat
                                </motion.button>

                                <motion.button
                                    className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm border border-white/20"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        generateAlternatives();
                                    }}
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.7)" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaEye className="inline mr-2" />
                                    More Views
                                </motion.button>
                            </motion.div>
                        )}

                        {/* Alternative perspectives panel */}
                        <AnimatePresence>
                            {showAlternatives && (
                                <motion.div
                                    className="absolute inset-x-0 -bottom-32 bg-black/80 backdrop-blur-md rounded-2xl p-6 z-40 border border-white/20"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-lg font-semibold text-white">Alternative Perspectives</h4>
                                        <button
                                            onClick={() => setShowAlternatives(false)}
                                            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    {isLoadingAlternatives ? (
                                        <div className="space-y-3">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="bg-white/10 rounded-lg p-3 animate-pulse">
                                                    <div className="h-4 bg-white/20 rounded mb-2"></div>
                                                    <div className="h-3 bg-white/20 rounded w-3/4"></div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-3 max-h-40 overflow-y-auto">
                                            {alternativePerspectives.map((alt) => (
                                                <motion.div
                                                    key={alt.id}
                                                    className="bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-colors cursor-pointer"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                                                            <FaLightbulb className="text-xs text-white" />
                                                        </div>
                                                        <span className="text-sm font-medium text-white">{alt.expertName}</span>
                                                    </div>
                                                    <h5 className="text-white font-medium text-sm mb-1">{alt.title}</h5>
                                                    <p className="text-white/70 text-xs line-clamp-2">{alt.subtitle}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Render all cards */}
                        {reels.map((reel, index) => renderCard(reel, index))}

                        {/* Mobile swipe hint */}
                        {isMobile && isTransitioning && (
                            <motion.div
                                className="absolute inset-x-0 -bottom-16 flex justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white/80">
                                    {swipeDirection === 'left' ? '→ Next' : swipeDirection === 'right' ? '← Previous' : ''}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Enhanced pagination with reel type indicators */}
                <div className="absolute -bottom-8 left-0 right-0 flex justify-center z-20">
                    <div className="flex items-center space-x-2">
                        {reels.map((reel, i) => (
                            <motion.button
                                key={i}
                                className="relative focus:outline-none"
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
                                    ? 'bg-white shadow-lg scale-110'
                                    : 'bg-white/30 hover:bg-white/50'
                                    }`} />
                                {reel.isGenerated && (
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full" />
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Expert Chat Modal */}
            <ExpertChat
                expertSlug={currentReel?.instructorSlug || 'dr-quantum'}
                reelTitle={currentReel?.title || ''}
                reelTopic={currentReel?.topic || ''}
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                expertUuid={currentReel?.expertUuid}
            />
        </>
    );
}