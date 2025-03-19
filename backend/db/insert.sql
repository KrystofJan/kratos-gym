
-- Insert more data into exercise_category table (General workout focus areas)
INSERT INTO public.exercise_category (category_id, category_name)
VALUES
    (1, 'Full Body'),
    (2, 'Upper Body'),
    (3, 'Lower Body'),
    (4, 'Core Training'),
    (5, 'Cardio & Conditioning'),
    (6, 'Flexibility & Mobility');

-- Insert more data into exercise_type table (Actual exercises under each category)
INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part)
VALUES
    -- Full Body
    (1, 'Burpees', 1, 'Full Body'),
    (2, 'Deadlift', 1, 'Back & Legs'),
    (3, 'Kettlebell Swing', 1, 'Full Body'),

    -- Upper Body
    (4, 'Bench Press', 2, 'Chest & Triceps'),
    (5, 'Pull-ups', 2, 'Back & Biceps'),
    (6, 'Dumbbell Shoulder Press', 2, 'Shoulders'),

    -- Lower Body
    (7, 'Squats', 3, 'Legs & Glutes'),
    (8, 'Leg Press', 3, 'Legs'),
    (9, 'Lunges', 3, 'Legs & Glutes'),

    -- Core Training
    (10, 'Plank', 4, 'Core'),
    (11, 'Russian Twists', 4, 'Obliques'),
    (12, 'Leg Raises', 4, 'Lower Abs'),

    -- Cardio & Conditioning
    (13, 'Treadmill Running', 5, 'Legs & Cardio'),
    (14, 'Jump Rope', 5, 'Full Body & Cardio'),
    (15, 'Rowing Machine', 5, 'Full Body & Cardio'),

    -- Flexibility & Mobility
    (16, 'Stretching Routine', 6, 'Full Body'),
    (17, 'Yoga Flow', 6, 'Full Body'),
    (18, 'Foam Rolling', 6, 'Legs & Back');

-- Insert more data into machine table (Machines relevant to exercises)
-- Insert more data into machine table (Machines relevant to exercises)
INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score)
VALUES
    -- Strength Training Machines (Mostly Single-User)
    (1, 'Smith Machine', 300, 15, 1, 1200, 90),
    (2, 'Bench Press Station', 250, 20, 1, 900, 95),
    (3, 'Squat Rack', 400, 20, 1, 900, 92),
    (4, 'Leg Press Machine', 300, 10, 1, 800, 85),
    (5, 'Cable Machine', 150, 5, 1, 700, 88),

    -- Cardio Machines (Mostly Single-User)
    (6, 'Treadmill', NULL, NULL, 1, 1800, 80),
    (7, 'Rowing Machine', NULL, NULL, 1, 1200, 85),
    (8, 'Stationary Bike', NULL, NULL, 1, 1500, 75),

    -- Functional Training Equipment (Some Allow Multiple Users)
    (9, 'Battle Ropes', NULL, NULL, 2, 600, 70),  -- Can be used by two people simultaneously
    (10, 'Foam Roller', NULL, NULL, 3, 900, 65),  -- People often use multiple rollers in a stretch area
    (11, 'Bosu Ball', NULL, NULL, 2, 900, 60),  -- Balance drills can involve two people taking turns
    (12, 'Jump Rope', NULL, NULL, 1, 300, 80),
    (13, 'Pull-up Bar', NULL, NULL, 2, 500, 85),  -- Pull-up bars often have space for two users
    (14, 'Dumbbells', 50, 2, 4, 600, 90),  -- Dumbbells allow multiple users at once
    (15, 'Multi-Station Gym Machine', 200, 5, 4, 1200, 88),  -- Multi-station machines support several users simultaneously
    (16, 'Sled Push Track', NULL, NULL, 3, 600, 75),  -- Multiple users can take turns on a sled push track
    (17, 'Boxing Heavy Bag', NULL, NULL, 2, 900, 78),  -- Can be used by two people training together
    (18, 'Assault Bike', NULL, NULL, 1, 1000, 77);  -- One user at a time for high-intensity cardio

-- Insert more data into machine_exercise_type table (Linking exercises to machines)
INSERT INTO public.machine_exercise_type (exercise_type_id, machine_id)
VALUES
    -- Full Body Exercises
    (1, 9),  -- Burpees -> Battle Ropes (HIIT Training)
    (2, 3),  -- Deadlift -> Squat Rack
    (3, 14), -- Kettlebell Swing -> Dumbbells (Kettlebells & Dumbbells)

    -- Upper Body Exercises
    (4, 2),  -- Bench Press -> Bench Press Station
    (5, 13), -- Pull-ups -> Pull-up Bar
    (6, 14), -- Dumbbell Shoulder Press -> Dumbbells

    -- Lower Body Exercises
    (7, 3),  -- Squats -> Squat Rack
    (8, 4),  -- Leg Press -> Leg Press Machine
    (9, 14), -- Lunges -> Dumbbells (For Weighted Lunges)

    -- Core Training
    (10, 11), -- Plank -> Bosu Ball (For Instability Training)
    (11, 14), -- Russian Twists -> Dumbbells (Weighted Russian Twists)
    (12, 5),  -- Leg Raises -> Cable Machine (For Weighted Leg Raises)

    -- Cardio & Conditioning
    (13, 6),  -- Treadmill Running -> Treadmill
    (14, 12), -- Jump Rope -> Jump Rope
    (15, 7),  -- Rowing Machine -> Rowing Machine

    -- Flexibility & Mobility
    (16, 10), -- Stretching Routine -> Foam Roller
    (17, 10), -- Yoga Flow -> Foam Roller (For Myofascial Release)
    (18, 10); -- Foam Rolling -> Foam Roller

-- Insert more data into plan_category table (Mapping plans to categories)
INSERT INTO public.plan_category (plan_id, category_id)
VALUES
    (1, 1),  -- Full Body Training Plan
    (2, 2),  -- Upper Body Focus Plan
    (3, 3),  -- Lower Body Strength Plan
    (4, 4),  -- Core Training Plan
    (5, 5),  -- Cardio & Conditioning Plan
    (6, 6);  -- Flexibility & Mobility Plan

-- Insert more data into test table (Testing various fitness levels)
INSERT INTO public.test (id, test)
VALUES
    (1, 'Strength Test - 1 Rep Max'),
    (2, 'Endurance Test - 5K Run Time'),
    (3, 'Flexibility Test - Sit and Reach'),
    (4, 'Core Stability Test - Plank Duration'),
    (5, 'VO2 Max Test - Cardio Fitness Level'),
    (6, 'Lower Body Strength Test - Squat Performance'),
    (7, 'Upper Body Strength Test - Push-Up Count'),
    (8, 'Balance Test - Single-Leg Hold Duration');
