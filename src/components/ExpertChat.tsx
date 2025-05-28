
"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaTimes, FaRobot, FaUser, FaLightbulb, FaQuestion } from 'react-icons/fa';
import { sensayAPI } from '../lib/sensay';
import { getExpertBySlug } from '../data/experts';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isTyping?: boolean;
}

interface ExpertChatProps {
    expertSlug: string;
    reelTitle: string;
    reelTopic: string;
    isOpen: boolean;
    onClose: () => void;
    expertUuid?: string;
}

const SUGGESTED_QUESTIONS = [
    "Can you explain this more simply?",
    "How does this apply to real life?",
    "What should I learn next?",
    "Can you give me an example?",
    "Why is this important?",
    "How can I remember this better?"
];

export default function ExpertChat({
    expertSlug,
    reelTitle,
    reelTopic,
    isOpen,
    onClose,
    expertUuid
}: ExpertChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [expertInfo, setExpertInfo] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize expert info and welcome message
    useEffect(() => {
        const expert = getExpertBySlug(expertSlug);
        if (expert) {
            setExpertInfo(expert);

            // Add welcome message when chat opens
            if (isOpen && messages.length === 0) {
                const welcomeMessage: ChatMessage = {
                    id: 'welcome-' + Date.now(),
                    role: 'assistant',
                    content: `${expert.greeting}\n\nI see you're interested in "${reelTitle}" - great choice! What would you like to know more about? 🤔`,
                    timestamp: new Date()
                };
                setMessages([welcomeMessage]);
            }
        }
    }, [expertSlug, isOpen, reelTitle]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const sendMessage = async (content: string) => {
        if (!content.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: 'user-' + Date.now(),
            role: 'user',
            content: content.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        // Add typing indicator
        const typingMessage: ChatMessage = {
            id: 'typing-' + Date.now(),
            role: 'assistant',
            content: '',
            timestamp: new Date(),
            isTyping: true
        };
        setMessages(prev => [...prev, typingMessage]);

        try {
            // Get expert UUID if not provided
            let uuid = expertUuid;
            if (!uuid) {
                const replicas = await sensayAPI.getExpertReplicas();
                const expert = replicas.find(r => r.slug === expertSlug);
                uuid = expert?.uuid;
            }

            if (!uuid) {
                throw new Error('Expert not found');
            }

            // Add context about the reel to the message
            const contextualMessage = `The user is asking about the educational content titled "${reelTitle}" about ${reelTopic}. Their question: "${content}". Please provide a helpful, engaging response that builds on the educational content while maintaining your expert personality and teaching style.`;

            const response = await sensayAPI.chatWithExpert(uuid, contextualMessage);

            // Remove typing indicator and add response
            setMessages(prev => {
                const filtered = prev.filter(msg => !msg.isTyping);
                const assistantMessage: ChatMessage = {
                    id: 'assistant-' + Date.now(),
                    role: 'assistant',
                    content: response.success ? response.content : 'Sorry, I had trouble processing that. Could you try asking in a different way?',
                    timestamp: new Date()
                };
                return [...filtered, assistantMessage];
            });

        } catch (error) {
            console.error('Error sending message:', error);

            // Remove typing indicator and add error message
            setMessages(prev => {
                const filtered = prev.filter(msg => !msg.isTyping);
                const errorMessage: ChatMessage = {
                    id: 'error-' + Date.now(),
                    role: 'assistant',
                    content: 'Oops! I\'m having trouble responding right now. Please try again in a moment! 😅',
                    timestamp: new Date()
                };
                return [...filtered, errorMessage];
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestedQuestion = (question: string) => {
        sendMessage(question);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(inputMessage);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="w-full max-w-lg h-[80vh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-t-3xl border border-white/10 flex flex-col"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <FaRobot className="text-white text-lg" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">
                                    {expertInfo?.name || 'AI Expert'}
                                </h3>
                                <p className="text-xs text-white/60">
                                    {expertInfo?.domain || 'Educational Expert'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                            <FaTimes className="text-white text-sm" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user'
                                    ? 'bg-blue-500'
                                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                                    }`}>
                                    {message.role === 'user' ? (
                                        <FaUser className="text-white text-sm" />
                                    ) : (
                                        <FaRobot className="text-white text-sm" />
                                    )}
                                </div>

                                <div className={`flex-1 ${message.role === 'user' ? 'text-right' : 'text-left'
                                    }`}>
                                    {message.isTyping ? (
                                        <div className="bg-white/10 rounded-2xl px-4 py-3 inline-block">
                                            <div className="flex space-x-1">
                                                <motion.div
                                                    className="w-2 h-2 bg-white/60 rounded-full"
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                                                />
                                                <motion.div
                                                    className="w-2 h-2 bg-white/60 rounded-full"
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                                />
                                                <motion.div
                                                    className="w-2 h-2 bg-white/60 rounded-full"
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className={`rounded-2xl px-4 py-3 inline-block max-w-xs ${message.role === 'user'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-white/10 text-white'
                                                }`}
                                        >
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                        </div>
                                    )}
                                    <p className="text-xs text-white/40 mt-1">
                                        {message.timestamp.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggested Questions */}
                    {messages.length <= 1 && (
                        <div className="px-4 pb-2">
                            <p className="text-xs text-white/60 mb-2 flex items-center">
                                <FaLightbulb className="mr-2" />
                                Try asking:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {SUGGESTED_QUESTIONS.slice(0, 3).map((question, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestedQuestion(question)}
                                        className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-white/80 transition-colors"
                                        disabled={isLoading}
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
                        <div className="flex items-center space-x-3">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Ask me anything about this topic..."
                                className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!inputMessage.trim() || isLoading}
                                className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                            >
                                <FaPaperPlane className="text-white text-sm" />
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}