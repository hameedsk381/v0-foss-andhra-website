# Dynamic Programs CMS - Test Checklist

## Test Results

### 1. FOSStar (fosstar)
#### Content Types: Initiatives, Team

**Initiatives:**
- [ ] List view shows all initiatives
- [ ] Can create new initiative
- [ ] Can edit existing initiative
- [ ] Can delete initiative
- [ ] Drag-and-drop reordering works
- [ ] Order persists after reload

**Team:**
- [ ] List view shows all team members
- [ ] Can create new team member
- [ ] Can edit existing team member
- [ ] Can delete team member
- [ ] Drag-and-drop reordering works
- [ ] Order persists after reload

---

### 2. FOSServe (fosserve)
#### Content Types: Services, Case Studies, Team

**Services:**
- [ ] List view shows all services
- [ ] Can create new service
- [ ] Can edit existing service
- [ ] Can delete service
- [ ] Drag-and-drop reordering works

**Case Studies:**
- [ ] List view shows all case studies
- [ ] Can create new case study
- [ ] Can edit existing case study
- [ ] Can delete case study
- [ ] Drag-and-drop reordering works

**Team:**
- [ ] Same as FOSStar team tests

---

### 3. FOSSynC (fossync)
#### Content Types: Clubs, Coordinators

**Clubs:**
- [ ] List view shows all clubs
- [ ] Can create new club
- [ ] Can edit existing club
- [ ] Can delete club
- [ ] Drag-and-drop reordering works
- [ ] Order persists after reload

**Coordinators:**
- [ ] List view shows all coordinators
- [ ] Can create new coordinator
- [ ] Can edit existing coordinator
- [ ] Can delete coordinator
- [ ] Drag-and-drop reordering works

---

### 4. FOSStorm (fosstorm)
#### Content Types: Projects, Maintainers

**Projects:**
- [ ] List view shows all projects
- [ ] Can create new project
- [ ] Can edit existing project
- [ ] Can delete project
- [ ] Drag-and-drop reordering works

**Maintainers:**
- [ ] List view shows all maintainers
- [ ] Can create new maintainer
- [ ] Can edit existing maintainer
- [ ] Can delete maintainer
- [ ] Drag-and-drop reordering works

---

### 5. FOSSart (fossart)
#### Content Types: Startups, Mentors

**Startups:**
- [ ] List view shows all startups
- [ ] Can create new startup
- [ ] Can edit existing startup
- [ ] Can delete startup
- [ ] Drag-and-drop reordering works
- [ ] Order persists after reload

**Mentors:**
- [ ] List view shows all mentors
- [ ] Can create new mentor
- [ ] Can edit existing mentor
- [ ] Can delete mentor
- [ ] Drag-and-drop reordering works

---

### 6. FOSSterage (fossterage)
#### Content Types: Repositories, Curators

**Repositories:**
- [ ] List view shows all repositories
- [ ] Can create new repository
- [ ] Can edit existing repository
- [ ] Can delete repository
- [ ] Drag-and-drop reordering works

**Curators:**
- [ ] List view shows all curators
- [ ] Can create new curator
- [ ] Can edit existing curator
- [ ] Can delete curator
- [ ] Drag-and-drop reordering works

---

### 7. FOSSpeaks (fosspeaks)
#### Content Types: Events, Speakers

**Events:**
- [ ] List view shows all events
- [ ] Can create new event
- [ ] Can edit existing event
- [ ] Can delete event
- [ ] Drag-and-drop reordering works

**Speakers:**
- [ ] List view shows all speakers
- [ ] Can create new speaker
- [ ] Can edit existing speaker
- [ ] Can delete speaker
- [ ] Drag-and-drop reordering works

---

## Field Type Tests

### All Content Types Should Support:
- [ ] Text fields work correctly
- [ ] Textarea fields work correctly
- [ ] Rich text editor works (if applicable)
- [ ] Number fields validate properly
- [ ] URL fields work correctly
- [ ] Image upload works (file selection)
- [ ] Image upload works (URL paste)
- [ ] Date picker works correctly
- [ ] Select dropdowns work correctly
- [ ] JSON fields work correctly

---

## Image Upload Tests
- [ ] Can upload image via file selection
- [ ] Can add image via URL paste
- [ ] Image preview shows correctly
- [ ] Can remove uploaded image
- [ ] File size validation works (max 5MB)
- [ ] File type validation works (jpg, png, webp, gif)
- [ ] Image optimization works (file size reduced)
- [ ] Uploaded images saved to /public/uploads/

---

## General UI/UX Tests
- [ ] All forms have proper validation
- [ ] Error messages display correctly
- [ ] Success messages display after operations
- [ ] Loading states show during API calls
- [ ] Responsive design works on mobile
- [ ] Navigation between programs works
- [ ] Navigation between content types works

---

## Status: IN PROGRESS

### Server Running:
- URL: http://localhost:3001
- Admin Panel: http://localhost:3001/admin/programs

### Test Data Seeded:
✅ FOSStar: 2 initiatives, 1 team member
✅ FOSServe: 1 case study
✅ FOSSynC: 2 clubs
✅ FOSStorm: 1 project
✅ FOSSart: 1 startup
✅ FOSSterage: 1 repository
✅ FOSSpeaks: 1 speaker
