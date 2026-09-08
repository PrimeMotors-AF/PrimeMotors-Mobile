-- AlterTable
ALTER TABLE `User` ADD COLUMN `avatar_url` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `TestDrive` (
    `id` VARCHAR(191) NOT NULL,
    `scheduledAt` DATETIME(3) NOT NULL,
    `carId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NULL,
    `status` ENUM('Pendente', 'Confirmado', 'Cancelado', 'Realizado') NOT NULL DEFAULT 'Pendente',

    UNIQUE INDEX `TestDrive_userId_carId_scheduledAt_key`(`userId`, `carId`, `scheduledAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TestDrive` ADD CONSTRAINT `TestDrive_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TestDrive` ADD CONSTRAINT `TestDrive_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
