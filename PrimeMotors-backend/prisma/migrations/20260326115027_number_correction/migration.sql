-- DropIndex
DROP INDEX `User_number_key` ON `User`;

-- AlterTable
ALTER TABLE `User` MODIFY `number` VARCHAR(191) NULL;
