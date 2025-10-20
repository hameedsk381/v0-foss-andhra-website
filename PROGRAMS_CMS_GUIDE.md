# Programs CMS Documentation

## Overview

The Programs CMS allows you to manage all 7 FOSS Andhra programs through a centralized admin interface. Each program can have initiatives, team members, and program-specific content.

## Database Structure

### Core Tables

1. **Program** - Main program information
   - `name` - Unique identifier (fosstar, fosserve, fossync, fosstorm, fossart, fossterage, fosspeaks)
   - `title` - Display title
   - `description` - Program description
   - `tagline` - Short tagline
   - `mission` - Mission statement
   - `color` - Brand color (hex)
   - `logo` - Logo URL
   - `status` - active/inactive
   - `displayOrder` - Sort order

2. **ProgramInitiative** - Program initiatives/features
   - `title` - Initiative title
   - `description` - Short description
   - `content` - Rich text content
   - `icon` - Icon name (Lucide)
   - `category` - Category (benefits, activities, etc.)
   - `order` - Display order
   - `active` - Active status

3. **ProgramTeamMember** - Team members
   - `name` - Full name
   - `role` - Job title/role
   - `bio` - Biography
   - `avatar` - Profile image URL
   - `email` - Contact email
   - `linkedin` - LinkedIn profile
   - `twitter` - Twitter handle
   - `order` - Display order
   - `active` - Active status

4. **ProgramCaseStudy** - Case studies (FOSServe)
   - `title` - Case study title
   - `subtitle` - Subtitle
   - `description` - Short description
   - `content` - Rich text content
   - `imageUrl` - Cover image
   - `metrics` - JSON string with metrics
   - `category` - Category
   - `order` - Display order
   - `active` - Active status

5. **ProgramClub** - Student clubs (FOSSynC)
   - `name` - Club name
   - `location` - City/location
   - `institution` - Institution name
   - `members` - Member count
   - `established` - Year established
   - `description` - Club description
   - `contact` - Contact info
   - `logo` - Club logo
   - `active` - Active status

6. **ProgramProject** - Open source projects (FOSStorm)
   - `name` - Project name
   - `description` - Short description
   - `content` - Rich text content
   - `githubUrl` - GitHub repository URL
   - `websiteUrl` - Project website
   - `status` - active/beta/development/archived
   - `technologies` - JSON array of tech tags
   - `stars` - GitHub stars count
   - `contributors` - Contributors count
   - `logo` - Project logo
   - `order` - Display order
   - `active` - Active status

7. **ProgramStartup** - Funded startups (FOSSart)
   - `name` - Startup name
   - `description` - Short description
   - `content` - Rich text content
   - `category` - Category (healthcare, ecommerce, etc.)
   - `founded` - Year founded
   - `location` - City/location
   - `teamSize` - Number of team members
   - `fundingStage` - funded/seed/incubation/pre-funding
   - `fundingAmount` - Funding amount
   - `logo` - Startup logo
   - `websiteUrl` - Startup website
   - `technologies` - JSON array of tech tags
   - `active` - Active status

8. **ProgramRepository** - Knowledge repositories (FOSSterage)
   - `name` - Repository name
   - `description` - Short description
   - `content` - Rich text content
   - `category` - databases/research/education
   - `type` - archive/hub/network/library
   - `url` - Repository URL
   - `features` - JSON array of features
   - `order` - Display order
   - `active` - Active status

## Admin Interface

### Main Programs Page
- **URL**: `/admin/programs`
- **Features**:
  - View all programs
  - Create new programs
  - Edit program details
  - Delete programs
  - View counts of related items
  - Quick links to manage sub-items

### Program Initiatives
- **URL**: `/admin/programs/[id]/initiatives`
- **Features**:
  - Create/edit/delete initiatives
  - Reorder initiatives (drag and drop)
  - Rich text editor for content
  - Categorize initiatives
  - Toggle active status
  - Set custom icons

### Program Team Members
- **URL**: `/admin/programs/[id]/team`
- **Features**:
  - Add team members
  - Set roles and bio
  - Upload avatars
  - Add social media links
  - Reorder team members
  - Toggle active status

### Program-Specific Management

#### FOSServe Case Studies
- **URL**: `/admin/programs/[id]/casestudies`
- Manage implementation case studies with metrics

#### FOSSynC Clubs
- **URL**: `/admin/programs/[id]/clubs`
- Manage student-led FOSS clubs

#### FOSStorm Projects
- **URL**: `/admin/programs/[id]/projects`
- Manage open source projects with GitHub integration

#### FOSSart Startups
- **URL**: `/admin/programs/[id]/startups`
- Manage funded startups and their details

#### FOSSterage Repositories
- **URL**: `/admin/programs/[id]/repositories`
- Manage knowledge repositories and databases

## API Endpoints

### Programs
- `GET /api/admin/programs` - List all programs
- `POST /api/admin/programs` - Create program
- `PUT /api/admin/programs?id=[id]` - Update program
- `DELETE /api/admin/programs?id=[id]` - Delete program
- `GET /api/admin/programs/[id]` - Get program details

### Initiatives
- `GET /api/admin/programs/[id]/initiatives` - List initiatives
- `POST /api/admin/programs/[id]/initiatives` - Create initiative
- `PUT /api/admin/programs/[id]/initiatives?id=[id]` - Update initiative
- `DELETE /api/admin/programs/[id]/initiatives?id=[id]` - Delete initiative
- `POST /api/admin/programs/[id]/initiatives/reorder` - Reorder initiatives

### Team Members
- `GET /api/admin/programs/[id]/team` - List team members
- `POST /api/admin/programs/[id]/team` - Create team member
- `PUT /api/admin/programs/[id]/team?id=[id]` - Update team member
- `DELETE /api/admin/programs/[id]/team?id=[id]` - Delete team member

### Similar patterns for:
- Case Studies: `/api/admin/programs/[id]/casestudies`
- Clubs: `/api/admin/programs/[id]/clubs`
- Projects: `/api/admin/programs/[id]/projects`
- Startups: `/api/admin/programs/[id]/startups`
- Repositories: `/api/admin/programs/[id]/repositories`

## Initial Setup

### 1. Run Migration
```bash
bunx prisma migrate dev --name add_programs_cms
bunx prisma generate
```

### 2. Seed Programs
```bash
bunx tsx prisma/seed-programs.ts
```

This will create all 7 programs with their basic information:
- FOSStar (Blue #015ba7)
- FOSServe (Purple #9333ea)
- FOSSynC (Green #16a34a)
- FOSStorm (Orange #ea580c)
- FOSSart (Red #dc2626)
- FOSSterage (Cyan #0891b2)
- FOSSpeaks (Pink #db2777)

## Usage Workflow

### Adding a New Initiative

1. Navigate to `/admin/programs`
2. Find the program you want to add an initiative to
3. Click "Manage Initiatives"
4. Click "Add Initiative"
5. Fill in the form:
   - Title (required)
   - Description (required)
   - Content (optional, rich text)
   - Icon (Lucide icon name)
   - Category (e.g., "benefits", "activities")
   - Display Order
   - Active status
6. Click "Create Initiative"

### Reordering Items

Most list views support reordering:
1. Use the up/down arrow buttons to move items
2. Changes are saved automatically
3. Order is reflected on the public website

### Managing Program-Specific Content

Each program has specific management pages based on its type:

**FOSServe**:
- Add case studies with metrics
- Track implementation success stories

**FOSSynC**:
- Add campus clubs
- Track member counts and establishment dates

**FOSStorm**:
- Add open source projects
- Link to GitHub repositories
- Track stars and contributors

**FOSSart**:
- Add funded startups
- Track funding stages and amounts
- Manage startup portfolios

**FOSSterage**:
- Add knowledge repositories
- Categorize by type (databases, research, education)
- Link to external resources

## Best Practices

1. **Consistency**: Use consistent formatting for descriptions and content
2. **Images**: Store images in `/public/logos/` or `/public/gallery/`
3. **Colors**: Use the program's brand color consistently
4. **Order**: Set logical display orders for better UX
5. **Active Status**: Deactivate items instead of deleting to preserve history
6. **Rich Content**: Use the rich text editor for formatted content
7. **Metrics**: For case studies, use JSON format for metrics:
   ```json
   {
     "cost_savings": "₹1.2 Crore",
     "time_improvement": "65%",
     "systems_migrated": "500+"
   }
   ```

## Future Enhancements

Planned features:
- [ ] Bulk import/export
- [ ] Media library integration
- [ ] Version history
- [ ] Multi-language support
- [ ] Advanced search and filtering
- [ ] Analytics per program
- [ ] Public API for program data
- [ ] Custom fields per program type

## Troubleshooting

### Issue: Programs not showing
- Check if seed script was run
- Verify database connection
- Check program `status` is "active"

### Issue: Images not loading
- Verify image paths are correct
- Check `/public` directory structure
- Ensure images are accessible

### Issue: Reorder not working
- Check JavaScript console for errors
- Verify API endpoint is responding
- Clear browser cache

## Support

For issues or questions:
- Check the database schema in `prisma/schema.prisma`
- Review API routes in `/app/api/admin/programs/`
- Consult the main documentation
