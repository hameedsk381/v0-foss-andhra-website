/**
 * Dynamic Program CMS Configuration
 * Each program can define its own content types and fields
 */

export interface ContentField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'richtext' | 'number' | 'url' | 'image' | 'date' | 'select' | 'json'
  required?: boolean
  placeholder?: string
  options?: string[] // For select fields
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
  defaultOrder?: string[] // Field names to show in list view
}

export interface ProgramConfig {
  id: string
  name: string
  title: string
  color: string
  contentTypes: ContentType[]
}

// Program Configurations
export const programConfigs: Record<string, ProgramConfig> = {
  fosstar: {
    id: 'fosstar',
    name: 'FOSStar',
    title: 'Membership Program',
    color: '#015ba7',
    contentTypes: [
      {
        id: 'initiatives',
        name: 'initiatives',
        singularName: 'Initiative',
        pluralName: 'Initiatives',
        icon: 'Sparkles',
        description: 'Member benefits and activities',
        fields: [
          { name: 'title', label: 'Title', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'textarea', required: true },
          { name: 'content', label: 'Content', type: 'richtext' },
          { name: 'icon', label: 'Icon', type: 'text', placeholder: 'lucide-react icon name' },
          {
            name: 'category',
            label: 'Category',
            type: 'select',
            options: ['benefits', 'activities', 'membership', 'events'],
          },
        ],
        defaultOrder: ['title', 'category', 'description'],
      },
      {
        id: 'team',
        name: 'team',
        singularName: 'Team Member',
        pluralName: 'Team Members',
        icon: 'Users',
        description: 'FOSStar team members',
        fields: [
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'role', label: 'Role', type: 'text', required: true },
          { name: 'bio', label: 'Bio', type: 'textarea' },
          { name: 'avatar', label: 'Avatar URL', type: 'image' },
          { name: 'email', label: 'Email', type: 'text' },
          { name: 'linkedin', label: 'LinkedIn', type: 'url' },
          { name: 'twitter', label: 'Twitter', type: 'url' },
        ],
        defaultOrder: ['name', 'role', 'email'],
      },
    ],
  },

  fosserve: {
    id: 'fosserve',
    name: 'FOSServe',
    title: 'FOSS Deployment Services',
    color: '#10b981',
    contentTypes: [
      {
        id: 'initiatives',
        name: 'initiatives',
        singularName: 'Service',
        pluralName: 'Services',
        icon: 'Server',
        description: 'Deployment services offered',
        fields: [
          { name: 'title', label: 'Service Name', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'textarea', required: true },
          { name: 'content', label: 'Details', type: 'richtext' },
          {
            name: 'category',
            label: 'Category',
            type: 'select',
            options: ['government', 'education', 'healthcare', 'enterprise'],
          },
        ],
        defaultOrder: ['title', 'category', 'description'],
      },
      {
        id: 'casestudies',
        name: 'casestudies',
        singularName: 'Case Study',
        pluralName: 'Case Studies',
        icon: 'FileText',
        description: 'Successful FOSS deployments',
        fields: [
          { name: 'title', label: 'Title', type: 'text', required: true },
          { name: 'subtitle', label: 'Subtitle', type: 'text' },
          { name: 'description', label: 'Description', type: 'textarea', required: true },
          { name: 'content', label: 'Full Story', type: 'richtext' },
          { name: 'imageUrl', label: 'Image', type: 'image' },
          { name: 'metrics', label: 'Metrics (JSON)', type: 'json', description: 'e.g., {"savings": "50%", "users": "10000"}' },
          {
            name: 'category',
            label: 'Category',
            type: 'select',
            options: ['government', 'education', 'healthcare', 'enterprise'],
          },
        ],
        defaultOrder: ['title', 'category', 'subtitle'],
      },
      {
        id: 'team',
        name: 'team',
        singularName: 'Team Member',
        pluralName: 'Team Members',
        icon: 'Users',
        description: 'FOSServe team',
        fields: [
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'role', label: 'Role', type: 'text', required: true },
          { name: 'bio', label: 'Bio', type: 'textarea' },
          { name: 'avatar', label: 'Avatar URL', type: 'image' },
        ],
        defaultOrder: ['name', 'role'],
      },
    ],
  },

  fossync: {
    id: 'fossync',
    name: 'FOSSynC',
    title: 'College Clubs Network',
    color: '#f59e0b',
    contentTypes: [
      {
        id: 'clubs',
        name: 'clubs',
        singularName: 'Club',
        pluralName: 'Clubs',
        icon: 'Users',
        description: 'FOSS college clubs',
        fields: [
          { name: 'name', label: 'Club Name', type: 'text', required: true },
          { name: 'institution', label: 'Institution', type: 'text', required: true },
          { name: 'location', label: 'Location', type: 'text', required: true },
          { name: 'members', label: 'Member Count', type: 'number', required: true },
          { name: 'established', label: 'Established Date', type: 'text', placeholder: 'e.g., Jan 2024' },
          { name: 'description', label: 'Description', type: 'textarea' },
          { name: 'contact', label: 'Contact Email', type: 'text' },
          { name: 'logo', label: 'Logo URL', type: 'image' },
        ],
        defaultOrder: ['name', 'institution', 'location', 'members'],
      },
      {
        id: 'initiatives',
        name: 'initiatives',
        singularName: 'Initiative',
        pluralName: 'Initiatives',
        icon: 'Lightbulb',
        description: 'Network-wide initiatives',
        fields: [
          { name: 'title', label: 'Title', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'textarea', required: true },
          { name: 'content', label: 'Content', type: 'richtext' },
        ],
        defaultOrder: ['title', 'description'],
      },
      {
        id: 'team',
        name: 'team',
        singularName: 'Coordinator',
        pluralName: 'Coordinators',
        icon: 'UserCog',
        description: 'Network coordinators',
        fields: [
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'role', label: 'Role', type: 'text', required: true },
          { name: 'bio', label: 'Bio', type: 'textarea' },
          { name: 'avatar', label: 'Avatar', type: 'image' },
        ],
        defaultOrder: ['name', 'role'],
      },
    ],
  },

  fosstorm: {
    id: 'fosstorm',
    name: 'FOSStorm',
    title: 'Open Source Projects',
    color: '#8b5cf6',
    contentTypes: [
      {
        id: 'projects',
        name: 'projects',
        singularName: 'Project',
        pluralName: 'Projects',
        icon: 'Code',
        description: 'Open source projects',
        fields: [
          { name: 'name', label: 'Project Name', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'textarea', required: true },
          { name: 'content', label: 'Details', type: 'richtext' },
          { name: 'githubUrl', label: 'GitHub URL', type: 'url' },
          { name: 'websiteUrl', label: 'Website URL', type: 'url' },
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: ['active', 'beta', 'development', 'archived'],
          },
          { name: 'technologies', label: 'Technologies (JSON array)', type: 'json', placeholder: '["React", "Node.js"]' },
          { name: 'stars', label: 'GitHub Stars', type: 'number' },
          { name: 'contributors', label: 'Contributors', type: 'number' },
          { name: 'logo', label: 'Logo URL', type: 'image' },
        ],
        defaultOrder: ['name', 'status', 'stars', 'contributors'],
      },
      {
        id: 'team',
        name: 'team',
        singularName: 'Maintainer',
        pluralName: 'Maintainers',
        icon: 'GitBranch',
        description: 'Project maintainers',
        fields: [
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'role', label: 'Role', type: 'text', required: true },
          { name: 'bio', label: 'Bio', type: 'textarea' },
          { name: 'avatar', label: 'Avatar', type: 'image' },
          { name: 'linkedin', label: 'LinkedIn', type: 'url' },
        ],
        defaultOrder: ['name', 'role'],
      },
    ],
  },

  fossart: {
    id: 'fossart',
    name: 'FOSSart',
    title: 'FOSS Startup Incubator',
    color: '#ec4899',
    contentTypes: [
      {
        id: 'startups',
        name: 'startups',
        singularName: 'Startup',
        pluralName: 'Startups',
        icon: 'Rocket',
        description: 'Incubated startups',
        fields: [
          { name: 'name', label: 'Startup Name', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'textarea', required: true },
          { name: 'content', label: 'Full Story', type: 'richtext' },
          {
            name: 'category',
            label: 'Category',
            type: 'select',
            options: ['healthcare', 'ecommerce', 'edtech', 'agritech', 'fintech', 'other'],
          },
          { name: 'founded', label: 'Founded', type: 'text', placeholder: 'e.g., 2024' },
          { name: 'location', label: 'Location', type: 'text' },
          { name: 'teamSize', label: 'Team Size', type: 'number' },
          {
            name: 'fundingStage',
            label: 'Funding Stage',
            type: 'select',
            options: ['funded', 'seed', 'incubation', 'pre-funding'],
          },
          { name: 'fundingAmount', label: 'Funding Amount', type: 'text' },
          { name: 'logo', label: 'Logo', type: 'image' },
          { name: 'websiteUrl', label: 'Website', type: 'url' },
          { name: 'technologies', label: 'Tech Stack (JSON)', type: 'json' },
        ],
        defaultOrder: ['name', 'category', 'fundingStage', 'teamSize'],
      },
      {
        id: 'team',
        name: 'team',
        singularName: 'Mentor',
        pluralName: 'Mentors',
        icon: 'GraduationCap',
        description: 'Startup mentors',
        fields: [
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'role', label: 'Expertise', type: 'text', required: true },
          { name: 'bio', label: 'Bio', type: 'textarea' },
          { name: 'avatar', label: 'Avatar', type: 'image' },
        ],
        defaultOrder: ['name', 'role'],
      },
    ],
  },

  fossterage: {
    id: 'fossterage',
    name: 'FOSSterage',
    title: 'FOSS Knowledge Repository',
    color: '#06b6d4',
    contentTypes: [
      {
        id: 'repositories',
        name: 'repositories',
        singularName: 'Repository',
        pluralName: 'Repositories',
        icon: 'Database',
        description: 'Knowledge repositories',
        fields: [
          { name: 'name', label: 'Repository Name', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'textarea', required: true },
          { name: 'content', label: 'Details', type: 'richtext' },
          {
            name: 'category',
            label: 'Category',
            type: 'select',
            options: ['databases', 'research', 'education', 'documentation'],
          },
          {
            name: 'type',
            label: 'Type',
            type: 'select',
            options: ['archive', 'hub', 'network', 'library'],
          },
          { name: 'url', label: 'Access URL', type: 'url' },
          { name: 'features', label: 'Features (JSON)', type: 'json' },
        ],
        defaultOrder: ['name', 'category', 'type'],
      },
      {
        id: 'team',
        name: 'team',
        singularName: 'Curator',
        pluralName: 'Curators',
        icon: 'BookOpen',
        description: 'Repository curators',
        fields: [
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'role', label: 'Role', type: 'text', required: true },
          { name: 'bio', label: 'Bio', type: 'textarea' },
          { name: 'avatar', label: 'Avatar', type: 'image' },
        ],
        defaultOrder: ['name', 'role'],
      },
    ],
  },

  fosspeaks: {
    id: 'fosspeaks',
    name: 'FOSSpeaks',
    title: 'FOSS Talks & Events',
    color: '#f97316',
    contentTypes: [
      {
        id: 'initiatives',
        name: 'initiatives',
        singularName: 'Event',
        pluralName: 'Events',
        icon: 'Calendar',
        description: 'Talks and events',
        fields: [
          { name: 'title', label: 'Event Title', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'textarea', required: true },
          { name: 'content', label: 'Details', type: 'richtext' },
          {
            name: 'category',
            label: 'Type',
            type: 'select',
            options: ['talk', 'workshop', 'conference', 'meetup'],
          },
        ],
        defaultOrder: ['title', 'category', 'description'],
      },
      {
        id: 'team',
        name: 'team',
        singularName: 'Speaker',
        pluralName: 'Speakers',
        icon: 'Mic',
        description: 'Event speakers',
        fields: [
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'role', label: 'Title/Expertise', type: 'text', required: true },
          { name: 'bio', label: 'Bio', type: 'textarea' },
          { name: 'avatar', label: 'Photo', type: 'image' },
          { name: 'linkedin', label: 'LinkedIn', type: 'url' },
          { name: 'twitter', label: 'Twitter', type: 'url' },
        ],
        defaultOrder: ['name', 'role'],
      },
    ],
  },
}

/**
 * Get configuration for a specific program
 */
export function getProgramConfig(programId: string): ProgramConfig | null {
  return programConfigs[programId] || null
}

/**
 * Get all program IDs
 */
export function getAllProgramIds(): string[] {
  return Object.keys(programConfigs)
}

/**
 * Get content type configuration for a program
 */
export function getContentTypeConfig(
  programId: string,
  contentTypeId: string
): ContentType | null {
  const program = getProgramConfig(programId)
  if (!program) return null
  return program.contentTypes.find((ct) => ct.id === contentTypeId) || null
}
