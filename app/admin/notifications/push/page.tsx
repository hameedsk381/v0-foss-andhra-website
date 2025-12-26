"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Send, Users, Bell } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function PushNotificationsPage() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [url, setUrl] = useState("")
  const [type, setType] = useState("general")
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSend = async () => {
    if (!title || !message) {
      toast({
        title: "Validation Error",
        description: "Title and message are required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          message,
          url: url || undefined,
          type,
          userId: userId || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send notification")
      }

      toast({
        title: "Success!",
        description: `Notification sent to ${data.sent} subscriber(s)`,
      })

      // Reset form
      setTitle("")
      setMessage("")
      setUrl("")
      setType("general")
      setUserId("")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send push notification",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Send Push Notification</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Send push notifications to all subscribers or specific users
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Details
            </CardTitle>
            <CardDescription>
              Fill in the details below to send a push notification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="type">Notification Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="blog">Blog Post</SelectItem>
                  <SelectItem value="membership">Membership</SelectItem>
                  <SelectItem value="donation">Donation</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Notification title"
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Notification message"
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="url">URL (Optional)</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://fossandhra.org/events/..."
              />
              <p className="text-sm text-gray-500 mt-1">
                URL to open when notification is clicked
              </p>
            </div>

            <div>
              <Label htmlFor="userId">User ID (Optional)</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Leave empty to send to all subscribers"
              />
              <p className="text-sm text-gray-500 mt-1">
                Send to specific user, or leave empty for broadcast
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSend}
                disabled={isLoading || !title || !message}
                className="flex-1"
              >
                {userId ? (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send to User
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    Send to All
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>
              • Keep titles short and descriptive (50 characters or less)
            </p>
            <p>• Messages should be concise but informative</p>
            <p>
              • Always include a URL for important notifications to drive
              engagement
            </p>
            <p>
              • Use appropriate notification types for better categorization
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

