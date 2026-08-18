-- CreateEnum
CREATE TYPE "SellerLifecycleStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "CommunityRecognitionStatus" AS ENUM ('FULL_TD', 'PROVISIONARY_TD', 'TRUSTED_SELLER', 'ESTABLISHED_SELLER', 'RECOMMENDED_SELLER', 'LISTED_SELLER', 'FORMER_TD', 'REMOVED_TD', 'BANNED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "QualitativeLabel" AS ENUM ('VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW', 'INSUFFICIENT_EVIDENCE');

-- CreateEnum
CREATE TYPE "RiskCategory" AS ENUM ('FRAUD', 'OPERATIONAL', 'QC', 'AFTER_SALES', 'PRODUCT_CLAIM');

-- CreateEnum
CREATE TYPE "EvidenceKind" AS ENUM ('TD_LISTING', 'MODERATOR_REVIEW', 'MODERATOR_TEST_PURCHASE', 'BUYER_REVIEW', 'TRANSACTION_REPORT', 'GIVEAWAY_OR_SPONSORSHIP', 'SELLER_PROMOTION', 'FORUM_STATUS', 'INDEPENDENT_REVIEW', 'OTHER');

-- CreateEnum
CREATE TYPE "SourceKind" AS ENUM ('FORUM', 'REDDIT', 'WEBSITE', 'MANUAL_CURATION', 'OTHER');

-- CreateEnum
CREATE TYPE "ClaimSentiment" AS ENUM ('POSITIVE', 'NEGATIVE', 'MIXED', 'NEUTRAL');

-- CreateTable
CREATE TABLE "Community" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "independenceGroup" TEXT NOT NULL,
    "formalTdProgram" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "vettingNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seller" (
    "id" TEXT NOT NULL,
    "canonicalName" TEXT NOT NULL,
    "status" "SellerLifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
    "likes" TEXT[],
    "concerns" TEXT[],
    "interpretation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellerAlias" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "identityConfidence" DOUBLE PRECISION NOT NULL,
    "evidenceNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SellerAlias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellerCommunity" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "status" "CommunityRecognitionStatus" NOT NULL,
    "statusSince" TIMESTAMP(3),
    "moderatorVetted" BOOLEAN NOT NULL DEFAULT false,
    "formalTdProgram" BOOLEAN NOT NULL DEFAULT false,
    "sellerParticipationRequired" BOOLEAN NOT NULL DEFAULT false,
    "giveawayOrSponsorshipRelationship" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "SellerCommunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrustDimension" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" "QualitativeLabel" NOT NULL,
    "notes" TEXT,

    CONSTRAINT "TrustDimension_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskFlag" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "category" "RiskCategory" NOT NULL,
    "label" "QualitativeLabel" NOT NULL,
    "summary" TEXT NOT NULL,

    CONSTRAINT "RiskFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "kind" "SourceKind" NOT NULL,
    "communityId" TEXT,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "publishedAt" TIMESTAMP(3),
    "retrievedAt" TIMESTAMP(3),
    "independenceGroup" TEXT NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "communityId" TEXT,
    "sourceId" TEXT,
    "evidenceType" "EvidenceKind" NOT NULL,
    "independenceGroup" TEXT NOT NULL,
    "claimText" TEXT NOT NULL,
    "sentiment" "ClaimSentiment",
    "confidence" DOUBLE PRECISION,
    "publishedAt" TIMESTAMP(3),
    "retrievedAt" TIMESTAMP(3),
    "sourceUrl" TEXT,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT,
    "sourceId" TEXT,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "predicate" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "observedAt" TIMESTAMP(3),

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "WatchCase" ADD COLUMN "sellerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SellerAlias_sellerId_alias_key" ON "SellerAlias"("sellerId", "alias");

-- CreateIndex
CREATE INDEX "SellerAlias_alias_idx" ON "SellerAlias"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "SellerCommunity_sellerId_communityId_key" ON "SellerCommunity"("sellerId", "communityId");

-- CreateIndex
CREATE UNIQUE INDEX "TrustDimension_sellerId_key_key" ON "TrustDimension"("sellerId", "key");

-- CreateIndex
CREATE INDEX "Evidence_sellerId_idx" ON "Evidence"("sellerId");

-- CreateIndex
CREATE INDEX "Evidence_independenceGroup_idx" ON "Evidence"("independenceGroup");

-- CreateIndex
CREATE INDEX "Claim_subjectType_subjectId_idx" ON "Claim"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "WatchCase_sellerId_idx" ON "WatchCase"("sellerId");

-- AddForeignKey
ALTER TABLE "WatchCase" ADD CONSTRAINT "WatchCase_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerAlias" ADD CONSTRAINT "SellerAlias_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerCommunity" ADD CONSTRAINT "SellerCommunity_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerCommunity" ADD CONSTRAINT "SellerCommunity_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrustDimension" ADD CONSTRAINT "TrustDimension_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFlag" ADD CONSTRAINT "RiskFlag_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;
