import { Gender, MemberStatus } from '@prisma/client';

export class CreateMemberDto {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  age: number;
  gender: Gender;
  address: string;
  photo: string; // set from uploaded file
  status: MemberStatus;
}
