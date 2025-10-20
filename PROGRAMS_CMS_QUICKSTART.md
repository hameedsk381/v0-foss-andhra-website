# Programs CMS Quick Start Guide

## 🚀 Getting Started

### 1. Database is Already Set Up
The migration has been run and programs have been seeded. You can start using the CMS immediately!

### 2. Access the Programs CMS

1. **Login to Admin**
   ```
   URL: http://localhost:3000/admin/login
   ```

2. **Navigate to Programs**
   - Click "Programs" in the left sidebar (folder tree icon)
   - You'll see all 7 programs:
     - FOSStar (Blue)
     - FOSServe (Purple)
     - FOSSynC (Green)
     - FOSStorm (Orange)
     - FOSSart (Red)
     - FOSSterage (Cyan)
     - FOSSpeaks (Pink)

## 📋 What You Can Do Now

### Managing Programs

#### View All Programs
- See program cards with their colors, descriptions, and statistics
- Each card shows counts for initiatives, team members, and program-specific items

#### Edit a Program
1. Click the edit (pencil) icon on any program card
2. Modify:
   - Title
   - Tagline
   - Description
   - Mission statement
   - Brand color
   - Logo URL
   - Display order
   - Status (active/inactive)
3. Click "Update Program"

### Managing Initiatives

#### Add an Initiative
1. Click "Manage Initiatives" on any program
2. Click "Add Initiative" button
3. Fill in the form:
   ```
   Title: Community Benefits
   Description: Access to exclusive community resources
   Content: [Use the rich text editor for formatted content]
   Icon: Users (Lucide icon name)
   Category: benefits
   Order: 0
   Active: ✓
   ```
4. Click "Create Initiative"

#### Edit Initiative
1. Click the edit (pencil) icon on any initiative
2. Modify the content
3. Click "Update Initiative"

#### Reorder Initiatives
- Use the ⬆️ and ⬇️ buttons to move initiatives up or down
- Changes are saved automatically

#### Delete Initiative
1. Click the trash icon
2. Confirm deletion in the dialog

## 🎨 Rich Text Editor Features

The TipTap editor supports:
- **Bold**, *Italic*, <u>Underline</u>
- Headings (H1, H2, H3)
- Bullet and numbered lists
- Links
- Images
- Text alignment
- Text colors
- Highlighting
- Code blocks

## 📊 Program-Specific Features

### FOSServe
- Can manage "Case Studies" (coming in next phase)
- Track implementation success stories

### FOSSynC
- Can manage "Clubs" (coming in next phase)
- Track student-led campus clubs

### FOSStorm
- Can manage "Projects" (coming in next phase)
- Link to GitHub repositories

### FOSSart
- Can manage "Startups" (coming in next phase)
- Track funded companies

### FOSSterage
- Can manage "Repositories" (coming in next phase)
- Manage knowledge databases

### FOSSpeaks
- Standard initiatives only
- Focus on advocacy content

## 💡 Best Practices

### 1. Organize Initiatives by Category
Use categories to group related initiatives:
- `benefits` - Member benefits, perks
- `activities` - Events, workshops, meetups
- `membership` - Membership tiers, pricing
- `training` - Educational programs
- `resources` - Tools and resources

### 2. Use Meaningful Icons
Common Lucide icons for programs:
- `Users` - Community, members
- `Calendar` - Events, activities
- `Star` - Featured, highlights
- `Heart` - Support, community
- `CheckCircle` - Benefits, completed
- `Briefcase` - Projects, work
- `Database` - Data, repositories
- `Megaphone` - Advocacy, announcements

### 3. Set Logical Display Orders
- Most important initiatives first (order: 0, 1, 2...)
- Group related initiatives together
- Use the reorder buttons to adjust

### 4. Write Clear Descriptions
- Keep descriptions concise (1-2 sentences)
- Use content field for detailed information
- Include call-to-actions where relevant

## 🔍 Current Limitations

### Not Yet Implemented
- ❌ Team member management
- ❌ Case studies (FOSServe)
- ❌ Club management (FOSSynC)
- ❌ Project management (FOSStorm)
- ❌ Startup management (FOSSart)
- ❌ Repository management (FOSSterage)
- ❌ Image upload (use URLs for now)
- ❌ Bulk operations

### Workarounds
- **Images**: Upload to `/public/logos/` or `/public/gallery/` and use the path
- **Team**: Coming in next update
- **Program-specific**: Coming soon

## 🛠️ Troubleshooting

### Can't See Programs?
- Refresh the page
- Check browser console for errors
- Verify you're logged in

### Rich Text Editor Not Loading?
- Clear browser cache
- Check network tab for failed requests
- Ensure all dependencies are installed

### Changes Not Saving?
- Check for validation errors
- Verify all required fields are filled
- Check network tab for failed API calls

## 📝 Example Use Case

### Setting Up FOSStar Membership Benefits

1. Go to Programs → FOSStar → Manage Initiatives
2. Create these initiatives:

**Initiative 1:**
```
Title: For Students
Description: Benefits for student members
Category: benefits
Icon: GraduationCap
Content: [Add bullet points about student benefits]
Order: 0
```

**Initiative 2:**
```
Title: For Professionals
Description: Benefits for professional members
Category: benefits
Icon: Briefcase
Content: [Add bullet points about professional benefits]
Order: 1
```

**Initiative 3:**
```
Title: Workshops & Training
Description: Regular workshops on open source technologies
Category: activities
Icon: Calendar
Content: [Add details about workshops]
Order: 2
```

3. Reorder if needed
4. Preview on the frontend (when integrated)

## 🎯 Next Steps

### What's Coming Next
1. **Team Management** - Add/edit team members
2. **Program-Specific Pages** - Clubs, Projects, Startups, etc.
3. **Image Upload** - Direct upload instead of URLs
4. **Frontend Integration** - Display CMS data on public pages
5. **Search & Filter** - Find initiatives quickly

### How You Can Help
- Test the current features
- Report any bugs or issues
- Suggest improvements
- Provide content for programs

## 🆘 Need Help?

If you encounter issues:
1. Check the console for errors
2. Review the API responses in Network tab
3. Check `PROGRAMS_CMS_GUIDE.md` for detailed docs
4. Look at database in Prisma Studio: `bunx prisma studio`

## 🎉 You're All Set!

The Programs CMS is ready to use. Start by:
1. Adding initiatives to each program
2. Organizing them by category
3. Using the rich text editor for formatted content
4. Reordering to prioritize important information

Happy managing! 🚀
