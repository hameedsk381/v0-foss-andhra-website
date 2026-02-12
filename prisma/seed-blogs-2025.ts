import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding 2025 FOSS AI & Tech blog posts...')

  // Get or create admin user
  let admin = await prisma.admin.findFirst()
  if (!admin) {
    admin = await prisma.admin.create({
      data: {
        id: randomUUID(),
        name: 'FOSS Andhra Admin',
        email: 'admin@fossandhra.org',
        password: 'hashed_password_here',
        role: 'admin',
        updatedAt: new Date(),
      },
    })
  }

  // Create categories
  const categories = [
    { name: 'Artificial Intelligence', slug: 'artificial-intelligence', description: 'Latest in AI and ML' },
    { name: 'Agentic AI', slug: 'agentic-ai', description: 'AI agents and autonomous systems' },
    { name: 'LLMs & Foundation Models', slug: 'llms-foundation-models', description: 'Large Language Models and foundations' },
    { name: 'Self-Hosting', slug: 'self-hosting', description: 'Self-hosted FOSS solutions' },
    { name: 'Developer Tools', slug: 'developer-tools', description: 'Tools and frameworks for developers' },
    { name: 'Open Source', slug: 'open-source', description: 'FOSS news and insights' },
  ]

  const createdCategories: any = {}
  for (const cat of categories) {
    const category = await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: { ...cat },
      create: {
        id: randomUUID(),
        ...cat,
      },
    })
    createdCategories[cat.slug] = category
  }

  // Create tags
  const tags = [
    'AI', 'Agentic AI', 'LLMs', 'GPT', 'Claude', 'Llama', 'Open Source',
    'Self-Hosting', 'Agent Frameworks', 'LangChain', 'AutoGPT', 'CrewAI',
    'Vibe Coding', 'AI Coding', 'GitHub Copilot', 'Cursor', 'LocalAI',
    'Ollama', 'Docker', 'Kubernetes', 'Python', 'TypeScript', 'Machine Learning',
    'Deep Learning', 'RAG', 'Vector Databases', 'AI Ethics', 'Privacy',
    'DevOps', 'Cloud Native', 'Edge Computing', 'AI Agents'
  ]

  const createdTags: any = {}
  for (const tag of tags) {
    const slug = tag.toLowerCase().replace(/\s+/g, '-')
    const blogTag = await prisma.blogTag.upsert({
      where: { slug },
      update: { name: tag },
      create: {
        id: randomUUID(),
        name: tag,
        slug,
      },
    })
    createdTags[slug] = blogTag
  }

  // Helper function to create blog post with tags
  async function createBlogPost(postData: any) {
    const { tags: tagSlugs, ...post } = postData

    const createdPost = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: { ...post, updatedAt: new Date() },
      create: {
        id: randomUUID(),
        ...post,
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date(),
        readingTime: Math.ceil(post.content.length / 1000),
      },
    })

    // Create tag relationships
    for (const tagSlug of tagSlugs) {
      const tag = createdTags[tagSlug]
      if (tag) {
        await prisma.blogPostTag.upsert({
          where: {
            postId_tagId: {
              postId: createdPost.id,
              tagId: tag.id,
            },
          },
          update: {},
          create: {
            id: randomUUID(),
            postId: createdPost.id,
            tagId: tag.id,
          },
        })
      }
    }

    return createdPost
  }

  // Blog posts
  const posts = [
    {
      title: 'The Rise of Agentic AI: Building Autonomous Systems with Open Source in 2025',
      slug: 'rise-of-agentic-ai-2025',
      excerpt: 'Explore how agentic AI is revolutionizing software development with autonomous agents that can plan, execute, and learn from their actions using open-source frameworks.',
      content: `<h2>What is Agentic AI?</h2><p>Agentic AI represents a paradigm shift from traditional AI models to autonomous agents capable of independent decision-making, planning, and execution.</p><h2>Key Open Source Agent Frameworks</h2><ul><li><strong>LangGraph:</strong> The evolution of LangChain for building stateful, multi-agent applications</li><li><strong>AutoGPT:</strong> Autonomous AI agents that can complete complex tasks independently</li><li><strong>CrewAI:</strong> Framework for orchestrating role-playing, autonomous AI agents</li></ul><h2>Best Practices for Agentic Systems</h2><ol><li>Define clear agent roles and boundaries</li><li>Implement robust error handling and fallbacks</li><li>Use human-in-the-loop patterns for critical decisions</li></ol>`,
      categoryId: createdCategories['agentic-ai'].id,
      authorId: admin.id,
      tags: ['agentic-ai', 'ai-agents', 'langchain', 'autogpt', 'crewai', 'open-source'],
      featured: true,
    },
    {
      title: 'Self-Hosting LLMs in 2025: A Complete Guide to Running AI Models Locally',
      slug: 'self-hosting-llms-guide-2025',
      excerpt: 'Learn how to self-host powerful LLMs like Llama 3, Mixtral, and Gemma on your own infrastructure using Ollama, vLLM, and other FOSS tools.',
      content: `<h2>Why Self-Host LLMs?</h2><p>Privacy, cost control, data sovereignty, and customization are driving organizations to self-host their AI infrastructure.</p><h2>Top Open Source LLMs</h2><ul><li><strong>Llama 3.1:</strong> Meta's flagship model</li><li><strong>Mixtral 8x22B:</strong> Mistral's mixture-of-experts model</li><li><strong>Gemma 2:</strong> Google's lightweight models</li></ul><h2>Essential Tools</h2><p>Ollama makes it easy to run models locally with simple commands.</p>`,
      categoryId: createdCategories['self-hosting'].id,
      authorId: admin.id,
      tags: ['self-hosting', 'llms', 'ollama', 'llama', 'docker', 'privacy'],
      featured: true,
    },
    {
      title: 'Vibe Coding with AI in 2025: The Future of Software Development',
      slug: 'vibe-coding-ai-2025',
      excerpt: 'Discover how "vibe coding" with AI assistants is transforming development workflows.',
      content: `<h2>What is Vibe Coding?</h2><p>Vibe coding represents a new paradigm where developers work in conversation with AI assistants.</p><h2>Open Source AI Coding Tools</h2><ul><li>Continue.dev - VS Code AI assistant</li><li>Tabby - Self-hosted code completion</li><li>Aider - AI pair programming</li></ul>`,
      categoryId: createdCategories['developer-tools'].id,
      authorId: admin.id,
      tags: ['vibe-coding', 'ai-coding', 'cursor', 'ai', 'developer-tools'],
      featured: true,
    },
    {
      title: 'Building RAG Applications with Open Source Tools: A 2025 Masterclass',
      slug: 'building-rag-applications-2025',
      excerpt: 'Master Retrieval-Augmented Generation with LangChain, Chroma, Qdrant, and open-source LLMs.',
      content: `<h2>RAG Architecture</h2><p>RAG combines LLMs with external knowledge retrieval.</p><h2>Vector Databases</h2><ul><li>Qdrant - High-performance vector search</li><li>Chroma - Developer-friendly database</li><li>Milvus - Cloud-native solution</li></ul>`,
      categoryId: createdCategories['artificial-intelligence'].id,
      authorId: admin.id,
      tags: ['rag', 'vector-databases', 'langchain', 'ai', 'llms'],
    },
    {
      title: 'Agent Frameworks Compared: LangGraph vs CrewAI vs AutoGPT in 2025',
      slug: 'agent-frameworks-comparison-2025',
      excerpt: 'In-depth comparison of leading open-source agent frameworks.',
      content: `<h2>LangGraph</h2><p>Production-ready stateful workflows</p><h2>CrewAI</h2><p>Role-based agent orchestration</p><h2>AutoGPT</h2><p>Autonomous task completion</p>`,
      categoryId: createdCategories['agentic-ai'].id,
      authorId: admin.id,
      tags: ['agent-frameworks', 'langchain', 'crewai', 'autogpt', 'ai-agents'],
    },
    {
      title: 'Self-Hosting Your AI Stack: Ollama, Open WebUI, and n8n Automation',
      slug: 'self-hosting-ai-stack-2025',
      excerpt: 'Build a complete self-hosted AI infrastructure with privacy-first tools.',
      content: `<h2>The AI Stack</h2><p>Ollama + Open WebUI + n8n = Complete AI infrastructure</p><h2>Setup</h2><p>Docker-based deployment for easy management</p>`,
      categoryId: createdCategories['self-hosting'].id,
      authorId: admin.id,
      tags: ['self-hosting', 'ollama', 'docker', 'ai', 'automation'],
    },
    {
      title: 'Open Source LLM Leaderboard 2025: Performance, Benchmarks, and Recommendations',
      slug: 'open-source-llm-leaderboard-2025',
      excerpt: 'Comprehensive comparison of open-source LLMs with benchmarks and practical recommendations.',
      content: `<h2>Top Models</h2><ul><li>Llama 3.1 405B - Leading performance</li><li>Mixtral 8x22B - Best efficiency</li><li>Qwen 2.5 - Coding excellence</li></ul>`,
      categoryId: createdCategories['llms-foundation-models'].id,
      authorId: admin.id,
      tags: ['llms', 'benchmarks', 'llama', 'mixtral', 'open-source'],
      featured: true,
    },
    {
      title: 'Building Multi-Agent Systems: Architecture Patterns and Best Practices',
      slug: 'multi-agent-systems-architecture-2025',
      excerpt: 'Learn to design robust multi-agent AI systems with proven patterns.',
      content: `<h2>Design Patterns</h2><ul><li>Hierarchical</li><li>Collaborative</li><li>Sequential</li><li>Competitive</li></ul>`,
      categoryId: createdCategories['agentic-ai'].id,
      authorId: admin.id,
      tags: ['ai-agents', 'architecture', 'multi-agent', 'design-patterns'],
    },
    {
      title: 'Local AI Development Environment: VS Code, Ollama, and Continue.dev',
      slug: 'local-ai-development-environment-2025',
      excerpt: 'Set up privacy-focused AI development environment.',
      content: `<h2>Privacy-First Development</h2><p>Code with AI without cloud dependencies</p><h2>Tools</h2><ul><li>Ollama</li><li>Continue.dev</li><li>Tabby</li></ul>`,
      categoryId: createdCategories['developer-tools'].id,
      authorId: admin.id,
      tags: ['vibe-coding', 'ollama', 'ai-coding', 'privacy'],
    },
    {
      title: 'Fine-Tuning Open Source LLMs: A Practical Guide for 2025',
      slug: 'fine-tuning-llms-guide-2025',
      excerpt: 'Master LLM fine-tuning with LoRA, QLoRA, and full parameter training.',
      content: `<h2>Techniques</h2><ul><li>LoRA - Parameter-efficient</li><li>QLoRA - Memory-efficient</li><li>Full fine-tuning</li></ul>`,
      categoryId: createdCategories['llms-foundation-models'].id,
      authorId: admin.id,
      tags: ['llms', 'machine-learning', 'fine-tuning', 'ai'],
    },
    {
      title: 'AI Ethics and Open Source: Building Responsible AI Systems in 2025',
      slug: 'ai-ethics-open-source-2025',
      excerpt: 'Explore ethical considerations and best practices for open-source AI development.',
      content: `<h2>Ethical AI Principles</h2><ul><li>Transparency</li><li>Fairness</li><li>Privacy</li><li>Accountability</li></ul><h2>Open Source Advantage</h2><p>Auditable, transparent, community-driven safety</p>`,
      categoryId: createdCategories['open-source'].id,
      authorId: admin.id,
      tags: ['ai-ethics', 'open-source', 'privacy', 'ai'],
    },
    {
      title: 'Ollama Plugin Ecosystem: Extending Your Local AI Infrastructure',
      slug: 'ollama-plugin-ecosystem-2025',
      excerpt: 'Discover and build plugins to extend Ollama functionality.',
      content: `<h2>Popular Plugins</h2><ul><li>Web search integration</li><li>Code execution</li><li>Database connectors</li></ul><h2>Building Plugins</h2><p>Simple API for extending capabilities</p>`,
      categoryId: createdCategories['self-hosting'].id,
      authorId: admin.id,
      tags: ['ollama', 'self-hosting', 'plugins', 'ai'],
    },
    {
      title: 'LangChain 2025: Advanced Patterns for Production AI Applications',
      slug: 'langchain-advanced-patterns-2025',
      excerpt: 'Master advanced LangChain patterns for building production-ready AI apps.',
      content: `<h2>Advanced Patterns</h2><ul><li>Streaming responses</li><li>Memory management</li><li>Error handling</li><li>Caching strategies</li></ul>`,
      categoryId: createdCategories['artificial-intelligence'].id,
      authorId: admin.id,
      tags: ['langchain', 'ai', 'python', 'production'],
    },
    {
      title: 'Voice AI with Open Source: Whisper, Piper, and Real-Time STT',
      slug: 'voice-ai-open-source-2025',
      excerpt: 'Build voice AI applications with Whisper, Piper TTS, and streaming speech recognition.',
      content: `<h2>Voice AI Stack</h2><ul><li>Whisper - Speech-to-text</li><li>Piper - Text-to-speech</li><li>Faster Whisper - Real-time STT</li></ul>`,
      categoryId: createdCategories['artificial-intelligence'].id,
      authorId: admin.id,
      tags: ['ai', 'voice-ai', 'whisper', 'open-source'],
    },
    {
      title: 'Kubernetes for AI Workloads: Scaling LLMs and Agent Systems',
      slug: 'kubernetes-ai-workloads-2025',
      excerpt: 'Deploy and scale AI workloads on Kubernetes with GPU support.',
      content: `<h2>K8s for AI</h2><ul><li>GPU scheduling</li><li>Model serving</li><li>Auto-scaling</li><li>Cost optimization</li></ul>`,
      categoryId: createdCategories['self-hosting'].id,
      authorId: admin.id,
      tags: ['kubernetes', 'devops', 'ai', 'cloud-native'],
    },
    {
      title: 'Edge AI in 2025: Running LLMs on Raspberry Pi and Edge Devices',
      slug: 'edge-ai-llms-2025',
      excerpt: 'Deploy quantized LLMs on edge devices for offline AI applications.',
      content: `<h2>Edge Deployment</h2><ul><li>Quantized models (2-4 bit)</li><li>Raspberry Pi 5</li><li>Jetson devices</li><li>Mobile deployment</li></ul>`,
      categoryId: createdCategories['artificial-intelligence'].id,
      authorId: admin.id,
      tags: ['edge-computing', 'ai', 'llms', 'iot'],
    },
    {
      title: 'Vector Database Deep Dive: Qdrant, Milvus, and Weaviate Compared',
      slug: 'vector-database-comparison-2025',
      excerpt: 'Comprehensive comparison of leading open-source vector databases.',
      content: `<h2>Vector DB Comparison</h2><table><tr><th>Database</th><th>Performance</th><th>Features</th></tr><tr><td>Qdrant</td><td>Excellent</td><td>Rust-based</td></tr><tr><td>Milvus</td><td>Great</td><td>Scalable</td></tr></table>`,
      categoryId: createdCategories['artificial-intelligence'].id,
      authorId: admin.id,
      tags: ['vector-databases', 'rag', 'ai', 'databases'],
    },
    {
      title: 'AI-Powered DevOps: Automating Infrastructure with LLM Agents',
      slug: 'ai-powered-devops-2025',
      excerpt: 'Use AI agents to automate DevOps tasks, infrastructure management, and incident response.',
      content: `<h2>AI in DevOps</h2><ul><li>Automated troubleshooting</li><li>Infrastructure as code generation</li><li>Log analysis</li><li>Incident response</li></ul>`,
      categoryId: createdCategories['agentic-ai'].id,
      authorId: admin.id,
      tags: ['devops', 'ai-agents', 'automation', 'ai'],
    },
    {
      title: 'Privacy-First AI: Self-Hosting vs Cloud APIs in 2025',
      slug: 'privacy-first-ai-comparison-2025',
      excerpt: 'Compare privacy, cost, and performance of self-hosted AI vs cloud APIs.',
      content: `<h2>Privacy Comparison</h2><p>Self-hosted: Complete data control, zero cloud dependency</p><p>Cloud APIs: Convenience vs privacy trade-offs</p><h2>Cost Analysis</h2><p>Break-even at ~1M tokens/month</p>`,
      categoryId: createdCategories['self-hosting'].id,
      authorId: admin.id,
      tags: ['privacy', 'self-hosting', 'ai', 'cloud'],
    },
    {
      title: 'Building AI Coding Assistants: From Autocomplete to Refactoring',
      slug: 'building-ai-coding-assistants-2025',
      excerpt: 'Learn to build your own AI coding assistant with autocomplete, chat, and refactoring capabilities.',
      content: `<h2>Components</h2><ul><li>Autocomplete engine</li><li>Chat interface</li><li>Code analysis</li><li>Refactoring tools</li></ul><h2>Technologies</h2><p>CodeLlama, Tree-sitter, LSP</p>`,
      categoryId: createdCategories['developer-tools'].id,
      authorId: admin.id,
      tags: ['ai-coding', 'vibe-coding', 'developer-tools', 'llms'],
    },
    {
      title: 'The State of Open Source AI in 2025: Trends, Predictions, and Opportunities',
      slug: 'state-of-open-source-ai-2025',
      excerpt: 'Comprehensive analysis of the open-source AI ecosystem, emerging trends, and future predictions.',
      content: `<h2>2025 Trends</h2><ul><li>Agentic AI mainstream adoption</li><li>Self-hosting movement growth</li><li>Multi-modal models</li><li>Edge AI deployment</li></ul><h2>Predictions</h2><p>Open models will match or exceed proprietary alternatives in most domains by end of 2025</p>`,
      categoryId: createdCategories['open-source'].id,
      authorId: admin.id,
      tags: ['open-source', 'ai', 'trends', 'llms'],
      featured: true,
    },
  ]

  // Create all blog posts
  for (const post of posts) {
    await createBlogPost(post)
    console.log(`✅ Created: ${post.title}`)
  }

  console.log('\n🎉 Successfully seeded 20 blog posts about FOSS, AI, Agentic AI, LLMs, and Self-Hosting!')
  console.log('📊 Categories created: 6')
  console.log('🏷️  Tags created: 30+')
  console.log('📝 Blog posts: 20')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
