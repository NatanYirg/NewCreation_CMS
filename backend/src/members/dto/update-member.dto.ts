import { Gender, MemberStatus, MaritalStatus, BaptismStatus } from '@prisma/client';

export class UpdateMemberDto {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: Gender;
  birthDate?: Date;
  phone?: string;
  alternativePhone?: string;
  email?: string;
  city?: string;
  subCity?: string;
  woreda?: string;
  houseNumber?: string;
  joinedDate?: Date;
  salvationDate?: Date;
  baptismStatus?: BaptismStatus;
  status?: MemberStatus;
  inactiveReason?: string;
  maritalStatus?: MaritalStatus;
  previousChurch?: string;
  notes?: string;
  photo?: string;
}
