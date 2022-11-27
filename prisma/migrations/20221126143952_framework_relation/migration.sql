-- AlterTable
ALTER TABLE "missions" ADD COLUMN     "frameworkId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "frameworks"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;
