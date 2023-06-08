/*
  Warnings:

  - You are about to drop the column `emal` on the `clients` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `clients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `clients` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "clients_emal_key";

-- AlterTable
ALTER TABLE "clients" DROP COLUMN "emal",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");
