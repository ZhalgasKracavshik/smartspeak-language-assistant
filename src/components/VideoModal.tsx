import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoId: string;
    title: string;
}

export function VideoModal({ isOpen, onClose, videoId, title }: VideoModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-black w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative"
                >
                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10 bg-gradient-to-b from-black/60 to-transparent">
                        <h3 className="text-white font-medium text-lg drop-shadow-md line-clamp-1 flex-1 mr-4">{title}</h3>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-full"
                        >
                            <X className="size-6" />
                        </Button>
                    </div>

                    {/* Video Player */}
                    <div className="relative pt-[56.25%] bg-black">
                        <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                            title={title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
