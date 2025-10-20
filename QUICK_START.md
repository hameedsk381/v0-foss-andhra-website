# Quick Start Guide - Dynamic Programs CMS

## 🚀 For Content Managers

### Accessing the CMS
1. Login to admin panel at `/admin/login`
2. Navigate to **Programs** in the sidebar
3. Select your program (FOSStar, FOSServe, etc.)
4. Choose a content type to manage

### Creating Content
1. Click **"Add [Type]"** button
2. Fill in the form fields
3. Required fields are marked with *
4. Click **"Create"** to save

### Editing Content
1. Find the item in the table
2. Click the **edit icon** (pencil)
3. Update the fields
4. Click **"Update"** to save

### Deleting Content
1. Click the **delete icon** (trash) on any item
2. Confirm the deletion

## 💻 For Developers

### Adding a New Content Type to Existing Program

**Edit `lib/program-config.ts`:**

```typescript
// Find your program and add to contentTypes array
contentTypes: [
  // ... existing types
  {
    id: 'newtype',
    name: 'newtype',
    singularName: 'New Type',
    pluralName: 'New Types',
    icon: 'Star',
    description: 'Description here',
    fields: [
      { 
        name: 'title', 
        label: 'Title', 
        type: 'text', 
        required: true 
      },
      { 
        name: 'description', 
        label: 'Description', 
        type: 'textarea' 
      }
    ],
    defaultOrder: ['title']
  }
]
```

**Update Prisma Schema:**

```prisma
model Program {
  // ... existing
  newTypes ProgramNewType[]
}

model ProgramNewType {
  id          String   @id @default(cuid())
  programId   String
  title       String
  description String?
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  program     Program  @relation(fields: [programId], references: [id], onDelete: Cascade)
}
```

**Add Model Mapping in API Route:**

Edit `app/api/admin/programs/[programId]/[contentType]/route.ts` and `[id]/route.ts`:

```typescript
const contentTypeModelMap: Record<string, string> = {
  // ... existing
  newtype: "programNewType",
}
```

**Run Migration:**

```bash
bunx prisma migrate dev --name add_program_newtype
```

✅ Done! Access at `/admin/programs/{programId}/newtype`

### Field Type Reference

```typescript
// Text input
{ name: 'title', label: 'Title', type: 'text', required: true }

// Multi-line text
{ name: 'bio', label: 'Biography', type: 'textarea' }

// Rich text editor
{ name: 'content', label: 'Content', type: 'richtext' }

// Number
{ name: 'count', label: 'Count', type: 'number' }

// URL with validation
{ name: 'website', label: 'Website', type: 'url' }

// Image URL with preview
{ name: 'logo', label: 'Logo', type: 'image' }

// Date picker
{ name: 'startDate', label: 'Start Date', type: 'date' }

// Dropdown
{ 
  name: 'status', 
  label: 'Status', 
  type: 'select',
  options: ['active', 'inactive', 'pending']
}

// JSON editor
{ 
  name: 'tags', 
  label: 'Tags', 
  type: 'json',
  placeholder: '["tag1", "tag2"]'
}
```

## 📊 Current Programs

| Program | URL | Color |
|---------|-----|-------|
| FOSStar | `/admin/programs/fosstar` | Blue #015ba7 |
| FOSServe | `/admin/programs/fosserve` | Green #10b981 |
| FOSSynC | `/admin/programs/fossync` | Orange #f59e0b |
| FOSStorm | `/admin/programs/fosstorm` | Purple #8b5cf6 |
| FOSSart | `/admin/programs/fossart` | Pink #ec4899 |
| FOSSterage | `/admin/programs/fossterage` | Cyan #06b6d4 |
| FOSSpeaks | `/admin/programs/fosspeaks` | Orange #f97316 |

## 🔧 Troubleshooting

### "Invalid content type" error
- Check content type ID matches configuration
- Verify model mapping in API routes

### Form not submitting
- Check required fields are filled
- Validate JSON fields are proper JSON syntax
- Check URL fields have valid URLs

### Item not appearing after creation
- Refresh the page
- Check database with `bunx prisma studio`

### TypeScript errors in IDE
- These are often stale cache issues
- Dependencies are installed correctly
- Restart TypeScript server in IDE

## 📚 Documentation

- **Full Guide**: [`DYNAMIC_PROGRAMS_CMS.md`](DYNAMIC_PROGRAMS_CMS.md)
- **Implementation Status**: [`IMPLEMENTATION_STATUS.md`](IMPLEMENTATION_STATUS.md)
- **Prisma Schema**: [`prisma/schema.prisma`](prisma/schema.prisma)
- **Configuration**: [`lib/program-config.ts`](lib/program-config.ts)

## 🆘 Support

For issues or questions:
1. Check the full documentation
2. Review existing program configurations as examples
3. Verify Prisma models match your configuration

---

**Last Updated**: January 2025
