-- DropForeignKey
ALTER TABLE "public"."account_attributions" DROP CONSTRAINT "account_attributions_account_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."account_stripe_platforms" DROP CONSTRAINT "account_stripe_platforms_account_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."account_users" DROP CONSTRAINT "account_users_users_id_fk";

-- DropForeignKey
ALTER TABLE "public"."account_users" DROP CONSTRAINT "fk_account_users_accounts";

-- DropForeignKey
ALTER TABLE "public"."account_users" DROP CONSTRAINT "fk_account_users_users";

-- DropForeignKey
ALTER TABLE "public"."account_vat_settings" DROP CONSTRAINT "account_vat_settings_account_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."accounts" DROP CONSTRAINT "accounts_account_configuration_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."affiliates" DROP CONSTRAINT "affiliates_account_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."affiliates" DROP CONSTRAINT "affiliates_event_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."attendee_check_ins" DROP CONSTRAINT "attendee_check_ins_attendee_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."attendee_check_ins" DROP CONSTRAINT "attendee_check_ins_check_in_list_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."attendee_check_ins" DROP CONSTRAINT "attendee_check_ins_event_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."attendee_check_ins" DROP CONSTRAINT "attendee_check_ins_order_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."attendee_check_ins" DROP CONSTRAINT "attendee_check_ins_ticket_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."attendees" DROP CONSTRAINT "attendees_events_id_fk";

-- DropForeignKey
ALTER TABLE "public"."attendees" DROP CONSTRAINT "attendees_ticket_prices_id_fk";

-- DropForeignKey
ALTER TABLE "public"."attendees" DROP CONSTRAINT "attendees_users_id_fk";

-- DropForeignKey
ALTER TABLE "public"."attendees" DROP CONSTRAINT "fk_attendees_checked_in_by_id";

-- DropForeignKey
ALTER TABLE "public"."attendees" DROP CONSTRAINT "fk_attendees_order_id";

-- DropForeignKey
ALTER TABLE "public"."attendees" DROP CONSTRAINT "fk_attendees_ticket_id";

-- DropForeignKey
ALTER TABLE "public"."capacity_assignments" DROP CONSTRAINT "capacity_assignments_event_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."check_in_lists" DROP CONSTRAINT "check_in_lists_event_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."email_templates" DROP CONSTRAINT "email_templates_account_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."email_templates" DROP CONSTRAINT "email_templates_event_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."email_templates" DROP CONSTRAINT "email_templates_organizer_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."event_daily_statistics" DROP CONSTRAINT "event_daily_statistics_events_id_fk";

-- DropForeignKey
ALTER TABLE "public"."event_logs" DROP CONSTRAINT "event_logs_users_id_fk";

-- DropForeignKey
ALTER TABLE "public"."event_settings" DROP CONSTRAINT "event_settings_events_id_fk";

-- DropForeignKey
ALTER TABLE "public"."event_statistics" DROP CONSTRAINT "event_statistics_events_id_fk";

-- DropForeignKey
ALTER TABLE "public"."events" DROP CONSTRAINT "events_organizers_id_fk";

-- DropForeignKey
ALTER TABLE "public"."events" DROP CONSTRAINT "fk_events_account_id";

-- DropForeignKey
ALTER TABLE "public"."events" DROP CONSTRAINT "fk_events_user_id";

-- DropForeignKey
ALTER TABLE "public"."images" DROP CONSTRAINT "images_account_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."invoices" DROP CONSTRAINT "invoices_account_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."invoices" DROP CONSTRAINT "invoices_order_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."messages" DROP CONSTRAINT "messages_events_id_fk";

-- DropForeignKey
ALTER TABLE "public"."messages" DROP CONSTRAINT "messages_users_id_fk";

-- DropForeignKey
ALTER TABLE "public"."order_application_fees" DROP CONSTRAINT "order_application_fees_order_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "fk_order_items_order_id";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "fk_order_items_ticket_id";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "order_items_ticket_prices_id_fk";

-- DropForeignKey
ALTER TABLE "public"."order_payment_platform_fees" DROP CONSTRAINT "order_payment_platform_fees_order_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."order_refunds" DROP CONSTRAINT "order_refunds_order_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "fk_orders_event_id";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_affiliate_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_promo_codes_id_fk";

-- DropForeignKey
ALTER TABLE "public"."organizer_settings" DROP CONSTRAINT "organizer_settings_organizer_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."organizers" DROP CONSTRAINT "organizers_account_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."outgoing_messages" DROP CONSTRAINT "outgoing_messages_event_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."outgoing_messages" DROP CONSTRAINT "outgoing_messages_message_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."product_capacity_assignments" DROP CONSTRAINT "ticket_capacity_assignments_capacity_assignment_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."product_capacity_assignments" DROP CONSTRAINT "ticket_capacity_assignments_ticket_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."product_categories" DROP CONSTRAINT "product_categories_event_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."product_check_in_lists" DROP CONSTRAINT "ticket_check_in_lists_check_in_list_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."product_check_in_lists" DROP CONSTRAINT "ticket_check_in_lists_ticket_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."product_prices" DROP CONSTRAINT "fk_ticket_prices_ticket_id";

-- DropForeignKey
ALTER TABLE "public"."product_questions" DROP CONSTRAINT "fk_ticket_questions_question_id";

-- DropForeignKey
ALTER TABLE "public"."product_questions" DROP CONSTRAINT "fk_ticket_questions_ticket_id";

-- DropForeignKey
ALTER TABLE "public"."product_taxes_and_fees" DROP CONSTRAINT "ticket_tax_and_fees_tax_and_fees_id_fk";

-- DropForeignKey
ALTER TABLE "public"."product_taxes_and_fees" DROP CONSTRAINT "ticket_tax_and_fees_tickets_id_fk";

-- DropForeignKey
ALTER TABLE "public"."products" DROP CONSTRAINT "fk_tickets_event_id";

-- DropForeignKey
ALTER TABLE "public"."products" DROP CONSTRAINT "products_product_category_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."promo_codes" DROP CONSTRAINT "promo_codes_events_id_fk";

-- DropForeignKey
ALTER TABLE "public"."question_answers" DROP CONSTRAINT "fk_attendeed_attendee_id";

-- DropForeignKey
ALTER TABLE "public"."question_answers" DROP CONSTRAINT "fk_orders_order_id";

-- DropForeignKey
ALTER TABLE "public"."question_answers" DROP CONSTRAINT "fk_question_answers_question_id";

-- DropForeignKey
ALTER TABLE "public"."question_answers" DROP CONSTRAINT "fk_tickets_ticket_id";

-- DropForeignKey
ALTER TABLE "public"."questions" DROP CONSTRAINT "questions_event_id_fk";

-- DropForeignKey
ALTER TABLE "public"."roles" DROP CONSTRAINT "roles_accounts_id_fk";

-- DropForeignKey
ALTER TABLE "public"."stripe_payments" DROP CONSTRAINT "stripe_payments_orders_id_fk";

-- DropForeignKey
ALTER TABLE "public"."webhook_logs" DROP CONSTRAINT "webhook_logs_webhook_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."webhooks" DROP CONSTRAINT "webhooks_account_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."webhooks" DROP CONSTRAINT "webhooks_event_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."webhooks" DROP CONSTRAINT "webhooks_user_id_foreign";

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "address" TEXT,
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);

-- DropTable
DROP TABLE "public"."account_attributions";

-- DropTable
DROP TABLE "public"."account_configuration";

-- DropTable
DROP TABLE "public"."account_stripe_platforms";

-- DropTable
DROP TABLE "public"."account_users";

-- DropTable
DROP TABLE "public"."account_vat_settings";

-- DropTable
DROP TABLE "public"."accounts";

-- DropTable
DROP TABLE "public"."affiliates";

-- DropTable
DROP TABLE "public"."attendee_check_ins";

-- DropTable
DROP TABLE "public"."attendees";

-- DropTable
DROP TABLE "public"."capacity_assignments";

-- DropTable
DROP TABLE "public"."check_in_lists";

-- DropTable
DROP TABLE "public"."email_templates";

-- DropTable
DROP TABLE "public"."event_daily_statistics";

-- DropTable
DROP TABLE "public"."event_logs";

-- DropTable
DROP TABLE "public"."event_settings";

-- DropTable
DROP TABLE "public"."event_statistics";

-- DropTable
DROP TABLE "public"."events";

-- DropTable
DROP TABLE "public"."failed_jobs";

-- DropTable
DROP TABLE "public"."images";

-- DropTable
DROP TABLE "public"."invoices";

-- DropTable
DROP TABLE "public"."job_batches";

-- DropTable
DROP TABLE "public"."messages";

-- DropTable
DROP TABLE "public"."migrations";

-- DropTable
DROP TABLE "public"."order_application_fees";

-- DropTable
DROP TABLE "public"."order_items";

-- DropTable
DROP TABLE "public"."order_payment_platform_fees";

-- DropTable
DROP TABLE "public"."order_refunds";

-- DropTable
DROP TABLE "public"."orders";

-- DropTable
DROP TABLE "public"."organizer_settings";

-- DropTable
DROP TABLE "public"."organizers";

-- DropTable
DROP TABLE "public"."outgoing_messages";

-- DropTable
DROP TABLE "public"."password_reset_tokens";

-- DropTable
DROP TABLE "public"."password_resets";

-- DropTable
DROP TABLE "public"."personal_access_tokens";

-- DropTable
DROP TABLE "public"."product_capacity_assignments";

-- DropTable
DROP TABLE "public"."product_categories";

-- DropTable
DROP TABLE "public"."product_check_in_lists";

-- DropTable
DROP TABLE "public"."product_prices";

-- DropTable
DROP TABLE "public"."product_questions";

-- DropTable
DROP TABLE "public"."product_taxes_and_fees";

-- DropTable
DROP TABLE "public"."products";

-- DropTable
DROP TABLE "public"."promo_codes";

-- DropTable
DROP TABLE "public"."question_answers";

-- DropTable
DROP TABLE "public"."questions";

-- DropTable
DROP TABLE "public"."roles";

-- DropTable
DROP TABLE "public"."stripe_customers";

-- DropTable
DROP TABLE "public"."stripe_payments";

-- DropTable
DROP TABLE "public"."stripe_payouts";

-- DropTable
DROP TABLE "public"."taxes_and_fees";

-- DropTable
DROP TABLE "public"."ticket_lookup_tokens";

-- DropTable
DROP TABLE "public"."timezones";

-- DropTable
DROP TABLE "public"."users";

-- DropTable
DROP TABLE "public"."webhook_logs";

-- DropTable
DROP TABLE "public"."webhooks";

-- CreateTable
CREATE TABLE "Inquiry" (
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

-- CreateTable
CREATE TABLE "PushSubscription" (
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

-- CreateTable
CREATE TABLE "Registration" (
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

-- CreateTable
CREATE TABLE "EventTicketType" (
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

-- CreateTable
CREATE TABLE "EventOrder" (
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

-- CreateTable
CREATE TABLE "EventTicket" (
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

-- CreateTable
CREATE TABLE "EventPromoCode" (
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

-- CreateTable
CREATE TABLE "PromoCodeTicket" (
    "id" TEXT NOT NULL,
    "promoCodeId" TEXT NOT NULL,
    "ticketTypeId" TEXT NOT NULL,

    CONSTRAINT "PromoCodeTicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");

-- CreateIndex
CREATE UNIQUE INDEX "EventOrder_orderNumber_key" ON "EventOrder"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PromoCodeTicket_promoCodeId_ticketTypeId_key" ON "PromoCodeTicket"("promoCodeId", "ticketTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_resetToken_key" ON "Member"("resetToken");

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTicketType" ADD CONSTRAINT "EventTicketType_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventOrder" ADD CONSTRAINT "EventOrder_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTicket" ADD CONSTRAINT "EventTicket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTicket" ADD CONSTRAINT "EventTicket_ticketTypeId_fkey" FOREIGN KEY ("ticketTypeId") REFERENCES "EventTicketType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTicket" ADD CONSTRAINT "EventTicket_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "EventOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPromoCode" ADD CONSTRAINT "EventPromoCode_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoCodeTicket" ADD CONSTRAINT "PromoCodeTicket_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "EventPromoCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoCodeTicket" ADD CONSTRAINT "PromoCodeTicket_ticketTypeId_fkey" FOREIGN KEY ("ticketTypeId") REFERENCES "EventTicketType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
