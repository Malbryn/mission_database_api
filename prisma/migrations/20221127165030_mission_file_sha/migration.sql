/*
  Warnings:

  - Added the required column `sha` to the `mission_files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mission_files" ADD COLUMN     "sha" TEXT NOT NULL;
