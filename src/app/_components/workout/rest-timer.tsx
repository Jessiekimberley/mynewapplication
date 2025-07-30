"use client";

import { useState, useEffect, useCallback } from "react";
import { Clock, X, Play, Pause, Timer } from "lucide-react";

interface RestTimerProps {
    isActive: boolean;
    onComplete: () => void;
    onStop: () => void;
    defaultDuration?: number; // in seconds
}

export function RestTimer({ isActive, onComplete, onStop, defaultDuration = 90 }: RestTimerProps) {
    const [timeLeft, setTimeLeft] = useState(defaultDuration);
    const [isPaused, setIsPaused] = useState(false);

    const resetTimer = useCallback(() => {
        setTimeLeft(defaultDuration);
        setIsPaused(false);
    }, [defaultDuration]);

    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    const stopTimer = () => {
        setIsPaused(false);
        setTimeLeft(defaultDuration);
        onStop();
    };

    useEffect(() => {
        if (!isActive) {
            resetTimer();
            return;
        }

        if (isPaused) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, isPaused, onComplete, resetTimer]);

    useEffect(() => {
        if (isActive) {
            resetTimer();
        }
    }, [isActive, resetTimer]);

    if (!isActive) return null;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const progress = ((defaultDuration - timeLeft) / defaultDuration) * 100;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-lg">
            <div className="max-w-5xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Timer Display */}
                    <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-mauve-500 to-lavender-500 rounded-full p-2">
                            <Timer className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="text-2xl font-light text-premium font-mono">
                                {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
                            </div>
                            <span className="text-premium-secondary text-base font-light">Rest Timer</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={togglePause}
                            className="p-3 rounded-xl hover:bg-slate-100 transition-all duration-200 hover:scale-105"
                            title={isPaused ? "Resume" : "Pause"}
                        >
                            {isPaused ? (
                                <Play className="w-5 h-5 text-mauve-600" />
                            ) : (
                                <Pause className="w-5 h-5 text-mauve-600" />
                            )}
                        </button>
                        <button
                            onClick={stopTimer}
                            className="p-3 rounded-xl hover:bg-slate-100 transition-all duration-200 hover:scale-105"
                            title="Stop Timer"
                        >
                            <X className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-mauve-500 to-lavender-500 h-2 rounded-full transition-all duration-1000 ease-linear shadow-sm"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
} 