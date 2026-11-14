// Seeds the first Learning Hub track ("Git & GitHub Basics") via the admin API.
// Usage: node scripts\seed-learning.mjs https://fossap.in
// Reads CONTENT_API_KEY from .env. Skips if the track slug already exists.

const BASE = process.argv[2] || "http://localhost:3000"

import { readFileSync } from "node:fs"

const env = readFileSync(new URL("../.env", import.meta.url), "utf8")
const key = (env.match(/^CONTENT_API_KEY=(.+)$/m) || [])[1]?.trim()
if (!key) {
  console.error("CONTENT_API_KEY not found in .env")
  process.exit(1)
}

const track = {
  title: "Git & GitHub Basics",
  description:
    "Everything you need to start contributing to open source: install Git, make your first commits, use branches, push to GitHub and open your first pull request. Written for students with no prior experience.",
  level: "beginner",
  estimatedHours: 3,
  status: "published",
  order: 1,
}

const lessons = [
  {
    title: "What is Git and why open source runs on it",
    summary: "Version control in plain language, and how thousands of volunteers build software together.",
    durationMin: 10,
    content: `## The problem Git solves

Imagine you and three friends are writing a project report together, each on your own laptop. You email files back and forth: \`report-final.docx\`, \`report-final-2.docx\`, \`report-FINAL-really.docx\`. Someone overwrites someone else's work. Nobody remembers which version was correct.

Git fixes exactly this for code. It is a **version control system**: it records every change you make, lets you go back to any earlier state, and lets many people work at the same time without overwriting each other.

## Why open source depends on it

Every major open source project — Linux, Python, VS Code, the software FOSS Andhra builds — lives in a Git **repository** ("repo"). A repo is the project's folder plus its entire history. When you hear "clone the repo", it means: download the project *and* all of its history, so you have everything locally.

This is why open source works at massive scale with volunteers who have never met: Git records **who** changed **what**, **when**, and **why** (in the commit message). Trust comes from the history, not from knowing each other personally.

## The vocabulary you need today

| Term | Plain meaning |
|------|---------------|
| Repository (repo) | A project folder tracked by Git |
| Commit | A saved snapshot of your changes, with a message |
| Branch | A parallel line of work, like a rough draft |
| GitHub | A website that hosts Git repos so people can collaborate |

> **Note:** Git and GitHub are different things. Git is the tool on your computer; GitHub is where repos are shared — like the difference between a word processor and Google Docs.

## What's next

In the next lesson you will install Git and set up your identity, so every commit you make is credited to you.`,
  },
  {
    title: "Installing Git and configuring your identity",
    summary: "Get Git running on Windows, Linux or Mac and set your name and email for the first time.",
    durationMin: 15,
    content: `## Install Git

**Windows:** download from [git-scm.com](https://git-scm.com/download/win) and run the installer. The default options are fine.

**Linux (Ubuntu/Debian):**

\`\`\`bash
sudo apt update
sudo apt install git
\`\`\`

**Mac:**

\`\`\`bash
xcode-select --install
\`\`\`

## Check it worked

Open a terminal (on Windows, use **Git Bash** which was installed with Git) and run:

\`\`\`bash
git --version
\`\`\`

You should see something like \`git version 2.45.0\`.

## Tell Git who you are

Every commit is signed with a name and email. This is how project maintainers know who made a change — and how you build a public contribution history employers can see.

\`\`\`bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
\`\`\`

> **Tip:** use the same email as your GitHub account. Your commits then link to your GitHub profile automatically.

Two more settings that save headaches later:

\`\`\`bash
git config --global init.defaultBranch main
git config --global core.editor "notepad"   # Windows (Linux/Mac: nano)
\`\`\`

## Check your settings

\`\`\`bash
git config --global --list
\`\`\`

If you see your name and email in the output, you are ready. Next lesson: your first repository.`,
  },
  {
    title: "Your first repository: init, add, commit",
    summary: "The three commands behind every commit, practised on a tiny local project.",
    durationMin: 20,
    content: `## Make a practice project

\`\`\`bash
mkdir foss-practice
cd foss-practice
echo "My first open source project" > README.md
\`\`\`

## Turn the folder into a repo

\`\`\`bash
git init
\`\`\`

Git now tracks this folder. Check the state of things:

\`\`\`bash
git status
\`\`\`

Git tells you \`README.md\` is **untracked** — it exists, but Git has not recorded it yet.

## The three-step rhythm

Almost everything you do in Git is this rhythm:

1. **Edit** files
2. **Stage** what you want to snapshot: \`git add README.md\`
3. **Commit** the snapshot: \`git commit -m "Add first README"\`

The **staging area** is a "next commit" basket: you choose exactly which changes go in. This lets you make clean commits — one logical change per commit — which open source maintainers love.

## Practise the rhythm

\`\`\`bash
echo "## Goals" >> README.md
echo "- Learn Git" >> README.md
git status
git add README.md
git commit -m "Add goals section to README"
\`\`\`

## See your history

\`\`\`bash
git log --oneline
\`\`\`

Each line is one snapshot with its message. This is the history that makes Git powerful.

## Commit messages matter

Bad: \`stuff\`, \`fix\`, \`asdf\`. Good: \`Add install instructions to README\`. Write messages as if completing the sentence *"This commit..."* — future maintainers (including you) will thank you.

Next lesson: branches, where you can experiment without breaking anything.`,
  },
  {
    title: "Branches: experiment without breaking anything",
    summary: "Create parallel versions of your project and merge them back when they work.",
    durationMin: 20,
    content: `## What a branch is

A branch is a parallel line of work. Your main branch stays stable while you try a risky idea on a side branch. If the idea fails, throw the branch away — main is untouched. If it works, merge it back.

This is exactly how open source contributions work: you never edit a project's main branch directly. You make a branch, do your work, and propose it back.

## Try it

\`\`\`bash
git branch feature-ideas     # create a branch
git switch feature-ideas     # move onto it
\`\`\`

(On older Git versions: \`git checkout -b feature-ideas\` does both steps.)

You are now on the side branch. Make a change:

\`\`\`bash
echo "Idea: add a contributors page" >> README.md
git add README.md
git commit -m "Draft contributors page idea"
\`\`\`

Now switch back:

\`\`\`bash
git switch main
\`\`\`

Open \`README.md\` — the idea is gone from view. It is safe on its branch, not lost. Switch back with \`git switch feature-ideas\` and it returns.

## Merge when ready

\`\`\`bash
git switch main
git merge feature-ideas
\`\`\`

The branch's commits are now part of main. Delete the finished branch:

\`\`\`bash
git branch -d feature-ideas
\`\`\`

## The command you will use most

\`\`\`bash
git branch
\`\`\`

lists your branches and marks the current one. When contributing to a real project you will type \`git switch -c my-fix\` more than almost any other command — create a branch per fix, never work on main.

Next lesson: taking your repo to GitHub, where collaboration happens.`,
  },
  {
    title: "Pushing to GitHub and opening your first pull request",
    summary: "Put your repo online and learn the pull request flow used by every open source project.",
    durationMin: 25,
    content: `## Create the repo on GitHub

1. Sign up / log in at [github.com](https://github.com) (free).
2. Click **New repository**, name it \`foss-practice\`, keep it **Public**, **do not** tick "Add a README" (you already have one).
3. GitHub shows you a "push an existing repository" section. Connect and upload your repo:

\`\`\`bash
git remote add origin https://github.com/YOUR-USERNAME/foss-practice.git
git push -u origin main
\`\`\`

\`origin\` is a nickname for your repo's home on GitHub. \`push\` uploads your commits. Refresh the GitHub page — your project is online, with full history.

## The pull request (PR) flow

A **pull request** says: *"Here are commits on my branch — please consider adding them to the project."* A maintainer reviews, comments, and merges or requests changes. This review step is the heart of open source quality.

Practise it on your own repo (the same flow you will use on real projects):

1. Make a branch with a change and push it:

\`\`\`bash
git switch -c add-license
echo "MIT License - see LICENSE file" >> README.md
git add README.md
git commit -m "Note the MIT license in README"
git push -u origin add-license
\`\`\`

2. GitHub shows a yellow banner: **"Compare & pull request"**. Click it.
3. Write a short title and description of the change, then **Create pull request**.
4. Review it yourself, then click **Merge pull request**.

## Keep main in sync

\`\`\`bash
git switch main
git pull
\`\`\`

\`pull\` downloads anything new. On real projects you will \`pull\` often, because other volunteers keep contributing while you work.

You now know the complete loop — **branch → commit → push → pull request → merge**. It is the same loop used to improve Linux and your favourite apps.

Next lesson: finding real projects that want your help.`,
  },
  {
    title: "Finding real projects and making your first real contribution",
    summary: "How to read CONTRIBUTING.md, find 'good first issue' labels, and survive code review.",
    durationMin: 20,
    content: `## Find a project that wants beginners

Good first targets:

- Projects tagged \`good-first-issue\` on GitHub — try [goodfirstissue.dev](https://goodfirstissue.dev) or search GitHub for \`label:"good first issue" language:python\` (swap in your language).
- FOSS Andhra's own repositories and FOSSynC club projects — mentors here expect beginners.

## Read before you write

Every serious repo has two files at the top:

- **README.md** — what the project does and how to run it.
- **CONTRIBUTING.md** — the rules for contributing: branch naming, commit style, how to run tests, what to include in a PR. **Read it.** Maintainers close PRs that ignore it, not out of rudeness, but because consistency is what keeps projects maintainable.

## Set up the project locally

Fork the repo on GitHub (the **Fork** button), then:

\`\`\`bash
git clone https://github.com/YOUR-USERNAME/PROJECT.git
cd PROJECT
# follow the README's setup steps
\`\`\`

## Small PRs win

Your first PR should be tiny:

- Fix a typo or broken link in the docs.
- Improve an error message.
- Add a missing step to installation docs.

Small PRs get merged fast, teach you the full flow, and put your name in a real project's history. A common beginner mistake is a 500-line first PR — reviewers will not get to it.

## Surviving code review

Review comments are about the code, not about you. Expect:

- **Changes requested** — normal; push new commits to the same branch and the PR updates itself.
- **Silence for days** — normal; maintainers are volunteers. A friendly nudge after a week is fine.

## Your checklist for any first contribution

1. Read README and CONTRIBUTING
2. Find a \`good first issue\` and comment "I'd like to work on this"
3. Fork, clone, branch
4. Small, focused change with a clear commit message
5. Push, open PR describing **what** and **why**
6. Respond politely to review

Congratulations — you now know everything a first-year FOSSynC club member needs. Bring your questions to your campus club or [FOSS Andhra community events](/events).`,
  },
]

async function api(path, method = "GET", body) {
  const r = await fetch(`${BASE}${path}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  })
  const j = await r.json()
  if (!j.success) throw new Error(`${path}: ${j.error || r.status}`)
  return j.data
}

// Skip if already seeded
const existing = await api("/api/admin/learning")
if (existing.some((t) => t.slug === "git-and-github-basics")) {
  console.log("Track already seeded, nothing to do.")
  process.exit(0)
}

const created = await api("/api/admin/learning", "POST", track)
console.log(`Track created: ${created.slug} (${created.id})`)

let i = 1
for (const lesson of lessons) {
  const l = await api(`/api/admin/learning/${created.id}/lessons`, "POST", { ...lesson, order: i++ })
  console.log(`Lesson created: ${l.slug} (${l.status})`)
}
console.log("Done.")
