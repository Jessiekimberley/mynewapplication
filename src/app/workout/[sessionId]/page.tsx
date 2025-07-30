import { WorkoutSession } from "~/app/_components/workout/workout-session";
import { HydrateClient } from "~/trpc/server";

interface WorkoutPageProps {
    params: Promise<{
        sessionId: string;
    }>;
}

export default async function WorkoutPage({ params }: WorkoutPageProps) {
    const { sessionId } = await params;
    const sessionIdNumber = parseInt(sessionId);

    if (isNaN(sessionIdNumber)) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-light text-gray-900 mb-2">Invalid Session</h1>
                    <p className="text-gray-600">The workout session could not be found.</p>
                </div>
            </div>
        );
    }

    return (
        <HydrateClient>
            <WorkoutSession sessionId={sessionIdNumber} />
        </HydrateClient>
    );
} 