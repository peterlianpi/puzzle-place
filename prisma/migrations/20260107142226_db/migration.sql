-- CreateTable
CREATE TABLE "Tbl_GameEvent" (
    "EventID" SERIAL NOT NULL,
    "CreatorUserID" TEXT NOT NULL,
    "EventName" TEXT NOT NULL,
    "Description" TEXT,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tbl_GameEvent_pkey" PRIMARY KEY ("EventID")
);

-- CreateTable
CREATE TABLE "Tbl_EventPrizePool" (
    "PrizeID" SERIAL NOT NULL,
    "EventID" INTEGER NOT NULL,
    "PrizeName" TEXT NOT NULL,
    "PrizeValue" DECIMAL(18,2) NOT NULL,
    "DisplayOrder" INTEGER,
    "IsBlank" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Tbl_EventPrizePool_pkey" PRIMARY KEY ("PrizeID")
);

-- CreateTable
CREATE TABLE "Tbl_GameHistory" (
    "HistoryID" SERIAL NOT NULL,
    "EventID" INTEGER NOT NULL,
    "PlayerUserID" TEXT NOT NULL,
    "WonPrizeName" TEXT,
    "WonPrizeValue" DECIMAL(18,2),
    "PlayedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tbl_GameHistory_pkey" PRIMARY KEY ("HistoryID")
);

-- CreateIndex
CREATE INDEX "user_username_idx" ON "user"("username");

-- CreateIndex
CREATE INDEX "user_emailVerified_idx" ON "user"("emailVerified");

-- CreateIndex
CREATE INDEX "user_createdAt_idx" ON "user"("createdAt");

-- AddForeignKey
ALTER TABLE "Tbl_GameEvent" ADD CONSTRAINT "Tbl_GameEvent_CreatorUserID_fkey" FOREIGN KEY ("CreatorUserID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tbl_EventPrizePool" ADD CONSTRAINT "Tbl_EventPrizePool_EventID_fkey" FOREIGN KEY ("EventID") REFERENCES "Tbl_GameEvent"("EventID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tbl_GameHistory" ADD CONSTRAINT "Tbl_GameHistory_EventID_fkey" FOREIGN KEY ("EventID") REFERENCES "Tbl_GameEvent"("EventID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tbl_GameHistory" ADD CONSTRAINT "Tbl_GameHistory_PlayerUserID_fkey" FOREIGN KEY ("PlayerUserID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
