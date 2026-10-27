-- CreateTable
CREATE TABLE `ProposalOutbox` (
    `id` VARCHAR(191) NOT NULL,
    `proposalId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nextAttemptAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `publishedAt` DATETIME(3) NULL,
    `lockedUntil` DATETIME(3) NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,

    INDEX `ProposalOutbox_publishedAt_nextAttemptAt_lockedUntil_created_idx`(`publishedAt`, `nextAttemptAt`, `lockedUntil`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
