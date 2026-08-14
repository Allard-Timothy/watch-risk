-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('DRAFT', 'READY_FOR_PAYMENT', 'PAID', 'ANALYZING', 'COMPLETE', 'ERROR');

-- CreateEnum
CREATE TYPE "PhotoType" AS ENUM ('DIAL', 'REHAUT', 'DATE_CYCLOPS', 'BEZEL', 'CROWN_GUARDS', 'CASEBACK', 'BRACELET', 'CLASP', 'END_LINKS', 'MOVEMENT', 'PAPERS', 'OTHER');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CANNOT_ASSESS');

-- CreateEnum
CREATE TYPE "ConfidenceLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "AnalysisRunStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETE', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('CREATED', 'PAID', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchCase" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "brand" TEXT NOT NULL,
    "model" TEXT,
    "reference" TEXT,
    "claimedYear" TEXT,
    "askingPrice" DECIMAL(65,30),
    "sellerPlatform" TEXT,
    "listingUrl" TEXT,
    "listingText" TEXT,
    "sellerClaims" TEXT,
    "status" "CaseStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseImage" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "claimedType" "PhotoType",
    "detectedType" TEXT,
    "qualityScore" DOUBLE PRECISION,
    "usable" BOOLEAN NOT NULL DEFAULT true,
    "analysisJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalysisRun" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "status" "AnalysisRunStatus" NOT NULL DEFAULT 'PENDING',
    "modelUsed" TEXT,
    "promptVersion" TEXT,
    "rawModelOutput" JSONB,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalysisRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "analysisRunId" TEXT,
    "riskLevel" "RiskLevel" NOT NULL,
    "confidence" "ConfidenceLevel" NOT NULL,
    "reportJson" JSONB NOT NULL,
    "reportText" TEXT NOT NULL,
    "rawModelOutput" JSONB,
    "modelUsed" TEXT NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentRecord" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "stripeCheckoutSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "amountCents" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "status" "PaymentStatus" NOT NULL DEFAULT 'CREATED',
    "rawEvent" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "WatchCase_userId_idx" ON "WatchCase"("userId");

-- CreateIndex
CREATE INDEX "CaseImage_caseId_idx" ON "CaseImage"("caseId");

-- CreateIndex
CREATE INDEX "AnalysisRun_caseId_idx" ON "AnalysisRun"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_analysisRunId_key" ON "Report"("analysisRunId");

-- CreateIndex
CREATE INDEX "Report_caseId_idx" ON "Report"("caseId");

-- CreateIndex
CREATE INDEX "PaymentRecord_caseId_idx" ON "PaymentRecord"("caseId");

-- AddForeignKey
ALTER TABLE "WatchCase" ADD CONSTRAINT "WatchCase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseImage" ADD CONSTRAINT "CaseImage_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "WatchCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisRun" ADD CONSTRAINT "AnalysisRun_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "WatchCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "WatchCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_analysisRunId_fkey" FOREIGN KEY ("analysisRunId") REFERENCES "AnalysisRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentRecord" ADD CONSTRAINT "PaymentRecord_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "WatchCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

