/*
  Warnings:

  - Made the column `categoryId` on table `car` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Car` DROP FOREIGN KEY `Car_categoryId_fkey`;

-- DropIndex
DROP INDEX `Car_categoryId_fkey` ON `Car`;

-- AlterTable
ALTER TABLE `Car` MODIFY `categoryId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
