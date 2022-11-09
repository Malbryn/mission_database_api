-- AlterTable
ALTER TABLE "mission_files" ALTER COLUMN "missionId" DROP NOT NULL,
ALTER COLUMN "createdById" DROP NOT NULL;

-- AlterTable
ALTER TABLE "missions" ALTER COLUMN "createdById" DROP NOT NULL;
