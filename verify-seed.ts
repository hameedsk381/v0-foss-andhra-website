import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verify() {
  const admin = await prisma.admin.findFirst()
  const blogPosts = await prisma.blogPost.findMany()
  const categories = await prisma.blogCategory.findMany()
  const tags = await prisma.blogTag.findMany()
  
  console.log('✅ Admin Account:')
  console.log(`  - Name: ${admin?.name}`)
  console.log(`  - Email: ${admin?.email}`)
  console.log(`  - Role: ${admin?.role}`)
  console.log(`  - Password Hash: ${admin?.password?.substring(0, 20)}...`)
  
  console.log(`\n✅ Blog Categories: ${categories.length} categories created`)
  categories.forEach((cat, i) => {
    console.log(`  ${i+1}. ${cat.name}`)
  })
  
  console.log(`\n✅ Blog Tags: ${tags.length} tags created`)
  
  console.log(`\n✅ Blog Posts: ${blogPosts.length} posts created`)
  blogPosts.forEach((post, i) => {
    console.log(`  ${i+1}. ${post.title}`)
    console.log(`     - Slug: ${post.slug}`)
    console.log(`     - Status: ${post.status}`)
    console.log(`     - Featured: ${post.featured}`)
  })
  
  await prisma.$disconnect()
}

verify().catch(console.error)
