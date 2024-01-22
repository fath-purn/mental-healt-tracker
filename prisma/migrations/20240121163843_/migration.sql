/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_admin` on the `Admin` table. All the data in the column will be lost.
  - The primary key for the `Artikel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_artikel` on the `Artikel` table. All the data in the column will be lost.
  - The primary key for the `Media` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_media` on the `Media` table. All the data in the column will be lost.
  - The primary key for the `Mood` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_mood` on the `Mood` table. All the data in the column will be lost.
  - The primary key for the `Taggar` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_taggar` on the `Taggar` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_user` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Artikel" DROP CONSTRAINT "Artikel_id_tagar_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_id_admin_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_id_artikel_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_id_user_fkey";

-- DropForeignKey
ALTER TABLE "Mood" DROP CONSTRAINT "Mood_id_user_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_pkey",
DROP COLUMN "id_admin",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Artikel" DROP CONSTRAINT "Artikel_pkey",
DROP COLUMN "id_artikel",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Artikel_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Media" DROP CONSTRAINT "Media_pkey",
DROP COLUMN "id_media",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Media_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Mood" DROP CONSTRAINT "Mood_pkey",
DROP COLUMN "id_mood",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Mood_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Taggar" DROP CONSTRAINT "Taggar_pkey",
DROP COLUMN "id_taggar",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Taggar_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id_user",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "validasi" SET DEFAULT false,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Artikel" ADD CONSTRAINT "Artikel_id_tagar_fkey" FOREIGN KEY ("id_tagar") REFERENCES "Taggar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mood" ADD CONSTRAINT "Mood_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_id_admin_fkey" FOREIGN KEY ("id_admin") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_id_artikel_fkey" FOREIGN KEY ("id_artikel") REFERENCES "Artikel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
