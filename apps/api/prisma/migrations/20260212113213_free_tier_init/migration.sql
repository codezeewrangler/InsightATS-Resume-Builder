-- AlterTable
ALTER TABLE "DailyUsage" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "RefreshToken" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Resume" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ResumeCollaborator" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ResumeVersion" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" DROP DEFAULT;
