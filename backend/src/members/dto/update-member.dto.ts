import { Gender, MemberStatus } from '@prisma/client';

export class UpdateMemberDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  age?: number;
  gender?: Gender;
  address?: string;
  photo?: string;
  status?: MemberStatus;
}
