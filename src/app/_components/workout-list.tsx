"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, TrendingUp, Sparkles } from "lucide-react";

interface WorkoutDay {
    id: number;
    name: string;
    focus: string | null;
    order: number;
}

interface WorkoutSession {
    id: number;
    status: "not_started" | "in_progress" | "completed";
    startedAt: Date;
    completedAt: Date | null;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "completed":
            return "bg-gradient-to-r from-sage-500 to-mint-500 text-white";
        case "in_progress":
            return "bg-gradient-to-r from-sky-500 to-azure-500 text-white";
        default:
            return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700";
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case "completed":
            return "Completed";
        case "in_progress":
            return "In Progress";
        default:
            return "Not Started";
    }
};

export function WorkoutList() {
    const router = useRouter();
    const [selectedProgramId, setSelectedProgramId] = useState(1); // Default to first program

    const { data: programs } = api.workout.getPrograms.useQuery();
    const { data: workoutDays } = api.workout.getWorkoutDays.useQuery(
        { programId: selectedProgramId },
        { enabled: !!selectedProgramId }
    );

    const createSessionMutation = api.workout.getOrCreateSession.useMutation();

    const handleStartWorkout = async (workoutDayId: number) => {
        try {
            const session = await createSessionMutation.mutateAsync({ workoutDayId });
            if (session) {
                router.push(`/workout/${session.id}`);
            }
        } catch (error) {
            console.error("Failed to start workout:", error);
        }
    };

    if (!workoutDays) {
        return (
            <div className="flex min-h-screen items-center justify-center gradient-primary">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-6"></div>
                    <p className="text-premium-secondary text-lg">Loading your workouts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen gradient-primary">
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Premium Header */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center mb-4">
                        <Sparkles className="w-8 h-8 text-mauve-500 mr-3" />
                        <h1 className="text-display text-5xl font-light text-premium">STRONGHER</h1>
                    </div>
                    <p className="text-premium-secondary text-xl font-light max-w-2xl mx-auto">
                        Build your strength, one workout at a time. Premium fitness tracking designed for real results.
                    </p>
                </div>

                {/* Program Selector */}
                {programs && programs.length > 1 && (
                    <div className="mb-12">
                        <div className="max-w-md mx-auto">
                            <label className="block text-premium-secondary text-sm font-medium mb-3">
                                Select Program
                            </label>
                            <select
                                value={selectedProgramId}
                                onChange={(e) => setSelectedProgramId(Number(e.target.value))}
                                className="input text-center"
                            >
                                {programs.map((program) => (
                                    <option key={program.id} value={program.id}>
                                        {program.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* Workout Days Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {workoutDays.map((day) => (
                        <WorkoutDayCard
                            key={day.id}
                            day={day}
                            onStartWorkout={handleStartWorkout}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

interface WorkoutDayCardProps {
    day: WorkoutDay;
    onStartWorkout: (workoutDayId: number) => void;
}

function WorkoutDayCard({ day, onStartWorkout }: WorkoutDayCardProps) {
    const { data: history } = api.workout.getWorkoutHistory.useQuery(
        { workoutDayId: day.id },
        { refetchInterval: 5000 } // Refresh every 5 seconds
    );

    const lastSession = history?.[0];
    const isCompleted = lastSession?.status === "completed";

    return (
        <div className="card-elevated group">
            <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                    <h3 className="text-display text-2xl font-light text-premium mb-2">{day.name}</h3>
                    {day.focus && (
                        <p className="text-premium-secondary text-base font-light">{day.focus}</p>
                    )}
                </div>

                {/* Status Badge */}
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${isCompleted ? 'bg-gradient-to-r from-sage-500 to-mint-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {isCompleted ? 'Completed' : 'Ready'}
                </div>
            </div>

            {/* Last completed date */}
            {lastSession?.completedAt && (
                <div className="flex items-center text-caption mb-6">
                    <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                    <span>
                        Last completed: {new Date(lastSession.completedAt).toLocaleDateString()}
                    </span>
                </div>
            )}

            {/* Action Button */}
            <button
                onClick={() => onStartWorkout(day.id)}
                className="btn-primary w-full group-hover:shadow-xl transition-all duration-300"
            >
                Start Workout
            </button>
        </div>
    );
} 