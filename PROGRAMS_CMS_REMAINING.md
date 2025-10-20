# Programs CMS - Remaining Implementation Guide

## ✅ Completed

1. **Team Management** - `/admin/programs/[id]/team`
   - Page: ✅ Created
   - API: ✅ Created (`route.ts` + `reorder/route.ts`)

2. **Case Studies** - `/admin/programs/[id]/casestudies`
   - Page: ✅ Created
   - API: ⏳ Needs creation

## 🔧 Remaining Pages to Create

### 3. Clubs (FOSSynC)
**File**: `app/admin/programs/[id]/clubs/page.tsx`
**Fields**:
- name, location, institution
- members (number), established (year)
- description, contact, logo
- active, order

**API Routes Needed**:
- `app/api/admin/programs/[id]/clubs/route.ts`
- `app/api/admin/programs/[id]/clubs/reorder/route.ts`

### 4. Projects (FOSStorm)
**File**: `app/admin/programs/[id]/projects/page.tsx`
**Fields**:
- name, description, content
- githubUrl, websiteUrl
- status (active/beta/development/archived)
- technologies (JSON array)
- stars, contributors
- logo, order, active

**API Routes Needed**:
- `app/api/admin/programs/[id]/projects/route.ts`
- `app/api/admin/programs/[id]/projects/reorder/route.ts`

### 5. Startups (FOSSart)
**File**: `app/admin/programs/[id]/startups/page.tsx`
**Fields**:
- name, description, content
- category (healthcare, ecommerce, etc.)
- founded (year), location
- teamSize (number)
- fundingStage, fundingAmount
- logo, websiteUrl
- technologies (JSON array)
- active

**API Routes Needed**:
- `app/api/admin/programs/[id]/startups/route.ts`

### 6. Repositories (FOSSterage)
**File**: `app/admin/programs/[id]/repositories/page.tsx`
**Fields**:
- name, description, content
- category (databases/research/education)
- type (archive/hub/network/library)
- url
- features (JSON array)
- order, active

**API Routes Needed**:
- `app/api/admin/programs/[id]/repositories/route.ts`
- `app/api/admin/programs/[id]/repositories/reorder/route.ts`

## 📋 API Route Template

Use this template for all remaining API routes:

\`\`\`typescript
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// GET - List all items
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const items = await prisma.programClub.findMany({  // Change to appropriate model
      where: { programId: params.id },
      orderBy: { order: "asc" },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching items:", error)
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 })
  }
}

// POST - Create new item
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const item = await prisma.programClub.create({  // Change to appropriate model
      data: {
        programId: params.id,
        ...body,  // Add all required fields
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error creating item:", error)
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 })
  }
}

// PUT - Update item
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }

    const body = await request.json()

    const item = await prisma.programClub.update({  // Change to appropriate model
      where: { id },
      data: body,
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error updating item:", error)
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
  }
}

// DELETE - Delete item
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }

    await prisma.programClub.delete({  // Change to appropriate model
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting item:", error)
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
  }
}
\`\`\`

## 🎯 Quick Implementation Steps

For each remaining page:

1. **Copy the template** from `casestudies/page.tsx` or `team/page.tsx`
2. **Update the interface** with correct fields
3. **Update form fields** in the edit tab
4. **Update display** in the overview tab
5. **Create API route** using the template above
6. **Test** CRUD operations

## 📝 Field Mapping Reference

### Clubs (FOSSynC)
\`\`\`typescript
interface Club {
  id: string
  name: string
  location: string
  institution: string
  members: number
  established: string
  description?: string
  contact?: string
  logo?: string
  active: boolean
}
\`\`\`

### Projects (FOSStorm)
\`\`\`typescript
interface Project {
  id: string
  name: string
  description: string
  content?: string
  githubUrl?: string
  websiteUrl?: string
  status: string  // active, beta, development, archived
  technologies?: string  // JSON string
  stars: number
  contributors: number
  logo?: string
  order: number
  active: boolean
}
\`\`\`

### Startups (FOSSart)
\`\`\`typescript
interface Startup {
  id: string
  name: string
  description: string
  content?: string
  category?: string
  founded: string
  location: string
  teamSize: number
  fundingStage?: string
  fundingAmount?: string
  logo?: string
  websiteUrl?: string
  technologies?: string  // JSON string
  active: boolean
}
\`\`\`

### Repositories (FOSSterage)
\`\`\`typescript
interface Repository {
  id: string
  name: string
  description: string
  content?: string
  category?: string
  type?: string
  url?: string
  features?: string  // JSON string
  order: number
  active: boolean
}
\`\`\`

## 🚀 Priority Order

1. ✅ Team (Done)
2. ✅ Case Studies (Page done, API pending)
3. **Clubs** - Simple, no reorder needed
4. **Projects** - Most complex (GitHub integration)
5. **Startups** - Medium complexity
6. **Repositories** - Simple with categories

## 💡 Tips

- Reuse the case studies page structure
- For JSON fields (technologies, features), provide example format
- Add validation for required fields
- Use rich text editor for `content` fields
- Add image preview for logo/imageUrl fields
- Test with actual data before moving to next

## ⚡ Automation Opportunity

All remaining pages follow the same pattern:
1. Form with specific fields
2. CRUD operations
3. Reordering (for some)
4. Active/Inactive toggle

You can create a template generator script to automate this!
