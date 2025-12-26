"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareButtonProps {
  title: string
  text?: string
  url?: string
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export function ShareButton({
  title,
  text,
  url,
  className,
  variant = "outline",
  size = "default",
}: ShareButtonProps) {
  const { toast } = useToast()

  const handleShare = async () => {
    const shareData = {
      title,
      text: text || title,
      url: url || (typeof window !== "undefined" ? window.location.href : ""),
    }

    // Check if Web Share API is supported
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData)
        toast({
          title: "Shared!",
          description: "Content shared successfully",
        })
      } catch (error: any) {
        // User cancelled or error occurred
        if (error.name !== "AbortError") {
          console.error("Error sharing:", error)
          fallbackShare(shareData)
        }
      }
    } else {
      // Fallback to clipboard
      fallbackShare(shareData)
    }
  }

  const fallbackShare = async (data: ShareData) => {
    try {
      // Copy URL to clipboard
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(data.url || window.location.href)
        toast({
          title: "Copied!",
          description: "Link copied to clipboard",
        })
      }
    } catch (error) {
      console.error("Failed to copy:", error)
      toast({
        title: "Share Failed",
        description: "Please copy the link manually",
        variant: "destructive",
      })
    }
  }

  return (
    <Button
      onClick={handleShare}
      variant={variant}
      size={size}
      className={className}
    >
      <Share2 className="h-4 w-4 mr-2" />
      Share
    </Button>
  )
}

