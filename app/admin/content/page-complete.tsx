"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, ImageIcon, Video, Edit, Trash2, Plus, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ContentItem {
  id: string
  type: string
  slug: string
  title: string
  content: string
  status: string
  updatedAt: string
}

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState("pages")
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null)
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
  })

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/admin/content")
      const data = await res.json()
      if (data.success) {
        setContentItems(data.data)
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

  const openNewContentDialog = (type: string) => {
    setEditingContent(null)
    setContentForm({
      type,
      slug: "",
      title: "",
      content: "",
      metaDescription: "",
      keywords: "",
      status: "draft",
    })
    setShowDialog(true)
  }

  const openEditContentDialog = (content: ContentItem) => {
    setEditingContent(content)
    setContentForm({
      type: content.type,
      slug: content.slug,
      title: content.title,
      content: content.content,
      metaDescription: "",
      keywords: "",
      status: content.status,
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

  const pages = contentItems.filter((item) => item.type === "page")
  const programs = contentItems.filter((item) => item.type === "program")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-1">Manage website content and media</p>
        </div>
        <Button className="bg-primary" onClick={() => openNewContentDialog("page")}>
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
              <div className="flex items-center justify-between">
                <CardTitle>Static Pages ({pages.length})</CardTitle>
                <Button size="sm" onClick={() => openNewContentDialog("page")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Page
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center py-8 text-gray-500">Loading...</p>
              ) : pages.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No pages found. Create your first page!</p>
              ) : (
                <div className="space-y-3">
                  {pages.map((page) => (
                    <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{page.title}</p>
                          <p className="text-sm text-gray-500">
                            Last updated: {new Date(page.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditContentDialog(page)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteContent(page.id)} className="text-red-600">
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
              <div className="flex items-center justify-between">
                <CardTitle>Program Content ({programs.length})</CardTitle>
                <Button size="sm" onClick={() => openNewContentDialog("program")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Program
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {programs.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No programs found. Create your first program!</p>
              ) : (
                <div className="space-y-3">
                  {programs.map((program) => (
                    <div key={program.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{program.title}</p>
                          <p className="text-sm text-gray-500">Program description and content</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditContentDialog(program)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteContent(program.id)} className="text-red-600">
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
              <div className="text-center py-12 text-gray-500">
                <p className="mb-4">Use the Gallery module from the admin sidebar</p>
                <p className="text-sm">Upload and manage event photos and images there</p>
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
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="font-medium">Upload Media</p>
                    <p className="text-sm text-gray-500">Use the dedicated Gallery page for uploads</p>
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
              {editingContent ? "Update content details" : "Create new page or program content"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
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
                onChange={(e) => setContentForm({
                  ...contentForm,
                  title: e.target.value,
                  slug: generateSlug(e.target.value),
                })}
                placeholder="Content title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={contentForm.slug}
                onChange={(e) => setContentForm({ ...contentForm, slug: e.target.value })}
                placeholder="url-slug"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={contentForm.content}
                onChange={(e) => setContentForm({ ...contentForm, content: e.target.value })}
                placeholder="Page content..."
                rows={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={contentForm.metaDescription}
                onChange={(e) => setContentForm({ ...contentForm, metaDescription: e.target.value })}
                placeholder="SEO description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={contentForm.keywords}
                  onChange={(e) => setContentForm({ ...contentForm, keywords: e.target.value })}
                  placeholder="keyword1, keyword2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
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
