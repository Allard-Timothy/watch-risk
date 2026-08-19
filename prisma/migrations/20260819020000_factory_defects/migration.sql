-- CreateTable
CREATE TABLE "Factory" (
    "id" TEXT NOT NULL,
    "canonicalName" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Factory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryVersion" (
    "id" TEXT NOT NULL,
    "factoryId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FactoryVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Defect" (
    "id" TEXT NOT NULL,
    "factoryId" TEXT NOT NULL,
    "factoryVersionId" TEXT,
    "area" TEXT NOT NULL,
    "photoType" TEXT,
    "whatBuyersShouldLookFor" TEXT NOT NULL,
    "whatPhotosCannotShow" TEXT NOT NULL,
    "references" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Defect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FactoryVersion_factoryId_idx" ON "FactoryVersion"("factoryId");

-- CreateIndex
CREATE INDEX "Defect_factoryId_idx" ON "Defect"("factoryId");

-- CreateIndex
CREATE INDEX "Defect_factoryVersionId_idx" ON "Defect"("factoryVersionId");

-- AddForeignKey
ALTER TABLE "FactoryVersion" ADD CONSTRAINT "FactoryVersion_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Defect" ADD CONSTRAINT "Defect_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Defect" ADD CONSTRAINT "Defect_factoryVersionId_fkey" FOREIGN KEY ("factoryVersionId") REFERENCES "FactoryVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
