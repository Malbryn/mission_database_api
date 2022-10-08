-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(32) NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isMember" BOOLEAN NOT NULL DEFAULT true,
    "isCreator" BOOLEAN NOT NULL DEFAULT false,
    "isStaff" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maps" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "worldName" VARCHAR(32) NOT NULL,

    CONSTRAINT "maps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(16) NOT NULL,

    CONSTRAINT "game_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statuses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(32) NOT NULL,

    CONSTRAINT "statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dlcs" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(32) NOT NULL,

    CONSTRAINT "dlcs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modsets" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "link" VARCHAR(512) NOT NULL,
    "description" VARCHAR(512) NOT NULL,

    CONSTRAINT "modsets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_files" (
    "id" SERIAL NOT NULL,
    "missionId" INTEGER NOT NULL,
    "name" VARCHAR(256),
    "path" VARCHAR(256),
    "downloadUrl" VARCHAR(256) NOT NULL,
    "version" INTEGER NOT NULL,
    "description" VARCHAR(512) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "mission_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "author" VARCHAR(32) NOT NULL,
    "slotsMin" INTEGER NOT NULL,
    "slotsMax" INTEGER NOT NULL,
    "mapId" INTEGER NOT NULL DEFAULT 1,
    "gameTypeId" INTEGER NOT NULL DEFAULT 1,
    "statusId" INTEGER NOT NULL DEFAULT 1,
    "modsetId" INTEGER NOT NULL DEFAULT 1,
    "description" VARCHAR(1024) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missions_on_dlcs" (
    "dlcId" INTEGER NOT NULL,
    "missionId" INTEGER NOT NULL,

    CONSTRAINT "missions_on_dlcs_pkey" PRIMARY KEY ("dlcId","missionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "mission_files" ADD CONSTRAINT "mission_files_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_files" ADD CONSTRAINT "mission_files_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "maps"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_gameTypeId_fkey" FOREIGN KEY ("gameTypeId") REFERENCES "game_types"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "statuses"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_modsetId_fkey" FOREIGN KEY ("modsetId") REFERENCES "modsets"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions_on_dlcs" ADD CONSTRAINT "missions_on_dlcs_dlcId_fkey" FOREIGN KEY ("dlcId") REFERENCES "dlcs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions_on_dlcs" ADD CONSTRAINT "missions_on_dlcs_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
