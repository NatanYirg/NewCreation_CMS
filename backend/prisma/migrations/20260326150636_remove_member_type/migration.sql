-- Remove member_type column and MemberType enum

ALTER TABLE "Member" DROP COLUMN IF EXISTS "memberType";

DROP TYPE IF EXISTS "MemberType";
