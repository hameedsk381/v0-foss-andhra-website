import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding blog posts about FOSS...")

  // Get or create admin user
  let admin = await prisma.admin.findFirst()
  if (!admin) {
    admin = await prisma.admin.create({
      data: {
        name: "FOSS Andhra Admin",
        email: "admin@fossandhra.org",
        password: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDzqgqw9XDpnDGfPdYjNlJBMF9S6", // "password123"
        role: "admin",
      },
    })
  }

  // Create categories
  const categories = await Promise.all([
    prisma.blogCategory.upsert({
      where: { slug: "open-source" },
      update: {},
      create: {
        name: "Open Source",
        slug: "open-source",
        description: "Articles about open source software and communities",
      },
    }),
    prisma.blogCategory.upsert({
      where: { slug: "linux" },
      update: {},
      create: {
        name: "Linux",
        slug: "linux",
        description: "Everything about Linux distributions and ecosystem",
      },
    }),
    prisma.blogCategory.upsert({
      where: { slug: "development" },
      update: {},
      create: {
        name: "Development",
        slug: "development",
        description: "Software development with open source tools",
      },
    }),
    prisma.blogCategory.upsert({
      where: { slug: "community" },
      update: {},
      create: {
        name: "Community",
        slug: "community",
        description: "FOSS community news and events",
      },
    }),
  ])

  // Create tags
  const tags = await Promise.all([
    prisma.blogTag.upsert({
      where: { slug: "foss" },
      update: {},
      create: { name: "FOSS", slug: "foss" },
    }),
    prisma.blogTag.upsert({
      where: { slug: "linux" },
      update: {},
      create: { name: "Linux", slug: "linux" },
    }),
    prisma.blogTag.upsert({
      where: { slug: "beginner" },
      update: {},
      create: { name: "Beginner", slug: "beginner" },
    }),
    prisma.blogTag.upsert({
      where: { slug: "tutorial" },
      update: {},
      create: { name: "Tutorial", slug: "tutorial" },
    }),
    prisma.blogTag.upsert({
      where: { slug: "community" },
      update: {},
      create: { name: "Community", slug: "community" },
    }),
    prisma.blogTag.upsert({
      where: { slug: "python" },
      update: {},
      create: { name: "Python", slug: "python" },
    }),
    prisma.blogTag.upsert({
      where: { slug: "javascript" },
      update: {},
      create: { name: "JavaScript", slug: "javascript" },
    }),
  ])

  // Blog posts data
  const blogPosts = [
    {
      title: "Getting Started with Free and Open Source Software",
      slug: "getting-started-with-foss",
      excerpt: "A comprehensive guide for beginners to understand and embrace the world of Free and Open Source Software (FOSS).",
      content: `<h2>What is FOSS?</h2>
<p>Free and Open Source Software (FOSS) represents software that is freely licensed to grant users the right to use, study, change, and distribute the software and its source code to anyone and for any purpose.</p>

<h3>The Four Essential Freedoms</h3>
<p>FOSS is built on four fundamental freedoms:</p>
<ul>
  <li><strong>Freedom 0:</strong> The freedom to run the program as you wish, for any purpose</li>
  <li><strong>Freedom 1:</strong> The freedom to study how the program works and change it</li>
  <li><strong>Freedom 2:</strong> The freedom to redistribute copies</li>
  <li><strong>Freedom 3:</strong> The freedom to distribute copies of your modified versions</li>
</ul>

<h3>Why Choose FOSS?</h3>
<p>Open source software offers numerous advantages:</p>
<ul>
  <li><strong>Cost-effective:</strong> Most FOSS is available at no cost</li>
  <li><strong>Security:</strong> With thousands of eyes reviewing code, vulnerabilities are found and fixed quickly</li>
  <li><strong>Flexibility:</strong> Customize software to meet your specific needs</li>
  <li><strong>Community:</strong> Join a global community of developers and users</li>
  <li><strong>No Vendor Lock-in:</strong> Freedom to switch or modify tools as needed</li>
</ul>

<h3>Popular FOSS Applications</h3>
<p>Start your FOSS journey with these popular applications:</p>
<ul>
  <li><strong>Firefox:</strong> Fast, privacy-focused web browser</li>
  <li><strong>LibreOffice:</strong> Complete office suite alternative to Microsoft Office</li>
  <li><strong>GIMP:</strong> Powerful image editing software</li>
  <li><strong>VLC Media Player:</strong> Plays virtually any media format</li>
  <li><strong>Audacity:</strong> Audio recording and editing software</li>
</ul>

<h3>Getting Involved</h3>
<p>Contributing to FOSS doesn't always mean coding. You can:</p>
<ul>
  <li>Report bugs and suggest features</li>
  <li>Write or improve documentation</li>
  <li>Design graphics and UI elements</li>
  <li>Translate software to other languages</li>
  <li>Help other users in forums and chat rooms</li>
</ul>

<p>Join FOSS Andhra to connect with like-minded individuals and contribute to the open source ecosystem!</p>`,
      categoryId: categories[0].id,
      authorId: admin.id,
      status: "published",
      featured: true,
      metaDescription: "Learn everything about Free and Open Source Software (FOSS). Discover the four essential freedoms, benefits, popular applications, and how to get involved.",
      metaKeywords: "FOSS, open source, free software, Linux, beginners guide",
      ogTitle: "Complete Beginner's Guide to FOSS",
      ogDescription: "Discover the world of Free and Open Source Software with this comprehensive guide for beginners.",
      focusKeyword: "FOSS beginner guide",
      readingTime: 5,
      publishedAt: new Date("2024-01-15"),
      tags: [tags[0].id, tags[2].id, tags[4].id],
    },
    {
      title: "Top 10 Linux Distributions for Developers in 2024",
      slug: "top-10-linux-distros-developers-2024",
      excerpt: "Explore the best Linux distributions tailored for software development, from beginner-friendly to advanced developer workstations.",
      content: `<h2>Why Linux for Development?</h2>
<p>Linux has become the operating system of choice for developers worldwide. Its open-source nature, powerful command-line tools, and extensive package repositories make it ideal for software development.</p>

<h3>1. Ubuntu</h3>
<p><strong>Best for:</strong> Beginners and general development</p>
<p>Ubuntu remains the most popular Linux distribution, offering excellent hardware support, a vast software repository, and long-term support (LTS) releases. Perfect for web development, Python programming, and containerization with Docker.</p>

<h3>2. Fedora Workstation</h3>
<p><strong>Best for:</strong> Cutting-edge development</p>
<p>Fedora delivers the latest software packages and technologies. It's sponsored by Red Hat and serves as a testing ground for RHEL features. Excellent for system programming and DevOps.</p>

<h3>3. Arch Linux</h3>
<p><strong>Best for:</strong> Advanced users who want control</p>
<p>Arch Linux follows a rolling release model and provides complete control over your system. The Arch User Repository (AUR) offers access to thousands of packages. Perfect for learning Linux internals.</p>

<h3>4. Pop!_OS</h3>
<p><strong>Best for:</strong> AI/ML developers</p>
<p>Developed by System76, Pop!_OS comes with excellent NVIDIA GPU support out of the box. Ideal for machine learning, data science, and CUDA development.</p>

<h3>5. Manjaro</h3>
<p><strong>Best for:</strong> Arch experience without the complexity</p>
<p>Manjaro provides an Arch-based system with easier installation and better hardware support. Great balance between cutting-edge and stability.</p>

<h3>6. Debian</h3>
<p><strong>Best for:</strong> Server development and stability</p>
<p>Known for its rock-solid stability, Debian is perfect for backend development and server applications. The foundation for Ubuntu and many other distributions.</p>

<h3>7. openSUSE Tumbleweed</h3>
<p><strong>Best for:</strong> Enterprise development</p>
<p>A rolling release with excellent tools like YaST for system configuration. Strong integration with enterprise tools and containers.</p>

<h3>8. Linux Mint</h3>
<p><strong>Best for:</strong> Windows developers transitioning to Linux</p>
<p>User-friendly interface similar to Windows, based on Ubuntu. Excellent for web development and general programming.</p>

<h3>9. Kali Linux</h3>
<p><strong>Best for:</strong> Security researchers and penetration testing</p>
<p>Packed with security and penetration testing tools. Essential for cybersecurity professionals and ethical hackers.</p>

<h3>10. NixOS</h3>
<p><strong>Best for:</strong> Reproducible development environments</p>
<p>Revolutionary approach to package management. Perfect for DevOps and ensuring reproducible builds.</p>

<h3>Choosing Your Distribution</h3>
<p>Consider these factors:</p>
<ul>
  <li>Your experience level with Linux</li>
  <li>Type of development you'll be doing</li>
  <li>Hardware compatibility requirements</li>
  <li>Preference for stability vs. cutting-edge features</li>
  <li>Community and documentation availability</li>
</ul>

<p>Visit FOSS Andhra's events page to join our Linux installation workshops!</p>`,
      categoryId: categories[1].id,
      authorId: admin.id,
      status: "published",
      featured: true,
      metaDescription: "Discover the top 10 Linux distributions for developers in 2024. From Ubuntu to NixOS, find the perfect Linux distro for your development needs.",
      metaKeywords: "Linux, distributions, developers, Ubuntu, Fedora, Arch, programming",
      ogTitle: "Best Linux Distributions for Developers - 2024 Guide",
      ogDescription: "Compare the top Linux distros for software development and find your perfect match.",
      focusKeyword: "Linux distributions developers",
      readingTime: 8,
      publishedAt: new Date("2024-02-01"),
      tags: [tags[1].id, tags[2].id],
    },
    {
      title: "Building Your First Open Source Project: A Step-by-Step Guide",
      slug: "building-first-open-source-project",
      excerpt: "Learn how to create, publish, and maintain your first open source project. From choosing a license to managing contributions.",
      content: `<h2>Starting Your Open Source Journey</h2>
<p>Creating your first open source project can be intimidating, but it's one of the best ways to learn, contribute to the community, and build your portfolio.</p>

<h3>Step 1: Choose a Problem to Solve</h3>
<p>The best projects solve real problems. Consider:</p>
<ul>
  <li>Pain points you've experienced while coding</li>
  <li>Tools that could improve your workflow</li>
  <li>Improvements to existing open source projects</li>
  <li>Educational projects that help others learn</li>
</ul>

<h3>Step 2: Select the Right License</h3>
<p>Choosing a license is crucial for open source projects:</p>
<ul>
  <li><strong>MIT License:</strong> Very permissive, allows commercial use</li>
  <li><strong>GPL (GNU General Public License):</strong> Copyleft license requiring derivatives to be open source</li>
  <li><strong>Apache 2.0:</strong> Similar to MIT with explicit patent grants</li>
  <li><strong>BSD:</strong> Simple and permissive like MIT</li>
</ul>

<h3>Step 3: Set Up Your Repository</h3>
<p>Create a professional repository structure:</p>
<pre><code>your-project/
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── .gitignore
├── src/
├── tests/
└── docs/</code></pre>

<h3>Step 4: Write Excellent Documentation</h3>
<p>Your README.md should include:</p>
<ul>
  <li>Project description and purpose</li>
  <li>Installation instructions</li>
  <li>Usage examples</li>
  <li>API documentation</li>
  <li>Contributing guidelines</li>
  <li>License information</li>
</ul>

<h3>Step 5: Write Quality Code</h3>
<p>Best practices for open source code:</p>
<ul>
  <li>Follow coding standards for your language</li>
  <li>Write comprehensive tests (aim for 80%+ coverage)</li>
  <li>Add meaningful comments</li>
  <li>Use clear variable and function names</li>
  <li>Keep functions small and focused</li>
</ul>

<h3>Step 6: Set Up CI/CD</h3>
<p>Implement continuous integration:</p>
<ul>
  <li>GitHub Actions for automated testing</li>
  <li>Code quality checks (linting, formatting)</li>
  <li>Automated releases</li>
  <li>Documentation generation</li>
</ul>

<h3>Step 7: Promote Your Project</h3>
<p>Get your project noticed:</p>
<ul>
  <li>Share on Reddit (r/opensource, language-specific subreddits)</li>
  <li>Post on Hacker News and Product Hunt</li>
  <li>Write blog posts about your project</li>
  <li>Present at local meetups (like FOSS Andhra events!)</li>
  <li>Engage on Twitter and LinkedIn</li>
</ul>

<h3>Step 8: Manage Contributions</h3>
<p>Welcome and manage contributors:</p>
<ul>
  <li>Respond to issues promptly</li>
  <li>Review pull requests constructively</li>
  <li>Acknowledge all contributions</li>
  <li>Create "good first issue" labels for newcomers</li>
  <li>Maintain a CODE_OF_CONDUCT.md</li>
</ul>

<h3>Step 9: Maintain and Iterate</h3>
<p>Keep your project healthy:</p>
<ul>
  <li>Regular releases with semantic versioning</li>
  <li>Keep dependencies updated</li>
  <li>Address security vulnerabilities promptly</li>
  <li>Maintain a changelog</li>
  <li>Listen to community feedback</li>
</ul>

<p>Join FOSS Andhra to connect with mentors and collaborate on open source projects!</p>`,
      categoryId: categories[2].id,
      authorId: admin.id,
      status: "published",
      featured: false,
      metaDescription: "Complete guide to creating your first open source project. Learn about licensing, documentation, CI/CD, and managing contributions effectively.",
      metaKeywords: "open source, GitHub, programming, project management, contribution guide",
      ogTitle: "How to Build Your First Open Source Project",
      ogDescription: "Step-by-step guide to creating, publishing, and maintaining an open source project.",
      focusKeyword: "open source project guide",
      readingTime: 10,
      publishedAt: new Date("2024-02-15"),
      tags: [tags[0].id, tags[3].id, tags[2].id],
    },
    {
      title: "Python for FOSS: Essential Libraries Every Developer Should Know",
      slug: "python-foss-essential-libraries",
      excerpt: "Discover the most powerful open source Python libraries that will supercharge your development workflow and projects.",
      content: `<h2>Why Python Dominates FOSS</h2>
<p>Python has become one of the most popular languages in the open source community, thanks to its simplicity, readability, and vast ecosystem of libraries.</p>

<h3>Web Development</h3>
<p><strong>Django</strong> - The web framework for perfectionists with deadlines</p>
<ul>
  <li>Full-featured MVC framework</li>
  <li>Built-in admin interface</li>
  <li>ORM for database interactions</li>
  <li>Excellent security features</li>
</ul>

<p><strong>Flask</strong> - Lightweight and flexible</p>
<ul>
  <li>Micro-framework for web applications</li>
  <li>Easy to learn and extend</li>
  <li>Perfect for APIs and microservices</li>
  <li>Large ecosystem of extensions</li>
</ul>

<p><strong>FastAPI</strong> - Modern, fast web framework</p>
<ul>
  <li>Based on type hints</li>
  <li>Automatic API documentation</li>
  <li>High performance (comparable to Node.js)</li>
  <li>Built-in data validation</li>
</ul>

<h3>Data Science & Machine Learning</h3>
<p><strong>NumPy</strong> - Fundamental package for scientific computing</p>
<ul>
  <li>Powerful N-dimensional arrays</li>
  <li>Linear algebra functions</li>
  <li>Foundation for other libraries</li>
</ul>

<p><strong>Pandas</strong> - Data manipulation and analysis</p>
<ul>
  <li>DataFrame structures for data analysis</li>
  <li>Time series functionality</li>
  <li>Easy data cleaning and preparation</li>
</ul>

<p><strong>Scikit-learn</strong> - Machine learning made easy</p>
<ul>
  <li>Classification, regression, clustering algorithms</li>
  <li>Model selection and evaluation</li>
  <li>Preprocessing tools</li>
</ul>

<p><strong>TensorFlow & PyTorch</strong> - Deep learning frameworks</p>
<ul>
  <li>Neural network development</li>
  <li>GPU acceleration</li>
  <li>Production deployment tools</li>
</ul>

<h3>DevOps & Automation</h3>
<p><strong>Ansible</strong> - IT automation platform</p>
<ul>
  <li>Configuration management</li>
  <li>Application deployment</li>
  <li>Agentless architecture</li>
</ul>

<p><strong>Fabric</strong> - Streamlining SSH for deployment</p>
<ul>
  <li>Remote server management</li>
  <li>Automated deployments</li>
  <li>Task execution</li>
</ul>

<h3>Testing</h3>
<p><strong>pytest</strong> - Powerful testing framework</p>
<ul>
  <li>Simple syntax</li>
  <li>Extensive plugin ecosystem</li>
  <li>Fixtures for setup/teardown</li>
</ul>

<p><strong>unittest</strong> - Built-in testing framework</p>
<ul>
  <li>Part of Python standard library</li>
  <li>xUnit-style testing</li>
  <li>Test discovery</li>
</ul>

<h3>Utilities & Tools</h3>
<p><strong>Requests</strong> - HTTP for humans</p>
<ul>
  <li>Elegant API for HTTP requests</li>
  <li>Session management</li>
  <li>Authentication support</li>
</ul>

<p><strong>Beautiful Soup</strong> - Web scraping</p>
<ul>
  <li>Parse HTML and XML</li>
  <li>Navigate parse trees</li>
  <li>Extract data from websites</li>
</ul>

<p><strong>Click</strong> - Command-line interfaces</p>
<ul>
  <li>Easy CLI creation</li>
  <li>Argument parsing</li>
  <li>Nested commands</li>
</ul>

<h3>Getting Started</h3>
<p>Install these libraries using pip:</p>
<pre><code>pip install django flask fastapi
pip install numpy pandas scikit-learn
pip install pytest requests beautifulsoup4</code></pre>

<p>Attend FOSS Andhra's Python workshops to learn how to use these libraries effectively!</p>`,
      categoryId: categories[2].id,
      authorId: admin.id,
      status: "published",
      featured: false,
      metaDescription: "Explore essential open source Python libraries for web development, data science, machine learning, DevOps, and automation. Complete guide with examples.",
      metaKeywords: "Python, libraries, Django, Flask, NumPy, Pandas, machine learning, web development",
      ogTitle: "Essential Python Libraries for FOSS Developers",
      ogDescription: "Comprehensive guide to the most important open source Python libraries every developer should know.",
      focusKeyword: "Python FOSS libraries",
      readingTime: 7,
      publishedAt: new Date("2024-03-01"),
      tags: [tags[5].id, tags[0].id, tags[3].id],
    },
    {
      title: "The Complete Guide to Contributing to Open Source on GitHub",
      slug: "contributing-open-source-github-guide",
      excerpt: "Master the art of contributing to open source projects on GitHub. Learn Git workflows, pull requests, and community best practices.",
      content: `<h2>Why Contribute to Open Source?</h2>
<p>Contributing to open source projects is one of the best ways to:</p>
<ul>
  <li>Improve your coding skills</li>
  <li>Build a public portfolio</li>
  <li>Network with experienced developers</li>
  <li>Give back to the community</li>
  <li>Learn industry best practices</li>
</ul>

<h3>Understanding Git and GitHub</h3>
<p><strong>Git</strong> is a distributed version control system, while <strong>GitHub</strong> is a platform for hosting Git repositories and collaborating.</p>

<h4>Essential Git Commands</h4>
<pre><code># Clone a repository
git clone https://github.com/username/repo.git

# Create a new branch
git checkout -b feature-name

# Stage changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push origin feature-name

# Pull latest changes
git pull origin main</code></pre>

<h3>Finding Projects to Contribute To</h3>
<p>Start with these resources:</p>
<ul>
  <li><strong>GitHub Explore:</strong> Discover trending repositories</li>
  <li><strong>Good First Issue:</strong> Find beginner-friendly issues</li>
  <li><strong>Up For Grabs:</strong> Projects actively seeking contributors</li>
  <li><strong>First Timers Only:</strong> Issues specifically for newcomers</li>
  <li><strong>CodeTriage:</strong> Get issues delivered to your inbox</li>
</ul>

<h3>The Contribution Workflow</h3>

<h4>1. Fork the Repository</h4>
<p>Click the "Fork" button on the project's GitHub page to create your own copy.</p>

<h4>2. Clone Your Fork</h4>
<pre><code>git clone https://github.com/YOUR-USERNAME/project.git
cd project
git remote add upstream https://github.com/ORIGINAL-OWNER/project.git</code></pre>

<h4>3. Create a Feature Branch</h4>
<pre><code>git checkout -b fix-issue-123</code></pre>

<h4>4. Make Your Changes</h4>
<ul>
  <li>Follow the project's coding style</li>
  <li>Write or update tests</li>
  <li>Update documentation if needed</li>
  <li>Keep commits atomic and well-described</li>
</ul>

<h4>5. Test Your Changes</h4>
<pre><code># Run tests
npm test  # or pytest, cargo test, etc.

# Check code style
npm run lint</code></pre>

<h4>6. Commit Your Changes</h4>
<pre><code>git add .
git commit -m "Fix: Resolve issue #123 - Add validation"</code></pre>

<h4>7. Keep Your Fork Updated</h4>
<pre><code>git fetch upstream
git rebase upstream/main</code></pre>

<h4>8. Push to Your Fork</h4>
<pre><code>git push origin fix-issue-123</code></pre>

<h4>9. Create a Pull Request</h4>
<ul>
  <li>Go to your fork on GitHub</li>
  <li>Click "Compare & pull request"</li>
  <li>Write a clear description of your changes</li>
  <li>Reference any related issues</li>
  <li>Be patient and responsive to feedback</li>
</ul>

<h3>Writing Great Commit Messages</h3>
<p>Follow these conventions:</p>
<pre><code>Type: Short summary (50 characters max)

Longer explanation if needed. Wrap at 72 characters.
Explain what and why, not how.

- Bullet points are okay
- Use imperative mood: "Fix bug" not "Fixed bug"

Fixes #123</code></pre>

<h4>Commit Types:</h4>
<ul>
  <li><strong>feat:</strong> New feature</li>
  <li><strong>fix:</strong> Bug fix</li>
  <li><strong>docs:</strong> Documentation changes</li>
  <li><strong>style:</strong> Code style changes (formatting)</li>
  <li><strong>refactor:</strong> Code refactoring</li>
  <li><strong>test:</strong> Adding or updating tests</li>
  <li><strong>chore:</strong> Maintenance tasks</li>
</ul>

<h3>Pull Request Best Practices</h3>
<ul>
  <li><strong>Small PRs:</strong> Focus on one issue or feature</li>
  <li><strong>Clear Title:</strong> Describe what the PR does</li>
  <li><strong>Detailed Description:</strong> Explain the problem and solution</li>
  <li><strong>Screenshots:</strong> Include for UI changes</li>
  <li><strong>Tests:</strong> Add or update tests for your changes</li>
  <li><strong>Documentation:</strong> Update docs if needed</li>
  <li><strong>Responsive:</strong> Address reviewer feedback promptly</li>
</ul>

<h3>Handling Code Reviews</h3>
<p>When you receive feedback:</p>
<ul>
  <li>Don't take criticism personally</li>
  <li>Ask questions if something is unclear</li>
  <li>Make requested changes thoughtfully</li>
  <li>Push updates to the same branch</li>
  <li>Thank reviewers for their time</li>
</ul>

<h3>Non-Code Contributions</h3>
<p>You can contribute without coding:</p>
<ul>
  <li>Improve documentation</li>
  <li>Report bugs with detailed information</li>
  <li>Triage and reproduce issues</li>
  <li>Review pull requests</li>
  <li>Translate documentation</li>
  <li>Create tutorials and examples</li>
  <li>Design logos and graphics</li>
</ul>

<h3>Common Pitfalls to Avoid</h3>
<ul>
  <li>Not reading CONTRIBUTING.md guidelines</li>
  <li>Making large, unfocused PRs</li>
  <li>Ignoring code style requirements</li>
  <li>Not testing changes before submitting</li>
  <li>Being defensive about feedback</li>
  <li>Abandoning PRs without communication</li>
</ul>

<p>Join FOSS Andhra's contribution workshops to practice these skills with mentorship!</p>`,
      categoryId: categories[0].id,
      authorId: admin.id,
      status: "published",
      featured: true,
      metaDescription: "Complete guide to contributing to open source on GitHub. Learn Git workflows, pull requests, code reviews, and community best practices.",
      metaKeywords: "GitHub, Git, open source, contribution guide, pull requests, version control",
      ogTitle: "Master Guide to Contributing to Open Source on GitHub",
      ogDescription: "Learn everything about contributing to open source projects, from Git basics to advanced collaboration techniques.",
      focusKeyword: "GitHub open source contribution",
      readingTime: 12,
      publishedAt: new Date("2024-03-15"),
      tags: [tags[0].id, tags[3].id, tags[4].id],
    },
  ]

  // Create blog posts
  for (const postData of blogPosts) {
    const { tags: postTags, ...postInfo } = postData
    
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

    console.log(`✓ Created: ${post.title}`)
  }

  console.log("\n✅ Successfully seeded 5 FOSS blog posts!")
  console.log("\n📝 Blog posts created:")
  console.log("1. Getting Started with Free and Open Source Software")
  console.log("2. Top 10 Linux Distributions for Developers in 2024")
  console.log("3. Building Your First Open Source Project")
  console.log("4. Python for FOSS: Essential Libraries")
  console.log("5. Contributing to Open Source on GitHub")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
