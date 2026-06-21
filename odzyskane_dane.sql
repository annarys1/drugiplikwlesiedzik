-- MySQL dump 10.19  Distrib 10.3.39-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: eduenroll
-- ------------------------------------------------------
-- Server version	10.3.39-MariaDB-0ubuntu0.20.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `application`
--

DROP TABLE IF EXISTS `application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `application` (
  `id_application` int(11) NOT NULL AUTO_INCREMENT,
  `id_parent` int(11) NOT NULL,
  `id_children` int(11) NOT NULL,
  `id_institution` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'submitted',
  `points` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `step` int(11) DEFAULT 1,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `id_institution_final` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_application`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application`
--

LOCK TABLES `application` WRITE;
/*!40000 ALTER TABLE `application` DISABLE KEYS */;
INSERT INTO `application` VALUES (1,1,1,1,'submitted',0,'2026-06-01 13:15:07',1,NULL,0),(2,3,1,1,'draft',0,'2026-06-01 13:57:06',2,'{\"wazne_informacje\":\"alergie dziecka...\"}',0),(3,7,1,3,'submitted',0,'2026-06-03 21:06:15',1,NULL,NULL),(4,7,4,3,'submitted',0,'2026-06-03 21:17:26',1,NULL,NULL),(5,7,5,3,'submitted',0,'2026-06-03 21:24:29',1,NULL,NULL),(6,7,6,3,'submitted',0,'2026-06-03 21:38:13',1,NULL,NULL),(8,8,7,NULL,'submitted',0,'2026-06-03 23:10:20',1,NULL,NULL),(12,9,9,NULL,'submitted',0,'2026-06-09 10:18:50',1,NULL,NULL);
/*!40000 ALTER TABLE `application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application_criteria`
--

DROP TABLE IF EXISTS `application_criteria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `application_criteria` (
  `id_application` int(11) NOT NULL,
  `id_criterion` int(11) NOT NULL,
  `declared_value` int(11) DEFAULT 0,
  PRIMARY KEY (`id_application`,`id_criterion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_criteria`
--

LOCK TABLES `application_criteria` WRITE;
/*!40000 ALTER TABLE `application_criteria` DISABLE KEYS */;
INSERT INTO `application_criteria` VALUES (8,1,0),(8,37,8),(12,5,0),(12,32,8);
/*!40000 ALTER TABLE `application_criteria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application_documents`
--

DROP TABLE IF EXISTS `application_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `application_documents` (
  `id_document` int(11) NOT NULL AUTO_INCREMENT,
  `id_application` int(11) NOT NULL,
  `id_criterion` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_document`),
  KEY `id_application` (`id_application`),
  CONSTRAINT `application_documents_ibfk_1` FOREIGN KEY (`id_application`) REFERENCES `application` (`id_application`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_documents`
--

LOCK TABLES `application_documents` WRITE;
/*!40000 ALTER TABLE `application_documents` DISABLE KEYS */;
INSERT INTO `application_documents` VALUES (2,1,1,'uploads/1780319739227_Project Timeline -2.pdf','2026-06-01 13:15:39');
/*!40000 ALTER TABLE `application_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application_institutions`
--

DROP TABLE IF EXISTS `application_institutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `application_institutions` (
  `id_application` int(11) NOT NULL,
  `id_institution` int(11) NOT NULL,
  `preference_order` int(11) NOT NULL,
  `calculated_points` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_application`,`id_institution`),
  KEY `application_institutions_ibfk_2` (`id_institution`),
  CONSTRAINT `application_institutions_ibfk_1` FOREIGN KEY (`id_application`) REFERENCES `application` (`id_application`) ON DELETE CASCADE,
  CONSTRAINT `application_institutions_ibfk_2` FOREIGN KEY (`id_institution`) REFERENCES `institution` (`id_institution`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_institutions`
--

LOCK TABLES `application_institutions` WRITE;
/*!40000 ALTER TABLE `application_institutions` DISABLE KEYS */;
INSERT INTO `application_institutions` VALUES (8,2,1,1),(8,3,2,17),(12,2,1,17),(12,3,2,1);
/*!40000 ALTER TABLE `application_institutions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `children`
--

DROP TABLE IF EXISTS `children`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `children` (
  `id_children` int(11) NOT NULL AUTO_INCREMENT,
  `id_rodzica` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `pesel` varchar(64) NOT NULL,
  `date_birth` date NOT NULL,
  `domicile` varchar(255) NOT NULL,
  PRIMARY KEY (`id_children`),
  UNIQUE KEY `pesel` (`pesel`),
  KEY `id_rodzica` (`id_rodzica`),
  CONSTRAINT `children_ibfk_1` FOREIGN KEY (`id_rodzica`) REFERENCES `user` (`id_user`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `children`
--

LOCK TABLES `children` WRITE;
/*!40000 ALTER TABLE `children` DISABLE KEYS */;
INSERT INTO `children` VALUES (1,3,'Anna','Lis','12345678901','2022-05-20','Kraków, ul. Główna 1'),(3,7,'Tomek','Kowalski','16230412345','2023-03-04','Kraków'),(4,7,'Tomek','Kowalski','16230482345','2023-03-04','Kraków'),(5,7,'Tomek','Kowalski','16230410345','2023-03-04','Kraków'),(6,7,'Tomek','Kowalski','16239412345','2023-03-04','Kraków'),(7,8,'Tomek','Kowalski','10230412345','2023-03-04','Kraków'),(8,7,'Tomek','Kowalski','16239419345','2023-03-04','Kraków'),(9,9,'Jan','Kowalski','12345679801','2020-01-01','Kraków'),(12,9,'Jan','Kowalski','11e57fc62141a0dca06cec58abc82b1f973729f810313a712a34640602b29140','2020-01-01','Kraków'),(13,1,'anna','kowalska','ad40450e01d99f91fc3956fd2843d068beeec5f0a9849fca963c5299ce2e96a1','2026-05-12','wieliczka'),(14,1,'anna','kowalska','d2c3a3a0cba2fa71293734ffe810fedc6cd4a9ea508da038ece65fe49a6daaff','2026-05-12','wieliczka');
/*!40000 ALTER TABLE `children` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `criteria`
--

DROP TABLE IF EXISTS `criteria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `criteria` (
  `id_criterion` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `criterion_point` int(11) DEFAULT 0,
  `id_institution` int(11) DEFAULT NULL,
  `type` enum('global','local') NOT NULL,
  `is_variable` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_criterion`),
  KEY `fk_institution_criteria` (`id_institution`),
  CONSTRAINT `fk_institution_criteria` FOREIGN KEY (`id_institution`) REFERENCES `institution` (`id_institution`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `criteria`
--

LOCK TABLES `criteria` WRITE;
/*!40000 ALTER TABLE `criteria` DISABLE KEYS */;
INSERT INTO `criteria` VALUES (1,'wielodzietność rodziny kandydata',1,NULL,'global',0),(2,'niepełnosprawność kandydata',1,NULL,'global',0),(3,'niepełnosprawność jednego z rodziców',1,NULL,'global',0),(4,'niepełnosprawność obojga rodziców',1,NULL,'global',0),(5,'niepełnosprawność rodzeństwa kandydata',1,NULL,'global',0),(6,'samotne wychowywanie kandydata w rodzinie',1,NULL,'global',0),(27,'objęcie kandydata pieczą zastępczą',1,NULL,'global',0),(28,'Kandydat, którego oboje rodzice (opiekunowie prawni) są zatrudnieni na podstawie umowy o pracę/umowy zlecenia lub studiują w systemie dziennym lub wykonują rolniczą lub pozarolniczą działalność gospodarczą ',50,2,'local',0),(29,'Kandydat, który ukończy 4 lata w roku kalendarzowym, w którym jest prowadzona rekrutacja do przedszkoli – liczba punktów',40,2,'local',0),(30,'Kandydat, który ukończy 3 lata w roku kalendarzowym, w którym jest prowadzona rekrutacja do przedszkoli – liczba punktów ',30,2,'local',0),(31,'uczęszczanie do tego samego przedszkola rodzeństwa kandydata',25,2,'local',0),(32,'Liczba zadeklarowanych godzin pobytu kandydata w przedszkolu powyżej 5 godzin podstawy programowej ',2,2,'local',1),(33,'Kandydat, którego oboje rodzice (opiekunowie prawni) są zatrudnieni na podstawie umowy o pracę/umowy \r\nzlecenia lub studiują w systemie dziennym lub wykonują rolniczą lub pozarolniczą działalność gospodarczą - \r\nliczba punktów ',50,3,'local',0),(34,'Kandydat, który ukończy 4 lata w roku kalendarzowym, w którym jest prowadzona rekrutacja do przedszkoli -  \r\nliczba punktów ',40,3,'local',0),(35,' Kandydat, który ukończy 3 lata w roku kalendarzowym, w którym jest prowadzona rekrutacja do przedszkoli -  \r\nliczba punktów',30,3,'local',0),(36,'Uczęszczanie do tego samego przedszkola rodzeństwa kandydata',25,3,'local',0),(37,') Liczba zadeklarowanych godzin pobytu kandydata w przedszkolu powyżej 5 godzin podstawy programowej',2,3,'local',1);
/*!40000 ALTER TABLE `criteria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `institution`
--

DROP TABLE IF EXISTS `institution`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `institution` (
  `id_institution` int(11) NOT NULL AUTO_INCREMENT,
  `id_headmaster` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `max_capacity` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_institution`),
  KEY `id_headmaster` (`id_headmaster`),
  CONSTRAINT `institution_ibfk_1` FOREIGN KEY (`id_headmaster`) REFERENCES `user` (`id_user`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institution`
--

LOCK TABLES `institution` WRITE;
/*!40000 ALTER TABLE `institution` DISABLE KEYS */;
INSERT INTO `institution` VALUES (1,1,'Przedszkole nr 1','Kraków',50,'2026-06-01 13:14:37'),(2,5,'Przedszkole Samorządowe w Biskupicach','Biskupice',20,'2026-06-02 11:44:27'),(3,6,'Przedszkole Samorządowe w Trąbkach','Trąbki',70,'2026-06-02 11:44:27');
/*!40000 ALTER TABLE `institution` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'parents',
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'sukces_eduenroll@example.com','$2b$10$b1yfMtF1YDiSGsKbTHXPAe8s87BS4iYvjQxb4Bz3XU9idrXgoNe2y','Jan','Kowalski','parents'),(2,'paretnt1@mail.com','haslomaslo','Ola','Kowalska','parents'),(3,'rodzic@test.pl','$2b$10$yteSlynvTBME.gQyvWU5qOssRSHgOo5YkYUi8iebKf8Z.WutWxj9S','Franek','Lis','parents'),(4,'test@test.pl','$2b$10$i0YCAgP7fBjEK1ugvI6VmOoIAlm/lxlFALkx.11nCmVe8lLF9agky','Jola','Nium','headmaster'),(5,'katarzyna.goczalbodura@gmail.com','haslo123','Katarzyna ','Goczał-Bodura','headmaster'),(6,'edyta.bukowska@gmail.com','haslo123','Edyta','Bukowska','headmaster'),(7,'dyrektor@szkola.pl','$2b$10$DASUp9mKdUkpbPl6ly0WFeuVAStUsae3sICJ/JwEM7HuSMonidlMC','Anna','Nowak','parents'),(8,'test@poczta.pl','$2b$10$X.ocO9ysqLh3PJxc6kPfNOqgOyKfv4x.2cv7Yu4.7tlVDgUe2PxEe','Anna','Nowak','parents'),(9,'rodzic1@test.pl','$2b$10$6mdmJQxNOivOBAmeHa2KbuohpcAB7e9Cd6BBD5g9dM/BqqsNpyoaS','Jan','Kowalski','parents'),(10,'kowalski@mail.com','$2b$10$UD9lCJK6mVY1rfdvRwgequnuwuddwHAh0bfL298di7MB92VwyA08a','Jan','Kowalski','parents'),(11,'admin@eduenroll.pl','$2b$10$tWdHJEnESDl9NH88IL4OLOIsMXEmS9VgDGz9cYudEeF.bRxqYTa.a','Admin','Eduenroll','admin');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-16 14:42:42
