/*
  Warnings:

  - You are about to drop the column `created` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `no_hp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `validasi` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Artikel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Mood` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Taggar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Artikel" DROP CONSTRAINT "Artikel_id_tagar_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_id_artikel_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_id_user_fkey";

-- DropForeignKey
ALTER TABLE "Mood" DROP CONSTRAINT "Mood_id_user_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "created",
DROP COLUMN "nama",
DROP COLUMN "no_hp",
DROP COLUMN "role",
DROP COLUMN "updated",
DROP COLUMN "username",
DROP COLUMN "validasi";

-- DropTable
DROP TABLE "Artikel";

-- DropTable
DROP TABLE "Media";

-- DropTable
DROP TABLE "Mood";

-- DropTable
DROP TABLE "Taggar";

-- DropEnum
DROP TYPE "EnumMoodToday";

-- DropEnum
DROP TYPE "Role";
