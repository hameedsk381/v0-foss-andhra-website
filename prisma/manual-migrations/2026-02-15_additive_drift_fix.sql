-- Additive drift fix for FOSS Andhra app schema on shared PostgreSQL database.
-- Date: 2026-02-15
-- Safety:
-- - No DROP statements.
-- - Uses IF NOT EXISTS where possible.
-- - FK constraints are guarded with pg_constraint checks.

BEGIN;

-- 1) Member columns required by Prisma model and auth/profile flows
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "address" TEXT;
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "resetToken" TEXT;
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "resetTokenExpiry" TIMESTAMP(3);
CREATE UNIQUE INDEX IF NOT EXISTS "Member_resetToken_key" ON "Member"("resetToken");

-- 2) Missing table: Inquiry
CREATE TABLE IF NOT EXISTS "Inquiry" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'new',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- 3) Missing table: PushSubscription
CREATE TABLE IF NOT EXISTS "PushSubscription" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "endpoint" TEXT NOT NULL,
  "p256dh" TEXT NOT NULL,
  "auth" TEXT NOT NULL,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");

-- 4) Missing table: Registration
CREATE TABLE IF NOT EXISTS "Registration" (
  "id" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "organization" TEXT,
  "notes" TEXT,
  "attended" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- 5) Missing table: EventTicketType
CREATE TABLE IF NOT EXISTS "EventTicketType" (
  "id" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "type" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "minDonation" DOUBLE PRECISION,
  "maxDonation" DOUBLE PRECISION,
  "quantity" INTEGER,
  "quantitySold" INTEGER NOT NULL DEFAULT 0,
  "salesStart" TIMESTAMP(3),
  "salesEnd" TIMESTAMP(3),
  "hidden" BOOLEAN NOT NULL DEFAULT false,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "EventTicketType_pkey" PRIMARY KEY ("id")
);

-- 6) Missing table: EventOrder
CREATE TABLE IF NOT EXISTS "EventOrder" (
  "id" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "orderNumber" TEXT NOT NULL,
  "customerName" TEXT NOT NULL,
  "customerEmail" TEXT NOT NULL,
  "customerPhone" TEXT,
  "totalAmount" DOUBLE PRECISION NOT NULL,
  "subtotal" DOUBLE PRECISION NOT NULL,
  "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "feeAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "promoCode" TEXT,
  "status" TEXT NOT NULL,
  "paymentMethod" TEXT NOT NULL,
  "paymentId" TEXT,
  "razorpayOrderId" TEXT,
  "notes" TEXT,
  "customFields" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EventOrder_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "EventOrder_orderNumber_key" ON "EventOrder"("orderNumber");

-- 7) Missing table: EventTicket
CREATE TABLE IF NOT EXISTS "EventTicket" (
  "id" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "ticketTypeId" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "attendeeName" TEXT NOT NULL,
  "attendeeEmail" TEXT NOT NULL,
  "attendeePhone" TEXT,
  "qrCode" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'valid',
  "checkInStatus" TEXT NOT NULL DEFAULT 'pending',
  "checkInTime" TIMESTAMP(3),
  "checkInBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EventTicket_pkey" PRIMARY KEY ("id")
);

-- 8) Missing table: EventPromoCode
CREATE TABLE IF NOT EXISTS "EventPromoCode" (
  "id" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "description" TEXT,
  "discountType" TEXT NOT NULL,
  "discountValue" DOUBLE PRECISION NOT NULL,
  "maxUses" INTEGER,
  "usedCount" INTEGER NOT NULL DEFAULT 0,
  "validFrom" TIMESTAMP(3),
  "validUntil" TIMESTAMP(3),
  "minOrderAmount" DOUBLE PRECISION,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EventPromoCode_pkey" PRIMARY KEY ("id")
);

-- 9) Missing table: PromoCodeTicket
CREATE TABLE IF NOT EXISTS "PromoCodeTicket" (
  "id" TEXT NOT NULL,
  "promoCodeId" TEXT NOT NULL,
  "ticketTypeId" TEXT NOT NULL,
  CONSTRAINT "PromoCodeTicket_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "PromoCodeTicket_promoCodeId_ticketTypeId_key"
  ON "PromoCodeTicket"("promoCodeId", "ticketTypeId");

-- 10) Foreign keys (guarded to avoid duplicate constraint errors)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Registration_eventId_fkey') THEN
    ALTER TABLE "Registration"
      ADD CONSTRAINT "Registration_eventId_fkey"
      FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'EventTicketType_eventId_fkey') THEN
    ALTER TABLE "EventTicketType"
      ADD CONSTRAINT "EventTicketType_eventId_fkey"
      FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'EventOrder_eventId_fkey') THEN
    ALTER TABLE "EventOrder"
      ADD CONSTRAINT "EventOrder_eventId_fkey"
      FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'EventTicket_eventId_fkey') THEN
    ALTER TABLE "EventTicket"
      ADD CONSTRAINT "EventTicket_eventId_fkey"
      FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'EventTicket_ticketTypeId_fkey') THEN
    ALTER TABLE "EventTicket"
      ADD CONSTRAINT "EventTicket_ticketTypeId_fkey"
      FOREIGN KEY ("ticketTypeId") REFERENCES "EventTicketType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'EventTicket_orderId_fkey') THEN
    ALTER TABLE "EventTicket"
      ADD CONSTRAINT "EventTicket_orderId_fkey"
      FOREIGN KEY ("orderId") REFERENCES "EventOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'EventPromoCode_eventId_fkey') THEN
    ALTER TABLE "EventPromoCode"
      ADD CONSTRAINT "EventPromoCode_eventId_fkey"
      FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PromoCodeTicket_promoCodeId_fkey') THEN
    ALTER TABLE "PromoCodeTicket"
      ADD CONSTRAINT "PromoCodeTicket_promoCodeId_fkey"
      FOREIGN KEY ("promoCodeId") REFERENCES "EventPromoCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PromoCodeTicket_ticketTypeId_fkey') THEN
    ALTER TABLE "PromoCodeTicket"
      ADD CONSTRAINT "PromoCodeTicket_ticketTypeId_fkey"
      FOREIGN KEY ("ticketTypeId") REFERENCES "EventTicketType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

COMMIT;
