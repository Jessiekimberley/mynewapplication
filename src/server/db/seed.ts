import { db } from "~/server/db";
import { workoutPrograms, workoutDays, exercises } from "~/server/db/schema";

export async function seed() {
    console.log("🌱 Seeding database...");

    // Create STRONGHER Build program
    const [program] = await db
        .insert(workoutPrograms)
        .values({
            name: "STRONGHER Build",
            description: "A comprehensive strength training program designed for real results",
            duration: "6 weeks",
        });

    // Create workout days
    const day1 = await db
        .insert(workoutDays)
        .values({
            programId: program.id,
            name: "Day 1",
            focus: "Posterior Chain Strength",
            order: 1,
        });

    const day2 = await db
        .insert(workoutDays)
        .values({
            programId: program.id,
            name: "Day 2",
            focus: "Upper Body Power",
            order: 2,
        });

    const day3 = await db
        .insert(workoutDays)
        .values({
            programId: program.id,
            name: "Day 3",
            focus: "Full Body Strength",
            order: 3,
        });

    const bonusDay = await db
        .insert(workoutDays)
        .values({
            programId: program.id,
            name: "Bonus Day",
            focus: "Core & Stability",
            order: 4,
        });

    // Create exercises for Day 1
    await db.insert(exercises).values([
        {
            workoutDayId: day1.id,
            name: "Romanian Deadlift",
            sets: 3,
            reps: "8-10",
            order: 1,
            musclesWorked: "Hamstrings, glutes, lower back",
            howToDo: "Stand with feet hip-width apart, hold barbell in front of thighs. Hinge at hips, keeping back straight, lower bar down legs until you feel stretch in hamstrings. Drive hips forward to return to start.",
        },
        {
            workoutDayId: day1.id,
            name: "Bulgarian Split Squats",
            sets: 3,
            reps: "10/leg",
            order: 2,
            musclesWorked: "Quads, glutes, hamstrings",
            howToDo: "Place rear foot on bench behind you. Lower body until rear knee nearly touches ground. Drive through front foot to return to start.",
        },
        {
            workoutDayId: day1.id,
            name: "Hip Thrusts",
            sets: 3,
            reps: "12-15",
            order: 3,
            musclesWorked: "Glutes, hamstrings",
            howToDo: "Sit on ground with upper back against bench, barbell across hips. Drive hips up until body forms straight line from shoulders to knees.",
        },
    ]);

    // Create exercises for Day 2
    await db.insert(exercises).values([
        {
            workoutDayId: day2.id,
            name: "Bench Press",
            sets: 4,
            reps: "6-8",
            order: 1,
            musclesWorked: "Chest, triceps, shoulders",
            howToDo: "Lie on bench, feet flat on ground. Lower bar to chest, then press back up to full extension.",
        },
        {
            workoutDayId: day2.id,
            name: "Overhead Press",
            sets: 3,
            reps: "8-10",
            order: 2,
            musclesWorked: "Shoulders, triceps",
            howToDo: "Stand with feet shoulder-width apart. Press barbell overhead, keeping core tight and avoiding excessive back arch.",
        },
        {
            workoutDayId: day2.id,
            name: "Bent Over Rows",
            sets: 3,
            reps: "10-12",
            order: 3,
            musclesWorked: "Upper back, biceps",
            howToDo: "Bend at hips and knees, keeping back straight. Pull barbell to lower chest, squeezing shoulder blades together.",
        },
    ]);

    // Create exercises for Day 3
    await db.insert(exercises).values([
        {
            workoutDayId: day3.id,
            name: "Squats",
            sets: 4,
            reps: "8-10",
            order: 1,
            musclesWorked: "Quads, glutes, hamstrings",
            howToDo: "Stand with feet shoulder-width apart. Lower body as if sitting back into a chair, keeping knees in line with toes.",
        },
        {
            workoutDayId: day3.id,
            name: "Pull-ups",
            sets: 3,
            reps: "6-8",
            order: 2,
            musclesWorked: "Upper back, biceps",
            howToDo: "Hang from pull-up bar with hands shoulder-width apart. Pull body up until chin clears bar, then lower with control.",
        },
        {
            workoutDayId: day3.id,
            name: "Plank",
            sets: 3,
            reps: "30s",
            order: 3,
            musclesWorked: "Core, shoulders",
            howToDo: "Hold body in straight line from head to heels, supporting weight on forearms and toes.",
        },
    ]);

    // Create exercises for Bonus Day
    await db.insert(exercises).values([
        {
            workoutDayId: bonusDay.id,
            name: "Dead Bug",
            sets: 3,
            reps: "10/side",
            order: 1,
            musclesWorked: "Core, hip flexors",
            howToDo: "Lie on back with knees bent, feet flat. Extend opposite arm and leg while keeping lower back pressed to ground.",
        },
        {
            workoutDayId: bonusDay.id,
            name: "Bird Dog",
            sets: 3,
            reps: "10/side",
            order: 2,
            musclesWorked: "Core, shoulders, hips",
            howToDo: "Start on hands and knees. Extend opposite arm and leg while keeping hips level and core engaged.",
        },
        {
            workoutDayId: bonusDay.id,
            name: "Side Plank",
            sets: 3,
            reps: "30s/side",
            order: 3,
            musclesWorked: "Core, obliques",
            howToDo: "Lie on side, prop up on forearm. Lift hips to form straight line from head to feet.",
        },
    ]);

    console.log("✅ Database seeded successfully!");
} 