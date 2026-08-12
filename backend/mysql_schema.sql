-- MySQL schema for Hospital Management System backend
-- Import this file into XAMPP/MySQL to create the database and tables.

CREATE DATABASE IF NOT EXISTS `hospital_management`;
USE `hospital_management`;

CREATE TABLE IF NOT EXISTS `Users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('patient','doctor','admin') NOT NULL DEFAULT 'patient',
  `specialization` VARCHAR(255) DEFAULT NULL,
  `availableTime` JSON DEFAULT NULL,
  `availabilitySlots` JSON DEFAULT NULL,
  `qualification` VARCHAR(255) DEFAULT NULL,
  `experience` VARCHAR(255) DEFAULT NULL,
  `consultationFee` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `rating` JSON DEFAULT NULL,
  `profileImage` VARCHAR(1024) DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Appointments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `patientId` INT UNSIGNED NOT NULL,
  `doctorId` INT UNSIGNED NOT NULL,
  `date` DATE NOT NULL,
  `time` VARCHAR(50) NOT NULL,
  `status` ENUM('pending','approved','cancelled','completed') NOT NULL DEFAULT 'pending',
  `amount` DECIMAL(10,2) NOT NULL DEFAULT 20.00,
  `paymentStatus` ENUM('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  `reason` TEXT DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_patientId` (`patientId`),
  INDEX `idx_doctorId` (`doctorId`),
  CONSTRAINT `fk_appointments_patient` FOREIGN KEY (`patientId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_appointments_doctor` FOREIGN KEY (`doctorId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Notifications` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('appointment','system','reminder') NOT NULL DEFAULT 'appointment',
  `isRead` TINYINT(1) NOT NULL DEFAULT 0,
  `isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
  `relatedId` VARCHAR(255) DEFAULT NULL,
  `relatedModel` VARCHAR(255) DEFAULT NULL,
  `priority` INT NOT NULL DEFAULT 0,
  `readAt` DATETIME DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_notifications_userId` (`userId`),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
