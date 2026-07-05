"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Search, Upload, Loader2, ImageOff, Check } from "lucide-react"

interface MediaItem {
  id: string
  url: string
  title?: string | null
  originalName: string
  createdAt: string
}

interface MediaPickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (url: string) => void
}

// Reusable dialog for picking (or uploading) an image from the shared media
// library — backed by the existing /api/admin/media endpoints.
export function MediaPicker({ open, onOpenChange, onSelect }: MediaPickerProps) {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (open) fetchMedia()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const fetchMedia = async (searchTerm?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.set("search", searchTerm)
      const res = await fetch(`/api/admin/media?${params.toString()}`)
      const data = await res.json()
      if (data.success) setItems(data.data)
    } catch (error) {
      console.error("Error fetching media:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchMedia(search)
  }

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please choose an image file", variant: "destructive" })
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", file.name)
      const res = await fetch("/api/admin/media", { method: "POST", body: formData })
      const data = await res.json()
      if (data.success) {
        toast({ title: "Uploaded", description: "Image added to the media library" })
        setItems((prev) => [data.data, ...prev])
        onSelect(data.data.url)
        onOpenChange(false)
      } else {
        throw new Error(data.error || "Upload failed")
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose an Image</DialogTitle>
          <DialogDescription>Pick from the media library or upload a new image</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search media..."
                className="pl-9"
              />
            </div>
          </form>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleUpload(file)
              e.target.value = ""
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload New
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto mt-2">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <ImageOff className="h-8 w-8 mb-2" />
              <p className="text-sm">No images found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item.url)
                    onOpenChange(false)
                  }}
                  className="group relative aspect-video rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
                >
                  <Image
                    src={item.url}
                    alt={item.title || item.originalName}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Check className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[11px] px-2 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.title || item.originalName}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
