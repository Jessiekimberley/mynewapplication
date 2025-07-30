import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import dotenv from "dotenv";
import * as schema from "../src/server/db/schema";
import {
    workoutPrograms,
    workoutDays,
    exercises
} from "../src/server/db/schema";

// Load environment variables
dotenv.config();

const pool = createPool({ uri: process.env.DATABASE_URL });
const db = drizzle(pool, { schema, mode: "default" });

async function seedWorkouts() {
    try {
        console.log("🌱 Starting workout data seeding...");

        // Create STRONGHER Build program
        await db.insert(workoutPrograms).values({
            name: "STRONGHER Build",
            description: "6-Week Full Body Progressive Overload Programme for women (35yo, beginner-intermediate)",
            duration: "6 weeks",
        });

        console.log("✅ Created workout program: STRONGHER Build");

        // Get the program ID
        const program = await db.query.workoutPrograms.findFirst({
            where: (programs, { eq }) => eq(programs.name, "STRONGHER Build"),
        });

        if (!program) {
            throw new Error("Failed to create workout program");
        }

        // Day 1 - Posterior Bias + Strength
        await db.insert(workoutDays).values({
            programId: program.id,
            name: "Day 1",
            focus: "Posterior Chain Strength",
            notes: "Glute + hamstring focus",
            order: 1,
        });

        console.log("✅ Created workout day: Day 1");

        // Get the day ID
        const day1 = await db.query.workoutDays.findFirst({
            where: (days, { eq, and }) => and(
                eq(days.name, "Day 1"),
                eq(days.programId, program.id)
            ),
        });

        if (!day1) {
            throw new Error("Failed to create Day 1");
        }

        console.log("✅ Created workout day:", day1.name);

        // Day 1 exercises
        const day1Exercises = [
            {
                name: "Barbell Romanian Deadlift",
                description: "Hinge movement; targets hamstrings and glutes. Keep a flat back and slight knee bend.",
                sets: 3,
                reps: "8",
                order: 1,
                musclesWorked: "Hamstrings, glutes, lower back",
                howToDo: "Stand with feet hip-width apart, hold barbell in front of thighs. Hinge at hips, keeping back flat, and lower bar down legs. Return to standing by driving hips forward.",
            },
            {
                name: "Front Foot Elevated Split Squat",
                description: "Quad/glute focus. Elevate front foot 2–3 inches, keep chest up, and descend under control.",
                sets: 3,
                reps: "10/leg",
                order: 2,
                musclesWorked: "Quads, glutes, hamstrings",
                howToDo: "Place front foot on elevated surface (2-3 inches). Step back into split stance. Lower back knee toward ground while keeping front knee over toes. Drive back up through front foot.",
            },
            {
                name: "Lat Pulldown",
                description: "Wide grip; engage lats and mid-back. Pull bar to chest.",
                sets: 3,
                reps: "10",
                order: 3,
                musclesWorked: "Lats, rhomboids, biceps",
                howToDo: "Sit with thighs secured under pads. Grasp bar with wide grip. Pull bar down to upper chest while keeping chest up and elbows down. Control the return.",
            },
            {
                name: "Glute-Focused Step-Ups",
                description: "Use a high box. Drive through heel. Glute activation peak at top.",
                sets: 2,
                reps: "10–12/leg",
                order: 4,
                musclesWorked: "Glutes, quads, hamstrings",
                howToDo: "Place one foot on elevated surface (knee height). Drive through heel to step up, keeping chest up. Control the descent. Focus on glute activation at the top.",
            },
            {
                name: "Hanging Leg Raises",
                description: "Controlled core exercise. Avoid swinging.",
                sets: 3,
                reps: "12",
                order: 5,
                musclesWorked: "Abs, hip flexors",
                howToDo: "Hang from pull-up bar. Raise legs to parallel or higher while keeping them straight. Control the descent. Avoid swinging or using momentum.",
            },
        ];

        for (const exercise of day1Exercises) {
            await db.insert(exercises).values({
                workoutDayId: day1.id,
                ...exercise,
            });
        }

        console.log(`✅ Added ${day1Exercises.length} exercises to Day 1`);

        // Day 2 - Compound Glutes + Power
        await db.insert(workoutDays).values({
            programId: program.id,
            name: "Day 2",
            focus: "Compound Glutes + Power",
            notes: "Hip thrust + deadlift priority",
            order: 2,
        });

        console.log("✅ Created workout day: Day 2");

        // Get the day ID
        const day2 = await db.query.workoutDays.findFirst({
            where: (days, { eq, and }) => and(
                eq(days.name, "Day 2"),
                eq(days.programId, program.id)
            ),
        });

        if (!day2) {
            throw new Error("Failed to create Day 2");
        }

        // Day 2 exercises
        const day2Exercises = [
            {
                name: "Barbell Hip Thrust",
                description: "Strongest glute builder. Use bar pad, chin tucked. Full lockout at top.",
                sets: 4,
                reps: "6–8",
                order: 1,
                musclesWorked: "Glutes, hamstrings, core",
                howToDo: "Sit on ground with upper back against bench. Place barbell across hips with pad. Drive hips up to full lockout, squeezing glutes at top. Control the descent.",
            },
            {
                name: "Trap Bar Deadlift",
                description: "Safe hinge for strength. Focus on leg drive and glute finish.",
                sets: 3,
                reps: "6",
                order: 2,
                musclesWorked: "Glutes, hamstrings, quads, back",
                howToDo: "Stand inside trap bar with feet hip-width apart. Hinge at hips and grasp handles. Drive through feet to stand up, keeping bar close to body. Control the descent.",
            },
            {
                name: "Dumbbell Bench Press",
                description: "Horizontal press. Keep wrists neutral. Control the negative.",
                sets: 3,
                reps: "10",
                order: 3,
                musclesWorked: "Chest, triceps, shoulders",
                howToDo: "Lie on bench with dumbbells at chest level. Press up to full extension, keeping wrists neutral. Control the descent back to chest.",
            },
            {
                name: "Kettlebell Goblet Squat",
                description: "Quad + core. Hold KB at chest. Sit deep. Elbows inside knees.",
                sets: 3,
                reps: "12",
                order: 4,
                musclesWorked: "Quads, glutes, core",
                howToDo: "Hold kettlebell at chest level. Squat down, keeping elbows inside knees. Sit deep, then drive back up through heels.",
            },
            {
                name: "Side Plank with Reach",
                description: "Core + oblique stability. Thread arm under and return with control.",
                sets: 2,
                reps: "30s/side",
                order: 5,
                musclesWorked: "Obliques, core, shoulders",
                howToDo: "Hold side plank position. Thread top arm under body and return with control. Maintain stable position throughout.",
            },
        ];

        for (const exercise of day2Exercises) {
            await db.insert(exercises).values({
                workoutDayId: day2.id,
                ...exercise,
            });
        }

        console.log(`✅ Added ${day2Exercises.length} exercises to Day 2`);

        // Day 3 - Athletic & Unilateral
        await db.insert(workoutDays).values({
            programId: program.id,
            name: "Day 3",
            focus: "Athletic & Unilateral",
            notes: "Functional + total-body finishers",
            order: 3,
        });

        console.log("✅ Created workout day: Day 3");

        // Get the day ID
        const day3 = await db.query.workoutDays.findFirst({
            where: (days, { eq, and }) => and(
                eq(days.name, "Day 3"),
                eq(days.programId, program.id)
            ),
        });

        if (!day3) {
            throw new Error("Failed to create Day 3");
        }

        // Day 3 exercises
        const day3Exercises = [
            {
                name: "Walking Lunges with Dumbbells",
                description: "Glute + quad + balance. Keep torso upright and step long.",
                sets: 3,
                reps: "10/leg",
                order: 1,
                musclesWorked: "Glutes, quads, hamstrings, core",
                howToDo: "Hold dumbbells at sides. Step forward into lunge, keeping torso upright. Drive back up and step forward with opposite leg. Continue walking pattern.",
            },
            {
                name: "Dumbbell Single-Leg RDL",
                description: "Hinge + balance. Hips square. Feel stretch in hamstrings.",
                sets: 3,
                reps: "8/leg",
                order: 2,
                musclesWorked: "Hamstrings, glutes, core",
                howToDo: "Stand on one leg, hold dumbbells. Hinge at hips, keeping back flat. Lower weights down leg while lifting back leg. Return to standing.",
            },
            {
                name: "Push Press or Landmine Press",
                description: "Powerful vertical press. Use lower body to assist.",
                sets: 3,
                reps: "8",
                order: 3,
                musclesWorked: "Shoulders, triceps, legs",
                howToDo: "Hold barbell at shoulder level. Dip slightly with legs, then drive up with legs and press bar overhead. Control the descent.",
            },
            {
                name: "Seated Row Machine",
                description: "Back/rear delts. Full range. Avoid shrugging.",
                sets: 3,
                reps: "12",
                order: 4,
                musclesWorked: "Lats, rhomboids, rear delts",
                howToDo: "Sit with chest against pad. Pull handles to chest, squeezing shoulder blades together. Control the return without shrugging.",
            },
            {
                name: "Cable Pallof Press",
                description: "Anti-rotation core drill. Keep arms straight, resist twist.",
                sets: 2,
                reps: "12/side",
                order: 5,
                musclesWorked: "Core, obliques, shoulders",
                howToDo: "Stand sideways to cable machine. Hold cable at chest level. Press straight out, resisting rotation. Return with control.",
            },
        ];

        for (const exercise of day3Exercises) {
            await db.insert(exercises).values({
                workoutDayId: day3.id,
                ...exercise,
            });
        }

        console.log(`✅ Added ${day3Exercises.length} exercises to Day 3`);

        // Bonus Day - Glute, Abs & Arm Pump
        await db.insert(workoutDays).values({
            programId: program.id,
            name: "Bonus Day",
            focus: "Glute, Abs & Arm Pump",
            notes: "Optional higher-rep finisher session",
            order: 4,
        });

        console.log("✅ Created workout day: Bonus Day");

        // Get the day ID
        const bonusDay = await db.query.workoutDays.findFirst({
            where: (days, { eq, and }) => and(
                eq(days.name, "Bonus Day"),
                eq(days.programId, program.id)
            ),
        });

        if (!bonusDay) {
            throw new Error("Failed to create Bonus Day");
        }

        // Bonus Day exercises
        const bonusDayExercises = [
            {
                name: "Glute Bridge March on Bench",
                description: "Glutes + stability. Keep hips up, alternate legs.",
                sets: 2,
                reps: "20 total",
                order: 1,
                musclesWorked: "Glutes, hamstrings, core",
                howToDo: "Lie on bench with feet on ground. Bridge hips up and hold. March legs up and down while maintaining bridge position.",
            },
            {
                name: "Banded Lateral Walks",
                description: "Glute medius activation. Maintain band tension.",
                sets: 2,
                reps: "30 steps",
                order: 2,
                musclesWorked: "Glute medius, quads",
                howToDo: "Place resistance band around thighs. Step sideways while maintaining tension. Keep knees slightly bent and hips level.",
            },
            {
                name: "Hammer Curl + Overhead Triceps Extension Superset",
                description: "Arms-focused superset. Keep movement strict.",
                sets: 3,
                reps: "12 each",
                order: 3,
                musclesWorked: "Biceps, triceps",
                howToDo: "Perform hammer curls, then immediately do overhead triceps extensions. Rest between supersets.",
            },
            {
                name: "Cable Crunches",
                description: "Keep spine rounded, focus on abs not arms.",
                sets: 3,
                reps: "15",
                order: 4,
                musclesWorked: "Abs, obliques",
                howToDo: "Kneel facing cable machine. Hold cable behind head. Crunch forward, rounding spine. Focus on abs, not arm movement.",
            },
            {
                name: "Optional Finisher (EMOM 6 min): 6 push-ups + 6 band pull-aparts",
                description: "Upper body & shoulder burn.",
                sets: 1,
                reps: "6 minutes",
                order: 5,
                musclesWorked: "Chest, shoulders, upper back",
                howToDo: "Every minute on the minute: 6 push-ups followed by 6 band pull-aparts. Repeat for 6 minutes.",
            },
        ];

        for (const exercise of bonusDayExercises) {
            await db.insert(exercises).values({
                workoutDayId: bonusDay.id,
                ...exercise,
            });
        }

        console.log(`✅ Added ${bonusDayExercises.length} exercises to Bonus Day`);

        console.log("🎉 Workout seeding completed successfully!");
        console.log(`📊 Created:`);
        console.log(`   - 1 workout program`);
        console.log(`   - 4 workout days`);
        console.log(`   - ${day1Exercises.length + day2Exercises.length + day3Exercises.length + bonusDayExercises.length} exercises`);

    } catch (error) {
        console.error("❌ Error seeding workouts:", error);
        throw error;
    } finally {
        await pool.end();
    }
}

// Run the seeding function
seedWorkouts().catch(console.error); 