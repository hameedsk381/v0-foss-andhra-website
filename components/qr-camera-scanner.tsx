"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, X, Scan } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface QRCameraScannerProps {
  onScan: (data: string) => void
  onError?: (error: string) => void
}

export function QRCameraScanner({ onScan, onError }: QRCameraScannerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen && hasPermission) {
      startCamera()
    } else if (!isOpen) {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isOpen, hasPermission])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsScanning(true)
      }
    } catch (error: any) {
      console.error("Camera error:", error)
      setHasPermission(false)
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to scan QR codes",
        variant: "destructive",
      })
      if (onError) {
        onError(error.message || "Failed to access camera")
      }
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }

  const handleOpen = async () => {
    // Check for camera support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        title: "Not Supported",
        description: "Camera scanning is not supported on this device",
        variant: "destructive",
      })
      return
    }

    // Request permission
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach((track) => track.stop()) // Stop immediately
      setHasPermission(true)
      setIsOpen(true)
    } catch (error: any) {
      setHasPermission(false)
      toast({
        title: "Permission Denied",
        description: "Camera access is required for QR scanning",
        variant: "destructive",
      })
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    stopCamera()
  }

  // Simple QR code detection (basic implementation)
  // For production, use a library like jsQR or html5-qrcode
  const handleScan = () => {
    // This is a placeholder - integrate with a QR code library
    toast({
      title: "QR Scanning",
      description: "QR code scanning requires a library like jsQR. Install it for full functionality.",
    })
  }

  return (
    <>
      <Button onClick={handleOpen} variant="outline" size="sm">
        <Camera className="h-4 w-4 mr-2" />
        Scan QR Code
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
            <DialogDescription>
              Point your camera at a QR code to scan it
            </DialogDescription>
          </DialogHeader>

          <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
            {hasPermission && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            )}

            {!hasPermission && (
              <div className="flex items-center justify-center h-full text-white">
                <Camera className="h-12 w-12" />
              </div>
            )}

            {/* Scanning overlay */}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-primary rounded-lg w-64 h-64" />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleScan} disabled={!isScanning} className="flex-1">
              <Scan className="h-4 w-4 mr-2" />
              Scan
            </Button>
            <Button onClick={handleClose} variant="outline">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            For full QR scanning, install jsQR: bun add jsQR @types/jsqr
          </p>
        </DialogContent>
      </Dialog>
    </>
  )
}

