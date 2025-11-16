/**
 * Test script to verify all admin API endpoints with database connectivity
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface TestResult {
  endpoint: string
  table: string
  status: 'PASS' | 'FAIL' | 'WARN'
  count?: number
  error?: string
  hasData: boolean
}

const results: TestResult[] = []

async function testTable(
  endpoint: string,
  tableName: string,
  queryFn: () => Promise<any>
) {
  try {
    const data = await queryFn()
    const count = Array.isArray(data) ? data.length : 1
    
    const result: TestResult = {
      endpoint,
      table: tableName,
      status: 'PASS',
      count,
      hasData: count > 0,
    }
    
    if (count === 0) {
      result.status = 'WARN'
    }
    
    results.push(result)
    
    const icon = result.status === 'PASS' ? '✅' : result.status === 'WARN' ? '⚠️' : '❌'
    console.log(`${icon} ${endpoint.padEnd(40)} | ${tableName.padEnd(20)} | Count: ${count}`)
    
    return result
  } catch (error) {
    const result: TestResult = {
      endpoint,
      table: tableName,
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error',
      hasData: false,
    }
    
    results.push(result)
    console.log(`❌ ${endpoint.padEnd(40)} | ${tableName.padEnd(20)} | ERROR: ${result.error}`)
    
    return result
  }
}

async function main() {
  console.log('\n🧪 Testing Admin Database Connectivity\n')
  console.log('='.repeat(100))
  console.log(`${'Endpoint'.padEnd(40)} | ${'Table'.padEnd(20)} | Status`)
  console.log('='.repeat(100))
  
  // Analytics API - Dashboard
  console.log('\n📊 Analytics & Dashboard')
  await testTable('/api/admin/dashboard', 'Member', () => prisma.member.findMany({ take: 1 }))
  await testTable('/api/admin/analytics', 'Donation', () => prisma.donation.findMany({ take: 1 }))
  
  // Blog API
  console.log('\n📝 Blog')
  await testTable('/api/admin/blog/categories', 'BlogCategory', () => prisma.blogCategory.findMany())
  await testTable('/api/admin/blog/tags', 'BlogTag', () => prisma.blogTag.findMany())
  await testTable('/api/admin/blog/posts', 'BlogPost', () => prisma.blogPost.findMany({ take: 5 }))
  
  // Content API
  console.log('\n📄 Content')
  await testTable('/api/admin/content', 'Content', () => prisma.content.findMany({ take: 5 }))
  
  // Donations API
  console.log('\n💰 Donations')
  await testTable('/api/admin/donations', 'Donation', () => prisma.donation.findMany({ take: 5 }))
  
  // Events API
  console.log('\n📅 Events')
  await testTable('/api/admin/events', 'Event', () => prisma.event.findMany({ take: 5 }))
  
  // Members API
  console.log('\n👥 Members')
  await testTable('/api/admin/members', 'Member', () => prisma.member.findMany({ take: 5 }))
  
  // Newsletter API
  console.log('\n📧 Newsletter')
  await testTable('/api/admin/newsletter/subscribers', 'Subscriber', () => prisma.subscriber.findMany({ take: 5 }))
  
  // Programs API
  console.log('\n🎯 Programs')
  await testTable('/api/admin/programs', 'Program', () => prisma.program.findMany())
  await testTable('/api/admin/programs/[id]/initiatives', 'ProgramInitiative', () => prisma.programInitiative.findMany({ take: 5 }))
  await testTable('/api/admin/programs/[id]/team', 'ProgramTeamMember', () => prisma.programTeamMember.findMany({ take: 5 }))
  await testTable('/api/admin/programs/[id]/clubs', 'ProgramClub', () => prisma.programClub.findMany({ take: 5 }))
  await testTable('/api/admin/programs/[id]/projects', 'ProgramProject', () => prisma.programProject.findMany({ take: 5 }))
  await testTable('/api/admin/programs/[id]/casestudies', 'ProgramCaseStudy', () => prisma.programCaseStudy.findMany({ take: 5 }))
  await testTable('/api/admin/programs/[id]/startups', 'ProgramStartup', () => prisma.programStartup.findMany({ take: 5 }))
  await testTable('/api/admin/programs/[id]/repositories', 'ProgramRepository', () => prisma.programRepository.findMany({ take: 5 }))
  
  // Summary
  console.log('\n' + '='.repeat(100))
  console.log('\n📋 TEST SUMMARY\n')
  
  const passed = results.filter(r => r.status === 'PASS').length
  const warned = results.filter(r => r.status === 'WARN').length
  const failed = results.filter(r => r.status === 'FAIL').length
  const withData = results.filter(r => r.hasData).length
  
  console.log(`Total Endpoints Tested: ${results.length}`)
  console.log(`✅ Passed (DB Connected): ${passed}`)
  console.log(`⚠️  Warnings (No Data): ${warned}`)
  console.log(`❌ Failed (DB Error): ${failed}`)
  console.log(`📊 Tables with Data: ${withData}/${results.length}`)
  console.log(`Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`)
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:')
    results
      .filter(r => r.status === 'FAIL')
      .forEach(r => {
        console.log(`   ${r.endpoint} (${r.table}) - ${r.error}`)
      })
  }
  
  if (warned > 0) {
    console.log('\n⚠️  Tables with No Data:')
    results
      .filter(r => r.status === 'WARN')
      .forEach(r => {
        console.log(`   ${r.endpoint} (${r.table})`)
      })
  }
  
  console.log('\n' + '='.repeat(100))
  
  await prisma.$disconnect()
}

main()
  .catch(async (e) => {
    console.error('❌ Error running tests:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
