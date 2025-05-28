
"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaVolumeUp, FaVolumeMute, FaPause, FaInfo, FaRandom, FaComments, FaLightbulb, FaEye } from 'react-icons/fa';
import { useSwipeable } from 'react-swipeable';
import ExpertChat from './ExpertChat';
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

    // Preloading state
    const [preloadedIndexes, setPreloadedIndexes] = useState<number[]>([]);

    // Refs
    const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
    const preloadRefs = useRef<Record<string, HTMLVideoElement | null>>({});
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

    // Auto-hide controls
    useEffect(() => {
        if (controlsTimerRef.current) {
            clearTimeout(controlsTimerRef.current);
        }

        if (controlsVisible && isPlaying && !showInfo && !isChatOpen) {
            controlsTimerRef.current = setTimeout(() => {
                setControlsVisible(false);
            }, 3000);
        }

        return () => {
            if (controlsTimerRef.current) {
                clearTimeout(controlsTimerRef.current);
            }
        };
    }, [controlsVisible, isPlaying, showInfo, isChatOpen]);

    // Handle video management for traditional video reels
    useEffect(() => {
        const currentReel = reels[currentIndex];
        if (!currentReel?.videoUrl) {
            setVideoLoaded(true); // For text-based reels
            return;
        }

        setVideoLoaded(false);

        // Pause all videos first
        Object.values(videoRefs.current).forEach(videoEl => {
            if (videoEl && !videoEl.paused) {
                videoEl.pause();
            }
        });

        // Play current video if needed
        const currentVideo = videoRefs.current[currentReel.id];
        if (currentVideo) {
            currentVideo.muted = isMuted;

            const handleCanPlay = () => {
                setVideoLoaded(true);
                if (isPlaying) {
                    currentVideo.play().catch(err => {
                        console.error("Video playback error:", err);
                        setIsPlaying(false);
                    });
                }
            };

            currentVideo.addEventListener('canplay', handleCanPlay);

            if (currentVideo.readyState >= 3) {
                handleCanPlay();
            } else {
                currentVideo.load();
            }

            return () => {
                currentVideo.removeEventListener('canplay', handleCanPlay);
            };
        }
    }, [currentIndex, isPlaying, isMuted, reels]);

    // Handle card navigation 
    const navigateToReel = (direction: 'next' | 'prev') => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setSwipeDirection(direction === 'next' ? 'left' : 'right');
        setControlsVisible(true);
        setShowAlternatives(false); // Hide alternatives when navigating

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

    // Handle shuffle animation
    const shuffleDeck = () => {
        if (isTransitioning || isShuffling) return;

        setIsShuffling(true);
        setSwipeDirection('shuffle');
        setControlsVisible(true);
        setShowAlternatives(false);

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

            setTimeout(() => {
                setIsShuffling(false);
                setSwipeDirection(null);
                setIsPlaying(true);
            }, 400);
        }, 500);
    };

    // Generate alternative perspectives using Sensay
    const generateAlternatives = async () => {
        const currentReel = reels[currentIndex];
        if (!currentReel || isLoadingAlternatives) return;

        setIsLoadingAlternatives(true);
        setShowAlternatives(true);

        try {
            // Initialize content generator if needed
            await contentGenerator.initialize();

            // Generate alternative perspectives
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

    // Swipe handling
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => !isShuffling && !isTransitioning && navigateToReel('next'),
        onSwipedRight: () => !isShuffling && !isTransitioning && navigateToReel('prev'),
        onTap: () => setControlsVisible(!controlsVisible),
        preventDefaultTouchmoveEvent: true,
        trackMouse: false,
        trackTouch: true,
        delta: 10,
        swipeDuration: 500,
    });

    // UI event handlers
    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPlaying(!isPlaying);
        setControlsVisible(true);
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
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

    // Card positioning and animation system
    const getCardTransform = (index: number) => {
        const distance = Math.min(
            Math.abs(index - currentIndex),
            Math.abs(index + reels.length - currentIndex),
            Math.abs(index - (currentIndex + reels.length))
        );

        if (distance > 2) return null;

        const isCurrentCard = index === currentIndex;

        let transform = {
            x: isCurrentCard ? 0 : (index < currentIndex ? -5 : 5) * distance,
            y: isCurrentCard ? 0 : -10 * distance,
            z: isCurrentCard ? 0 : -20 * distance,
            rotateZ: isCurrentCard ? 0 : (index < currentIndex ? -5 : 5) * distance,
            scale: isCurrentCard ? 1 : 1 - (0.05 * distance),
            opacity: isCurrentCard ? 1 : 1 - (0.2 * distance),
            zIndex: 10 - distance,
        };

        if (isCurrentCard && swipeDirection) {
            if (swipeDirection === 'left') {
                transform.x = -1000;
                transform.rotateZ = -10;
            } else if (swipeDirection === 'right') {
                transform.x = 1000;
                transform.rotateZ = 10;
            } else if (swipeDirection === 'shuffle') {
                transform.y = -200;
                transform.rotateZ = index % 2 ? 120 : -120;
                transform.scale = 0.8;
                transform.opacity = 0;
            }
        }

        return transform;
    };

    // Render content based on reel type
    const renderReelContent = (reel: ReelData) => {
        if (reel.isGenerated) {
            // Render text-based generated content
            return (
                <div className="absolute inset-0 p-6 flex flex-col justify-center bg-gradient-to-br from-black/60 to-transparent">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-white/80 font-medium">AI Generated Content</span>
                        </div>

                        <div className="prose prose-invert prose-sm max-w-none">
                            <div className="text-white leading-relaxed whitespace-pre-wrap">
                                {reel.content}
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            // Render traditional video content
            return (
                <video
                    ref={el => videoRefs.current[reel.id] = el}
                    src={reel.videoUrl}
                    poster={reel.thumbnailUrl}
                    className="w-full h-full object-cover"
                    playsInline
                    loop
                    muted={isMuted}
                />
            );
        }
    };

    // Render a single card
    const renderCard = (reel: ReelData, index: number) => {
        const isCurrentCard = index === currentIndex;
        const transform = getCardTransform(index);

        if (!transform) return null;

        const isLoading = isCurrentCard && !videoLoaded && !isTransitioning && !isShuffling;

        return (
            <motion.div
                key={reel.id}
                className={`absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden shadow-xl ${isCurrentCard ? 'card-active' : 'card-background'}`}
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
                    duration: isShuffling ? 0.6 : 0.3,
                    ease: "easeOut"
                }}
            >
                <div className="absolute inset-0">
                    {/* Background */}
                    <div className="relative w-full h-full">
                        {reel.isGenerated ? (
                            <div
                                className={`w-full h-full bg-gradient-to-br ${reel.color}`}
                                style={{
                                    backgroundImage: `url(${reel.thumbnailUrl})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundBlendMode: 'overlay'
                                }}
                            />
                        ) : (
                            <>
                                {isCurrentCard ? renderReelContent(reel) : (
                                    <div
                                        className="w-full h-full bg-cover bg-center"
                                        style={{ backgroundImage: `url(${reel.thumbnailUrl})` }}
                                    />
                                )}
                            </>
                        )}

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                        {/* Colored overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${reel.color} opacity-30 mix-blend-overlay`} />
                    </div>

                    {/* Content for generated reels */}
                    {isCurrentCard && reel.isGenerated && renderReelContent(reel)}

                    {/* Card content overlay */}
                    {isCurrentCard && (
                        <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between">
                            {/* Top bar */}
                            <div className={`flex justify-between items-start transition-opacity duration-300 ${controlsVisible ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="flex space-x-2">
                                    <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs">
                                        {reel.tags[0]}
                                    </div>
                                    {reel.isGenerated && (
                                        <div className="px-3 py-1 bg-green-500/20 backdrop-blur-md rounded-full text-xs flex items-center">
                                            <FaLightbulb className="mr-1 text-green-400" />
                                            AI Expert
                                        </div>
                                    )}
                                </div>

                                <div className="flex space-x-2">
                                    <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs">
                                        {reel.duration}
                                    </div>
                                    <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs">
                                        {reel.views}
                                    </div>
                                </div>
                            </div>

                            {showAlternatives && (
                                <AlternativePerspectives
                                    alternatives={alternativePerspectives}
                                    isLoading={isLoadingAlternatives}
                                    onClose={() => setShowAlternatives(false)}
                                />
                            )}

                            {/* Bottom content */}
                            <div>
                                {!showInfo && !reel.isGenerated && (
                                    <div className={`transition-opacity duration-300 ${controlsVisible ? 'opacity-100' : 'opacity-0'}`}>
                                        {/* Instructor info */}
                                        <div className="mb-2 flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-white/20 mr-2 flex items-center justify-center text-xs font-bold">
                                                {reel.instructor.charAt(0)}
                                            </div>
                                            <span className="text-sm">{reel.instructor}</span>
                                        </div>

                                        {/* Title and description */}
                                        <h3 className="text-2xl font-bold mb-1">{reel.title}</h3>
                                        <p className="text-white/80 text-sm mb-4">{reel.subtitle}</p>

                                        {/* Enhanced controls */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex space-x-2">
                                                {!reel.isGenerated && (
                                                    <>
                                                        <motion.button
                                                            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                                                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={togglePlay}
                                                        >
                                                            {isPlaying ? <FaPause /> : <FaPlay />}
                                                        </motion.button>

                                                        <motion.button
                                                            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                                                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={toggleMute}
                                                        >
                                                            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                                                        </motion.button>
                                                    </>
                                                )}

                                                <motion.button
                                                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={openExpertChat}
                                                >
                                                    <FaComments />
                                                </motion.button>

                                                <motion.button
                                                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={generateAlternatives}
                                                >
                                                    <FaEye />
                                                </motion.button>
                                            </div>

                                            <motion.button
                                                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                                                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    shuffleDeck();
                                                }}
                                            >
                                                <FaRandom />
                                            </motion.button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    };

    return (
        <>
            <div className="relative h-[500px] md:h-[600px]" style={{ perspective: '1000px' }}>
                {/* Main container */}
                <div
                    ref={deckRef}
                    className="relative w-full h-full flex items-center justify-center"
                    onClick={handleContainerClick}
                    {...swipeHandlers}
                >
                    {/* Card container */}
                    <div className="relative w-72 h-96 md:w-80 md:h-[450px]" style={{ transformStyle: 'preserve-3d' }}>
                        {/* Navigation arrows for desktop */}
                        {!isMobile && !isShuffling && !isTransitioning && (
                            <div className={`transition-opacity duration-300 ${controlsVisible ? 'opacity-100' : 'opacity-0'}`}>
                                <button
                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-30 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateToReel('prev');
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M15 18l-6-6 6-6" />
                                    </svg>
                                </button>

                                <button
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 z-30 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateToReel('next');
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Render all cards */}
                        {reels.map((reel, index) => renderCard(reel, index))}
                    </div>
                </div>

                {/* Card pagination indicators */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
                    <div className="flex space-x-2">
                        {reels.map((_, i) => (
                            <motion.button
                                key={i}
                                className="w-2 h-2 rounded-full focus:outline-none"
                                style={{
                                    backgroundColor: i === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.3)',
                                    boxShadow: i === currentIndex ? '0 0 8px rgba(255, 255, 255, 0.5)' : 'none'
                                }}
                                whileHover={{ scale: 1.5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isTransitioning && !isShuffling && i !== currentIndex) {
                                        setCurrentIndex(i);
                                        setIsPlaying(true);
                                    }
                                }}
                            />
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

// Alternative Perspectives Component
function AlternativePerspectives({
    alternatives,
    isLoading,
    onClose
}: {
    alternatives: ReelData[];
    isLoading: boolean;
    onClose: () => void;
}) {
    return (
        <motion.div
            className="absolute inset-x-4 top-16 bg-black/80 backdrop-blur-md rounded-2xl p-4 z-40"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-white">More Perspectives</h4>
                <button
                    onClick={onClose}
                    className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
                >
                    ×
                </button>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white/10 rounded-lg p-3 animate-pulse">
                            <div className="h-4 bg-white/20 rounded mb-2"></div>
                            <div className="h-3 bg-white/20 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {alternatives.map((alt) => (
                        <div key={alt.id} className="bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-colors">
                            <div className="flex items-center space-x-2 mb-2">
                                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
                                <span className="text-sm font-medium text-white">{alt.expertName}</span>
                            </div>
                            <h5 className="text-white font-medium mb-1">{alt.title}</h5>
                            <p className="text-white/70 text-sm line-clamp-2">{alt.subtitle}</p>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}