-- Track which renewal reminders have already been sent so the daily cron
-- never double-sends the 30-day or 7-day nudge for the same expiry cycle.
ALTER TABLE "Member" ADD COLUMN "renewal30ReminderSentAt" TIMESTAMP(3);
ALTER TABLE "Member" ADD COLUMN "renewal7ReminderSentAt" TIMESTAMP(3);
