/*
  Warnings:

  - You are about to alter the column `city` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `street` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.

*/
-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "city" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "street" SET DATA TYPE VARCHAR(200);
