INSERT INTO Address (Street, City, PostalCode, Country, BuildingNumber, ApartmentNumber)
VALUES
    ('123 Main St', 'New York', '10001', 'USA', 'Building A', 'Apt 101'),
    ('456 Elm St', 'Los Angeles', '90001', 'USA', 'Building B', 'Apt 202'),
    ('789 Oak St', 'Chicago', '60601', 'USA', 'Building C', 'Apt 303'),
    ('101 Pine Ave', 'San Francisco', '94101', 'USA', 'Building D', 'Apt 404'),
    ('222 Maple Rd', 'Miami', '33101', 'USA', 'Building E', 'Apt 505'),
    ('333 Cedar Ln', 'Seattle', '98101', 'USA', 'Building F', 'Apt 606'),
    ('444 Oak Ave', 'Boston', '02201', 'USA', 'Building G', 'Apt 707'),
    ('555 Birch St', 'Dallas', '75201', 'USA', 'Building H', 'Apt 808'),
    ('666 Elm Dr', 'Denver', '80201', 'USA', 'Building I', 'Apt 909'),
    ('777 Walnut Ct', 'Las Vegas', '89101', 'USA', 'Building J', 'Apt 1010'),
    ('888 Spruce Pl', 'Phoenix', '85001', 'USA', 'Building K', 'Apt 1111'),
    ('999 Sycamore Ln', 'Atlanta', '30301', 'USA', 'Building L', 'Apt 1212');

INSERT INTO User (FirstName, LastName, Role, Email, PhoneNumber, IsActive, CreateDate, LastOnline, Password, AddressId)
VALUES
    ('John', 'Doe', 'U', 'johndoe@example.com', '555-123-4567', '1', '2023-09-30', '2023-09-30', 'hashed_password', 1),
    ('Jane', 'Smith', 'T', 'janesmith@example.com', '555-987-6543', '1', '2023-09-30', '2023-09-30', 'hashed_password', 2),
    ('Alice', 'Johnson', 'U', 'alice@example.com', '555-555-5555', '1', '2023-09-30', '2023-09-30', 'hashed_password', 3),
    ('Bob', 'Brown', 'U', 'bobbrown@example.com', '555-111-2222', '1', '2023-09-30', '2023-09-30', 'hashed_password', 4),
    ('Sara', 'Wilson', 'T', 'sarawilson@example.com', '555-222-3333', '1', '2023-09-30', '2023-09-30', 'hashed_password', 5),
    ('David', 'Clark', 'U', 'davidclark@example.com', '555-333-4444', '1', '2023-09-30', '2023-09-30', 'hashed_password', 6),
    ('Emily', 'Garcia', 'U', 'emilygarcia@example.com', '555-444-5555', '1', '2023-09-30', '2023-09-30', 'hashed_password', 7),
    ('Michael', 'Martinez', 'T', 'michaelmartinez@example.com', '555-555-6666', '1', '2023-09-30', '2023-09-30', 'hashed_password', 8),
    ('Sophia', 'Lopez', 'U', 'sophialopez@example.com', '555-666-7777', '1', '2023-09-30', '2023-09-30', 'hashed_password', 9),
    ('William', 'Harris', 'U', 'williamharris@example.com', '555-777-8888', '1', '2023-09-30', '2023-09-30', 'hashed_password', 10),
    ('Olivia', 'Turner', 'T', 'oliviaturner@example.com', '555-888-9999', '1', '2023-09-30', '2023-09-30', 'hashed_password', 11),
    ('James', 'Young', 'U', 'jamesyoung@example.com', '555-999-0000', '1', '2023-09-30', '2023-09-30', 'hashed_password', 12);

INSERT INTO ExerciseType (ExerciseTypeName, Category, BodyPart)
VALUES
    ('Treadmill Running', 'Cardio', 'Cardiovascular'),
    ('Barbell Bench Press', 'Upper Body Training', 'Chest'),
    ('Close-Grip Bench Press', 'Upper Body Training', 'Triceps'),
    ('Overhead Tricep Extensions', 'Upper Body Training', 'Triceps'),
    ('Yoga', 'Flexibility', 'Core'),
    ('Dumbbell Bicep Curls', 'Upper Body Training', 'Biceps'),
    ('Squat', 'Lower Body Training', 'Quads'),
    ('Squat', 'Lower Body Training', 'Glutes'),
    ('Plank', 'Core Trainingening', 'Core'),
    ('Deadlift', 'Lower Body Training', 'Lower Back'),
    ('Pull-Ups', 'Upper Body Training', 'Upper Back'),
    ('Leg Press', 'Lower Body Training', 'Quads'),
    ('Rowing', 'Cardio', 'Upper Body'),
    ('Push-Ups', 'Upper Body Training', 'Chest'),
    ('Kettlebell Swings', 'Full Body Training', 'Full Body'),
    ('Cycling', 'Cardio', 'Legs'),
    ('Lunges', 'Lower Body Training', 'Glutes'),
    ('Russian Twists', 'Core Training', 'Obliques'),
    ('Reverse Curls', 'Upper Body Weightlifting', 'Biceps');

INSERT INTO WrkOutMachine (MachineName, MaxWeight, MinWeight)
VALUES
    ('Treadmill', NULL, NULL),
    ('Bench Press', 300, 5),
    ('Yoga Mat', NULL, NULL),
    ('Dumbbell', 3,3),
    ('Dumbbell', 5,5),
    ('Dumbbell', 7.5,7.5),
    ('Dumbbell', 9,9),
    ('Dumbbell', 10,10),
    ('Dumbbell', 12,12),
    ('Dumbbell', 14,14),
    ('Dumbbell', 16,16),
    ('Squat Rack', 500,5),
    ('Deadlift Rack', 500,5),
    ('Barbell', 20, 20),
    ('Barbell', 20, 20),
    ('Barbell', 18, 18),
    ('Barbell', 18, 18),
    ('Barbell', 20, 20),
    ('Pullup Bar', NULL, NULL),
    ('Yoga Mat', NULL, NULL),
    ('Leg Press Machine', 300, 40),
    ('Rowing Machine', 90, 5),
    ('Kettlebell', 9,9),
    ('Kettlebell', 10,10),
    ('Kettlebell', 12,12),
    ('Kettlebell', 14,14),
    ('Kettlebell', 16,16),
    ('Kettlebell', 16,16),
    ('Spin Bike', 15,0),
    ('Spin Bike', 15,0),
    ('Spin Bike', 15,0),
    ('Spin Bike', 15,0);

INSERT INTO MachineExerciseTypes (ExerciseTypeId, WrkOutMachineId)
VALUES
    (1, 1),
    (2, 2),
    (3, 2),
    (4, 4),
    (4, 5),
    (4, 6),
    (4, 7),
    (4, 8),
    (4, 9),
    (4, 10),
    (4, 11),
    (5, 3),
    (6, 4),
    (6, 5),
    (6, 6),
    (6, 7),
    (6, 8),
    (6, 9),
    (6, 10),
    (6, 11),
    (7, 12),
    (8, 12),
    (9, 2),
    (10, 13);

INSERT INTO WrkOutPlan (PlanName)
VALUES
    ('Push'),
    ('Pull'),
    ('Leg'),
    ('Upper body'),
    ('Lower body'),
    ('Cardio');

INSERT INTO WrkOutPlanType (WrkOutPlanId, ExerciseTypeId)
VALUES
    (1, 2),
    (1, 3),
    (1, 4),
    (2, 6),
    (2, 10),
    (2, 11),
    (3, 12),
    (3, 17),
    (3, 1),
    (4,2),
    (4,3),
    (4,6),
    (5,7),
    (5,10),
    (5,12),
    (6,16),
    (6,1);

# INSERT INTO WrkOutPlanMachines (WrkOutPlanId, WrkOutMachineId, sets, reps)
# VALUES
#     (1, 1, 4, 8),
#     (1, 2, 3, 10),
#     (2, 2, 4, 8),
#     -- Add more as needed

INSERT INTO Reservation (AmmoutOfPeople, ReservationTime, CustomerId, TrainerId, WrkOutPlanId)
VALUES
    (1, '2023-10-01 10:00:00', 1, 2, 1),
    (2, '2023-10-02 15:30:00', 3, NULL, 2),
    (1, '2023-10-03 09:00:00', 2, 1, 3);
