# NCIC Hub - Quick Reference Guide

## Running the Application

### Start Backend
```bash
cd backend
npm run start:dev
```
Backend runs on: `http://localhost:3000`

### Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:3001`

## New Features Overview

### 1. Foundation Classes
- **List Page**: `/` → Click "Foundation Classes"
- **Details Page**: Click any row in the table
- **Features**:
  - View all members in the class
  - Add/remove members
  - View all leaders
  - Add/remove leaders
  - Mark a leader as main leader
  - View this week's attendance (coming soon)

### 2. Departments
- **List Page**: `/` → Click "Departments"
- **Details Page**: Click any row in the table
- **Features**:
  - View all members in the department
  - Add/remove members
  - View all leaders
  - Add/remove leaders

### 3. Members
- **List Page**: `/` → Click "Members"
- **Detail View**: Click any row in the table
- **Features**:
  - View member details in a side drawer
  - See member photo
  - View all personal information
  - Add new members with photo upload

### 4. Baptism
- **List Page**: `/` → Click "Baptism"
- **Features**:
  - Create baptism rounds
  - Add members to rounds
  - View members in each round
  - Remove members from rounds
  - Delete rounds

### 5. Attendance
- **List Page**: `/` → Click "Attendance"
- **Features**:
  - Select a foundation class
  - View all sessions for that class
  - Create new sessions
  - Mark attendance with checkboxes
  - Bulk submit attendance

### 6. Tithe
- **List Page**: `/` → Click "Tithe"
- **Features**:
  - Record tithe entries
  - Named or anonymous tithes
  - Link to foundation class (optional)
  - View all tithes
  - Delete tithes

### 7. Family
- **List Page**: `/` → Click "Family"
- **Features**:
  - Select a member
  - View their family relationships
  - Add new relationships
  - Delete relationships
  - Relationship types: SPOUSE, PARENT, CHILD, SIBLING

### 8. Dashboard
- **List Page**: `/` → Click "Dashboard"
- **Features**:
  - Overview statistics
  - Total members, leaders, classes
  - Active/inactive member counts
  - Total tithe

## UI Improvements

### Popconfirm (Delete Confirmation)
- Now appears centered on screen
- Larger size for better visibility
- Improved spacing and typography

### Table Rows
- Hover effect shows cursor pointer
- Clickable rows navigate to detail pages
- Action buttons don't trigger row click

### Modals
- Centered on screen
- Proper sizing and spacing
- Loading states on buttons during submission

### Sidebar
- Gradient background (purple)
- Smooth hover effects
- Clear menu items

## API Endpoints Quick Reference

### Members
- `GET /members` - Get all members
- `POST /members` - Create member (multipart/form-data with photo)
- `GET /members/:id` - Get member by ID
- `PUT /members/:id` - Update member
- `DELETE /members/:id` - Delete member

### Foundation Classes
- `GET /foundation-classes` - Get all classes
- `POST /foundation-classes` - Create class
- `GET /foundation-classes/:id` - Get class by ID
- `PUT /foundation-classes/:id` - Update class
- `DELETE /foundation-classes/:id` - Delete class

### Foundation Class Members
- `POST /foundation-class-members/assign` - Assign member to class
- `GET /foundation-class-members/ListAll/:classId` - Get class members
- `DELETE /foundation-class-members/DeleteMember/:memberId` - Remove member

### Foundation Class Leaders
- `POST /foundation-class-leaders/AssignLeader` - Assign leader
- `GET /foundation-class-leaders/GetLeader/:classId` - Get class leaders
- `DELETE /foundation-class-leaders/:id` - Remove leader

### Departments
- `GET /departments` - Get all departments
- `POST /departments` - Create department
- `GET /departments/:id` - Get department by ID
- `PUT /departments/:id` - Update department
- `DELETE /departments/:id` - Delete department
- `POST /departments/:id/members` - Add member
- `GET /departments/:id/members` - Get members
- `DELETE /departments/:id/members/:memberId` - Remove member
- `POST /departments/:id/leaders` - Add leader
- `GET /departments/:id/leaders` - Get leaders
- `DELETE /departments/:id/leaders/:memberId` - Remove leader

### Attendance
- `POST /attendance/sessions` - Create session
- `GET /attendance/sessions/class/:classId` - Get sessions by class
- `GET /attendance/sessions/:id/roster` - Get session roster
- `POST /attendance/sessions/:id/bulk` - Record bulk attendance
- `GET /attendance/sessions/:id/summary` - Get session summary

### Baptism
- `POST /baptism/rounds` - Create round
- `GET /baptism/rounds` - Get all rounds
- `POST /baptism/rounds/:id/members` - Add member to round
- `GET /baptism/rounds/:id/members` - Get round members
- `DELETE /baptism/rounds/:id/members/:memberId` - Remove member
- `DELETE /baptism/rounds/:id` - Delete round

### Family
- `POST /family/relationships` - Create relationship
- `GET /family/member/:memberId` - Get member's family
- `DELETE /family/relationships/:id` - Delete relationship

### Tithe
- `POST /tithe` - Record tithe
- `GET /tithe` - Get all tithes
- `GET /tithe/:id` - Get tithe by ID
- `DELETE /tithe/:id` - Delete tithe

### Dashboard
- `GET /dashboard/admin` - Get admin dashboard
- `GET /dashboard/foundation-class/:classId` - Get class dashboard
- `GET /dashboard/attendance/weekly` - Get weekly attendance

## Keyboard Shortcuts

- `Esc` - Close modals and drawers
- `Tab` - Navigate form fields
- `Enter` - Submit forms

## Common Tasks

### Add a Member to a Foundation Class
1. Go to Foundation Classes
2. Click on the class
3. Click "Add Member" in the Members tab
4. Select member from dropdown
5. Click OK

### Assign a Leader to a Foundation Class
1. Go to Foundation Classes
2. Click on the class
3. Click "Add Leader" in the Leaders tab
4. Select member from dropdown
5. Choose if they are main leader
6. Click OK

### Record Attendance
1. Go to Attendance
2. Select a foundation class
3. Click "Create New Session" or select existing session
4. Click "Mark Attendance"
5. Check boxes for present members
6. Click OK

### Create a Baptism Round and Add Members
1. Go to Baptism
2. Click "Create Baptism Round"
3. Enter round name and date
4. Click OK
5. Click "Add Member" on the round
6. Select member
7. Click OK

## Troubleshooting

### Page Not Loading
- Check if backend is running: `http://localhost:3000`
- Check if frontend is running: `http://localhost:3001`
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh page (F5)

### API Errors
- Check backend logs for error messages
- Verify all required fields are filled
- Check network tab in browser DevTools

### Photo Not Uploading
- Ensure file is jpg, jpeg, png, or webp
- Check file size is reasonable
- Verify uploads/members directory exists

## Support

For detailed API documentation, see: `TESTING_GUIDE.md`
For project overview, see: `PROJECT_SUMMARY.md`
For all improvements, see: `IMPROVEMENTS_COMPLETED.md`
