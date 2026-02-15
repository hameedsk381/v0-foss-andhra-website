"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  Upload, Image as ImageIcon, Trash2, Edit, Search, Filter, X, 
  Loader2, Plus, Download, Eye, MoreVertical
} from "lucide-react"
import Image from "next/image"
import { PROGRAMS as PROGRAM_DEFINITIONS } from "@/lib/programs"

interface MediaItem {
  id: string
  filename: string
  originalName: string
  url: string
  title?: string | null
  description?: string | null
  alt?: string | null
  program?: string | null
  category?: string | null
  tags?: string | null
  size: number
  createdAt: string
}

export default function AdminGalleryPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterProgram, setFilterProgram] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const { toast } = useToast()

  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    program: "",
    category: "",
    tags: "",
    alt: "",
  })

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    program: "",
    category: "",
    tags: "",
    alt: "",
  })

  const categoryOptions = useMemo(() => {
    return Array.from(new Set(media.map((item) => item.category).filter(Boolean) as string[])).sort((a, b) =>
      a.localeCompare(b)
    )
  }, [media])

  useEffect(() => {
    fetchMedia()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/admin/media")
      const data = await res.json()
      
      if (data.success) {
        setMedia(data.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load media",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching media:", error)
      toast({
        title: "Error",
        description: "Failed to load media",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredMedia = useMemo(() => {
    let filtered = [...media]

    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.tags?.toLowerCase().includes(q)
      )
    }

    if (filterProgram !== "all") {
      filtered = filtered.filter((item) => item.program === filterProgram)
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((item) => item.category === filterCategory)
    }

    return filtered
  }, [media, searchTerm, filterProgram, filterCategory])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one file",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      for (const file of selectedFiles) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("title", uploadForm.title || file.name)
        formData.append("description", uploadForm.description)
        formData.append("program", uploadForm.program)
        formData.append("category", uploadForm.category)
        formData.append("tags", uploadForm.tags)
        formData.append("alt", uploadForm.alt || uploadForm.title)

        const res = await fetch("/api/admin/media", {
          method: "POST",
          body: formData,
        })

        const data = await res.json()

        if (!data.success) {
          throw new Error(data.error || "Upload failed")
        }
      }

      toast({
        title: "Success",
        description: `${selectedFiles.length} image(s) uploaded successfully`,
      })

      setShowUploadDialog(false)
      setSelectedFiles([])
      setUploadForm({
        title: "",
        description: "",
        program: "",
        category: "",
        tags: "",
        alt: "",
      })
      fetchMedia()
    } catch (error: any) {
      console.error("Upload error:", error)
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = async () => {
    if (!editingItem) return

    try {
      const res = await fetch(`/api/admin/media/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Media updated successfully",
        })
        setShowEditDialog(false)
        setEditingItem(null)
        fetchMedia()
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Media deleted successfully",
        })
        fetchMedia()
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (item: MediaItem) => {
    setEditingItem(item)
    setEditForm({
      title: item.title || "",
      description: item.description || "",
      program: item.program || "",
      category: item.category || "",
      tags: item.tags || "",
      alt: item.alt || "",
    })
    setShowEditDialog(true)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gallery Management</h1>
          <p className="text-gray-600 mt-2">Manage your media library</p>
        </div>
        <Button onClick={() => setShowUploadDialog(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Images
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
            <Select value={filterProgram} onValueChange={setFilterProgram}>
              <SelectTrigger>
                <SelectValue placeholder="All Programs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                {PROGRAM_DEFINITIONS.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoryOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.length > 0 ? (
            filteredMedia.map((item) => (
              <Card key={item.id} className="overflow-hidden group">
                <div className="relative aspect-square">
                  <Image
                    src={item.url}
                    alt={item.alt || item.title || "Gallery image"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => window.open(item.url, "_blank")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openEditDialog(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm truncate mb-1">
                    {item.title || item.originalName}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{formatFileSize(item.size)}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.program && (
                      <Badge variant="outline" className="text-xs">
                        {item.program}
                      </Badge>
                    )}
                    {item.category && (
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">No images found</p>
              <Button onClick={() => setShowUploadDialog(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First Image
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Images</DialogTitle>
            <DialogDescription>Upload one or multiple images to your gallery</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Images</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
              />
              {selectedFiles.length > 0 && (
                <p className="text-sm text-gray-600">
                  {selectedFiles.length} file(s) selected
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title (applies to all if multiple)</Label>
              <Input
                id="title"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                placeholder="Image title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                placeholder="Image description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="program">Program</Label>
                <Select
                  value={uploadForm.program || "none"}
                  onValueChange={(value) => setUploadForm({ ...uploadForm, program: value === "none" ? "" : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Program</SelectItem>
                    {PROGRAM_DEFINITIONS.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                  placeholder="event, workshop, implementation"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={uploadForm.tags}
                onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                placeholder="event, community, workshop"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={uploadForm.alt}
                onChange={(e) => setUploadForm({ ...uploadForm, alt: e.target.value })}
                placeholder="Alternative text for accessibility"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={uploading || selectedFiles.length === 0}>
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
            <DialogDescription>Update image information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {editingItem && (
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                <Image
                  src={editingItem.url}
                  alt={editingItem.alt || ""}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-program">Program</Label>
                <Select
                  value={editForm.program || "none"}
                  onValueChange={(value) => setEditForm({ ...editForm, program: value === "none" ? "" : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Program</SelectItem>
                    {PROGRAM_DEFINITIONS.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  placeholder="event, workshop, implementation"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                value={editForm.tags}
                onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-alt">Alt Text</Label>
              <Input
                id="edit-alt"
                value={editForm.alt}
                onChange={(e) => setEditForm({ ...editForm, alt: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
