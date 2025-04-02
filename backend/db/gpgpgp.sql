
--
-- PostgreSQL database dump (Simplified and Readable)
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Create Tables --

CREATE TABLE public.account (
    account_id SERIAL PRIMARY KEY,
    first_name VARCHAR(64) NOT NULL,
    last_name VARCHAR(64) NOT NULL,
    login VARCHAR(64) UNIQUE NOT NULL,
    role VARCHAR(1) DEFAULT 'c' NOT NULL,
    email VARCHAR(128) NOT NULL,
    phone_number VARCHAR(32),
    is_active BOOLEAN DEFAULT true NOT NULL,
    create_date DATE DEFAULT now() NOT NULL,
    last_online DATE DEFAULT now() NOT NULL,
    address_id INTEGER REFERENCES public.address(address_id),
    credits INTEGER DEFAULT 0 NOT NULL,
    clerk_id VARCHAR(255) UNIQUE NOT NULL,
    profile_picture_url VARCHAR(255)
);

CREATE TABLE public.address (
    address_id SERIAL PRIMARY KEY,
    street VARCHAR(128) NOT NULL,
    city VARCHAR(128) NOT NULL,
    postal_code VARCHAR(16) NOT NULL,
    country VARCHAR(64) NOT NULL,
    building_number VARCHAR(16) NOT NULL,
    apartment_number VARCHAR(16)
);

CREATE TABLE public.exercise_category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR NOT NULL
);

CREATE TABLE public.exercise_type (
    exercise_type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(64) NOT NULL,
    category_id INTEGER REFERENCES public.exercise_category(category_id),
    body_part VARCHAR(32) NOT NULL
);

CREATE TABLE public.machine (
    machine_id SERIAL PRIMARY KEY,
    machine_name VARCHAR(64) NOT NULL,
    max_weight DOUBLE PRECISION,
    min_weight DOUBLE PRECISION,
    max_people INTEGER DEFAULT 2 NOT NULL,
    avg_time_taken INTEGER DEFAULT 300 NOT NULL,
    popularity_score INTEGER DEFAULT 0 NOT NULL
);

CREATE TABLE public.machine_exercise_type (
    exercise_type_id INTEGER REFERENCES public.exercise_type(exercise_type_id),
    machine_id INTEGER REFERENCES public.machine(machine_id),
    PRIMARY KEY (exercise_type_id, machine_id)
);

CREATE TABLE public.plan (
    plan_id SERIAL PRIMARY KEY,
    plan_name VARCHAR(64) NOT NULL,
    account_id INTEGER REFERENCES public.account(account_id)
);

CREATE TABLE public.plan_category (
    plan_id INTEGER REFERENCES public.plan(plan_id),
    category_id INTEGER REFERENCES public.exercise_category(category_id),
    PRIMARY KEY (plan_id, category_id)
);

CREATE TABLE public.plan_machine (
    plan_id INTEGER REFERENCES public.plan(plan_id),
    machine_id INTEGER REFERENCES public.machine(machine_id),
    sets INTEGER DEFAULT 4 NOT NULL,
    reps INTEGER DEFAULT 8 NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    can_disturb BOOLEAN DEFAULT false,
    PRIMARY KEY (plan_id, machine_id)
);

CREATE TABLE public.reservation (
    reservation_id SERIAL PRIMARY KEY,
    amount_of_people INTEGER DEFAULT 1 NOT NULL,
    reservation_time TIMESTAMP NOT NULL,
    customer_id INTEGER REFERENCES public.account(account_id),
    trainer_id INTEGER REFERENCES public.account(account_id),
    plan_id INTEGER REFERENCES public.plan(plan_id)
);

CREATE TABLE public.test (
    id SERIAL PRIMARY KEY,
    test VARCHAR(64) NOT NULL
);

-- Insert Data --

INSERT INTO public.exercise_category (category_id, category_name)
VALUES
    (1, 'Full Body'),
    (2, 'Upper Body'),
    (3, 'Lower Body'),
    (4, 'Core Training'),
    (5, 'Cardio & Conditioning'),
    (6, 'Flexibility & Mobility');

INSERT INTO public.exercise_type (exercise_type_id, type_name, category_id, body_part)
VALUES
    (1, 'Burpees', 1, 'Full Body'),
    (2, 'Deadlift', 1, 'Back & Legs'),
    (3, 'Kettlebell Swing', 1, 'Full Body'),
    (4, 'Bench Press', 2, 'Chest & Triceps'),
    (5, 'Pull-ups', 2, 'Back & Biceps'),
    (6, 'Dumbbell Shoulder Press', 2, 'Shoulders'),
    (7, 'Squats', 3, 'Legs & Glutes'),
    (8, 'Leg Press', 3, 'Legs'),
    (9, 'Lunges', 3, 'Legs & Glutes'),
    (10, 'Plank', 4, 'Core'),
    (11, 'Russian Twists', 4, 'Obliques'),
    (12, 'Leg Raises', 4, 'Lower Abs'),
    (13, 'Treadmill Running', 5, 'Legs & Cardio'),
    (14, 'Jump Rope', 5, 'Full Body & Cardio'),
    (15, 'Rowing Machine', 5, 'Full Body & Cardio'),
    (16, 'Stretching Routine', 6, 'Full Body'),
    (17, 'Yoga Flow', 6, 'Full Body'),
    (18, 'Foam Rolling', 6, 'Legs & Back');

INSERT INTO public.machine (machine_id, machine_name, max_weight, min_weight, max_people, avg_time_taken, popularity_score)
VALUES
    (1, 'Smith Machine', 300, 15, 1, 1200, 90),
    (2, 'Bench Press Station', 250, 20, 1, 900, 95),
    (3, 'Squat Rack', 400, 20, 1, 900, 92),
    (4, 'Leg Press Machine', 300, 10, 1, 800, 85),
    (5, 'Cable Machine', 150, 5, 1, 700, 88),
    (6, 'Treadmill', NULL, NULL, 1, 1800, 80),
    (7, 'Rowing Machine', NULL, NULL, 1, 1200, 85),
    (8, 'Stationary Bike', NULL, NULL, 1, 1500, 75),
    (9, 'Battle Ropes', NULL, NULL, 2, 600, 70),
    (10, 'Foam Roller', NULL, NULL, 3, 900, 65),
    (11, 'Bosu Ball', NULL, NULL, 2, 900, 60),
    (12, 'Jump Rope', NULL, NULL, 1, 300, 80),
    (13, 'Pull-up Bar', NULL, NULL, 2, 500, 85),
    (14, 'Dumbbells', 50, 2, 4, 600, 90),
    (15, 'Multi-Station Gym Machine', 200, 5, 4, 1200, 88),
    (16, 'Sled Push Track', NULL, NULL, 3, 600, 75),
    (17, 'Boxing Heavy Bag', NULL, NULL, 2, 900, 78),
    (18, 'Assault Bike', NULL, NULL, 1, 1000, 77);
