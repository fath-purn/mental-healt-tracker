-- CreateEnum
CREATE TYPE "EnumMoodToday" AS ENUM ('HAPPY', 'NEUTRAL', 'SAD');

-- CreateTable
CREATE TABLE "Admin" (
    "id_admin" SERIAL NOT NULL,
    "user_admin" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id_admin")
);

-- CreateTable
CREATE TABLE "User" (
    "id_user" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "no_hp" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "validasi" BOOLEAN NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Taggar" (
    "id_taggar" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Taggar_pkey" PRIMARY KEY ("id_taggar")
);

-- CreateTable
CREATE TABLE "Artikel" (
    "id_artikel" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "id_tagar" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artikel_pkey" PRIMARY KEY ("id_artikel")
);

-- CreateTable
CREATE TABLE "Mood" (
    "id_mood" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "mood_today" "EnumMoodToday" NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mood_pkey" PRIMARY KEY ("id_mood")
);

-- CreateTable
CREATE TABLE "Media" (
    "id_media" SERIAL NOT NULL,
    "id_admin" INTEGER,
    "id_user" INTEGER,
    "id_artikel" INTEGER,
    "id_link" INTEGER NOT NULL,
    "link" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id_media")
);

-- AddForeignKey
ALTER TABLE "Artikel" ADD CONSTRAINT "Artikel_id_tagar_fkey" FOREIGN KEY ("id_tagar") REFERENCES "Taggar"("id_taggar") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mood" ADD CONSTRAINT "Mood_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_id_admin_fkey" FOREIGN KEY ("id_admin") REFERENCES "Admin"("id_admin") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_id_artikel_fkey" FOREIGN KEY ("id_artikel") REFERENCES "Artikel"("id_artikel") ON DELETE SET NULL ON UPDATE CASCADE;
