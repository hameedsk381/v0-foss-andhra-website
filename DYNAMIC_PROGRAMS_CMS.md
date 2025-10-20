# Dynamic Programs CMS

## Overview

The Dynamic Programs CMS is a configuration-driven content management system that adapts to each program's unique content needs. Instead of hard-coding forms and tables for each program, the system automatically generates UI components based on field configurations.

## Architecture

### Configuration-Driven Design

Each program defines its content structure in [`lib/program-config.ts`](lib/program-config.ts):

```typescript
export interface ContentField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'richtext' | 'number' | 'url' | 'image' | 'date' | 'select' | 'json'
  required?: boolean
  placeholder?: string
  options?: string[]  // For select fields
  description?: string
}

export interface ContentType {
  id: string
  name: string
  singularName: string
  pluralName: string
  icon: string
  description: string
  fields: ContentField[]
  defaultOrder?: string[]  // Fields to show in list view
}
```

### Component Structure

```
components/admin/
├── DynamicForm.tsx       # Auto-generates forms from field config
├── DynamicList.tsx       # Auto-generates tables with formatting
└── RichTextField.tsx     # TipTap rich text editor

app/admin/programs/
├── [id]/
│   ├── page.tsx          # Program overview
│   └── [contentType]/
│       └── page.tsx      # Content management page

app/api/admin/programs/
└── [programId]/
    └── [contentType]/
        ├── route.ts      # GET/POST endpoints
        └── [id]/
            └── route.ts  # PATCH/DELETE endpoints
```

## Supported Field Types

The system supports 9 field types with automatic rendering and validation:

| Type | Description | Example Use |
|------|-------------|-------------|
| `text` | Single-line text input | Name, Title |
| `textarea` | Multi-line text | Description, Bio |
| `richtext` | TipTap WYSIWYG editor | Article content |
| `number` | Numeric input | Team size, Stars |
| `url` | URL with validation | Website, GitHub |
| `image` | Image URL with preview | Logo, Avatar |
| `date` | Date picker | Event date |
| `select` | Dropdown menu | Category, Status |
| `json` | JSON editor | Tags, Metrics |

## Programs Configuration

### 7 Programs Configured

1. **FOSStar** (Membership) - `#015ba7`
   - Content Types: Initiatives, Team Members

2. **FOSServe** (FOSS Deployment) - `#10b981`
   - Content Types: Services, Case Studies, Team Members

3. **FOSSynC** (College Clubs) - `#f59e0b`
   - Content Types: Clubs, Initiatives, Coordinators

4. **FOSStorm** (Open Source Projects) - `#8b5cf6`
   - Content Types: Projects, Maintainers

5. **FOSSart** (Startup Incubator) - `#ec4899`
   - Content Types: Startups, Mentors

6. **FOSSterage** (Knowledge Repository) - `#06b6d4`
   - Content Types: Repositories, Curators

7. **FOSSpeaks** (Talks & Events) - `#f97316`
   - Content Types: Events, Speakers

## Adding a New Program

### Step 1: Add Configuration

Edit [`lib/program-config.ts`](lib/program-config.ts):

```typescript
export const programConfigs: Record<string, ProgramConfig> = {
  // ... existing programs
  
  mynewprogram: {
    id: 'mynewprogram',
    name: 'MyNewProgram',
    title: 'My New Program Title',
    color: '#3b82f6',
    contentTypes: [
      {
        id: 'items',
        name: 'items',
        singularName: 'Item',
        pluralName: 'Items',
        icon: 'Package',
        description: 'Program items',
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
          },
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: ['active', 'inactive']
          }
        ],
        defaultOrder: ['title', 'status']
      }
    ]
  }
}
```

### Step 2: Create Prisma Model

Edit [`prisma/schema.prisma`](prisma/schema.prisma):

```prisma
// Add to Program model relations
model Program {
  // ... existing fields
  items ProgramItem[]
}

// Create new content model
model ProgramItem {
  id          String   @id @default(cuid())
  programId   String
  title       String
  description String?
  status      String   @default("active")
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  program     Program  @relation(fields: [programId], references: [id], onDelete: Cascade)
}
```

### Step 3: Update API Route Mapping

Edit [`app/api/admin/programs/[programId]/[contentType]/route.ts`](app/api/admin/programs/[programId]/[contentType]/route.ts):

```typescript
const contentTypeModelMap: Record<string, string> = {
  // ... existing mappings
  items: "programItem",
}
```

### Step 4: Run Migration

```bash
bunx prisma migrate dev --name add_program_item
```

That's it! The admin UI will automatically appear at `/admin/programs/mynewprogram/items`.

## API Usage

### Get All Items

```typescript
GET /api/admin/programs/{programId}/{contentType}

Response:
{
  "data": [
    {
      "id": "clx...",
      "title": "Example Item",
      "createdAt": "2025-01-20T..."
    }
  ]
}
```

### Create Item

```typescript
POST /api/admin/programs/{programId}/{contentType}
Content-Type: application/json

{
  "title": "New Item",
  "description": "Item description"
}
```

### Update Item

```typescript
PATCH /api/admin/programs/{programId}/{contentType}/{id}
Content-Type: application/json

{
  "title": "Updated Title"
}
```

### Delete Item

```typescript
DELETE /api/admin/programs/{programId}/{contentType}/{id}
```

## User Workflow

1. **Access Program**: Navigate to `/admin/programs/{programId}`
2. **Select Content Type**: Click on a content type card (e.g., "Initiatives")
3. **View Existing Data**: See all items in a formatted table
4. **Add New Item**: Click "Add {Type}" button
5. **Fill Form**: Auto-generated form with all configured fields
6. **Edit Item**: Click edit icon in table row
7. **Delete Item**: Click delete icon (with confirmation)

## Benefits

### For Developers

- **No Repetitive Code**: One set of components works for all programs
- **Type-Safe**: Full TypeScript support with interfaces
- **Easy to Extend**: Add new field types in one place
- **Maintainable**: Changes to form logic update all programs

### For Content Managers

- **Consistent UX**: Same interface pattern across all programs
- **Immediate Feedback**: Validation errors shown inline
- **Rich Editing**: TipTap editor for formatted content
- **Visual Previews**: Images show thumbnails, JSON is formatted

### For Programs

- **Flexible Structure**: Each program defines its own fields
- **Custom Workflows**: Different field types for different needs
- **Scalable**: Add new content types without code changes

## Technical Details

### JSON Field Handling

JSON fields are automatically parsed and stringified:

```typescript
// Input
{
  "technologies": '["React", "Node.js"]'
}

// Stored in DB
{
  "technologies": ["React", "Node.js"]
}

// Displayed in list
"React, Node.js"
```

### Rich Text Editor (TipTap)

Configured with SSR disabled to prevent hydration issues:

```typescript
const RichTextField = dynamic(
  () => import("@/components/admin/RichTextField"),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse" />
  }
)
```

### Select Field Options

Defined in configuration:

```typescript
{
  name: 'status',
  type: 'select',
  options: ['active', 'beta', 'archived']
}
```

## Best Practices

1. **Field Naming**: Use camelCase for field names matching Prisma schema
2. **Required Fields**: Mark essential fields as `required: true`
3. **Default Order**: Specify 3-4 most important fields for list view
4. **Descriptions**: Add helpful descriptions for complex fields
5. **Validation**: Use appropriate field types (url, number) for auto-validation
6. **JSON Format**: Document expected JSON structure in placeholder

## Troubleshooting

### Form Not Appearing

- Check if program exists in `programConfigs`
- Verify content type ID matches configuration
- Ensure user is authenticated

### API Errors

- Verify model name in `contentTypeModelMap`
- Check Prisma model has all required fields
- Run `bunx prisma migrate dev` after schema changes

### Field Not Rendering

- Confirm field type is valid (check `ContentField` interface)
- For select fields, ensure `options` array is provided
- Check for console errors

## Future Enhancements

- [ ] File upload support for images
- [ ] Drag-and-drop reordering in lists
- [ ] Bulk actions (delete, update status)
- [ ] CSV import/export
- [ ] Field-level permissions
- [ ] Custom validation rules per field
- [ ] Preview mode for rich text content
- [ ] Search and filter in lists

---

**Last Updated**: January 2025  
**Version**: 1.0.0
