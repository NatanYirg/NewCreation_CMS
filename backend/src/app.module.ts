import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MembersModule } from './members/members.module';
import { PrismaModule } from './prisma/prisma.module';
import { FoundationClassesModule } from './foundation-classes/foundation-classes.module';
import { FoundationClassMembersModule } from './foundation-class-members/foundation-class-members.module';
import { FoundationClassTeachersModule } from './foundation-class-teachers/foundation-class-teachers.module';
import { FoundationClassLeadersModule } from './foundation-class-leaders/foundation-class-leaders.module';
import { DepartmentsModule } from './departments/departments.module';
import { AttendanceModule } from './attendance/attendance.module';
import { BaptismModule } from './baptism/baptism.module';
import { FamilyModule } from './family/family.module';
import { TitheModule } from './tithe/tithe.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    MembersModule,
    PrismaModule,
    FoundationClassesModule,
    FoundationClassMembersModule,
    FoundationClassTeachersModule,
    FoundationClassLeadersModule,
    DepartmentsModule,
    AttendanceModule,
    BaptismModule,
    FamilyModule,
    TitheModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
