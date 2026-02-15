-- Move FOSS Andhra app tables from public schema to dedicated foss_app schema.
-- Run only after taking a full DB backup.
-- This script is non-destructive to table data but changes object namespace.

BEGIN;

CREATE SCHEMA IF NOT EXISTS foss_app;

DO $$
DECLARE
  tbl text;
  app_tables text[] := ARRAY[
    'Admin',
    'Analytics',
    'BlogCategory',
    'BlogComment',
    'BlogPost',
    'BlogPostTag',
    'BlogTag',
    'Content',
    'Donation',
    'Event',
    'Inquiry',
    'Media',
    'Member',
    'Notification',
    'Program',
    'ProgramCaseStudy',
    'ProgramClub',
    'ProgramInitiative',
    'ProgramProject',
    'ProgramRepository',
    'ProgramStartup',
    'ProgramTeamMember',
    'PushSubscription',
    'Registration',
    'Settings',
    'Subscriber',
    'Volunteer',
    'EventTicketType',
    'EventOrder',
    'EventTicket',
    'EventPromoCode',
    'PromoCodeTicket'
  ];
BEGIN
  FOREACH tbl IN ARRAY app_tables LOOP
    EXECUTE format('ALTER TABLE IF EXISTS public.%I SET SCHEMA foss_app;', tbl);
  END LOOP;
END $$;

COMMIT;
