/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
"use client";

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaRobot,
    FaBrain,
    FaTimes,
    FaChevronRight,
    FaTag,
    FaBook,
    FaPlus,
    FaDollarSign,
    FaHome,
    FaCompass,
    FaUser,
    FaPlay,
    FaCog,
    FaCheck,
    FaInfoCircle,
    FaLightbulb,
    FaCloudUploadAlt,
    FaFileAlt,
    FaGraduationCap,
    FaChartLine,
    FaStar,
    FaEye,
    FaRocket
} from 'react-icons/fa';
import Link from 'next/link';
import { enhancedSensayAPI } from '@/lib/sensay';

export default function ExpertCreatorPage() {
    // Core state for expert creation
    const [creationStep, setCreationStep] = useState<'setup' | 'training' | 'content' | 'preview' | 'publishing' | 'complete'>('setup');
    const [expertData, setExpertData] = useState({
        name: '',
        domain: '',
        description: '',
        tags: [] as string[],
        profileImage: ''
    });
    const [expertUuid, setExpertUuid] = useState<string | null>(null);
    const [trainingProgress, setTrainingProgress] = useState(0);
    const [currentTag, setCurrentTag] = useState('');

    // Training content state
    const [trainingContent, setTrainingContent] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // Revenue projection state
    const [projectedRevenue, setProjectedRevenue] = useState({
        monthly: 0,
        yearly: 0,
        perView: 0.08
    });

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Popular domains for quick selection
    const popularDomains = [
        'AI & Technology', 'Health & Wellness', 'Business & Finance',
        'Science & Physics', 'Psychology', 'History', 'Art & Design',
        'Cooking & Nutrition', 'Fitness', 'Philosophy', 'Language Learning',
        'Music & Audio', 'Photography', 'Programming', 'Marketing'
    ];

    // Error state
    const [error, setError] = useState<string | null>(null);

    // Handle expert creation
    const handleCreateExpert = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!expertData.name || !expertData.domain || !expertData.description) return;

        setError(null); // Clear any previous errors
        setCreationStep('training');

        try {
            const result = await enhancedSensayAPI.createExpertChannel(expertData);
            if (result.success && result.expertUuid) {
                setExpertUuid(result.expertUuid);
                // Calculate projected revenue based on domain popularity
                calculateRevenueProjection(expertData.domain, expertData.tags);
                // Move to training step after a brief delay
                setTimeout(() => {
                    simulateTraining();
                }, 1000);
            } else {
                setError(result.error || "Failed to create expert. Please try again.");
                setCreationStep('setup'); // Go back to setup
            }
        } catch (error: any) {
            console.error('Error creating expert:', error);
            setError("Network error. Please check your connection and try again.");
            setCreationStep('setup'); // Go back to setup
        }
    };

    // Simulate training progress
    const simulateTraining = () => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTrainingProgress(100);
                setTimeout(() => {
                    setCreationStep('content');
                }, 500);
            }
            setTrainingProgress(progress);
        }, 300);
    };

    // Calculate revenue projection
    const calculateRevenueProjection = (domain: string, tags: string[]) => {
        // Mock calculation based on domain popularity
        const domainMultipliers: Record<string, number> = {
            'AI & Technology': 1.5,
            'Business & Finance': 1.3,
            'Health & Wellness': 1.2,
            'Programming': 1.4,
            'Marketing': 1.1
        };

        const baseViews = 1000; // Conservative estimate
        const multiplier = domainMultipliers[domain] || 1.0;
        const projectedViews = baseViews * multiplier;
        const perView = 0.08; // $0.08 per view (similar to YouTube CPM)

        setProjectedRevenue({
            monthly: Math.round(projectedViews * perView),
            yearly: Math.round(projectedViews * perView * 12),
            perView
        });
    };

    // Add training content
    const handleAddTrainingContent = async () => {
        if (!expertUuid || !trainingContent.trim()) return;

        try {
            const trainingSession = await enhancedSensayAPI.startTrainingSession(expertUuid);
            if (trainingSession.success && trainingSession.trainingId) {
                await enhancedSensayAPI.addTrainingContent(
                    expertUuid,
                    trainingSession.trainingId,
                    trainingContent
                );
                setTrainingContent('');
                // Show success feedback
            }
        } catch (error) {
            console.error('Error adding training content:', error);
        }
    };

    // Handle file upload for training
    const handleFileUpload = async (files: FileList) => {
        if (!expertUuid) return;

        setIsUploading(true);
        const newFiles = Array.from(files);

        try {
            for (const file of newFiles) {
                await enhancedSensayAPI.uploadTrainingDocument(expertUuid, file);
            }
            setUploadedFiles(prev => [...prev, ...newFiles]);
        } catch (error) {
            console.error('Error uploading files:', error);
        } finally {
            setIsUploading(false);
        }
    };

    // Publish expert
    const handlePublishExpert = async () => {
        if (!expertUuid) return;

        setCreationStep('publishing');

        try {
            const success = await enhancedSensayAPI.publishExpert(expertUuid);
            if (success) {
                setTimeout(() => {
                    setCreationStep('complete');
                }, 2000);
            }
        } catch (error) {
            console.error('Error publishing expert:', error);
        }
    };

    // Tag management
    const handleAddTag = () => {
        if (currentTag.trim() && !expertData.tags.includes(currentTag.trim())) {
            setExpertData(prev => ({
                ...prev,
                tags: [...prev.tags, currentTag.trim()]
            }));
            setCurrentTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setExpertData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    // Reset form
    const handleReset = () => {
        setCreationStep('setup');
        setExpertData({
            name: '',
            domain: '',
            description: '',
            tags: [],
            profileImage: ''
        });
        setExpertUuid(null);
        setTrainingProgress(0);
        setTrainingContent('');
        setUploadedFiles([]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-tr from-[#0c0612] via-[#131019] to-[#1a1522] text-white">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-black/20 backdrop-blur-md border-b border-white/10 px-6 py-4">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <Link href="/">
                        <div className="flex items-center">
                            <motion.div
                                className="w-10 h-10 bg-gradient-to-tr from-[#8f46c1] to-[#d56f66] rounded-full flex items-center justify-center shadow-lg mr-3"
                                whileHover={{ scale: 1.05 }}
                            >
                                <span className="text-xl font-bold">M</span>
                            </motion.div>
                            <div>
                                <h1 className="text-xl font-bold">MentorScroll</h1>
                                <p className="text-xs text-white/60">Creator Studio</p>
                            </div>
                        </div>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm font-medium">Create AI Expert</p>
                            <p className="text-xs text-white/60">Powered by Sensay</p>
                        </div>
                        <motion.div
                            className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8f46c1] to-[#d56f66] flex items-center justify-center"
                            whileHover={{ scale: 1.1, rotate: 180 }}
                        >
                            <FaRobot className="text-xl" />
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* Progress Steps */}
            <div className="max-w-4xl mx-auto px-6 py-8 pb-24">
                <div className="flex justify-between items-center mb-12">
                    {['setup', 'training', 'content', 'preview', 'publishing', 'complete'].map((step, index) => (
                        <div key={step} className="flex flex-col items-center relative">
                            <motion.div
                                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${['training', 'content', 'preview', 'publishing', 'complete'].indexOf(creationStep) >= index
                                    ? 'bg-gradient-to-r from-[#8f46c1] to-[#d56f66]'
                                    : 'bg-white/10'
                                    }`}
                                animate={{
                                    scale: creationStep === step ? [1, 1.2, 1] : 1,
                                }}
                                transition={{ duration: 2, repeat: creationStep === step ? Infinity : 0 }}
                            >
                                {step === 'setup' && <FaCog />}
                                {step === 'training' && <FaBrain />}
                                {step === 'content' && <FaBook />}
                                {step === 'preview' && <FaEye />}
                                {step === 'publishing' && <FaRocket />}
                                {step === 'complete' && <FaCheck />}
                            </motion.div>

                            <p className={`text-xs ${creationStep === step ? 'text-white' : 'text-white/50'}`}>
                                {step === 'setup' ? 'Setup' :
                                    step === 'training' ? 'Training' :
                                        step === 'content' ? 'Content' :
                                            step === 'preview' ? 'Preview' :
                                                step === 'publishing' ? 'Publishing' : 'Complete'}
                            </p>

                            {index < 5 && (
                                <div className={`absolute top-5 left-full w-16 h-0.5 ${['training', 'content', 'preview', 'publishing', 'complete'].indexOf(creationStep) > index
                                    ? 'bg-gradient-to-r from-[#8f46c1] to-[#d56f66]'
                                    : 'bg-white/10'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    {/* Setup Step */}
                    {creationStep === 'setup' && (
                        <motion.div
                            className="max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold mb-4">Create Your AI Expert</h2>
                                <p className="text-white/70">
                                    Train an AI with your knowledge and expertise. Earn revenue as others learn from your AI expert.
                                </p>
                            </div>

                            {/* Revenue Opportunity Banner */}
                            <motion.div
                                className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-6 mb-8 border border-green-500/30"
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="flex items-center mb-4">
                                    <FaDollarSign className="text-2xl text-green-400 mr-3" />
                                    <h3 className="text-xl font-bold">Monetize Your Knowledge</h3>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-green-400">$0.08</p>
                                        <p className="text-sm text-white/70">Per interaction</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-green-400">$500+</p>
                                        <p className="text-sm text-white/70">Monthly potential</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-green-400">24/7</p>
                                        <p className="text-sm text-white/70">Passive income</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="space-y-6">
                                {/* Error Display */}
                                {error && (
                                    <motion.div
                                        className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="flex items-center">
                                            <FaTimes className="text-red-400 mr-3" />
                                            <div>
                                                <h4 className="text-red-300 font-medium mb-1">Creation Failed</h4>
                                                <p className="text-red-200 text-sm">{error}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                {/* Expert Name */}
                                <div>
                                    <label className="block mb-2 font-medium">Expert Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 focus:border-purple-400 focus:outline-none"
                                        placeholder="e.g., Dr. Sarah - Quantum Physics Expert"
                                        value={expertData.name}
                                        onChange={(e) => setExpertData(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                    />
                                </div>

                                {/* Domain */}
                                <div>
                                    <label className="block mb-2 font-medium">Expertise Domain</label>
                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                        {popularDomains.slice(0, 6).map(domain => (
                                            <motion.button
                                                key={domain}
                                                type="button"
                                                className={`p-2 rounded-lg text-sm border ${expertData.domain === domain
                                                    ? 'border-purple-400 bg-purple-400/20'
                                                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                                                    }`}
                                                whileHover={{ scale: 1.02 }}
                                                onClick={() => setExpertData(prev => ({ ...prev, domain }))}
                                            >
                                                {domain}
                                            </motion.button>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 focus:border-purple-400 focus:outline-none"
                                        placeholder="Or enter custom domain..."
                                        value={expertData.domain}
                                        onChange={(e) => setExpertData(prev => ({ ...prev, domain: e.target.value }))}
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block mb-2 font-medium">Expert Description</label>
                                    <textarea
                                        className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 focus:border-purple-400 focus:outline-none min-h-[120px]"
                                        placeholder="Describe your expertise, background, and what makes you unique..."
                                        value={expertData.description}
                                        onChange={(e) => setExpertData(prev => ({ ...prev, description: e.target.value }))}
                                        required
                                    />
                                    <div className="flex justify-between mt-1 text-xs">
                                        <span className="text-white/50">
                                            {expertData.description.length}/500 characters
                                        </span>
                                        <span className="text-white/50">
                                            Preview: &quot;{expertData.description.length > 50 ? expertData.description.substring(0, 47) + "..." : expertData.description}&quot;
                                        </span>
                                    </div>
                                    {expertData.description.length > 50 && (
                                        <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                            <p className="text-yellow-300 text-sm flex items-center">
                                                <FaInfoCircle className="mr-2" />
                                                Your full description will be used for AI training. The preview shows how it appears in listings (50 char limit).
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block mb-2 font-medium">Tags</label>
                                    <div className="flex mb-3">
                                        <input
                                            type="text"
                                            className="flex-1 bg-white/5 border border-white/20 rounded-l-lg py-3 px-4 focus:border-purple-400 focus:outline-none"
                                            placeholder="Add relevant tags..."
                                            value={currentTag}
                                            onChange={(e) => setCurrentTag(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                        />
                                        <motion.button
                                            type="button"
                                            className="bg-gradient-to-r from-[#8f46c1] to-[#d56f66] px-4 rounded-r-lg"
                                            whileHover={{ scale: 1.05 }}
                                            onClick={handleAddTag}
                                        >
                                            <FaPlus />
                                        </motion.button>
                                    </div>

                                    {expertData.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {expertData.tags.map(tag => (
                                                <motion.div
                                                    key={tag}
                                                    className="bg-purple-500/20 rounded-full px-3 py-1 text-sm flex items-center"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        className="ml-2 text-white/70 hover:text-white"
                                                        onClick={() => handleRemoveTag(tag)}
                                                    >
                                                        <FaTimes className="text-xs" />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <motion.button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleCreateExpert(e);
                                    }}
                                    className="w-full py-4 bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-lg font-semibold text-lg"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={!expertData.name || !expertData.domain || !expertData.description}
                                >
                                    Create AI Expert
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* Training Step */}
                    {creationStep === 'training' && (
                        <motion.div
                            className="max-w-2xl mx-auto text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="mb-8">
                                <motion.div
                                    className="w-24 h-24 mx-auto mb-6 relative"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                >
                                    <div className="w-full h-full rounded-full border-4 border-white/10 border-t-purple-500"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FaBrain className="text-2xl text-purple-400" />
                                    </div>
                                </motion.div>

                                <h2 className="text-2xl font-bold mb-2">Training Your AI Expert</h2>
                                <p className="text-white/70 mb-4">
                                    We&apos;re initializing your AI expert &quot;{expertData.name}&quot; with Sensay&apos;s advanced training system.
                                </p>

                                <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-full"
                                        initial={{ width: "0%" }}
                                        animate={{ width: `${trainingProgress}%` }}
                                    />
                                </div>

                                <p className="text-lg font-semibold">{Math.round(trainingProgress)}% Complete</p>
                            </div>

                            {/* Revenue Projection */}
                            <motion.div
                                className="bg-white/5 rounded-2xl p-6 border border-white/10"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 1 }}
                            >
                                <h3 className="text-lg font-bold mb-4 flex items-center justify-center">
                                    <FaChartLine className="mr-2 text-green-400" />
                                    Revenue Projection
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-400">${projectedRevenue.monthly}</p>
                                        <p className="text-sm text-white/70">Monthly Potential</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-400">${projectedRevenue.yearly}</p>
                                        <p className="text-sm text-white/70">Yearly Potential</p>
                                    </div>
                                </div>
                                <p className="text-xs text-white/50 mt-4">
                                    Based on average engagement in {expertData.domain} domain
                                </p>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Content Step */}
                    {creationStep === 'content' && (
                        <motion.div
                            className="max-w-4xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold mb-2">Train Your Expert</h2>
                                <p className="text-white/70">
                                    Add your knowledge, documents, and expertise to make your AI expert truly intelligent.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Text Training */}
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                    <h3 className="text-lg font-bold mb-4 flex items-center">
                                        <FaFileAlt className="mr-2 text-blue-400" />
                                        Add Text Knowledge
                                    </h3>
                                    <textarea
                                        className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 focus:border-purple-400 focus:outline-none min-h-[200px] mb-4"
                                        placeholder="Share your expertise, insights, methodologies, case studies, or any knowledge you want your AI to learn..."
                                        value={trainingContent}
                                        onChange={(e) => setTrainingContent(e.target.value)}
                                    />
                                    <motion.button
                                        className="w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-500/30"
                                        whileHover={{ scale: 1.02 }}
                                        onClick={handleAddTrainingContent}
                                        disabled={!trainingContent.trim()}
                                    >
                                        Add Knowledge
                                    </motion.button>
                                </div>

                                {/* File Upload */}
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                    <h3 className="text-lg font-bold mb-4 flex items-center">
                                        <FaCloudUploadAlt className="mr-2 text-green-400" />
                                        Upload Documents
                                    </h3>

                                    <div
                                        className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center mb-4 hover:border-purple-400/50 transition-colors cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <FaCloudUploadAlt className="text-3xl text-white/50 mx-auto mb-2" />
                                        <p className="text-white/70">Drop files or click to upload</p>
                                        <p className="text-xs text-white/50 mt-1">PDF, DOC, TXT files supported</p>
                                    </div>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept=".pdf,.doc,.docx,.txt"
                                        className="hidden"
                                        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                                    />

                                    {uploadedFiles.length > 0 && (
                                        <div className="space-y-2">
                                            {uploadedFiles.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                                                    <span className="text-sm">{file.name}</span>
                                                    <FaCheck className="text-green-400" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="text-center mt-8">
                                <motion.button
                                    className="px-8 py-3 bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-lg font-semibold"
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => setCreationStep('preview')}
                                >
                                    Preview Expert
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* Preview Step */}
                    {creationStep === 'preview' && (
                        <motion.div
                            className="max-w-4xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold mb-2">Preview Your Expert</h2>
                                <p className="text-white/70">Review your AI expert before publishing to the platform.</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Expert Card Preview */}
                                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/10">
                                    <div className="flex items-center mb-4">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8f46c1] to-[#d56f66] flex items-center justify-center mr-4">
                                            <FaRobot className="text-2xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">{expertData.name}</h3>
                                            <p className="text-white/70">{expertData.domain}</p>
                                        </div>
                                    </div>

                                    <p className="text-white/80 mb-4">{expertData.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {expertData.tags.map(tag => (
                                            <span key={tag} className="bg-purple-500/20 rounded-full px-3 py-1 text-xs">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-white/10">
                                        <div>
                                            <p className="text-lg font-bold">0</p>
                                            <p className="text-xs text-white/60">Subscribers</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold">$0</p>
                                            <p className="text-xs text-white/60">Earned</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold">New</p>
                                            <p className="text-xs text-white/60">Status</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Publishing Options */}
                                <div className="space-y-6">
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                        <h3 className="text-lg font-bold mb-4">Publishing Settings</h3>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span>Make expert discoverable</span>
                                                <div className="w-12 h-6 bg-green-500 rounded-full relative">
                                                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span>Enable monetization</span>
                                                <div className="w-12 h-6 bg-green-500 rounded-full relative">
                                                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-green-500/10 rounded-2xl p-6 border border-green-500/20">
                                        <h3 className="text-lg font-bold mb-2 text-green-400">Revenue Potential</h3>
                                        <p className="text-white/80 mb-4">
                                            Your expert is projected to earn <strong>${projectedRevenue.monthly}/month</strong> based on similar experts in {expertData.domain}.
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-green-400 font-bold">${projectedRevenue.perView}</p>
                                                <p className="text-white/60">Per interaction</p>
                                            </div>
                                            <div>
                                                <p className="text-green-400 font-bold">70%</p>
                                                <p className="text-white/60">Your share</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mt-8">
                                <motion.button
                                    className="px-8 py-4 bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-lg font-semibold text-lg"
                                    whileHover={{ scale: 1.05 }}
                                    onClick={handlePublishExpert}
                                >
                                    Publish Expert & Go Live
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* Publishing Step */}
                    {creationStep === 'publishing' && (
                        <motion.div
                            className="max-w-2xl mx-auto text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <motion.div
                                className="w-24 h-24 mx-auto mb-6"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="w-full h-full rounded-full border-4 border-white/10 border-t-green-500"></div>
                            </motion.div>

                            <h2 className="text-2xl font-bold mb-4">Publishing Your Expert</h2>
                            <p className="text-white/70 mb-8">
                                Your AI expert is being deployed to the MentorScroll platform. This will only take a moment.
                            </p>

                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <h3 className="font-bold mb-4">What&apos;s happening:</h3>
                                <div className="space-y-3 text-left">
                                    <div className="flex items-center">
                                        <FaCheck className="text-green-400 mr-3" />
                                        <span className="text-sm">Finalizing AI training</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaCheck className="text-green-400 mr-3" />
                                        <span className="text-sm">Setting up monetization</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                        <span className="text-sm">Making discoverable to users</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Complete Step */}
                    {creationStep === 'complete' && (
                        <motion.div
                            className="max-w-2xl mx-auto text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <motion.div
                                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                            >
                                <FaCheck className="text-3xl text-white" />
                            </motion.div>

                            <h2 className="text-3xl font-bold mb-4">🎉 Your Expert is Live!</h2>
                            <p className="text-white/70 mb-8">
                                &quot;{expertData.name}&quot; is now available on MentorScroll. Users can discover and learn from your AI expert, and you&apos;ll earn revenue from every interaction.
                            </p>

                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="text-center">
                                        <FaEye className="text-2xl text-blue-400 mx-auto mb-2" />
                                        <h3 className="font-bold mb-1">Now Discoverable</h3>
                                        <p className="text-sm text-white/70">Users can find your expert</p>
                                    </div>
                                    <div className="text-center">
                                        <FaDollarSign className="text-2xl text-green-400 mx-auto mb-2" />
                                        <h3 className="font-bold mb-1">Monetization Active</h3>
                                        <p className="text-sm text-white/70">Start earning immediately</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/dashboard">
                                    <motion.button
                                        className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        View Dashboard
                                    </motion.button>
                                </Link>

                                <motion.button
                                    className="px-6 py-3 bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-lg font-semibold"
                                    whileHover={{ scale: 1.05 }}
                                    onClick={handleReset}
                                >
                                    Create Another Expert
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Navigation */}
            <motion.nav
                className="fixed bottom-0 inset-x-0 h-20 bg-black/40 backdrop-blur-xl border-t border-white/20 z-50" // Increased z-index and height
                initial={{ y: 100 }}
                animate={{ y: 0 }}
            >
                <div className="flex items-center justify-around h-full px-4">
                    <Link href="/">
                        <motion.div
                            className="flex flex-col items-center text-white/70 hover:text-white transition-colors p-2"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaHome className="text-xl mb-1" />
                            <span className="text-xs">Home</span>
                        </motion.div>
                    </Link>

                    <Link href="/explore">
                        <motion.div
                            className="flex flex-col items-center text-white/70 hover:text-white transition-colors p-2"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaCompass className="text-xl mb-1" />
                            <span className="text-xs">Explore</span>
                        </motion.div>
                    </Link>

                    {/* Center Create Button - elevated */}
                    <motion.div
                        className="flex flex-col items-center -mt-6"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="w-14 h-14 bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-full flex items-center justify-center shadow-2xl border-4 border-black/20">
                            <FaRobot className="text-xl text-white" />
                        </div>
                        <span className="text-xs text-purple-300 mt-1 font-medium">Create</span>
                    </motion.div>

                    <Link href="/feed">
                        <motion.div
                            className="flex flex-col items-center text-white/70 hover:text-white transition-colors p-2"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaPlay className="text-xl mb-1" />
                            <span className="text-xs">Feed</span>
                        </motion.div>
                    </Link>

                    <Link href="/profile">
                        <motion.div
                            className="flex flex-col items-center text-white/70 hover:text-white transition-colors p-2"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaUser className="text-xl mb-1" />
                            <span className="text-xs">Profile</span>
                        </motion.div>
                    </Link>
                </div>
            </motion.nav>
        </div>
    );
}