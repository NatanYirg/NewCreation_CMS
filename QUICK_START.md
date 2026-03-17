# NCIC Hub - Quick Start Guide

## Prerequisites
- Node.js (v18+)
- npm or yarn
- PostgreSQL database running

## Installation & Setup

### 1. Backend Setup
```bash
cd backend
npm install
npm run start:dev
```
Backend will start on `http://localhost:3000`

### 2. Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Frontend will start on `http://localhost:3001`

## Accessing the Application

Open your browser and go to: **http://localhost:3001**

## First Steps

### 1. Create a Member
1. Click "Members" in the sidebar
2. Click "Add Member" button
3. Fill in all required fields:
   - First Name
   - Last Name
   - Phone
   - Email
   - Age
   - Gender
   - Address
   - Photo (jpg, jpeg, png, webp)
4. Click OK to create

### 2. Create a Foundation Class
1. Click "Foundation Classes" in the sidebar
2. Click "Add Foundation Class" button
3. Enter class name and level
4. Click OK to create

### 3. Assign Member to Class
1. Go to Foundation Classes
2. Select a class
3. Assign members to the class

### 4. Create Attendance Session
1. Click "Attendance" in the sidebar
2. Select a foundation class
3. Click "Create New Session"
4. Enter session date and notes
5. Click OK

### 5. Mark Attendance
1. In Attendance page, select a session
2. Click "Mark Attendance"
3. Check boxes for members present
4. Click OK to save

### 6. Record Tithe
1. Click "Tithe" in the sidebar
2. Click "Record Tithe"
3. Fill in tithe details:
   - Type (Named/Anonymous)
   - Name, Email, Phone
   - Amount
   - Foundation Class (optional)
   - Date
4. Click OK to record

## API Testing with Postman

See `TESTING_GUIDE.md` for complete API documentation and Postman examples.

## Key Features

✅ Member Management with photo upload
✅ Foundation Class organization
✅ Attendance tracking with bulk operations
✅ Department/Ministry management
✅ Baptism round tracking
✅ Family relationship mapping
✅ Tithe recording and analytics
✅ Admin dashboard with statistics

## Troubleshooting

### Frontend won't connect to backend
- Ensure backend is running on port 3000
- Check `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:3000`
- Clear browser cache and refresh

### Photo upload fails
- Ensure file is jpg, jpeg, png, or webp
- Check file size is reasonable
- Verify `uploads/members/` directory exists in backend

### Database connection error
- Verify PostgreSQL is running
- Check `DATABASE_URL` in backend `.env`
- Run migrations: `npx prisma migrate deploy`

## Project Structure

```
NCIC-Hub/
├── backend/          # NestJS API
├── frontend/         # Next.js + React frontend
├── TESTING_GUIDE.md  # API testing documentation
├── PROJECT_SUMMARY.md # Detailed project overview
└── QUICK_START.md    # This file
```

## Next Steps

1. Test all features using the frontend UI
2. Use Postman to test API endpoints (see TESTING_GUIDE.md)
3. Create sample data for testing
4. Review dashboard analytics
5. Plan additional features or customizations

## Support

For detailed API documentation, see `TESTING_GUIDE.md`
For project overview, see `PROJECT_SUMMARY.md`
