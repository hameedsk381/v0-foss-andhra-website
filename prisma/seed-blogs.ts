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
        password: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdqgqw9XDpnDGfPdYjNlJBMF9S6", // "password123"
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

  // Blog posts data - now using Markdown format
  const blogPosts = [
    {
      title: "Getting Started with Free and Open Source Software",
      slug: "getting-started-with-foss",
      excerpt: "A comprehensive guide for beginners to understand and embrace the world of Free and Open Source Software (FOSS).",
      content: `## What is FOSS?

Free and Open Source Software (FOSS) represents software that is freely licensed to grant users the right to use, study, change, and distribute the software and its source code to anyone and for any purpose.

### The Four Essential Freedoms

FOSS is built on four fundamental freedoms:

- **Freedom 0:** The freedom to run the program as you wish, for any purpose
- **Freedom 1:** The freedom to study how the program works and change it
- **Freedom 2:** The freedom to redistribute copies
- **Freedom 3:** The freedom to distribute copies of your modified versions

### Why Choose FOSS?

Open source software offers numerous advantages:

- **Cost-effective:** Most FOSS is available at no cost
- **Security:** With thousands of eyes reviewing code, vulnerabilities are found and fixed quickly
- **Flexibility:** Customize software to meet your specific needs
- **Community:** Join a global community of developers and users
- **No Vendor Lock-in:** Freedom to switch or modify tools as needed

### Popular FOSS Applications

Start your FOSS journey with these popular applications:

- **Firefox:** Fast, privacy-focused web browser
- **LibreOffice:** Complete office suite alternative to Microsoft Office
- **GIMP:** Powerful image editing software
- **VLC Media Player:** Plays virtually any media format
- **Audacity:** Audio recording and editing software

### Getting Involved

Contributing to FOSS doesn't always mean coding. You can:

- Report bugs and suggest features
- Write or improve documentation
- Design graphics and UI elements
- Translate software to other languages
- Help other users in forums and chat rooms

Join FOSS Andhra to connect with like-minded individuals and contribute to the open source ecosystem!`,
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
      content: `## Why Linux for Development?

Linux has become the operating system of choice for developers worldwide. Its open-source nature, powerful command-line tools, and extensive package repositories make it ideal for software development.

### 1. Ubuntu

**Best for:** Beginners and general development

Ubuntu remains the most popular Linux distribution, offering excellent hardware support, a vast software repository, and long-term support (LTS) releases. Perfect for web development, Python programming, and containerization with Docker.

### 2. Fedora Workstation

**Best for:** Cutting-edge development

Fedora delivers the latest software packages and technologies. It's sponsored by Red Hat and serves as a testing ground for RHEL features. Excellent for system programming and DevOps.

### 3. Arch Linux

**Best for:** Advanced users who want control

Arch Linux follows a rolling release model and provides complete control over your system. The Arch User Repository (AUR) offers access to thousands of packages. Perfect for learning Linux internals.

### 4. Pop!_OS

**Best for:** AI/ML developers

Developed by System76, Pop!_OS comes with excellent NVIDIA GPU support out of the box. Ideal for machine learning, data science, and CUDA development.

### 5. Manjaro

**Best for:** Arch experience without the complexity

Manjaro provides an Arch-based system with easier installation and better hardware support. Great balance between cutting-edge and stability.

### 6. Debian

**Best for:** Server development and stability

Known for its rock-solid stability, Debian is perfect for backend development and server applications. The foundation for Ubuntu and many other distributions.

### 7. openSUSE Tumbleweed

**Best for:** Enterprise development

A rolling release with excellent tools like YaST for system configuration. Strong integration with enterprise tools and containers.

### 8. Linux Mint

**Best for:** Windows developers transitioning to Linux

User-friendly interface similar to Windows, based on Ubuntu. Excellent for web development and general programming.

### 9. Kali Linux

**Best for:** Security researchers and penetration testing

Packed with security and penetration testing tools. Essential for cybersecurity professionals and ethical hackers.

### 10. NixOS

**Best for:** Reproducible development environments

Revolutionary approach to package management. Perfect for DevOps and ensuring reproducible builds.

### Choosing Your Distribution

Consider these factors:

- Your experience level with Linux
- Type of development you'll be doing
- Hardware compatibility requirements
- Preference for stability vs. cutting-edge features
- Community and documentation availability

Visit FOSS Andhra's events page to join our Linux installation workshops!`,
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
      content: `## Starting Your Open Source Journey

Creating your first open source project can be intimidating, but it's one of the best ways to learn, contribute to the community, and build your portfolio.

### Step 1: Choose a Problem to Solve

The best projects solve real problems. Consider:

- Pain points you've experienced while coding
- Tools that could improve your workflow
- Improvements to existing open source projects
- Educational projects that help others learn

### Step 2: Select the Right License

Choosing a license is crucial for open source projects:

- **MIT License:** Very permissive, allows commercial use
- **GPL (GNU General Public License):** Copyleft license requiring derivatives to be open source
- **Apache 2.0:** Similar to MIT with explicit patent grants
- **BSD:** Simple and permissive like MIT

### Step 3: Set Up Your Repository

Create a professional repository structure:

\`\`\`
your-project/
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── .gitignore
├── src/
├── tests/
└── docs/
\`\`\`

### Step 4: Write Excellent Documentation

Your README.md should include:

- Project description and purpose
- Installation instructions
- Usage examples
- API documentation
- Contributing guidelines
- License information

### Step 5: Write Quality Code

Best practices for open source code:

- Follow coding standards for your language
- Write comprehensive tests (aim for 80%+ coverage)
- Add meaningful comments
- Use clear variable and function names
- Keep functions small and focused

### Step 6: Set Up CI/CD

Implement continuous integration:

- GitHub Actions for automated testing
- Code quality checks (linting, formatting)
- Automated releases
- Documentation generation

### Step 7: Promote Your Project

Get your project noticed:

- Share on Reddit (r/opensource, language-specific subreddits)
- Post on Hacker News and Product Hunt
- Write blog posts about your project
- Present at local meetups (like FOSS Andhra events!)
- Engage on Twitter and LinkedIn

### Step 8: Manage Contributions

Welcome and manage contributors:

- Respond to issues promptly
- Review pull requests constructively
- Acknowledge all contributions
- Create "good first issue" labels for newcomers
- Maintain a CODE_OF_CONDUCT.md

### Step 9: Maintain and Iterate

Keep your project healthy:

- Regular releases with semantic versioning
- Keep dependencies updated
- Address security vulnerabilities promptly
- Maintain a changelog
- Listen to community feedback

Join FOSS Andhra to connect with mentors and collaborate on open source projects!`,
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
      content: `## Why Python Dominates FOSS

Python has become one of the most popular languages in the open source community, thanks to its simplicity, readability, and vast ecosystem of libraries.

### Web Development

**Django** - The web framework for perfectionists with deadlines

- Full-featured MVC framework
- Built-in admin interface
- ORM for database interactions
- Excellent security features

**Flask** - Lightweight and flexible

- Micro-framework for web applications
- Easy to learn and extend
- Perfect for APIs and microservices
- Large ecosystem of extensions

**FastAPI** - Modern, fast web framework

- Based on type hints
- Automatic API documentation
- High performance (comparable to Node.js)
- Built-in data validation

### Data Science & Machine Learning

**NumPy** - Fundamental package for scientific computing

- Powerful N-dimensional arrays
- Linear algebra functions
- Foundation for other libraries

**Pandas** - Data manipulation and analysis

- DataFrame structures for data analysis
- Time series functionality
- Easy data cleaning and preparation

**Scikit-learn** - Machine learning made easy

- Classification, regression, clustering algorithms
- Model selection and evaluation
- Preprocessing tools

**TensorFlow & PyTorch** - Deep learning frameworks

- Neural network development
- GPU acceleration
- Production deployment tools

### DevOps & Automation

**Ansible** - IT automation platform

- Configuration management
- Application deployment
- Agentless architecture

**Fabric** - Streamlining SSH for deployment

- Remote server management
- Automated deployments
- Task execution

### Testing

**pytest** - Powerful testing framework

- Simple syntax
- Extensive plugin ecosystem
- Fixtures for setup/teardown

**unittest** - Built-in testing framework

- Part of Python standard library
- xUnit-style testing
- Test discovery

### Utilities & Tools

**Requests** - HTTP for humans

- Elegant API for HTTP requests
- Session management
- Authentication support

**Beautiful Soup** - Web scraping

- Parse HTML and XML
- Navigate parse trees
- Extract data from websites

**Click** - Command-line interfaces

- Easy CLI creation
- Argument parsing
- Nested commands

### Getting Started

Install these libraries using pip:

\`\`\`
pip install django flask fastapi
pip install numpy pandas scikit-learn
pip install pytest requests beautifulsoup4
\`\`\`

Attend FOSS Andhra's Python workshops to learn how to use these libraries effectively!`,
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
      content: `## Why Contribute to Open Source?

Contributing to open source projects is one of the best ways to:

- Improve your coding skills
- Build a public portfolio
- Network with experienced developers
- Give back to the community
- Learn industry best practices

### Understanding Git and GitHub

**Git** is a distributed version control system, while **GitHub** is a platform for hosting Git repositories and collaborating.

#### Essential Git Commands

\`\`\`bash
# Clone a repository
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
git pull origin main
\`\`\`

### Finding Projects to Contribute To

Start with these resources:

- **GitHub Explore:** Discover trending repositories
- **Good First Issue:** Find beginner-friendly issues
- **Up For Grabs:** Projects actively seeking contributors
- **First Timers Only:** Issues specifically for newcomers
- **CodeTriage:** Get issues delivered to your inbox

### The Contribution Workflow

#### 1. Fork the Repository

Click the "Fork" button on the project's GitHub page to create your own copy.

#### 2. Clone Your Fork

\`\`\`bash
git clone https://github.com/YOUR-USERNAME/project.git
cd project
git remote add upstream https://github.com/ORIGINAL-OWNER/project.git
\`\`\`

#### 3. Create a Feature Branch

\`\`\`bash
git checkout -b fix-issue-123
\`\`\`

#### 4. Make Your Changes

- Follow the project's coding style
- Write or update tests
- Update documentation if needed
- Keep commits atomic and well-described

#### 5. Test Your Changes

\`\`\`bash
# Run tests
npm test  # or pytest, cargo test, etc.

# Check code style
npm run lint
\`\`\`

#### 6. Commit Your Changes

\`\`\`bash
git add .
git commit -m "Fix: Resolve issue #123 - Add validation"
\`\`\`

#### 7. Keep Your Fork Updated

\`\`\`bash
git fetch upstream
git rebase upstream/main
\`\`\`

#### 8. Push to Your Fork

\`\`\`bash
git push origin fix-issue-123
\`\`\`

#### 9. Create a Pull Request

- Go to your fork on GitHub
- Click "Compare & pull request"
- Write a clear description of your changes
- Reference any related issues
- Be patient and responsive to feedback

### Writing Great Commit Messages

Follow these conventions:

\`\`\`
Type: Short summary (50 characters max)

Longer explanation if needed. Wrap at 72 characters.
Explain what and why, not how.

- Bullet points are okay
- Use imperative mood: "Fix bug" not "Fixed bug"

Fixes #123
\`\`\`

#### Commit Types:

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting)
- **refactor:** Code refactoring
- **test:** Adding or updating tests
- **chore:** Maintenance tasks

### Pull Request Best Practices

- **Small PRs:** Focus on one issue or feature
- **Clear Title:** Describe what the PR does
- **Detailed Description:** Explain the problem and solution
- **Screenshots:** Include for UI changes
- **Tests:** Add or update tests for your changes
- **Documentation:** Update docs if needed
- **Responsive:** Address reviewer feedback promptly

### Handling Code Reviews

When you receive feedback:

- Don't take criticism personally
- Ask questions if something is unclear
- Make requested changes thoughtfully
- Push updates to the same branch
- Thank reviewers for their time

### Non-Code Contributions

You can contribute without coding:

- Improve documentation
- Report bugs with detailed information
- Triage and reproduce issues
- Review pull requests
- Translate documentation
- Create tutorials and examples
- Design logos and graphics

### Common Pitfalls to Avoid

- Not reading CONTRIBUTING.md guidelines
- Making large, unfocused PRs
- Ignoring code style requirements
- Not testing changes before submitting
- Being defensive about feedback
- Abandoning PRs without communication

Join FOSS Andhra's contribution workshops to practice these skills with mentorship!`,
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
