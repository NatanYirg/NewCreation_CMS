import { Gender, MemberStatus, MaritalStatus, BaptismStatus } from '@prisma/client';

export class CreateMemberDto {
  // Name
  firstName: string;
  middleName: string;
  lastName: string;

  // Personal
  gender?: Gender;
  birthDate?: Date;

  // Contact
  phone: string;
  alternativePhone?: string;
  email?: string;

  // Address
  city?: string;
  subCity?: string;
  woreda?: string;
  houseNumber?: string;

  // Church lifecycle
  joinedDate?: Date;
  salvationDate?: Date;

  // Baptism
  baptismStatus?: BaptismStatus;

  // Status
  status?: MemberStatus;
  inactiveReason?: string;

  // Marital
  maritalStatus?: MaritalStatus;

  // Background
  previousChurch?: string;

  // Notes & photo
  notes?: string;
  photo?: string;
}
