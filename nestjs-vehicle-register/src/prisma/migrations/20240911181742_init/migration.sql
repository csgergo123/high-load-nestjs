-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citext" WITH SCHEMA "pg_catalog";

-- CreateTable
CREATE TABLE "Vehicle" (
    "uuid" TEXT NOT NULL,
    "rendszam" CITEXT NOT NULL,
    "tulajdonos" CITEXT NOT NULL,
    "forgalmi_ervenyes" TEXT NOT NULL,
    "adatok" TEXT[],

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_uuid_key" ON "Vehicle"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_rendszam_key" ON "Vehicle"("rendszam");

-- CreateIndex
CREATE INDEX "Vehicle_rendszam_tulajdonos_adatok_idx" ON "Vehicle"("rendszam", "tulajdonos", "adatok");
