-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mapId" INTEGER NOT NULL,

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maps" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "worldName" TEXT NOT NULL,

    CONSTRAINT "maps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "maps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
