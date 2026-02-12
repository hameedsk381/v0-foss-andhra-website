import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
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

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const postRaw = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    include: {
      BlogCategory: true,
      Admin: {
        select: { name: true },
      },
    },
  })

  // Map to expected structure
  const post = postRaw
    ? {
      ...postRaw,
      category: postRaw.BlogCategory,
      author: postRaw.Admin,
    }
    : null

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return generateBlogPostMetadata(post)
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const postRaw = await prisma.blogPost.findUnique({
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

  // Map to expected structure
  const post = postRaw
    ? {
      ...postRaw,
      category: postRaw.BlogCategory,
      author: postRaw.Admin,
      tags: postRaw.BlogPostTag.map((t) => ({ tag: t.BlogTag })),
      comments: postRaw.BlogComment,
    }
    : null

  if (!post) {
    notFound()
  }

  // Increment view count
  await prisma.blogPost.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO: Structured Data */}
      <BlogPostJsonLd post={post} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: process.env.NEXT_PUBLIC_SITE_URL || "https://fossandhra.org" },
          { name: "Blog", url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://fossandhra.org"}/blog` },
          { name: post.category.name, url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://fossandhra.org"}/blog/category/${post.category.slug}` },
          { name: post.title, url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://fossandhra.org"}/blog/${post.slug}` },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {post.coverImage && (
            <div className="aspect-video w-full">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Category & Reading Time */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {post.category.name}
              </span>
              {post.readingTime && (
                <span>{post.readingTime} min read</span>
              )}
              <span>{post.views} views</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>

            {/* Meta Info */}
            <div className="flex items-center gap-4 pb-6 border-b">
              {post.author.avatar && (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <p className="font-semibold text-gray-900">{post.author.name}</p>
                <p className="text-sm text-gray-600">
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Content - Markdown Rendering */}
            <div className="prose prose-zinc dark:prose-invert max-w-none mt-8 prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-7 prose-li:my-0.5 prose-img:rounded-lg prose-img:shadow-md ProseMirror">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(({ tag }: any) => (
                    <a
                      key={tag.id}
                      href={`/blog/tag/${tag.slug}`}
                      className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700 transition"
                    >
                      #{tag.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Comments Section */}
        {post.comments.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">
              Comments ({post.comments.length})
            </h2>
            <div className="space-y-6">
              {post.comments.map((comment: any) => (
                <div key={comment.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      {comment.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{comment.name}</p>
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
