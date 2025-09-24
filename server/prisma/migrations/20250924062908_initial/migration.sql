-- CreateEnum
CREATE TYPE "public"."RequestStatus" AS ENUM ('OPEN', 'CLOSE');

-- CreateTable
CREATE TABLE "public"."Customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNo" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Agent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "languagesKnown" TEXT[],
    "password" TEXT NOT NULL,
    "availability" BOOLEAN NOT NULL DEFAULT true,
    "skills" TEXT[],
    "isAdmin" BOOLEAN NOT NULL,
    "currentWorkload" INTEGER NOT NULL DEFAULT 0,
    "phoneNo" TEXT NOT NULL,
    "issueResolvedCount" INTEGER NOT NULL DEFAULT 0,
    "totalRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Request" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT,
    "priority" TEXT NOT NULL,
    "status" "public"."RequestStatus" NOT NULL,
    "rating" DOUBLE PRECISION,
    "customerId" INTEGER NOT NULL,
    "agentID" INTEGER,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Prompt" (
    "id" SERIAL NOT NULL,
    "promptId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,

    CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "public"."Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_email_key" ON "public"."Agent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Prompt_promptId_key" ON "public"."Prompt"("promptId");

-- AddForeignKey
ALTER TABLE "public"."Request" ADD CONSTRAINT "Request_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Request" ADD CONSTRAINT "Request_agentID_fkey" FOREIGN KEY ("agentID") REFERENCES "public"."Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
