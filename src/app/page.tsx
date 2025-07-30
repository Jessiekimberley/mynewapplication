import { WorkoutList } from "~/app/_components/workout-list";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <WorkoutList />
    </HydrateClient>
  );
}
