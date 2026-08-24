/*
  Warnings:

  - You are about to drop the column `date_buy` on the `garage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,carId,status]` on the table `Garage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `offeredValue` to the `Garage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Garage` DROP COLUMN `date_buy`,
    ADD COLUMN `date_offer` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `message` TEXT NULL,
    ADD COLUMN `offeredValue` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `status` ENUM('Pendente', 'EmAnalise', 'Aceita', 'Recusada', 'ContraProposta') NOT NULL DEFAULT 'Pendente';

-- CreateIndex
CREATE UNIQUE INDEX `Garage_userId_carId_status_key` ON `Garage`(`userId`, `carId`, `status`);
