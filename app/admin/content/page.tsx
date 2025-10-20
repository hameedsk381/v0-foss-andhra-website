"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { FileText, Image, Video, Edit, Trash2, Plus, Save, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Content {
  id: string
  type: string
  slug: string
  title: string
  content: string
  metaDescription?: string
  keywords?: string
  status: string
  createdAt: string
  updatedAt: string
}

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState("pages")
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingContent, setEditingContent] = useState<Content | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [contentForm, setContentForm] = useState({
    type: "page",
    slug: "",
    title: "",
    content: "",
    metaDescription: "",
    keywords: "",
    status: "draft",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterCard: "summary_large_image",
    focusKeyword: "",
    canonicalUrl: "",
  })

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/admin/content")
      const data = await res.json()
      if (data.success) {
        setContents(data.data)
      }
    } catch (error) {
      console.error("Error fetching content:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (title: string) => {
    setContentForm({
      ...contentForm,
      title,
      slug: generateSlug(title),
    })
  }

  const openNewContentDialog = () => {
    setEditingContent(null)
    setContentForm({
      type: activeTab === "pages" ? "page" : "program",
      slug: "",
      title: "",
      content: "",
      metaDescription: "",
      keywords: "",
      status: "draft",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      twitterCard: "summary_large_image",
      focusKeyword: "",
      canonicalUrl: "",
    })
    setShowDialog(true)
  }

  const openEditContentDialog = (content: Content) => {
    setEditingContent(content)
    setContentForm({
      type: content.type,
      slug: content.slug,
      title: content.title,
      content: content.content,
      metaDescription: content.metaDescription || "",
      keywords: content.keywords || "",
      status: content.status,
      ogTitle: (content as any).ogTitle || "",
      ogDescription: (content as any).ogDescription || "",
      ogImage: (content as any).ogImage || "",
      twitterCard: (content as any).twitterCard || "summary_large_image",
      focusKeyword: (content as any).focusKeyword || "",
      canonicalUrl: (content as any).canonicalUrl || "",
    })
    setShowDialog(true)
  }

  const saveContent = async () => {
    if (!contentForm.title || !contentForm.slug) {
      toast({
        title: "Validation Error",
        description: "Title and slug are required",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const url = editingContent
        ? `/api/admin/content/${editingContent.id}`
        : "/api/admin/content"
      
      const method = editingContent ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contentForm),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: "Success!",
          description: `Content ${editingContent ? "updated" : "created"} successfully`,
        })
        setShowDialog(false)
        fetchContent()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingContent ? "update" : "create"} content`,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const deleteContent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return

    try {
      const res = await fetch(`/api/admin/content/${id}`, {
        method: "DELETE",
      })
      const data = await res.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Content deleted successfully",
        })
        fetchContent()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      })
    }
  }

  const filteredContents = contents.filter((content) => {
    if (activeTab === "pages") return content.type === "page"
    if (activeTab === "programs") return content.type === "program"
    return false
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-1">Manage website content and media</p>
        </div>
        <Button onClick={openNewContentDialog} className="bg-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Content
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Static Pages ({filteredContents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center py-8 text-gray-500">Loading...</p>
              ) : filteredContents.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No pages found. Create your first page!</p>
              ) : (
                <div className="space-y-3">
                  {filteredContents.map((content) => (
                    <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{content.title}</h3>
                          <Badge
                            className={
                              content.status === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {content.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">/{content.slug}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Last updated: {new Date(content.updatedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditContentDialog(content)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteContent(content.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Program Content ({filteredContents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center py-8 text-gray-500">Loading...</p>
              ) : filteredContents.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No programs found. Create your first program!</p>
              ) : (
                <div className="space-y-3">
                  {filteredContents.map((content) => (
                    <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{content.title}</h3>
                          <Badge
                            className={
                              content.status === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {content.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-1">{content.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Last updated: {new Date(content.updatedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditContentDialog(content)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteContent(content.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Photo Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div key={item} className="relative group">
                    <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                      <Image className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Image className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="font-medium">Upload Media</p>
                    <p className="text-sm text-gray-500">Drag and drop or click to upload</p>
                    <Button className="mt-2">Choose Files</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Content Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingContent ? "Edit Content" : "Create New Content"}</DialogTitle>
            <DialogDescription>
              {editingContent ? "Update content details" : "Create new content for your website"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={contentForm.type} onValueChange={(value) => setContentForm({ ...contentForm, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="page">Page</SelectItem>
                  <SelectItem value="program">Program</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={contentForm.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter content title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={contentForm.slug}
                onChange={(e) => setContentForm({ ...contentForm, slug: e.target.value })}
                placeholder="content-url-slug"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={contentForm.status} onValueChange={(value) => setContentForm({ ...contentForm, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <RichTextEditor
                content={contentForm.content}
                onChange={(content) => setContentForm({ ...contentForm, content })}
                placeholder="Write your content here..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={contentForm.metaDescription}
                onChange={(e) => setContentForm({ ...contentForm, metaDescription: e.target.value })}
                placeholder="SEO meta description"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={contentForm.keywords}
                onChange={(e) => setContentForm({ ...contentForm, keywords: e.target.value })}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            {/* SEO Section */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3">SEO Settings</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="focusKeyword">Focus Keyword</Label>
                  <Input
                    id="focusKeyword"
                    value={contentForm.focusKeyword}
                    onChange={(e) => setContentForm({ ...contentForm, focusKeyword: e.target.value })}
                    placeholder="Primary SEO keyword"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="canonicalUrl">Canonical URL</Label>
                  <Input
                    id="canonicalUrl"
                    value={contentForm.canonicalUrl}
                    onChange={(e) => setContentForm({ ...contentForm, canonicalUrl: e.target.value })}
                    placeholder="https://fossandhra.org/page-url"
                  />
                </div>

                <details className="border rounded-lg p-3">
                  <summary className="cursor-pointer font-medium">Open Graph & Social Media</summary>
                  <div className="space-y-3 mt-3">
                    <div className="space-y-2">
                      <Label htmlFor="ogTitle">OG Title</Label>
                      <Input
                        id="ogTitle"
                        value={contentForm.ogTitle}
                        onChange={(e) => setContentForm({ ...contentForm, ogTitle: e.target.value })}
                        placeholder="Open Graph title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ogDescription">OG Description</Label>
                      <Textarea
                        id="ogDescription"
                        value={contentForm.ogDescription}
                        onChange={(e) => setContentForm({ ...contentForm, ogDescription: e.target.value })}
                        placeholder="Open Graph description"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ogImage">OG Image URL</Label>
                      <Input
                        id="ogImage"
                        value={contentForm.ogImage}
                        onChange={(e) => setContentForm({ ...contentForm, ogImage: e.target.value })}
                        placeholder="https://example.com/og-image.jpg (1200x630)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitterCard">Twitter Card Type</Label>
                      <Select 
                        value={contentForm.twitterCard} 
                        onValueChange={(value) => setContentForm({ ...contentForm, twitterCard: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summary">Summary</SelectItem>
                          <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveContent} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : editingContent ? "Update Content" : "Create Content"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
