"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Minus, CheckCircle, Circle, Target, Zap } from "lucide-react";
import { api } from "~/trpc/react";

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

interface ExerciseCardProps {
    exercise: Exercise;
    sessionId: number;
    sets: ExerciseSet[];
    onSetComplete: (exerciseId: number, setNumber: number, weight?: number, reps?: number) => void;
}

export function ExerciseCard({
    exercise,
    sessionId,
    sets,
    onSetComplete
}: ExerciseCardProps) {
    const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
    const [currentSet, setCurrentSet] = useState(1);
    const [weight, setWeight] = useState<number | undefined>();
    const [reps, setReps] = useState<number | undefined>();

    const completeSetMutation = api.workout.completeSet.useMutation();
    const { data: lastSession } = api.workout.getLastCompletedSession.useQuery(
        { exerciseId: exercise.id },
        { enabled: !!exercise.id }
    );

    const completedSets = sets.filter(set => set.completed).length;
    const totalSets = exercise.sets;

    const handleCompleteSet = async () => {
        if (!weight && !reps) return;

        try {
            await completeSetMutation.mutateAsync({
                sessionId,
                exerciseId: exercise.id,
                setNumber: currentSet,
                weight,
                reps,
            });

            onSetComplete(exercise.id, currentSet, weight, reps);

            // Reset for next set
            setWeight(undefined);
            setReps(undefined);

            if (currentSet < totalSets) {
                setCurrentSet(currentSet + 1);
            }
        } catch (error) {
            console.error("Failed to complete set:", error);
        }
    };

    const getSetStatus = (setNumber: number) => {
        const set = sets.find(s => s.setNumber === setNumber);
        if (!set) return "pending";
        return set.completed ? "completed" : "pending";
    };

    const isSetCompleted = (setNumber: number) => {
        return sets.some(s => s.setNumber === setNumber && s.completed);
    };

    const getSetData = (setNumber: number) => {
        return sets.find(s => s.setNumber === setNumber);
    };

    return (
        <div className="card-elevated mb-8">
            {/* Exercise Header */}
            <div className="mb-8">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-display text-2xl font-light text-premium mb-2">{exercise.name}</h3>
                        <div className="flex items-center space-x-4">
                            <span className="text-premium-secondary text-lg font-light">
                                {exercise.sets} sets × {exercise.reps}
                            </span>
                            <div className="flex items-center text-sage-600">
                                <Target className="w-4 h-4 mr-1" />
                                <span className="text-sm font-light">Exercise {exercise.order}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
                        className="flex items-center space-x-2 text-mauve-600 hover:text-mauve-700 transition-colors px-4 py-2 rounded-lg hover:bg-mauve-50"
                    >
                        <span className="text-sm font-medium">Instructions</span>
                        {isInstructionsOpen ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Instructions (Collapsible) */}
            {isInstructionsOpen && (
                <div className="mb-8 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
                    {exercise.howToDo && (
                        <div className="mb-6">
                            <h4 className="text-premium text-base font-medium mb-3 flex items-center">
                                <Zap className="w-4 h-4 mr-2 text-mauve-500" />
                                How to do it:
                            </h4>
                            <p className="text-premium-secondary text-base leading-relaxed">{exercise.howToDo}</p>
                        </div>
                    )}
                    {exercise.musclesWorked && (
                        <div>
                            <h4 className="text-premium text-base font-medium mb-3 flex items-center">
                                <Target className="w-4 h-4 mr-2 text-sage-500" />
                                Muscles worked:
                            </h4>
                            <p className="text-premium-secondary text-base leading-relaxed">{exercise.musclesWorked}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Last Session Data */}
            {lastSession && (lastSession.weight || lastSession.reps) && (
                <div className="mb-8 p-4 bg-gradient-to-r from-sky-50 to-azure-50 rounded-2xl border border-sky-200">
                    <p className="text-sky-800 font-light text-base">
                        <span className="font-medium">Last week:</span> {lastSession.weight ? `${lastSession.weight}kg` : ''}
                        {lastSession.weight && lastSession.reps ? ' × ' : ''}
                        {lastSession.reps ? `${lastSession.reps} reps` : ''}
                    </p>
                </div>
            )}

            {/* Sets Progress */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-premium text-lg font-medium">Sets Progress</span>
                    <span className="text-premium-secondary text-base">{completedSets}/{totalSets} completed</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Array.from({ length: totalSets }, (_, i) => i + 1).map((setNumber) => {
                        const status = getSetStatus(setNumber);
                        const setData = getSetData(setNumber);

                        return (
                            <div key={setNumber} className="relative">
                                <div className={`text-center p-4 rounded-2xl border-2 transition-all duration-300 ${status === "completed"
                                        ? "bg-gradient-to-r from-sage-500 to-mint-500 border-sage-400 text-white shadow-lg"
                                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                    }`}>
                                    <div className="text-sm font-medium mb-2">Set {setNumber}</div>
                                    {setData && setData.completed && (
                                        <div className="text-xs space-y-1">
                                            {setData.weight && <div className="font-medium">{setData.weight}kg</div>}
                                            {setData.reps && <div>{setData.reps} reps</div>}
                                        </div>
                                    )}
                                    {status === "completed" && (
                                        <CheckCircle className="w-5 h-5 mx-auto mt-2" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Current Set Input */}
            {currentSet <= totalSets && (
                <div className="space-y-6">
                    <div className="text-center">
                        <h4 className="text-premium text-xl font-medium mb-2">
                            Set {currentSet} of {totalSets}
                        </h4>
                        <p className="text-premium-secondary text-base">Track your progress</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-premium text-sm font-medium mb-3">
                                Weight (kg)
                            </label>
                            <input
                                type="number"
                                value={weight || ""}
                                onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : undefined)}
                                className="input text-center text-lg"
                                placeholder="0"
                                min="0"
                                step="0.5"
                            />
                        </div>

                        <div>
                            <label className="block text-premium text-sm font-medium mb-3">
                                Reps
                            </label>
                            <input
                                type="number"
                                value={reps || ""}
                                onChange={(e) => setReps(e.target.value ? Number(e.target.value) : undefined)}
                                className="input text-center text-lg"
                                placeholder="0"
                                min="0"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleCompleteSet}
                        disabled={completeSetMutation.isLoading || (!weight && !reps)}
                        className="btn-accent w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {completeSetMutation.isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Saving...
                            </div>
                        ) : (
                            "Mark Set Complete"
                        )}
                    </button>
                </div>
            )}

            {/* Exercise Complete */}
            {currentSet > totalSets && (
                <div className="text-center py-8">
                    <div className="bg-gradient-to-r from-sage-500 to-mint-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-premium text-xl font-medium mb-2">Exercise Complete!</h3>
                    <p className="text-premium-secondary text-base">Great work! Ready for the next exercise.</p>
                </div>
            )}
        </div>
    );
} 