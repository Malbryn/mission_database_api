/*
  Warnings:

  - Added the required column `notes` to the `missions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "missions" ADD COLUMN     "notes" VARCHAR(1024) NOT NULL;

-- CreateTable
CREATE TABLE "frameworks" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "link" VARCHAR(256) NOT NULL,

    CONSTRAINT "frameworks_pkey" PRIMARY KEY ("id")
);
