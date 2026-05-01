-- phpMyAdmin SQL Dump
-- Database: `dollorgrows`

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `dollorgrows` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `dollorgrows`;

-- --------------------------------------------------------

-- Table structure for table `users`
CREATE TABLE `users` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `password` VARCHAR(191) NOT NULL,
  `security_pin` VARCHAR(191) NOT NULL,
  `referral_code` VARCHAR(191) NOT NULL,
  `sponsor_id` VARCHAR(191) DEFAULT NULL,
  `phone` VARCHAR(191) DEFAULT NULL,
  `country` VARCHAR(191) DEFAULT NULL,
  `phone_code` VARCHAR(191) DEFAULT NULL,
  `avatar` VARCHAR(191) DEFAULT NULL,
  `role` VARCHAR(191) NOT NULL DEFAULT 'user',
  `status` VARCHAR(191) NOT NULL DEFAULT 'active',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  `last_login` DATETIME(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`),
  UNIQUE KEY `users_referral_code_key` (`referral_code`),
  KEY `users_sponsor_id_fkey` (`sponsor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `wallets`
CREATE TABLE `wallets` (
  `id` VARCHAR(191) NOT NULL,
  `user_id` VARCHAR(191) NOT NULL,
  `balance_wallet` DOUBLE NOT NULL DEFAULT 0,
  `pool_wallet` DOUBLE NOT NULL DEFAULT 0,
  `pool_commission` DOUBLE NOT NULL DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wallets_user_id_key` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `pools`
CREATE TABLE `pools` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) DEFAULT NULL,
  `minimum_investment` DOUBLE NOT NULL DEFAULT 0,
  `maximum_investment` DOUBLE DEFAULT NULL,
  `daily_return` DOUBLE NOT NULL,
  `duration_days` INTEGER NOT NULL DEFAULT 30,
  `is_active` BOOLEAN NOT NULL DEFAULT 1,
  `total_capacity` DOUBLE DEFAULT NULL,
  `total_invested` DOUBLE NOT NULL DEFAULT 0,
  `level1_commission` DOUBLE NOT NULL DEFAULT 10,
  `level2_commission` DOUBLE NOT NULL DEFAULT 5,
  `level3_commission` DOUBLE NOT NULL DEFAULT 3,
  `bonus_percent` DOUBLE NOT NULL DEFAULT 30,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `investments`
CREATE TABLE `investments` (
  `id` VARCHAR(191) NOT NULL,
  `user_id` VARCHAR(191) NOT NULL,
  `pool_id` VARCHAR(191) NOT NULL,
  `amount` DOUBLE NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'active',
  `start_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `end_date` DATETIME(3) NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT 1,
  `last_claim_date` DATETIME(3) DEFAULT NULL,
  `total_claimed` DOUBLE NOT NULL DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `investments_user_id_pool_id_key` (`user_id`, `pool_id`),
  KEY `investments_pool_id_fkey` (`pool_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `commissions`
CREATE TABLE `commissions` (
  `id` VARCHAR(191) NOT NULL,
  `from_user_id` VARCHAR(191) NOT NULL,
  `to_user_id` VARCHAR(191) NOT NULL,
  `investment_id` VARCHAR(191) DEFAULT NULL,
  `amount` DOUBLE NOT NULL,
  `level` INTEGER NOT NULL,
  `percentage` DOUBLE NOT NULL DEFAULT 0,
  `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
  `description` VARCHAR(191) DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `processed_at` DATETIME(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `commissions_from_user_id_fkey` (`from_user_id`),
  KEY `commissions_to_user_id_fkey` (`to_user_id`),
  KEY `commissions_investment_id_fkey` (`investment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `transactions`
CREATE TABLE `transactions` (
  `id` VARCHAR(191) NOT NULL,
  `user_id` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `amount` DOUBLE NOT NULL,
  `tx_hash` VARCHAR(191) DEFAULT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
  `description` VARCHAR(191) DEFAULT NULL,
  `network` VARCHAR(191) DEFAULT NULL,
  `deposit_address` VARCHAR(191) DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `transactions_tx_hash_key` (`tx_hash`),
  KEY `transactions_user_id_fkey` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `withdrawal_requests`
CREATE TABLE `withdrawal_requests` (
  `id` VARCHAR(191) NOT NULL,
  `user_id` VARCHAR(191) NOT NULL,
  `amount` DOUBLE NOT NULL DEFAULT 0,
  `wallet_address` VARCHAR(191) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
  `tx_hash` VARCHAR(191) DEFAULT NULL,
  `notes` VARCHAR(191) DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `processed_at` DATETIME(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `withdrawal_requests_user_id_fkey` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `matrix_slots`
CREATE TABLE `matrix_slots` (
  `id` VARCHAR(191) NOT NULL,
  `owner_id` VARCHAR(191) NOT NULL,
  `position` INTEGER NOT NULL,
  `filled_by_id` VARCHAR(191) DEFAULT NULL,
  `filled_at` DATETIME(3) DEFAULT NULL,
  `is_filled` BOOLEAN NOT NULL DEFAULT 0,
  `bonus_amount` DOUBLE NOT NULL DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `matrix_slots_owner_id_position_key` (`owner_id`, `position`),
  KEY `matrix_slots_owner_id_idx` (`owner_id`),
  KEY `matrix_slots_filled_by_id_idx` (`filled_by_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `matrix_bonuses`
CREATE TABLE `matrix_bonuses` (
  `id` VARCHAR(191) NOT NULL,
  `from_user_id` VARCHAR(191) NOT NULL,
  `to_user_id` VARCHAR(191) NOT NULL,
  `investment_id` VARCHAR(191) NOT NULL,
  `pool_id` VARCHAR(191) NOT NULL,
  `amount` DOUBLE NOT NULL,
  `bonus_percent` DOUBLE NOT NULL,
  `slot_position` INTEGER NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'processed',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `matrix_bonuses_to_user_id_idx` (`to_user_id`),
  KEY `matrix_bonuses_from_user_id_idx` (`from_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `settings`
CREATE TABLE `settings` (
  `id` VARCHAR(191) NOT NULL,
  `key` VARCHAR(191) NOT NULL,
  `value` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) DEFAULT NULL,
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_key_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `notifications`
CREATE TABLE `notifications` (
  `id` VARCHAR(191) NOT NULL,
  `user_id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `message` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL DEFAULT 'info',
  `is_read` BOOLEAN NOT NULL DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `notifications_user_id_idx` (`user_id`),
  KEY `notifications_is_read_idx` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `daily_profits`
CREATE TABLE `daily_profits` (
  `id` VARCHAR(191) NOT NULL,
  `user_id` VARCHAR(191) NOT NULL,
  `investment_id` VARCHAR(191) NOT NULL,
  `amount` DOUBLE NOT NULL,
  `profit_date` DATETIME(3) NOT NULL,
  `is_claimed` BOOLEAN NOT NULL DEFAULT 0,
  `claimed_at` DATETIME(3) DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `daily_profits_user_id_idx` (`user_id`),
  KEY `daily_profits_investment_id_idx` (`investment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Constraints
-- --------------------------------------------------------

ALTER TABLE `users`
  ADD CONSTRAINT `users_sponsor_id_fkey` FOREIGN KEY (`sponsor_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `wallets`
  ADD CONSTRAINT `wallets_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `investments`
  ADD CONSTRAINT `investments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `investments_pool_id_fkey` FOREIGN KEY (`pool_id`) REFERENCES `pools` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `commissions`
  ADD CONSTRAINT `commissions_from_user_id_fkey` FOREIGN KEY (`from_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `commissions_to_user_id_fkey` FOREIGN KEY (`to_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `commissions_investment_id_fkey` FOREIGN KEY (`investment_id`) REFERENCES `investments` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `withdrawal_requests`
  ADD CONSTRAINT `withdrawal_requests_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `matrix_slots`
  ADD CONSTRAINT `matrix_slots_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `matrix_slots_filled_by_id_fkey` FOREIGN KEY (`filled_by_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE `matrix_bonuses`
  ADD CONSTRAINT `matrix_bonuses_from_user_id_fkey` FOREIGN KEY (`from_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `matrix_bonuses_to_user_id_fkey` FOREIGN KEY (`to_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

COMMIT;
