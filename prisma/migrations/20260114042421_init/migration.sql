-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN DEFAULT false,
    "image" TEXT,
    "bio" TEXT,
    "theme" TEXT DEFAULT 'system',
    "language" TEXT DEFAULT 'en',
    "timezone" TEXT,
    "isProfilePublic" BOOLEAN DEFAULT true,
    "showEmail" BOOLEAN DEFAULT false,
    "showStats" BOOLEAN DEFAULT true,
    "showActivity" BOOLEAN DEFAULT true,
    "allowDataExport" BOOLEAN DEFAULT true,
    "marketingEmails" BOOLEAN DEFAULT false,
    "securityEmails" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "PasswordHash" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rateLimit" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "lastRequest" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "rateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "userId" TEXT,
    "level" TEXT NOT NULL,
    "action" TEXT,
    "details" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tbl_GameEvent" (
    "EventID" TEXT NOT NULL,
    "CreatorUserID" TEXT NOT NULL,
    "EventName" TEXT NOT NULL,
    "Description" TEXT,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tbl_GameEvent_pkey" PRIMARY KEY ("EventID")
);

-- CreateTable
CREATE TABLE "Tbl_EventPrizePool" (
    "PrizeID" TEXT NOT NULL,
    "EventID" TEXT NOT NULL,
    "PrizeName" TEXT NOT NULL,
    "PrizeValue" DECIMAL(18,2) NOT NULL,
    "DisplayOrder" INTEGER,
    "IsBlank" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Tbl_EventPrizePool_pkey" PRIMARY KEY ("PrizeID")
);

-- CreateTable
CREATE TABLE "Tbl_GameHistory" (
    "HistoryID" TEXT NOT NULL,
    "EventID" TEXT NOT NULL,
    "PlayerUserID" TEXT NOT NULL,
    "WonPrizeName" TEXT,
    "WonPrizeValue" DECIMAL(18,2),
    "PlayedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tbl_GameHistory_pkey" PRIMARY KEY ("HistoryID")
);

-- CreateTable
CREATE TABLE "testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_username_idx" ON "user"("username");

-- CreateIndex
CREATE INDEX "user_emailVerified_idx" ON "user"("emailVerified");

-- CreateIndex
CREATE INDEX "user_createdAt_idx" ON "user"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "account_providerId_accountId_key" ON "account"("providerId", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_identifier_value_key" ON "verification"("identifier", "value");

-- CreateIndex
CREATE UNIQUE INDEX "rateLimit_key_key" ON "rateLimit"("key");

-- CreateIndex
CREATE INDEX "log_userId_idx" ON "log"("userId");

-- CreateIndex
CREATE INDEX "log_type_idx" ON "log"("type");

-- CreateIndex
CREATE INDEX "log_level_idx" ON "log"("level");

-- CreateIndex
CREATE INDEX "log_timestamp_idx" ON "log"("timestamp");

-- CreateIndex
CREATE INDEX "Tbl_GameEvent_CreatorUserID_idx" ON "Tbl_GameEvent"("CreatorUserID");

-- CreateIndex
CREATE INDEX "Tbl_GameEvent_IsActive_idx" ON "Tbl_GameEvent"("IsActive");

-- CreateIndex
CREATE INDEX "Tbl_GameEvent_CreatedAt_idx" ON "Tbl_GameEvent"("CreatedAt");

-- CreateIndex
CREATE INDEX "Tbl_EventPrizePool_EventID_idx" ON "Tbl_EventPrizePool"("EventID");

-- CreateIndex
CREATE INDEX "Tbl_GameHistory_EventID_idx" ON "Tbl_GameHistory"("EventID");

-- CreateIndex
CREATE INDEX "Tbl_GameHistory_PlayerUserID_idx" ON "Tbl_GameHistory"("PlayerUserID");

-- CreateIndex
CREATE INDEX "testimonial_isActive_idx" ON "testimonial"("isActive");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification" ADD CONSTRAINT "verification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tbl_GameEvent" ADD CONSTRAINT "Tbl_GameEvent_CreatorUserID_fkey" FOREIGN KEY ("CreatorUserID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tbl_EventPrizePool" ADD CONSTRAINT "Tbl_EventPrizePool_EventID_fkey" FOREIGN KEY ("EventID") REFERENCES "Tbl_GameEvent"("EventID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tbl_GameHistory" ADD CONSTRAINT "Tbl_GameHistory_EventID_fkey" FOREIGN KEY ("EventID") REFERENCES "Tbl_GameEvent"("EventID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tbl_GameHistory" ADD CONSTRAINT "Tbl_GameHistory_PlayerUserID_fkey" FOREIGN KEY ("PlayerUserID") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
