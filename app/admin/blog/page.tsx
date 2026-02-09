"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Plus, Edit, Trash2, Eye, FileText, Tag, FolderOpen, Save, X, Download, MessageSquare, Check, XOctagon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DataTable, Column } from "@/components/admin/data-table"
import { BulkActions } from "@/components/admin/bulk-actions"
import { AdvancedFilters, FilterOption } from "@/components/admin/advanced-filters"
import { exportToCSV } from "@/components/admin/export-utils"
import { format } from "date-fns"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  status: string
  category: { id: string; name: string }
  author: { name: string }
  views: number
  createdAt: string
  featured: boolean
  _count: { comments: number }
}

interface Comment {
  id: string
  name: string
  email: string
  content: string
  status: "pending" | "approved" | "spam"
  createdAt: string
  post: {
    title: string
    slug: string
  }
}

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [filterValues, setFilterValues] = useState({ status: "all" })
  const [selectedPosts, setSelectedPosts] = useState<BlogPost[]>([])
  const [showPostDialog, setShowPostDialog] = useState(false)
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [showTagDialog, setShowTagDialog] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [postForm, setPostForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    categoryId: "",
    status: "draft",
    featured: false,
    coverImage: "",
    metaDescription: "",
    metaKeywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterCard: "summary_large_image",
    focusKeyword: "",
  })

  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "", description: "" })
  const [tagForm, setTagForm] = useState({ name: "", slug: "" })

  useEffect(() => {
    fetchPosts()
    fetchCategories()
    fetchTags()
    fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValues.status])

  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/admin/blog/posts?status=${filterValues.status}`)
      const data = await res.json()
      if (data.success) {
        setPosts(data.data)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/blog/categories")
      const data = await res.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchTags = async () => {
    try {
      const res = await fetch("/api/admin/blog/tags")
      const data = await res.json()
      if (data.success) {
        setTags(data.data)
      }
    } catch (error) {
      console.error("Error fetching tags:", error)
    }
  }

  const fetchComments = async () => {
    try {
      const res = await fetch("/api/admin/blog/comments")
      const data = await res.json()
      if (data.success) {
        setComments(data.data)
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  const handleCommentAction = async (id: string, action: "approve" | "spam" | "delete") => {
    try {
      if (action === "delete") {
        if (!confirm("Are you sure you want to delete this comment?")) return
        const res = await fetch(`/api/admin/blog/comments/${id}`, { method: "DELETE" })
        const data = await res.json()
        if (data.success) {
          toast({ title: "Success", description: "Comment deleted successfully" })
          fetchComments()
        }
      } else {
        const status = action === "approve" ? "approved" : "spam"
        const res = await fetch(`/api/admin/blog/comments/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        })
        const data = await res.json()
        if (data.success) {
          toast({ title: "Success", description: `Comment marked as ${status}` })
          fetchComments()
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update comment", variant: "destructive" })
    }
  }

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (filterValues.status !== "all" && post.status !== filterValues.status) return false
      return true
    })
  }, [posts, filterValues.status])

  const handleExport = (items: BlogPost[]) => {
    const columns = [
      { key: "title" as keyof BlogPost, header: "Title" },
      { key: "status" as keyof BlogPost, header: "Status" },
      { key: "views" as keyof BlogPost, header: "Views" },
      { key: "createdAt" as keyof BlogPost, header: "Created" },
    ]
    exportToCSV(items, columns, { filename: "blog-posts" })
  }

  const filterOptions: FilterOption[] = [
    {
      id: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "published", label: "Published" },
        { value: "draft", label: "Draft" },
      ],
    },
  ]

  const commentColumns: Column<Comment>[] = [
    {
      id: "author",
      header: "Author",
      accessor: (comment) => (
        <div>
          <div className="font-medium">{comment.name}</div>
          <div className="text-xs text-gray-500">{comment.email}</div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "content",
      header: "Comment",
      accessor: (comment) => (
        <div>
          <div className="text-sm line-clamp-2">{comment.content}</div>
          <div className="text-xs text-blue-600 mt-1">On: {comment.post.title}</div>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessor: (comment) => (
        <Badge
          className={
            comment.status === "approved"
              ? "bg-green-100 text-green-800"
              : comment.status === "spam"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
          }
        >
          {comment.status}
        </Badge>
      ),
      sortable: true,
    },
    {
      id: "date",
      header: "Date",
      accessor: (comment) => format(new Date(comment.createdAt), "MMM dd, yyyy"),
      sortable: true,
    },
  ]

  const commentActions = (comment: Comment) => (
    <>
      {comment.status !== "approved" && (
        <Button variant="ghost" size="sm" title="Approve" onClick={() => handleCommentAction(comment.id, "approve")} className="text-green-600">
          <Check className="h-4 w-4" />
        </Button>
      )}
      {comment.status !== "spam" && (
        <Button variant="ghost" size="sm" title="Mark as Spam" onClick={() => handleCommentAction(comment.id, "spam")} className="text-orange-600">
          <XOctagon className="h-4 w-4" />
        </Button>
      )}
      <Button variant="ghost" size="sm" title="Delete" onClick={() => handleCommentAction(comment.id, "delete")} className="text-red-600">
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  )

  const columns: Column<BlogPost>[] = [
    {
      id: "title",
      header: "Title",
      accessor: (post) => (
        <div>
          <div className="font-medium">{post.title}</div>
          <div className="text-xs text-gray-500">{post.slug}</div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      accessor: (post) => (
        <Badge className={post.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
          {post.status}
        </Badge>
      ),
      sortable: true,
    },
    {
      id: "category",
      header: "Category",
      accessor: (post) => post.category?.name || "Uncategorized",
      sortable: true,
    },
    {
      id: "views",
      header: "Views",
      accessor: (post) => post.views,
      sortable: true,
    },
    {
      id: "comments",
      header: "Comments",
      accessor: (post) => post._count?.comments ?? 0,
      sortable: true,
    },
    {
      id: "created",
      header: "Created",
      accessor: (post) => format(new Date(post.createdAt), "MMM dd, yyyy"),
      sortable: true,
    },
  ]

  const actions = (post: BlogPost) => (
    <>
      <Button variant="ghost" size="sm" title="View" onClick={() => window.open(`/blog/${post.slug}`, "_blank")}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" title="Edit" onClick={() => openEditPostDialog(post)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" title="Delete" onClick={() => deletePost(post.id)} className="text-red-600">
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  )

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (title: string) => {
    setPostForm({
      ...postForm,
      title,
      slug: generateSlug(title),
    })
  }

  const openNewPostDialog = () => {
    setEditingPost(null)
    setPostForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      categoryId: categories[0]?.id || "",
      status: "draft",
      featured: false,
      coverImage: "",
      metaDescription: "",
      metaKeywords: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      twitterCard: "summary_large_image",
      focusKeyword: "",
    })
    setShowPostDialog(true)
  }

  const openEditPostDialog = async (post: BlogPost) => {
    setEditingPost(post)
    setPostForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      categoryId: post.category.id,
      status: post.status,
      featured: post.featured,
      coverImage: (post as any).coverImage || "",
      metaDescription: (post as any).metaDescription || "",
      metaKeywords: (post as any).metaKeywords || "",
      ogTitle: (post as any).ogTitle || "",
      ogDescription: (post as any).ogDescription || "",
      ogImage: (post as any).ogImage || "",
      twitterCard: (post as any).twitterCard || "summary_large_image",
      focusKeyword: (post as any).focusKeyword || "",
    })
    setShowPostDialog(true)
  }

  const savePost = async () => {
    if (!postForm.title || !postForm.categoryId) {
      toast({
        title: "Validation Error",
        description: "Title and category are required",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const url = editingPost
        ? `/api/admin/blog/posts/${editingPost.id}`
        : "/api/admin/blog/posts"

      const method = editingPost ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postForm),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: "Success!",
          description: `Post ${editingPost ? "updated" : "created"} successfully`,
        })
        setShowPostDialog(false)
        fetchPosts()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingPost ? "update" : "create"} post`,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const res = await fetch(`/api/admin/blog/posts/${id}`, {
        method: "DELETE",
      })
      const data = await res.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Blog post deleted successfully",
        })
        fetchPosts()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      })
    }
  }

  const saveCategory = async () => {
    if (!categoryForm.name) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/admin/blog/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...categoryForm,
          slug: categoryForm.slug || generateSlug(categoryForm.name),
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: "Success!",
          description: "Category created successfully",
        })
        setShowCategoryDialog(false)
        setCategoryForm({ name: "", slug: "", description: "" })
        fetchCategories()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const saveTag = async () => {
    if (!tagForm.name) {
      toast({
        title: "Validation Error",
        description: "Tag name is required",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/admin/blog/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...tagForm,
          slug: tagForm.slug || generateSlug(tagForm.name),
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: "Success!",
          description: "Tag created successfully",
        })
        setShowTagDialog(false)
        setTagForm({ name: "", slug: "" })
        fetchTags()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tag",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-1">Manage blog posts, categories, and tags</p>
        </div>
        <Button onClick={openNewPostDialog} className="bg-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="posts">
            <FileText className="h-4 w-4 mr-2" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="categories">
            <FolderOpen className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="tags">
            <Tag className="h-4 w-4 mr-2" />
            Tags
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="h-4 w-4 mr-2" />
            Comments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4 items-center">
                <AdvancedFilters
                  filters={filterOptions}
                  values={filterValues}
                  onChange={(values) => setFilterValues(values as typeof filterValues)}
                />
                <div className="flex-1" />
                <Button variant="outline" onClick={() => handleExport(filteredPosts)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedPosts.length > 0 && (
            <BulkActions selected={selectedPosts} onExport={handleExport} />
          )}

          {/* Posts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Blog Posts ({filteredPosts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={filteredPosts}
                columns={columns}
                searchable
                searchPlaceholder="Search posts by title, slug, author, or category..."
                searchKeys={["title", "slug"]}
                pagination
                pageSize={10}
                selectable
                onSelectionChange={setSelectedPosts}
                loading={loading}
                emptyMessage="No posts found. Create your first post!"
                actions={actions}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Categories ({categories.length})</CardTitle>
                <Button size="sm" onClick={() => setShowCategoryDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-gray-500">{category._count.posts} posts</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tags ({tags.length})</CardTitle>
                <Button size="sm" onClick={() => setShowTagDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tag
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="text-sm px-3 py-1">
                    {tag.name} ({tag._count.posts})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comments ({comments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={comments}
                columns={commentColumns}
                searchable
                searchPlaceholder="Search comments..."
                searchKeys={["content", "name", "email"]}
                pagination
                pageSize={10}
                loading={loading}
                emptyMessage="No comments found."
                actions={commentActions}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Post Dialog */}
      <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Post" : "Create New Post"}</DialogTitle>
            <DialogDescription>
              {editingPost ? "Update your blog post" : "Create a new blog post for your website"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={postForm.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={postForm.slug}
                onChange={(e) => setPostForm({ ...postForm, slug: e.target.value })}
                placeholder="post-url-slug"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={postForm.categoryId} onValueChange={(value) => setPostForm({ ...postForm, categoryId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={postForm.status} onValueChange={(value) => setPostForm({ ...postForm, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={postForm.excerpt}
                onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                placeholder="Short description of the post"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <RichTextEditor
                content={postForm.content}
                onChange={(content) => setPostForm({ ...postForm, content })}
                placeholder="Write your blog post content here..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={postForm.featured}
                onChange={(e) => setPostForm({ ...postForm, featured: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Featured Post
              </Label>
            </div>

            {/* SEO Section */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3">SEO Settings</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="coverImage">Cover Image URL</Label>
                  <Input
                    id="coverImage"
                    value={postForm.coverImage}
                    onChange={(e) => setPostForm({ ...postForm, coverImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={postForm.metaDescription}
                    onChange={(e) => setPostForm({ ...postForm, metaDescription: e.target.value })}
                    placeholder="SEO meta description (150-160 characters)"
                    rows={2}
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-500">{postForm.metaDescription.length}/160 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaKeywords">Keywords</Label>
                  <Input
                    id="metaKeywords"
                    value={postForm.metaKeywords}
                    onChange={(e) => setPostForm({ ...postForm, metaKeywords: e.target.value })}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="focusKeyword">Focus Keyword</Label>
                  <Input
                    id="focusKeyword"
                    value={postForm.focusKeyword}
                    onChange={(e) => setPostForm({ ...postForm, focusKeyword: e.target.value })}
                    placeholder="Primary SEO keyword"
                  />
                </div>

                <details className="border rounded-lg p-3">
                  <summary className="cursor-pointer font-medium">Open Graph Settings</summary>
                  <div className="space-y-3 mt-3">
                    <div className="space-y-2">
                      <Label htmlFor="ogTitle">OG Title</Label>
                      <Input
                        id="ogTitle"
                        value={postForm.ogTitle}
                        onChange={(e) => setPostForm({ ...postForm, ogTitle: e.target.value })}
                        placeholder="Open Graph title (defaults to post title)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ogDescription">OG Description</Label>
                      <Textarea
                        id="ogDescription"
                        value={postForm.ogDescription}
                        onChange={(e) => setPostForm({ ...postForm, ogDescription: e.target.value })}
                        placeholder="Open Graph description"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ogImage">OG Image URL</Label>
                      <Input
                        id="ogImage"
                        value={postForm.ogImage}
                        onChange={(e) => setPostForm({ ...postForm, ogImage: e.target.value })}
                        placeholder="https://example.com/og-image.jpg (1200x630)"
                      />
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPostDialog(false)}>
              Cancel
            </Button>
            <Button onClick={savePost} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : editingPost ? "Update Post" : "Create Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Name *</Label>
              <Input
                id="cat-name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value, slug: generateSlug(e.target.value) })}
                placeholder="Category name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-description">Description</Label>
              <Textarea
                id="cat-description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                placeholder="Category description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveCategory} disabled={saving}>
              {saving ? "Saving..." : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tag Dialog */}
      <Dialog open={showTagDialog} onOpenChange={setShowTagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tag-name">Name *</Label>
              <Input
                id="tag-name"
                value={tagForm.name}
                onChange={(e) => setTagForm({ ...tagForm, name: e.target.value, slug: generateSlug(e.target.value) })}
                placeholder="Tag name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTagDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveTag} disabled={saving}>
              {saving ? "Saving..." : "Create Tag"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
