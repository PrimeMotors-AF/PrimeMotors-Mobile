-- DropForeignKey
ALTER TABLE `Garage` DROP FOREIGN KEY `Garage_carId_fkey`;

-- DropIndex
DROP INDEX `Garage_carId_fkey` ON `Garage`;

-- AddForeignKey
ALTER TABLE `Garage` ADD CONSTRAINT `Garage_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
