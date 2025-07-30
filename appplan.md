# STRONGHER – App Functionality Plan (Version 1)

## Core Features – Version 1

### 1. Home Screen

- List of workout days (e.g., Day 1 / Day 2 / Day 3 / Bonus Day)
- Each workout shows:
  - Name
  - Status (Not started / In progress / Completed)
  - Last completed date
- Selecting a workout loads full plan

### 2. Workout Session Screen (Persistent)

- Scrollable layout with the following structure:
  - Sticky Rest Timer Overlay
  - Workout Title
  - Exercise Cards:
    - Exercise name
    - Sets & Reps (editable)
    - Last week's data (faint text or modal)
    - "+" and "–" buttons to add/remove sets
    - Weight input (kg or lbs toggle)
    - Collapsible instruction section:
      - “How to do it”
      - “Muscles worked”
    - “Mark Set Complete” button triggers rest timer

- Rest timer:
  - Appears subtly at top when active
  - Starts automatically after tapping "Mark Complete"
  - Manual start/stop option
  - Countdown bar or circle animation

### 3. Workout Persistence

- If the app is closed or backgrounded, session progress is cached
- Reopens exactly where the user left off

### 4. Progress Tracking

- Track:
  - Sets completed
  - Weights per set
  - Reps per set
- Last session values shown on each exercise
- Highlight when user beats previous best

### 5. Design / UX

- Fonts: Thin line sans-serif (e.g. Inter, Poppins Light, SF Pro Thin)
- Colours: Off-white background, neutral beige/blush accents, soft black/grey text
- Tone: Clean, elegant, minimal – no clutter
- Interaction: Tap-friendly inputs, swipe-to-close instruction cards, big “Next Set” and “Mark Done” buttons

## User Flow Summary

Home > Select Day > In-Workout Scrollable Page > Rest + Track > Exit or Complete

## Rest Timer Flow

- Triggered on "Mark Set Complete"
- Countdown at top of screen (subtle overlay)
- Option to manually stop/reset
- Can move to next exercise anytime

## Key Components

- WorkoutList (home screen workouts)
- WorkoutSession (handles persistence + exercise logic)
- ExerciseCard
- RestTimerOverlay
- SetTracker
- CollapsibleInstruction
