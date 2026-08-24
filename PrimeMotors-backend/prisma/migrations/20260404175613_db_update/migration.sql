/*
  Warnings:

  - You are about to drop the column `alarme` on the `itens` table. All the data in the column will be lost.
  - You are about to drop the column `banco_de_couro` on the `itens` table. All the data in the column will be lost.
  - You are about to drop the column `computador_bordo` on the `itens` table. All the data in the column will be lost.
  - You are about to drop the column `controle_cruzeiro` on the `itens` table. All the data in the column will be lost.
  - You are about to drop the `cons` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Cons` DROP FOREIGN KEY `Cons_carId_fkey`;

-- AlterTable
ALTER TABLE `Itens` DROP COLUMN `alarme`,
    DROP COLUMN `banco_de_couro`,
    DROP COLUMN `computador_bordo`,
    DROP COLUMN `controle_cruzeiro`,
    ADD COLUMN `alarm` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `cruise_control` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `leather_seat` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `onBoard_computer` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `Cons`;
