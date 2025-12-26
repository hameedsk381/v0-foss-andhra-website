"use client"

import { WifiOff, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md">
        <WifiOff className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">You&apos;re Offline</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          It looks like you&apos;re not connected to the internet. Check your
          connection and try again.
        </p>
        <div className="flex gap-2 justify-center">
          <Button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-6">
          Some pages may be available offline if you&apos;ve visited them
          before.
        </p>
      </div>
    </div>
  )
}

