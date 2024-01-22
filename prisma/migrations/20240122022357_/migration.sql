/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PENGGUNA', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_id_admin_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL,
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "no_hp" DROP NOT NULL;

-- DropTable
DROP TABLE "Admin";
