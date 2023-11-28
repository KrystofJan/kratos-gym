-- MySQL dump 10.13  Distrib 8.0.35, for Linux (x86_64)
--
-- Host: localhost    Database: Kratos
-- ------------------------------------------------------
-- Server version	8.0.35-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Address`
--

DROP TABLE IF EXISTS `Address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Address` (
  `AddressId` int NOT NULL AUTO_INCREMENT,
  `Street` varchar(128) NOT NULL,
  `City` varchar(128) NOT NULL,
  `PostalCode` varchar(16) NOT NULL,
  `Country` varchar(64) NOT NULL,
  `BuildingNumber` varchar(16) NOT NULL,
  `ApartmentNumber` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`AddressId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Address`
--

LOCK TABLES `Address` WRITE;
/*!40000 ALTER TABLE `Address` DISABLE KEYS */;
INSERT INTO `Address` VALUES (1,'123 Main St','New York','10001','USA','Building A','Apt 101'),(2,'456 Elm St','Los Angeles','90001','USA','Building B','Apt 202'),(3,'789 Oak St','Chicago','60601','USA','Building C','Apt 303'),(4,'101 Pine Ave','San Francisco','94101','USA','Building D','Apt 404'),(5,'222 Maple Rd','Miami','33101','USA','Building E','Apt 505'),(6,'333 Cedar Ln','Seattle','98101','USA','Building F','Apt 606'),(7,'444 Oak Ave','Boston','02201','USA','Building G','Apt 707'),(8,'555 Birch St','Dallas','75201','USA','Building H','Apt 808'),(9,'666 Elm Dr','Denver','80201','USA','Building I','Apt 909'),(10,'777 Walnut Ct','Las Vegas','89101','USA','Building J','Apt 1010'),(11,'888 Spruce Pl','Phoenix','85001','USA','Building K','Apt 1111'),(12,'999 Sycamore Ln','Atlanta','30301','USA','Building L','Apt 1212');
/*!40000 ALTER TABLE `Address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ExerciseType`
--

DROP TABLE IF EXISTS `ExerciseType`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ExerciseType` (
  `ExerciseTypeId` int NOT NULL AUTO_INCREMENT,
  `ExerciseTypeName` varchar(64) NOT NULL,
  `Category` varchar(64) NOT NULL,
  `BodyPart` varchar(32) NOT NULL,
  PRIMARY KEY (`ExerciseTypeId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ExerciseType`
--

LOCK TABLES `ExerciseType` WRITE;
/*!40000 ALTER TABLE `ExerciseType` DISABLE KEYS */;
INSERT INTO `ExerciseType` VALUES (1,'Treadmill Running','Cardio','Cardiovascular'),(2,'Barbell Bench Press','Upper Body Training','Chest'),(3,'Close-Grip Bench Press','Upper Body Training','Triceps'),(4,'Overhead Tricep Extensions','Upper Body Training','Triceps'),(5,'Yoga','Flexibility','Core'),(6,'Dumbbell Bicep Curls','Upper Body Training','Biceps'),(7,'Squat','Lower Body Training','Quads'),(8,'Squat','Lower Body Training','Glutes'),(9,'Plank','Core Trainingening','Core'),(10,'Deadlift','Lower Body Training','Lower Back'),(11,'Pull-Ups','Upper Body Training','Upper Back'),(12,'Leg Press','Lower Body Training','Quads'),(13,'Rowing','Cardio','Upper Body'),(14,'Push-Ups','Upper Body Training','Chest'),(15,'Kettlebell Swings','Full Body Training','Full Body'),(16,'Cycling','Cardio','Legs'),(17,'Lunges','Lower Body Training','Glutes'),(18,'Russian Twists','Core Training','Obliques'),(19,'Reverse Curls','Upper Body Weightlifting','Biceps'),(20,'Dumbbell bench press','Upper Body Training','Chest');
/*!40000 ALTER TABLE `ExerciseType` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MachineExerciseTypes`
--

DROP TABLE IF EXISTS `MachineExerciseTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MachineExerciseTypes` (
  `ExerciseTypeId` int NOT NULL,
  `WrkOutMachineId` int NOT NULL,
  PRIMARY KEY (`ExerciseTypeId`,`WrkOutMachineId`),
  KEY `WrkOutMachineId` (`WrkOutMachineId`),
  CONSTRAINT `MachineExerciseTypes_ibfk_1` FOREIGN KEY (`ExerciseTypeId`) REFERENCES `ExerciseType` (`ExerciseTypeId`),
  CONSTRAINT `MachineExerciseTypes_ibfk_2` FOREIGN KEY (`WrkOutMachineId`) REFERENCES `WrkOutMachine` (`WrkOutMachineId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MachineExerciseTypes`
--

LOCK TABLES `MachineExerciseTypes` WRITE;
/*!40000 ALTER TABLE `MachineExerciseTypes` DISABLE KEYS */;
INSERT INTO `MachineExerciseTypes` VALUES (1,1),(2,2),(3,2),(9,2),(5,3),(7,12),(8,12),(10,13),(4,33),(6,33),(20,33);
/*!40000 ALTER TABLE `MachineExerciseTypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Reservation`
--

DROP TABLE IF EXISTS `Reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Reservation` (
  `ReservetionId` int NOT NULL AUTO_INCREMENT,
  `AmmoutOfPeople` int NOT NULL DEFAULT '1',
  `ReservationTime` datetime NOT NULL,
  `CustomerId` int NOT NULL,
  `TrainerId` int DEFAULT NULL,
  `WrkOutPlanId` int NOT NULL,
  PRIMARY KEY (`ReservetionId`),
  KEY `CustomerId` (`CustomerId`),
  KEY `TrainerId` (`TrainerId`),
  KEY `WrkOutPlanId` (`WrkOutPlanId`),
  CONSTRAINT `Reservation_ibfk_1` FOREIGN KEY (`CustomerId`) REFERENCES `User` (`UserId`),
  CONSTRAINT `Reservation_ibfk_2` FOREIGN KEY (`TrainerId`) REFERENCES `User` (`UserId`),
  CONSTRAINT `Reservation_ibfk_3` FOREIGN KEY (`WrkOutPlanId`) REFERENCES `WrkOutPlan` (`WrkOutPlanId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Reservation`
--

LOCK TABLES `Reservation` WRITE;
/*!40000 ALTER TABLE `Reservation` DISABLE KEYS */;
INSERT INTO `Reservation` VALUES (1,1,'2023-10-01 10:00:00',1,2,1),(2,2,'2023-10-02 15:30:00',3,NULL,2),(3,1,'2023-10-03 09:00:00',2,1,3);
/*!40000 ALTER TABLE `Reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `UserId` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(64) NOT NULL,
  `LastName` varchar(64) NOT NULL,
  `Role` varchar(1) NOT NULL,
  `Email` varchar(128) NOT NULL,
  `PhoneNumber` varchar(32) NOT NULL,
  `IsActive` char(1) NOT NULL DEFAULT '1',
  `CreateDate` date NOT NULL,
  `LastOnline` date NOT NULL,
  `Password` varchar(128) NOT NULL,
  `AddressId` int NOT NULL,
  `credits` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`UserId`),
  KEY `AddressId` (`AddressId`),
  CONSTRAINT `User_ibfk_1` FOREIGN KEY (`AddressId`) REFERENCES `Address` (`AddressId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'John','Doe','C','johndoe@example.com','555-123-4567','1','2023-09-30','2023-09-30','hashed_password',1,0),(2,'Jane','Smith','T','janesmith@example.com','555-987-6543','1','2023-09-30','2023-09-30','hashed_password',2,0),(3,'Alice','Johnson','C','alice@example.com','555-555-5555','1','2023-09-30','2023-09-30','hashed_password',3,0),(4,'Bob','Brown','C','bobbrown@example.com','555-111-2222','1','2023-09-30','2023-09-30','hashed_password',4,0),(5,'Sara','Wilson','T','sarawilson@example.com','555-222-3333','1','2023-09-30','2023-09-30','hashed_password',5,0),(6,'David','Clark','C','davidclark@example.com','555-333-4444','1','2023-09-30','2023-09-30','hashed_password',6,0),(7,'Emily','Garcia','C','emilygarcia@example.com','555-444-5555','1','2023-09-30','2023-09-30','hashed_password',7,0),(8,'Michael','Martinez','T','michaelmartinez@example.com','555-555-6666','1','2023-09-30','2023-09-30','hashed_password',8,0),(9,'Sophia','Lopez','C','sophialopez@example.com','555-666-7777','1','2023-09-30','2023-09-30','hashed_password',9,0),(10,'William','Harris','C','williamharris@example.com','555-777-8888','1','2023-09-30','2023-09-30','hashed_password',10,0),(11,'Olivia','Turner','T','oliviaturner@example.com','555-888-9999','1','2023-09-30','2023-09-30','hashed_password',11,0),(12,'James','Young','C','jamesyoung@example.com','555-999-0000','1','2023-09-30','2023-09-30','hashed_password',12,0);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WrkOutMachine`
--

DROP TABLE IF EXISTS `WrkOutMachine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WrkOutMachine` (
  `WrkOutMachineId` int NOT NULL AUTO_INCREMENT,
  `MachineName` varchar(64) NOT NULL,
  `MaxWeight` float DEFAULT NULL,
  `MinWeight` float DEFAULT NULL,
  `PopularityScore` int NOT NULL DEFAULT '0',
  `AvgTimeTaken` int NOT NULL DEFAULT '300',
  `MaxPeople` int NOT NULL DEFAULT '2',
  PRIMARY KEY (`WrkOutMachineId`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WrkOutMachine`
--

LOCK TABLES `WrkOutMachine` WRITE;
/*!40000 ALTER TABLE `WrkOutMachine` DISABLE KEYS */;
INSERT INTO `WrkOutMachine` VALUES (1,'Treadmill',NULL,NULL,0,300,2),(2,'Bench Press',300,5,0,300,2),(3,'Yoga Mat',NULL,NULL,0,300,2),(12,'Squat Rack',500,5,0,300,2),(13,'Deadlift Rack',500,5,0,300,2),(14,'Barbell',20,20,0,300,2),(15,'Barbell',20,20,0,300,2),(16,'Barbell',18,18,0,300,2),(17,'Barbell',18,18,0,300,2),(18,'Barbell',20,20,0,300,2),(19,'Pullup Bar',NULL,NULL,0,300,2),(20,'Yoga Mat',NULL,NULL,0,300,2),(21,'Leg Press Machine',300,40,0,300,2),(22,'Rowing Machine',90,5,0,300,2),(23,'Kettlebell',9,9,0,300,2),(24,'Kettlebell',10,10,0,300,2),(25,'Kettlebell',12,12,0,300,2),(26,'Kettlebell',14,14,0,300,2),(27,'Kettlebell',16,16,0,300,2),(28,'Kettlebell',16,16,0,300,2),(29,'Spin Bike',15,0,0,300,2),(30,'Spin Bike',15,0,0,300,2),(31,'Spin Bike',15,0,0,300,2),(32,'Spin Bike',15,0,0,300,2),(33,'Dumbbell',2.5,60,0,300,5);
/*!40000 ALTER TABLE `WrkOutMachine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WrkOutPlan`
--

DROP TABLE IF EXISTS `WrkOutPlan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WrkOutPlan` (
  `WrkOutPlanId` int NOT NULL AUTO_INCREMENT,
  `PlanName` varchar(64) NOT NULL,
  `UserId` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`WrkOutPlanId`),
  KEY `FK_User` (`UserId`),
  CONSTRAINT `FK_User` FOREIGN KEY (`UserId`) REFERENCES `User` (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WrkOutPlan`
--

LOCK TABLES `WrkOutPlan` WRITE;
/*!40000 ALTER TABLE `WrkOutPlan` DISABLE KEYS */;
INSERT INTO `WrkOutPlan` VALUES (1,'Push',1),(2,'Pull',1),(3,'Leg',1),(4,'Upper body',1),(5,'Lower body',1),(6,'Cardio',1);
/*!40000 ALTER TABLE `WrkOutPlan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WrkOutPlanMachines`
--

DROP TABLE IF EXISTS `WrkOutPlanMachines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WrkOutPlanMachines` (
  `WrkOutPlanId` int NOT NULL,
  `WrkOutMachineId` int NOT NULL,
  `sets` int NOT NULL DEFAULT '4',
  `reps` int NOT NULL DEFAULT '8',
  `canDisturb` bit(1) NOT NULL DEFAULT b'0',
  `WrkOutStartTime` datetime NOT NULL,
  `WrkOutEndTime` datetime NOT NULL,
  `AvgTimeTaken` int NOT NULL DEFAULT '300',
  PRIMARY KEY (`WrkOutPlanId`,`WrkOutMachineId`),
  KEY `WrkOutMachineId` (`WrkOutMachineId`),
  CONSTRAINT `WrkOutPlanMachines_ibfk_1` FOREIGN KEY (`WrkOutPlanId`) REFERENCES `WrkOutPlan` (`WrkOutPlanId`),
  CONSTRAINT `WrkOutPlanMachines_ibfk_2` FOREIGN KEY (`WrkOutMachineId`) REFERENCES `WrkOutMachine` (`WrkOutMachineId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WrkOutPlanMachines`
--

LOCK TABLES `WrkOutPlanMachines` WRITE;
/*!40000 ALTER TABLE `WrkOutPlanMachines` DISABLE KEYS */;
/*!40000 ALTER TABLE `WrkOutPlanMachines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WrkOutPlanMachinesPreset`
--

DROP TABLE IF EXISTS `WrkOutPlanMachinesPreset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WrkOutPlanMachinesPreset` (
  `WrkOutPlanMachinesPresetId` int NOT NULL,
  `WrkOutMachineId` int NOT NULL,
  `sets` int NOT NULL DEFAULT '4',
  `reps` int NOT NULL DEFAULT '8',
  PRIMARY KEY (`WrkOutPlanMachinesPresetId`,`WrkOutMachineId`),
  KEY `WrkOutMachineId` (`WrkOutMachineId`),
  CONSTRAINT `WrkOutPlanMachinesPreset_ibfk_1` FOREIGN KEY (`WrkOutPlanMachinesPresetId`) REFERENCES `WrkOutPlan` (`WrkOutPlanId`),
  CONSTRAINT `WrkOutPlanMachinesPreset_ibfk_2` FOREIGN KEY (`WrkOutMachineId`) REFERENCES `WrkOutMachine` (`WrkOutMachineId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WrkOutPlanMachinesPreset`
--

LOCK TABLES `WrkOutPlanMachinesPreset` WRITE;
/*!40000 ALTER TABLE `WrkOutPlanMachinesPreset` DISABLE KEYS */;
/*!40000 ALTER TABLE `WrkOutPlanMachinesPreset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WrkOutPlanPreset`
--

DROP TABLE IF EXISTS `WrkOutPlanPreset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WrkOutPlanPreset` (
  `WrkOutPlanPresetId` int NOT NULL,
  `PresetName` varchar(64) NOT NULL,
  `AuthorId` int NOT NULL,
  PRIMARY KEY (`WrkOutPlanPresetId`),
  KEY `AuthorId` (`AuthorId`),
  CONSTRAINT `WrkOutPlanPreset_ibfk_1` FOREIGN KEY (`AuthorId`) REFERENCES `User` (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WrkOutPlanPreset`
--

LOCK TABLES `WrkOutPlanPreset` WRITE;
/*!40000 ALTER TABLE `WrkOutPlanPreset` DISABLE KEYS */;
/*!40000 ALTER TABLE `WrkOutPlanPreset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WrkOutPlanType`
--

DROP TABLE IF EXISTS `WrkOutPlanType`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WrkOutPlanType` (
  `WrkOutPlanId` int NOT NULL,
  `ExerciseTypeId` int NOT NULL,
  PRIMARY KEY (`WrkOutPlanId`,`ExerciseTypeId`),
  KEY `ExerciseTypeId` (`ExerciseTypeId`),
  CONSTRAINT `WrkOutPlanType_ibfk_1` FOREIGN KEY (`WrkOutPlanId`) REFERENCES `WrkOutPlan` (`WrkOutPlanId`),
  CONSTRAINT `WrkOutPlanType_ibfk_2` FOREIGN KEY (`ExerciseTypeId`) REFERENCES `ExerciseType` (`ExerciseTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WrkOutPlanType`
--

LOCK TABLES `WrkOutPlanType` WRITE;
/*!40000 ALTER TABLE `WrkOutPlanType` DISABLE KEYS */;
INSERT INTO `WrkOutPlanType` VALUES (3,1),(6,1),(1,2),(4,2),(1,3),(4,3),(1,4),(2,6),(4,6),(5,7),(2,10),(5,10),(2,11),(3,12),(5,12),(6,16),(3,17);
/*!40000 ALTER TABLE `WrkOutPlanType` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-21 15:23:18
