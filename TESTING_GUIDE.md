# NCIC Hub - Testing Guide

## System Status

- **Backend**: Running on `http://localhost:3000` (npm run start:dev)
- **Frontend**: Running on `http://localhost:3001` (npm run dev)

## Frontend Access

Open your browser and navigate to: `http://localhost:3001`

The frontend includes:
- Dashboard (admin overview)
- Members (CRUD with photo upload)
- Foundation Classes (CRUD)
- Departments (CRUD)
- Attendance (session management + roster marking)
- Baptism (round management)
- Family (relationship mapping)
- Tithe (record and analytics)

## Backend API Testing with Postman

### 1. Members API

#### Create Member (with photo)
```
POST http://localhost:3000/members
Content-Type: multipart/form-data

Body (form-data):
- firstName: John
- lastName: Doe
- phone: 0712345678
- email: john@example.com
- age: 30
- gender: MALE
- address: Nairobi
- status: ACTIVE
- photo: [select image file - jpg, jpeg, png, webp]
```

#### Get All Members
```
GET http://localhost:3000/members
```

#### Get Member by ID
```
GET http://localhost:3000/members/1
```

#### Update Member Status
```
PATCH http://localhost:3000/members/1/status
Content-Type: application/json

Body:
{
  "status": "INACTIVE",
  "inactiveReason": "Relocated"
}
```

#### Delete Member
```
DELETE http://localhost:3000/members/1
```

---

### 2. Foundation Classes API

#### Create Foundation Class
```
POST http://localhost:3000/foundation-classes
Content-Type: application/json

Body:
{
  "name": "Foundation Class 1",
  "level": 1
}
```

#### Get All Foundation Classes
```
GET http://localhost:3000/foundation-classes
```

#### Get Foundation Class by ID
```
GET http://localhost:3000/foundation-classes/1
```

#### Update Foundation Class
```
PUT http://localhost:3000/foundation-classes/1
Content-Type: application/json

Body:
{
  "name": "Foundation Class 1 Updated",
  "level": 2
}
```

#### Delete Foundation Class
```
DELETE http://localhost:3000/foundation-classes/1
```

---

### 3. Foundation Class Members API

#### Assign Member to Foundation Class
```
POST http://localhost:3000/foundation-class-members/assign
Content-Type: application/json

Body:
{
  "memberId": 1,
  "foundationClassId": 1
}
```

#### Get All Members in a Foundation Class
```
GET http://localhost:3000/foundation-class-members/ListAll/1
```

#### Get Member's Foundation Class
```
GET http://localhost:3000/foundation-class-members/GetMember/1
```

#### Remove Member from Foundation Class
```
DELETE http://localhost:3000/foundation-class-members/member/1
```

---

### 4. Foundation Class Leaders API

#### Assign Leader to Foundation Class
```
POST http://localhost:3000/foundation-class-leaders/AssignLeader
Content-Type: application/json

Body:
{
  "memberId": 1,
  "foundationClassId": 1,
  "isMainLeader": true
}
```

#### Get All Leaders in a Foundation Class
```
GET http://localhost:3000/foundation-class-leaders/class/1
```

#### Get Member's Leadership Positions
```
GET http://localhost:3000/foundation-class-leaders/member/1
```

#### Remove Leader from Foundation Class
```
DELETE http://localhost:3000/foundation-class-leaders/1
```

---

### 5. Attendance API

#### Create Attendance Session
```
POST http://localhost:3000/attendance/sessions
Content-Type: application/json

Body:
{
  "foundationClassId": 1,
  "sessionDate": "2026-03-15",
  "notes": "Sunday service"
}
```

#### Get Sessions by Foundation Class
```
GET http://localhost:3000/attendance/sessions/class/1
```

#### Get Session Roster (all members with attendance status)
```
GET http://localhost:3000/attendance/sessions/1/roster
```

#### Record Bulk Attendance
```
POST http://localhost:3000/attendance/sessions/1/bulk
Content-Type: application/json

Body:
{
  "records": [
    { "memberId": 1, "present": true },
    { "memberId": 2, "present": false },
    { "memberId": 3, "present": true }
  ]
}
```

#### Get Session Summary
```
GET http://localhost:3000/attendance/sessions/1/summary
```

---

### 6. Departments API

#### Create Department
```
POST http://localhost:3000/departments
Content-Type: application/json

Body:
{
  "name": "Children Ministry",
  "description": "Ministry for children"
}
```

#### Get All Departments
```
GET http://localhost:3000/departments
```

#### Assign Member to Department
```
POST http://localhost:3000/departments/1/members
Content-Type: application/json

Body:
{
  "memberId": 1
}
```

#### Get Department Members
```
GET http://localhost:3000/departments/1/members
```

#### Remove Member from Department
```
DELETE http://localhost:3000/departments/1/members/1
```

#### Delete Department
```
DELETE http://localhost:3000/departments/1
```

---

### 7. Baptism API

#### Create Baptism Round
```
POST http://localhost:3000/baptism/rounds
Content-Type: application/json

Body:
{
  "name": "First Baptism Round",
  "date": "2026-03-20",
  "notes": "Easter baptism"
}
```

#### Get All Baptism Rounds
```
GET http://localhost:3000/baptism/rounds
```

#### Add Member to Baptism Round
```
POST http://localhost:3000/baptism/rounds/1/members
Content-Type: application/json

Body:
{
  "memberId": 1
}
```

#### Get Members in Baptism Round
```
GET http://localhost:3000/baptism/rounds/1/members
```

#### Delete Baptism Round
```
DELETE http://localhost:3000/baptism/rounds/1
```

---

### 8. Family API

#### Create Family Relationship
```
POST http://localhost:3000/family/relationships
Content-Type: application/json

Body:
{
  "memberId1": 1,
  "memberId2": 2,
  "relationType": "SPOUSE"
}
```

#### Get Member's Family
```
GET http://localhost:3000/family/member/1
```

#### Get Member's Spouse
```
GET http://localhost:3000/family/member/1/spouse
```

#### Get Member's Children
```
GET http://localhost:3000/family/member/1/children
```

#### Delete Relationship
```
DELETE http://localhost:3000/family/relationships/1
```

---

### 9. Tithe API

#### Record Tithe
```
POST http://localhost:3000/tithe
Content-Type: application/json

Body:
{
  "amount": 5000,
  "type": "NAMED",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0712345678",
  "memberId": 1,
  "foundationClassId": 1,
  "date": "2026-03-15",
  "notes": "Sunday offering"
}
```

#### Get All Tithes
```
GET http://localhost:3000/tithe
```

#### Get Tithe by ID
```
GET http://localhost:3000/tithe/1
```

#### Get Member's Tithes
```
GET http://localhost:3000/tithe/member/1
```

#### Get Monthly Tithe Stats
```
GET http://localhost:3000/tithe/analytics/monthly?year=2026&month=3
```

#### Get Yearly Tithe Stats
```
GET http://localhost:3000/tithe/analytics/yearly?year=2026
```

#### Delete Tithe
```
DELETE http://localhost:3000/tithe/1
```

---

### 10. Dashboard API

#### Get Admin Dashboard
```
GET http://localhost:3000/dashboard/admin
```

#### Get Foundation Class Leader Dashboard
```
GET http://localhost:3000/dashboard/foundation-class/1
```

#### Get Weekly Attendance Summary
```
GET http://localhost:3000/dashboard/attendance/weekly
```

#### Get Monthly Tithe Summary
```
GET http://localhost:3000/dashboard/tithe/monthly
```

---

## Testing Workflow

### Step 1: Create Members
1. Create at least 3 members using the Members API with photo uploads
2. Verify members appear in the frontend Members page

### Step 2: Create Foundation Classes
1. Create 2-3 foundation classes
2. Verify they appear in the frontend

### Step 3: Assign Members to Classes
1. Assign the created members to foundation classes
2. Verify in the frontend

### Step 4: Create Attendance Session
1. Create an attendance session for a foundation class
2. Get the roster to verify all members are listed
3. Record bulk attendance for the session

### Step 5: Test Other Features
1. Create departments and assign members
2. Create baptism rounds and add members
3. Create family relationships between members
4. Record tithes for members

### Step 6: Check Dashboard
1. Access the admin dashboard to see overall statistics
2. Verify attendance and tithe analytics

---

## Notes

- All photo uploads must be jpg, jpeg, png, or webp format
- All member fields are required on creation (including photo)
- Foundation class leaders must have `isMainLeader` boolean set
- Attendance is recorded per session per foundation class
- Tithe can be linked to a member or left anonymous
- Family relationships are bidirectional (SPOUSE, PARENT, CHILD, SIBLING)
