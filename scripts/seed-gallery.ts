import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleGalleryData = [
  {
    filename: 'gallery/sample-1.jpg',
    originalName: 'fosstar-event-1.jpg',
    mimeType: 'image/jpeg',
    size: 245000,
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    title: 'FOSStar Community Meetup',
    description: 'Community meetup for FOSS enthusiasts in Vijayawada',
    alt: 'FOSStar community members at meetup',
    caption: 'Community meetup for FOSS enthusiasts in Vijayawada',
    program: 'fosstar',
    category: 'event',
    tags: 'event,community,meetup',
    uploadedBy: 'admin',
  },
  {
    filename: 'gallery/sample-2.jpg',
    originalName: 'fosstar-summit.jpg',
    mimeType: 'image/jpeg',
    size: 312000,
    url: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800',
    title: 'FOSS Leadership Summit',
    description: 'Annual leadership summit for FOSS community leaders',
    alt: 'FOSS leaders at summit',
    caption: 'Annual leadership summit for FOSS community leaders',
    program: 'fosstar',
    category: 'event',
    tags: 'event,leadership,summit',
    uploadedBy: 'admin',
  },
  {
    filename: 'gallery/sample-3.jpg',
    originalName: 'fosserve-launch.jpg',
    mimeType: 'image/jpeg',
    size: 198000,
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
    title: 'Government Portal Launch',
    description: 'Launch of new FOSS-based government service portal',
    alt: 'Government officials at portal launch',
    caption: 'Launch of new FOSS-based government service portal',
    program: 'fosserve',
    category: 'launch',
    tags: 'implementation,government,launch',
    uploadedBy: 'admin',
  },
  {
    filename: 'gallery/sample-4.jpg',
    originalName: 'fossync-club.jpg',
    mimeType: 'image/jpeg',
    size: 267000,
    url: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800',
    title: 'University FOSS Club Inauguration',
    description: 'Opening ceremony of new FOSS club at Andhra University',
    alt: 'Students at FOSS club inauguration',
    caption: 'Opening ceremony of new FOSS club at Andhra University',
    program: 'fossync',
    category: 'inauguration',
    tags: 'education,university,inauguration',
    uploadedBy: 'admin',
  },
  {
    filename: 'gallery/sample-5.jpg',
    originalName: 'fosstorm-workshop.jpg',
    mimeType: 'image/jpeg',
    size: 289000,
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    title: 'Project Collaboration Workshop',
    description: 'Developers collaborate on open source projects',
    alt: 'Developers working together at workshop',
    caption: 'Developers collaborate on open source projects',
    program: 'fosstorm',
    category: 'workshop',
    tags: 'development,workshop,collaboration',
    uploadedBy: 'admin',
  },
  {
    filename: 'gallery/sample-6.jpg',
    originalName: 'fossart-startup.jpg',
    mimeType: 'image/jpeg',
    size: 234000,
    url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
    title: 'FOSS Startup Incubation',
    description: 'New startups join the FOSS entrepreneurship program',
    alt: 'Startup founders at incubation program',
    caption: 'New startups join the FOSS entrepreneurship program',
    program: 'fossart',
    category: 'event',
    tags: 'startup,entrepreneurship,innovation',
    uploadedBy: 'admin',
  },
  {
    filename: 'gallery/sample-7.jpg',
    originalName: 'fossterage-database.jpg',
    mimeType: 'image/jpeg',
    size: 201000,
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    title: 'Open Data Repository Launch',
    description: 'Launch of new open research data repository',
    alt: 'Data visualization at repository launch',
    caption: 'Launch of new open research data repository',
    program: 'fossterage',
    category: 'launch',
    tags: 'data,research,repository',
    uploadedBy: 'admin',
  },
  {
    filename: 'gallery/sample-8.jpg',
    originalName: 'fosspeaks-advocacy.jpg',
    mimeType: 'image/jpeg',
    size: 276000,
    url: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800',
    title: 'Policy Advocacy Forum',
    description: 'Forum on FOSS policy advocacy with government officials',
    alt: 'Policy makers at advocacy forum',
    caption: 'Forum on FOSS policy advocacy with government officials',
    program: 'fosspeaks',
    category: 'event',
    tags: 'policy,advocacy,government',
    uploadedBy: 'admin',
  },
]

async function main() {
  console.log('🌱 Seeding gallery with sample images...\n')

  for (const item of sampleGalleryData) {
    const media = await prisma.media.create({
      data: item,
    })
    console.log(`✅ ${media.title} (${media.program})`)
  }

  console.log(`\n✨ ${sampleGalleryData.length} gallery images seeded successfully!`)
  console.log('\n📸 View at: http://localhost:3000/gallery')
  console.log('🎨 Admin: http://localhost:3000/admin/gallery')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding gallery:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
