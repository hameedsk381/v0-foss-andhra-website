import { NextRequest, NextResponse } from "next/server"
import { requireAdminSession } from "@/lib/auth/admin"

export const dynamic = "force-dynamic"
export const maxDuration = 120

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile"

interface GeneratedBlog {
  title: string
  slug: string
  excerpt: string
  contentHtml: string
  metaDescription: string
  metaKeywords: string
  focusKeyword: string
  ogTitle: string
  ogDescription: string
  suggestedTags: string[]
  readingTime: number
}

const SYSTEM_PROMPT = `You are the content editor for FOSS Andhra (fossap.in), a non-profit promoting free and open source software across Andhra Pradesh, India. You turn rough notes into polished, SEO-optimised blog posts.

Context about the organisation:
- Seven programmes: FOSStar (membership), FOSServe (education/governance deployments), FOSSynC (campus clubs), FOSStorm (community software like TeluguNLP and OpenEdu), FOSStart (startup incubation), FOSSterage (open knowledge repository), FOSSpeaks (advocacy)
- Audience: students, developers, educators, and institutions in Andhra Pradesh
- Voice: knowledgeable but accessible, community-minded, practical; Indian English spellings (organisation, programme)

Writing rules:
- Write the post as clean HTML using only these tags: h2, h3, p, ul, ol, li, strong, em, a, blockquote. Never include h1 (the title renders separately), never include scripts, styles, or images.
- Structure: an opening paragraph that hooks the reader (no "In this post" boilerplate), 3-6 h2 sections with descriptive keyword-bearing headings, and a short closing section with a call to action relevant to FOSS Andhra.
- Length: 700-1200 words unless the notes clearly call for shorter.
- SEO: work the focus keyword naturally into the first paragraph, at least one h2, and the conclusion. Never keyword-stuff.
- Only state facts present in the user's notes or general public knowledge. Never invent statistics, dates, names, or quotes.

Respond with a single JSON object, no markdown fences, with exactly these keys:
{
  "title": "compelling title, 45-60 characters, focus keyword near the front",
  "slug": "url-slug-in-kebab-case",
  "excerpt": "1-2 sentence summary, max 200 characters",
  "contentHtml": "the full post as HTML per the rules above",
  "metaDescription": "search snippet, 140-155 characters, includes focus keyword, ends with a draw to click",
  "metaKeywords": "5-8 comma-separated keywords",
  "focusKeyword": "the primary keyword phrase (2-4 words)",
  "ogTitle": "social share title, max 60 chars, may differ from title",
  "ogDescription": "social share description, max 160 chars",
  "suggestedTags": ["3-5 short tag names"],
  "readingTime": 4
}`

// POST — generate a blog post draft from the editor's notes/brief
export async function POST(request: NextRequest) {
  try {
    const { authError } = await requireAdminSession(["editor", "admin"])
    if (authError) return authError

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { success: false, error: "GROQ_API_KEY is not configured on the server" },
        { status: 500 }
      )
    }

    const body = await request.json()
    const brief: string = (body.brief || "").trim()
    const tone: string = body.tone || "informative"
    const targetKeyword: string = (body.targetKeyword || "").trim()
    const categoryName: string = (body.categoryName || "").trim()

    if (brief.length < 20) {
      return NextResponse.json(
        { success: false, error: "Please provide at least a few sentences of notes or content to work from" },
        { status: 400 }
      )
    }
    if (brief.length > 24000) {
      return NextResponse.json(
        { success: false, error: "Notes are too long — please keep them under 24,000 characters" },
        { status: 400 }
      )
    }

    const userPrompt = [
      `Tone: ${tone}`,
      categoryName ? `Blog category: ${categoryName}` : null,
      targetKeyword ? `Target focus keyword: ${targetKeyword}` : "Choose the best focus keyword yourself.",
      "",
      "Here are my notes / raw content — turn this into a full blog post:",
      "",
      brief,
    ]
      .filter((line) => line !== null)
      .join("\n")

    const groqRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.7,
        max_tokens: 8000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    })

    if (!groqRes.ok) {
      const errText = await groqRes.text()
      console.error("Groq API error:", groqRes.status, errText)
      const friendly =
        groqRes.status === 401
          ? "Groq API key is invalid"
          : groqRes.status === 429
            ? "AI service is rate limited — please try again in a minute"
            : "AI service returned an error"
      return NextResponse.json({ success: false, error: friendly }, { status: 502 })
    }

    const completion = await groqRes.json()
    const raw = completion?.choices?.[0]?.message?.content
    if (!raw) {
      return NextResponse.json(
        { success: false, error: "AI returned an empty response — please try again" },
        { status: 502 }
      )
    }

    let generated: GeneratedBlog
    try {
      generated = JSON.parse(raw)
    } catch {
      return NextResponse.json(
        { success: false, error: "AI returned malformed output — please try again" },
        { status: 502 }
      )
    }

    // Basic shape validation + sanitised fallbacks
    if (!generated.title || !generated.contentHtml) {
      return NextResponse.json(
        { success: false, error: "AI response was missing the title or content — please try again" },
        { status: 502 }
      )
    }

    const slugify = (text: string) =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 80)

    // Strip any tags outside the allowed set as a safety net (script/style/iframe etc.)
    const contentHtml = String(generated.contentHtml)
      .replace(/<\s*(script|style|iframe|object|embed|form)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
      .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*')/gi, "")

    const wordCount = contentHtml.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length

    return NextResponse.json({
      success: true,
      data: {
        title: String(generated.title).slice(0, 120),
        slug: slugify(generated.slug || generated.title),
        excerpt: String(generated.excerpt || "").slice(0, 300),
        contentHtml,
        metaDescription: String(generated.metaDescription || "").slice(0, 160),
        metaKeywords: String(generated.metaKeywords || ""),
        focusKeyword: String(generated.focusKeyword || targetKeyword),
        ogTitle: String(generated.ogTitle || generated.title).slice(0, 70),
        ogDescription: String(generated.ogDescription || generated.metaDescription || "").slice(0, 200),
        suggestedTags: Array.isArray(generated.suggestedTags)
          ? generated.suggestedTags.slice(0, 5).map((t) => String(t))
          : [],
        readingTime: Math.max(1, Math.round(wordCount / 200)),
      },
    })
  } catch (error) {
    console.error("Error generating blog with AI:", error)
    return NextResponse.json(
      { success: false, error: "Failed to generate blog post" },
      { status: 500 }
    )
  }
}
