# NCIC Hub - Church Management System

## Project Overview

A comprehensive church management system for New Creation International Church (NCIC) with approximately 3000 members organized into 15+ foundation classes.

## Technology Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Port**: 3000
- **Command**: `npm run start:dev` (watch mode)

### Frontend
- **Framework**: Next.js 15 with React 19
- **UI Library**: Ant Design 5
- **Port**: 3001
- **Command**: `npm run dev`

## Project Structure

```
NCIC-Hub/
├── backend/
│   ├── src/
│   │   ├── app.module.ts (main module)
│   │   ├── members/ (member management)
│   │   ├── foundation-classes/ (class management)
│   │   ├── foundation-class-members/ (member-class assignments)
│   │   ├── foundation-class-leaders/ (leader management)
│   │   ├── foundation-class-teachers/ (teacher management)
│   │   ├── departments/ (ministry management)
│   │   ├── attendance/ (attendance tracking)
│   │   ├── baptism/ (baptism management)
│   │   ├── family/ (family relationships)
│   │   ├── tithe/ (tithe management)
│   │   ├── dashboard/ (analytics)
│   │   ├── prisma/ (database service)
│   │   └── common/ (shared utilities)
│   ├── prisma/
│   │   ├── schema.prisma (database schema)
│   │   └── migrations/ (database migrations)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx (root layout)
    │   │   ├── page.tsx (main page with navigation)
    │   │   └── globals.css
    │   ├── components/
    │   │   ├── Dashboard.tsx
    │   │   ├── Members.tsx
    │   │   ├── FoundationClasses.tsx
    │   │   ├── Departments.tsx
    │   │   ├── Attendance.tsx
    │   │   ├── Baptism.tsx
    │   │   ├── Family.tsx
    │   │   └── Tithe.tsx
    │   └── lib/
    │       └── api.ts (API client)
    ├── .env.local (API URL configuration)
    ├── next.config.js
    ├── tsconfig.json
    └── package.json
```

## Core Features Implemented

### 1. Member Management
- Create, read, update, delete members
- Member fields: name, phone, email, age, gender, address, photo, status
- Member statuses: ACTIVE, INACTIVE, DECEASED, LEFT_CHURCH
- Photo upload (jpg, jpeg, png, webp)
- All fields required on creation

### 2. Foundation Classes
- Create and manage foundation classes
- Assign members to classes
- Assign leaders to classes (with isMainLeader flag)
- Assign teachers to classes
- Track class levels (1, 2, etc.)

### 3. Attendance Tracking
- Create attendance sessions per foundation class
- Get roster of all class members
- Mark members present/absent
- Bulk attendance recording
- Session summaries (present/absent counts)
- Weekly and monthly attendance analytics

### 4. Departments (Ministries)
- Create and manage departments
- Assign members to departments
- Assign department leaders
- Members can serve in multiple departments

### 5. Baptism Management
- Create baptism rounds
- Add members to rounds
- Track baptism status
- View baptized members by round
- Multiple baptism rounds support

### 6. Family Mapping
- Create family relationships (SPOUSE, PARENT, CHILD, SIBLING)
- View member's family tree
- Query married members, unmarried members
- Bidirectional relationships

### 7. Tithe Management
- Record named and anonymous tithes
- Link tithes to members or foundation classes
- Monthly and yearly analytics
- Top contributors tracking
- Date range filtering

### 8. Dashboard & Analytics
- Admin dashboard with overview statistics
- Foundation class leader dashboard
- Department leader dashboard
- Attendance analytics (weekly, by class)
- Tithe analytics (monthly, yearly, all-time)
- Member statistics (by status)

## Database Schema

Key models:
- **Member**: Core member information with status tracking
- **FoundationClass**: Class organization and levels
- **FoundationClassMember**: Member-class assignments
- **FoundationClassLeader**: Leader assignments with isMainLeader flag
- **FoundationClassTeacher**: Teacher assignments
- **Department**: Ministry/department definitions
- **DepartmentMember**: Member-department assignments
- **DepartmentLeader**: Department leader assignments
- **AttendanceSession**: Attendance session records
- **Attendance**: Individual attendance records
- **BaptismRound**: Baptism round definitions
- **BaptismMember**: Member baptism records
- **FamilyRelationship**: Family relationship tracking
- **Tithe**: Tithe contribution records

## API Endpoints

### Members
- `POST /members` - Create member (multipart/form-data with photo)
- `GET /members` - Get all members
- `GET /members/:id` - Get member by ID
- `PUT /members/:id` - Update member
- `DELETE /members/:id` - Delete member
- `PATCH /members/:id/status` - Update member status

### Foundation Classes
- `POST /foundation-classes` - Create class
- `GET /foundation-classes` - Get all classes
- `GET /foundation-classes/:id` - Get class by ID
- `PUT /foundation-classes/:id` - Update class
- `DELETE /foundation-classes/:id` - Delete class

### Foundation Class Members
- `POST /foundation-class-members/assign` - Assign member to class
- `GET /foundation-class-members/ListAll/:classId` - Get class members
- `GET /foundation-class-members/GetMember/:memberId` - Get member's class
- `DELETE /foundation-class-members/member/:memberId` - Remove member from class

### Foundation Class Leaders
- `POST /foundation-class-leaders/AssignLeader` - Assign leader
- `GET /foundation-class-leaders/class/:classId` - Get class leaders
- `GET /foundation-class-leaders/member/:memberId` - Get member's leadership positions
- `DELETE /foundation-class-leaders/:id` - Remove leader

### Attendance
- `POST /attendance/sessions` - Create session
- `GET /attendance/sessions/class/:classId` - Get sessions by class
- `GET /attendance/sessions/:id/roster` - Get session roster
- `POST /attendance/sessions/:id/bulk` - Record bulk attendance
- `GET /attendance/sessions/:id/summary` - Get session summary

### Departments
- `POST /departments` - Create department
- `GET /departments` - Get all departments
- `POST /departments/:id/members` - Assign member
- `GET /departments/:id/members` - Get department members
- `DELETE /departments/:id/members/:memberId` - Remove member
- `DELETE /departments/:id` - Delete department

### Baptism
- `POST /baptism/rounds` - Create round
- `GET /baptism/rounds` - Get all rounds
- `POST /baptism/rounds/:id/members` - Add member to round
- `GET /baptism/rounds/:id/members` - Get round members
- `DELETE /baptism/rounds/:id` - Delete round

### Family
- `POST /family/relationships` - Create relationship
- `GET /family/member/:memberId` - Get member's family
- `GET /family/member/:memberId/spouse` - Get spouse
- `GET /family/member/:memberId/children` - Get children
- `DELETE /family/relationships/:id` - Delete relationship

### Tithe
- `POST /tithe` - Record tithe
- `GET /tithe` - Get all tithes
- `GET /tithe/:id` - Get tithe by ID
- `GET /tithe/member/:memberId` - Get member's tithes
- `GET /tithe/analytics/monthly` - Get monthly stats
- `GET /tithe/analytics/yearly` - Get yearly stats
- `DELETE /tithe/:id` - Delete tithe

### Dashboard
- `GET /dashboard/admin` - Admin dashboard
- `GET /dashboard/foundation-class/:classId` - Class leader dashboard
- `GET /dashboard/attendance/weekly` - Weekly attendance
- `GET /dashboard/tithe/monthly` - Monthly tithe

## Frontend Features

### Navigation
- Sidebar menu with collapsible navigation
- Quick access to all modules
- User profile and logout button

### Pages
1. **Dashboard** - Overview statistics and analytics
2. **Members** - CRUD operations with photo upload
3. **Foundation Classes** - Class management
4. **Departments** - Ministry management
5. **Attendance** - Session creation and roster marking
6. **Baptism** - Round management
7. **Family** - Relationship mapping
8. **Tithe** - Recording and analytics

## Running the Application

### Backend
```bash
cd backend
npm install
npm run start:dev
```
Backend runs on `http://localhost:3000`

### Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Frontend runs on `http://localhost:3001`

## Environment Configuration

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/ncic_hub
```

## Key Implementation Details

1. **Photo Upload**: Members require photo upload (jpg, jpeg, png, webp). Photos stored in `uploads/members/` and served as static files.

2. **Attendance Roster**: The `/attendance/sessions/:id/roster` endpoint returns all class members with their attendance status (present/absent/null), enabling checkbox UI on frontend.

3. **Bulk Operations**: Attendance and other operations support bulk recording for efficiency.

4. **Relationships**: Family relationships are bidirectional and support multiple relationship types.

5. **Analytics**: Dashboard provides comprehensive statistics for different user roles.

6. **Status Tracking**: Members have status tracking with inactive reasons.

## Next Steps (Future Enhancements)

1. Authentication and authorization (role-based access control)
2. User management with different roles
3. Email notifications
4. SMS notifications
5. Report generation (PDF exports)
6. Advanced filtering and search
7. Member profile pages
8. Class schedule management
9. Event management
10. Financial reporting

## Testing

See `TESTING_GUIDE.md` for comprehensive API testing instructions with Postman examples.
