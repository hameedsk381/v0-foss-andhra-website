
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("🌱 Seeding AI Trend blog posts...")

    // Get admin user
    const admin = await prisma.admin.findFirst()
    if (!admin) {
        console.error("❌ Admin user not found. Please run the main seed script first.")
        return
    }

    // Ensure 'Artificial Intelligence' category exists
    const aiCategory = await prisma.blogCategory.upsert({
        where: { slug: "artificial-intelligence" },
        update: {},
        create: {
            name: "Artificial Intelligence",
            slug: "artificial-intelligence",
            description: "The latest in Open Source AI, LLMs, and Machine Learning",
        },
    })

    // Ensure relevant tags exist
    const tags = await Promise.all([
        prisma.blogTag.upsert({ where: { slug: "llm" }, update: {}, create: { name: "LLM", slug: "llm" } }),
        prisma.blogTag.upsert({ where: { slug: "generative-ai" }, update: {}, create: { name: "Generative AI", slug: "generative-ai" } }),
        prisma.blogTag.upsert({ where: { slug: "future" }, update: {}, create: { name: "Future Tech", slug: "future" } }),
        prisma.blogTag.upsert({ where: { slug: "tutorial" }, update: {}, create: { name: "Tutorial", slug: "tutorial" } }),
    ])

    const tagIds = {
        llm: tags[0].id,
        genAi: tags[1].id,
        future: tags[2].id,
        tutorial: tags[3].id,
    }

    const blogPosts = [
        {
            title: "Running LLMs Locally: The Ultimate Guide to Ollama and Llama 3",
            slug: "running-llms-locally-ollama-llama-3-guide",
            excerpt: "Stop paying for API credits. Learn how to run powerful open-source Large Language Models like Llama 3 directly on your laptop using Ollama.",
            content: `
        <h2>Why Run LLMs Locally?</h2>
        <p>The democratization of AI is here. With the release of efficient open-weights models like Meta's <strong>Llama 3</strong> and Mistral, developers no longer rely solely on closed APIs like OpenAI's GPT-4. Running LLMs locally offers:</p>
        <ul>
            <li><strong>Privacy:</strong> Your data never leaves your machine. Perfect for sensitive documents.</li>
            <li><strong>Cost:</strong> No per-token API fees. Run it as much as you want.</li>
            <li><strong>Offline Access:</strong> Code and write without an internet connection.</li>
            <li><strong>Customization:</strong> Fine-tune or tweak system prompts without restrictions.</li>
        </ul>

        <h2>Enter Ollama: The Docker for LLMs</h2>
        <p><a href="https://ollama.com" target="_blank" rel="noopener noreferrer">Ollama</a> has revolutionized local AI. It simplifies the complex process of model quantization and inference into a single CLI tool.</p>

        <h3>Getting Started</h3>
        <p>First, download Ollama for your OS (Windows, macOS, or Linux). Once installed, open your terminal:</p>
        <pre><code class="language-bash">ollama run llama3</code></pre>
        <p>That's it. Ollama will automatically pull the multi-gigabyte model file and drop you into a chat prompt.</p>

        <h3>Benchmarks & Performance</h3>
        <p>On a standard MacBook Pro (M2/M3) or a PC with an NVIDIA RTX 3060+, Llama 3 (8B parameter) runs surprisingly fast, often exceeding reading speed. For coding tasks, it rivals GPT-3.5 in accuracy.</p>

        <h2>Integrating with Your Workflow</h2>
        <p>You can connect Ollama to tools like VS Code using the <strong>Continue</strong> extension, giving you a free, private GitHub Copilot alternative.</p>
        
        <p><em>Start experimenting with local AI today and take back control of your data!</em></p>
      `,
            categoryId: aiCategory.id,
            authorId: admin.id,
            status: "published",
            featured: true,
            metaDescription: "Learn how to run Llama 3 and other LLMs locally using Ollama. A step-by-step guide to private, offline, and free AI on your own computer.",
            metaKeywords: "Ollama, Llama 3, Local LLM, Open Source AI, AI Privacy, Mistral",
            ogTitle: "How to Run Llama 3 Locally with Ollama",
            ogDescription: "A comprehensive guide to running open source LLMs on your own hardware.",
            focusKeyword: "Local LLM Ollama",
            readingTime: 6,
            publishedAt: new Date(), // Current date
            tags: [tagIds.llm, tagIds.genAi, tagIds.tutorial],
        },
        {
            title: "The Rise of Open Source AI Agents: Beyond Simple Chatbots",
            slug: "rise-of-open-source-ai-agents",
            excerpt: "Chatbots are so 2023. The future is autonomous AI agents that can plan, execute, and complete complex tasks. Discover the open source frameworks leading the charge.",
            content: `
        <h2>What are AI Agents?</h2>
        <p>While a chatbot waits for you to ask a question, an <strong>AI Agent</strong> is given a goal and figures out how to achieve it. It can:</p>
        <ul>
            <li>Browse the web for information</li>
            <li>Read and write files</li>
            <li>Execute code</li>
            <li>Use other software tools</li>
        </ul>

        <h2>Top Open Source Frameworks</h2>
        
        <h3>1. LangChain & LangGraph</h3>
        <p>The industry standard for building LLM applications. LangGraph now allows developers to build stateful, multi-agent workflows that are cyclically robust.</p>

        <h3>2. CrewAI</h3>
        <p>CrewAI orchestrates role-playing autonomous AI agents. You can define a "Researcher" agent, a "Writer" agent, and a "Manager" agent, and watch them collaborate to write a blog post or generate a report.</p>

        <h3>3. AutoGPT</h3>
        <p>One of the first viral agent projects, AutoGPT aims to be a fully autonomous internet-connected agent. While still experimental, it showcases the raw potential of agentic workflows.</p>

        <h2>The Future of Work?</h2>
        <p>Imagine assigning a "Junior Developer" agent to fix minor bugs in your repo overnight, or a "Marketing" agent to draft daily tweets. With open source models getting smarter, this future is rapidly approaching.</p>
        
        <h3>Join the Revolution</h3>
        <p>FOSS Andhra is organizing a Hackathon on building AI Agents next month. Stay tuned to our Events page!</p>
      `,
            categoryId: aiCategory.id,
            authorId: admin.id,
            status: "published",
            featured: false,
            metaDescription: "Discover the world of autonomous AI agents. Explore open source frameworks like LangChain, CrewAI, and AutoGPT that are shaping the future of automation.",
            metaKeywords: "AI Agents, LangChain, CrewAI, AutoGPT, Autonomous AI, Open Source Trends",
            ogTitle: "The Rise of Open Source AI Agents",
            ogDescription: "Why autonomous agents are the next big thing in open source AI.",
            focusKeyword: "Open Source AI Agents",
            readingTime: 8,
            publishedAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
            tags: [tagIds.genAi, tagIds.future],
        },
        {
            title: "Open Source vs. Closed AI: The Battle for Digital Sovereignty",
            slug: "open-source-vs-closed-ai-sovereignty",
            excerpt: "Why the license of your AI model matters. A deep dive into the importance of open weights, data privacy, and the definitions of 'Open Source AI'.",
            content: `
        <h2>The Definition Problem</h2>
        <p>What makes an AI "Open Source"? Is it just the code? The weights? The training data? Organizations like the <strong>Open Source Initiative (OSI)</strong> are working hard to define this standard.</p>

        <h2>Why Open Source AI Matters</h2>
        
        <h3>1. Preventing Monopolies</h3>
        <p>If only a few tech giants control the most powerful models, they control the future of intelligence. Open source models like Llama, Falcon, and Bloom ensure that this power is distributed.</p>

        <h3>2. Transparency & Safety</h3>
        <p>You cannot inspect a black box. Open models allow researchers to audit for bias, safety flaws, and security vulnerabilities. This transparency is crucial for deploying AI in critical sectors like healthcare and governance.</p>

        <h3>3. Innovation Rate</h3>
        <p>The open-source community moves faster than any single company. Techniques like <em>LoRA (Low-Rank Adaptation)</em> and <em>Quantization</em> were largely popularized by the community hacking on open models.</p>

        <h2>The Verdict</h2>
        <p>While closed models like GPT-4 currently hold the crown for raw reasoning, the gap is closing. For businesses and governments in places like Andhra Pradesh, investing in Open Source AI is an investment in digital independence.</p>
      `,
            categoryId: aiCategory.id,
            authorId: admin.id,
            status: "published",
            featured: false,
            metaDescription: "Understand the critical differences between Open Source and Closed AI. Why open weights and training data are essential for digital sovereignty and innovation.",
            metaKeywords: "Open Source AI, Digital Sovereignty, AI Ethics, Open Weights, OSI",
            ogTitle: "Open Source vs. Closed AI: Why It Matters",
            ogDescription: "The battle for the future of AI: Open Source vs. Closed Gardens.",
            focusKeyword: "Open Source AI Sovereignty",
            readingTime: 5,
            publishedAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
            tags: [tagIds.future, tagIds.llm],
        }
    ]

    for (const postData of blogPosts) {
        const { tags: postTags, ...postInfo } = postData

        console.log(`Creating post: ${postInfo.title}`)

        const post = await prisma.blogPost.upsert({
            where: { slug: postInfo.slug },
            update: postInfo,
            create: postInfo,
        })

        // Create tag associations
        for (const tagId of postTags) {
            await prisma.blogPostTag.upsert({
                where: {
                    postId_tagId: {
                        postId: post.id,
                        tagId: tagId,
                    },
                },
                update: {},
                create: {
                    postId: post.id,
                    tagId: tagId,
                },
            })
        }
    }

    console.log("✅ Successfully seeded AI Trend blog posts!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
