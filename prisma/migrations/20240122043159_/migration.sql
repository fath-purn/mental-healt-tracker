/*
  Warnings:

  - You are about to drop the column `id_tagar` on the `Artikel` table. All the data in the column will be lost.
  - Added the required column `id_taggar` to the `Artikel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Artikel" DROP CONSTRAINT "Artikel_id_tagar_fkey";

-- AlterTable
ALTER TABLE "Artikel" DROP COLUMN "id_tagar",
ADD COLUMN     "id_taggar" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Artikel" ADD CONSTRAINT "Artikel_id_taggar_fkey" FOREIGN KEY ("id_taggar") REFERENCES "Taggar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
