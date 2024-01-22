/*
  Warnings:

  - A unique constraint covering the columns `[user_admin]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Admin_user_admin_key" ON "Admin"("user_admin");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
