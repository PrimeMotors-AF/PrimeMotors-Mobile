-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Car` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `value` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('Entregue', 'Pendente', 'Processando') NOT NULL DEFAULT 'Processando',
    `date_registered` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `brandId` VARCHAR(191) NOT NULL,
    `especId` VARCHAR(191) NOT NULL,
    `itensId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Car_especId_key`(`especId`),
    UNIQUE INDEX `Car_itensId_key`(`itensId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Brand` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Brand_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Itens` (
    `id` VARCHAR(191) NOT NULL,
    `airbag` BOOLEAN NOT NULL DEFAULT false,
    `alarme` BOOLEAN NOT NULL DEFAULT false,
    `banco_de_couro` BOOLEAN NOT NULL DEFAULT false,
    `controle_cruzeiro` BOOLEAN NOT NULL DEFAULT false,
    `abs` BOOLEAN NOT NULL DEFAULT false,
    `computador_bordo` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Espec` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `fuel` ENUM('Gasolina', 'Alcool', 'Flex', 'Diesel', 'Hibrido', 'Eletrico') NOT NULL DEFAULT 'Gasolina',
    `color` VARCHAR(191) NOT NULL,
    `transmission` VARCHAR(191) NOT NULL,
    `engine` VARCHAR(191) NOT NULL,
    `potency` VARCHAR(191) NOT NULL,
    `max_speed` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cons` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `carId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `carId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Garage` (
    `id` VARCHAR(191) NOT NULL,
    `date_buy` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `carId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `Brand`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_especId_fkey` FOREIGN KEY (`especId`) REFERENCES `Espec`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_itensId_fkey` FOREIGN KEY (`itensId`) REFERENCES `Itens`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cons` ADD CONSTRAINT `Cons_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Garage` ADD CONSTRAINT `Garage_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Garage` ADD CONSTRAINT `Garage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
