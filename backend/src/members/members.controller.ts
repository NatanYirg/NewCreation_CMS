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
    const required = ['firstName', 'lastName', 'phone', 'email', 'age', 'gender', 'address', 'status'];
    for (const field of required) {
      if (!body[field]) throw new BadRequestException(`${field} is required`);
    }
    if (!file) throw new BadRequestException('photo is required');

    const dto: CreateMemberDto = {
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      email: body.email,
      age: Number(body.age),
      gender: body.gender as any,
      address: body.address,
      status: body.status as any,
      photo: `/uploads/members/${file.filename}`,
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
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      email: body.email,
      age: body.age ? Number(body.age) : undefined,
      gender: body.gender as any,
      address: body.address,
      status: body.status as any,
      photo: file ? `/uploads/members/${file.filename}` : undefined,
    };
    // Remove undefined keys so we don't overwrite existing values
    Object.keys(dto).forEach((k) => dto[k] === undefined && delete dto[k]);
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
