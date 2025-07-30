"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Trophy, Target } from "lucide-react";
import { api } from "~/trpc/react";
import { ExerciseCard } from "./exercise-card";
import { RestTimer } from "./rest-timer";

interface WorkoutSessionProps {
    sessionId: number;
}

interface Exercise {
    id: number;
    name: string;
    description: string | null;
    sets: number;
    reps: string;
    order: number;
    musclesWorked: string | null;
    howToDo: string | null;
}

interface ExerciseSet {
    id: number;
    exerciseId: number;
    setNumber: number;
    weight: number | null;
    reps: number | null;
    completed: boolean;
    completedAt: Date | null;
    notes: string | null;
}

export function WorkoutSession({ sessionId }: WorkoutSessionProps) {
    const router = useRouter();
    const [isRestTimerActive, setIsRestTimerActive] = useState(false);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

    const { data: session } = api.workout.getSession.useQuery({ sessionId });
    const { data: exercises } = api.workout.getSessionExercises.useQuery({ sessionId });
    const { data: sets } = api.workout.getSessionSets.useQuery({ sessionId });

    const updateSessionMutation = api.workout.updateSession.useMutation();

    useEffect(() => {
        // Auto-save session progress
        if (session) {
            updateSessionMutation.mutate({
                sessionId,
                status: "in_progress",
                startedAt: session.startedAt || new Date(),
            });
        }
    }, [sessionId, session]);

    if (!session || !exercises || !sets) {
        return (
            <div className="flex min-h-screen items-center justify-center gradient-primary">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-6"></div>
                    <p className="text-premium-secondary text-lg">Loading your workout...</p>
                </div>
            </div>
        );
    }

    const handleSetComplete = (exerciseId: number, setNumber: number, weight?: number, reps?: number) => {
        // Start rest timer
        setIsRestTimerActive(true);
    };

    const handleRestTimerComplete = () => {
        setIsRestTimerActive(false);
        // Optionally move to next exercise
        if (currentExerciseIndex < exercises.length - 1) {
            setCurrentExerciseIndex(currentExerciseIndex + 1);
        }
    };

    const handleRestTimerStop = () => {
        setIsRestTimerActive(false);
    };

    const completedExercises = exercises.filter((exercise: Exercise) => {
        const exerciseSets = sets.filter((s: ExerciseSet) => s.exerciseId === exercise.id);
        return exerciseSets.every((set: ExerciseSet) => set.completed);
    }).length;

    const totalExercises = exercises.length;

    return (
        <div className="min-h-screen gradient-primary">
            {/* Rest Timer Overlay */}
            <RestTimer
                isActive={isRestTimerActive}
                onComplete={handleRestTimerComplete}
                onStop={handleRestTimerStop}
                defaultDuration={90}
            />

            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center space-x-3 text-premium-secondary hover:text-premium transition-colors px-4 py-2 rounded-xl hover:bg-white/50"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-light">Back to Workouts</span>
                    </button>

                    <div className="text-center">
                        <h1 className="text-display text-3xl font-light text-premium mb-2">
                            {session.workoutDay?.name || "Workout"}
                        </h1>
                        <div className="flex items-center justify-center space-x-4">
                            <div className="flex items-center text-premium-secondary">
                                <Target className="w-4 h-4 mr-2" />
                                <span className="text-base font-light">
                                    {completedExercises} of {totalExercises} exercises completed
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="w-32"></div> {/* Spacer for centering */}
                </div>

                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-sage-500 to-mint-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-sm"
                            style={{ width: `${(completedExercises / totalExercises) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-3">
                        <span className="text-premium-secondary text-sm font-light">Start</span>
                        <span className="text-premium-secondary text-sm font-light">Complete</span>
                    </div>
                </div>

                {/* Exercises */}
                <div className="space-y-8">
                    {exercises.map((exercise: Exercise, index: number) => {
                        const exerciseSets = sets.filter((s: ExerciseSet) => s.exerciseId === exercise.id);
                        return (
                            <ExerciseCard
                                key={exercise.id}
                                exercise={exercise}
                                sessionId={sessionId}
                                sets={exerciseSets}
                                onSetComplete={handleSetComplete}
                            />
                        );
                    })}
                </div>

                {/* Workout Complete */}
                {completedExercises === totalExercises && (
                    <div className="text-center py-16">
                        <div className="bg-gradient-to-r from-sage-500 to-mint-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                            <Trophy className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-display text-3xl font-light text-premium mb-4">Workout Complete!</h2>
                        <p className="text-premium-secondary text-xl font-light mb-8 max-w-2xl mx-auto">
                            Incredible work! You've completed all exercises and taken another step toward your strength goals.
                        </p>
                        <button
                            onClick={() => router.push("/")}
                            className="btn-primary text-lg px-8 py-4"
                        >
                            Back to Workouts
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
} 