import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Eye } from "lucide-react"

export const dynamic = "force-dynamic"
import { generateBlogPostMetadata } from "@/components/seo-metadata"
import { BlogPostJsonLd, BreadcrumbJsonLd } from "@/components/structured-data"
import { Metadata } from "next"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fossap.in"

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const postRaw = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
      include: {
        BlogCategory: true,
        Admin: {
          select: { name: true },
        },
      },
    })

    const post = postRaw
      ? {
        ...postRaw,
        category: postRaw.BlogCategory,
        author: postRaw.Admin,
      }
      : null

    if (!post) {
      return { title: "Post Not Found" }
    }

    return generateBlogPostMetadata(post)
  } catch {
    return { title: "Blog Post | FOSS Andhra" }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  let postRaw = null
  try {
    postRaw = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
      include: {
        BlogCategory: true,
        Admin: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        BlogPostTag: {
          include: { BlogTag: true },
        },
        BlogComment: {
          where: { status: "approved" },
          orderBy: { createdAt: "desc" },
        },
      },
    })
  } catch (error) {
    console.error("Database connection error in blog page:", error)
  }

  // Map to expected structure
  const post = postRaw
    ? {
      ...postRaw,
      category: postRaw.BlogCategory,
      author: postRaw.Admin,
      tags: postRaw.BlogPostTag.map((t: any) => ({ tag: t.BlogTag })),
      comments: postRaw.BlogComment,
    }
    : null

  if (!post) {
    notFound()
  }

  // Increment view count (fire and forget safely)
  try {
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    })
  } catch {
    // Ignore view count update errors during build/preview
  }

  // Related posts from the same category (deep internal links for readers + crawlers)
  const relatedPosts = await prisma.blogPost.findMany({
    where: { status: "published", id: { not: post.id }, categoryId: post.categoryId },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      readingTime: true,
      publishedAt: true,
      category: { select: { name: true, slug: true } },
    },
  })

  const publishedAt = post.publishedAt || post.createdAt

  return (
    <div className="min-h-screen bg-background">
      {/* SEO: Structured Data */}
      <BlogPostJsonLd post={post} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
        ]}
      />

      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
        {/* Back to blog */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All posts
        </Link>

        <article className="bg-card rounded-xl shadow-sm overflow-hidden border border-border">
          {/* Article header */}
          <header className="px-6 sm:px-10 pt-8 pb-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Link
                href={`/blog?category=${post.category.slug}`}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                {post.category.name}
              </Link>
              {post.readingTime != null && post.readingTime > 0 && (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  {post.readingTime} min read
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" aria-hidden="true" />
                {post.views} views
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-foreground">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
            )}

            <div className="mt-6 flex items-center justify-between gap-4 border-b pb-6">
              <div className="flex items-center gap-3">
                {post.author.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-11 h-11 rounded-full border border-border object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-bold"
                  >
                    {post.author.name?.charAt(0).toUpperCase() || "F"}
                  </span>
                )}
                <div>
                  <p className="text-sm font-semibold text-foreground">{post.author.name || "FOSS Andhra"}</p>
                  <time
                    dateTime={publishedAt.toISOString()}
                    className="text-sm text-muted-foreground"
                  >
                    {publishedAt.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </div>
            </div>
          </header>

          {/* Content - Markdown rendering */}
          <div className="px-6 sm:px-10">
            <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-p:leading-7 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-primary prose-blockquote:bg-primary/[0.04] prose-blockquote:py-1 prose-blockquote:pr-4 prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:bg-foreground prose-img:rounded-lg prose-img:shadow-md">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Tags (non-link: tag archive pages don't exist) */}
            {post.tags.length > 0 && (
              <div className="mt-10 pb-8 border-t pt-6" aria-label="Post tags">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(({ tag }: any) => (
                    <span
                      key={tag.id}
                      className="bg-muted px-3 py-1 rounded-full text-sm text-foreground"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Related posts from the same category */}
        {relatedPosts.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-10">
            <h2 id="related-heading" className="font-display text-xl font-bold text-foreground mb-5">
              More from {post.category.name}
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedPosts.map((related: any) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {related.category?.name}
                  </span>
                  <span className="mt-2 font-display text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                    {related.title}
                  </span>
                  <span className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    {related.readingTime > 0 ? `${related.readingTime} min read` : "Guide"}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Comments */}
        {post.comments.length > 0 && (
          <section aria-labelledby="comments-heading" className="mt-10 bg-card rounded-xl p-6 sm:p-8 border border-border">
            <h2 id="comments-heading" className="font-display text-xl font-bold mb-6">
              Comments ({post.comments.length})
            </h2>
            <div className="space-y-6">
              {post.comments.map((comment: any) => (
                <div key={comment.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold shrink-0"
                    >
                      {comment.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold">{comment.name}</p>
                      <time
                        dateTime={new Date(comment.createdAt).toISOString()}
                        className="text-sm text-muted-foreground"
                      >
                        {new Date(comment.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </time>
                      <p className="mt-2 text-foreground leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA band — internal links for the reader journey */}
        <div className="mt-10 rounded-xl border border-border bg-primary/[0.04] p-6 sm:p-8">
          <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">
            Take the next step
          </h2>
          <p className="mt-2 text-muted-foreground">
            Explore our{" "}
            <Link href="/careers?type=internship" className="font-medium text-primary hover:underline">
              internship openings
            </Link>
            , become a{" "}
            <Link href="/membership" className="font-medium text-primary hover:underline">
              FOSStar member
            </Link>
            , or meet the community at an{" "}
            <Link href="/events" className="font-medium text-primary hover:underline">
              upcoming event
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
