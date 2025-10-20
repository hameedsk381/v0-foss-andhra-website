-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN "canonicalUrl" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "focusKeyword" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "ogDescription" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "ogImage" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "ogTitle" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "readingTime" INTEGER;
ALTER TABLE "BlogPost" ADD COLUMN "twitterCard" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "twitterDescription" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "twitterImage" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "twitterTitle" TEXT;

-- AlterTable
ALTER TABLE "Content" ADD COLUMN "canonicalUrl" TEXT;
ALTER TABLE "Content" ADD COLUMN "focusKeyword" TEXT;
ALTER TABLE "Content" ADD COLUMN "ogDescription" TEXT;
ALTER TABLE "Content" ADD COLUMN "ogImage" TEXT;
ALTER TABLE "Content" ADD COLUMN "ogTitle" TEXT;
ALTER TABLE "Content" ADD COLUMN "twitterCard" TEXT;
ALTER TABLE "Content" ADD COLUMN "twitterDescription" TEXT;
ALTER TABLE "Content" ADD COLUMN "twitterImage" TEXT;
ALTER TABLE "Content" ADD COLUMN "twitterTitle" TEXT;
