import {
  Controller, Get, Post, Body, Param, Put, Delete,
  Patch, ParseIntPipe, Query, UseInterceptors,
  UploadedFile, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MemberStatus } from '@prisma/client';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { memberPhotoStorage, imageFileFilter } from '../common/upload.config';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo', { storage: memberPhotoStorage, fileFilter: imageFileFilter }))
  create(
    @Body() body: Record<string, string>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const required = ['firstName', 'middleName', 'lastName', 'phone'];
    for (const field of required) {
      if (!body[field]) throw new BadRequestException(`${field} is required`);
    }

    const dto: CreateMemberDto = {
      firstName: body.firstName,
      middleName: body.middleName,
      lastName: body.lastName,
      gender: body.gender as any,
      birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
      phone: body.phone,
      alternativePhone: body.alternativePhone || undefined,
      email: body.email || undefined,
      city: body.city || undefined,
      subCity: body.subCity || undefined,
      woreda: body.woreda || undefined,
      houseNumber: body.houseNumber || undefined,
      joinedDate: body.joinedDate ? new Date(body.joinedDate) : undefined,
      salvationDate: body.salvationDate ? new Date(body.salvationDate) : undefined,
      baptismStatus: body.baptismStatus as any,
      status: (body.status as any) || 'ACTIVE',
      inactiveReason: body.inactiveReason || undefined,
      maritalStatus: body.maritalStatus as any,
      previousChurch: body.previousChurch || undefined,
      notes: body.notes || undefined,
      photo: file ? `/uploads/members/${file.filename}` : undefined,
    };

    return this.membersService.create(dto);
  }

  @Get()
  findAll(@Query('status') status?: MemberStatus) {
    if (status) return this.membersService.findByStatus(status);
    return this.membersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.membersService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('photo', { storage: memberPhotoStorage, fileFilter: imageFileFilter }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Record<string, string>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const dto: UpdateMemberDto = {
      firstName: body.firstName || undefined,
      middleName: body.middleName || undefined,
      lastName: body.lastName || undefined,
      gender: body.gender as any,
      birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
      phone: body.phone || undefined,
      alternativePhone: body.alternativePhone || undefined,
      email: body.email || undefined,
      city: body.city || undefined,
      subCity: body.subCity || undefined,
      woreda: body.woreda || undefined,
      houseNumber: body.houseNumber || undefined,
      joinedDate: body.joinedDate ? new Date(body.joinedDate) : undefined,
      salvationDate: body.salvationDate ? new Date(body.salvationDate) : undefined,
      baptismStatus: body.baptismStatus as any,
      status: body.status as any,
      inactiveReason: body.inactiveReason || undefined,
      maritalStatus: body.maritalStatus as any,
      previousChurch: body.previousChurch || undefined,
      notes: body.notes || undefined,
      photo: file ? `/uploads/members/${file.filename}` : undefined,
    };

    // Strip undefined so we don't overwrite existing values
    Object.keys(dto).forEach((k) => (dto as any)[k] === undefined && delete (dto as any)[k]);
    return this.membersService.update(id, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: MemberStatus; inactiveReason?: string },
  ) {
    return this.membersService.updateStatus(id, body.status, body.inactiveReason);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.membersService.remove(id);
  }
}
