/*
  Warnings:

  - Added the required column `no_hp` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "no_hp",
ADD COLUMN     "no_hp" INTEGER NOT NULL;
