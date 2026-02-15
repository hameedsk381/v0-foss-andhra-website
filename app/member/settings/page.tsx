"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PushSubscription } from "@/components/push-subscription"
import { Bell, Settings } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface NotificationPreferences {
  eventReminders: boolean
  newBlogPosts: boolean
  membershipUpdates: boolean
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  eventReminders: true,
  newBlogPosts: true,
  membershipUpdates: true,
}

export default function MemberSettingsPage() {
  const { toast } = useToast()
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      const res = await fetch("/api/member/preferences")
      const data = await res.json()
      if (data.success) {
        setPreferences({ ...DEFAULT_PREFERENCES, ...data.data })
      }
    } catch (error) {
      console.error("Error fetching preferences:", error)
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/member/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save preferences")
      }

      toast({
        title: "Preferences Saved",
        description: "Your notification preferences were updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save preferences",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold">
            <Settings className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and notifications</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Push Notifications
            </CardTitle>
            <CardDescription>
              Enable push notifications to stay updated with events, blog posts, and important announcements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Browser Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications even when the app is closed</p>
              </div>
              <PushSubscription />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose what types of notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="pref-events" className="font-medium">Event Reminders</Label>
                <p className="text-sm text-gray-500">Get notified about upcoming events</p>
              </div>
              <Switch
                id="pref-events"
                checked={preferences.eventReminders}
                disabled={loading}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, eventReminders: Boolean(checked) }))
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="pref-blog" className="font-medium">New Blog Posts</Label>
                <p className="text-sm text-gray-500">Notifications for new blog content</p>
              </div>
              <Switch
                id="pref-blog"
                checked={preferences.newBlogPosts}
                disabled={loading}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, newBlogPosts: Boolean(checked) }))
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="pref-membership" className="font-medium">Membership Updates</Label>
                <p className="text-sm text-gray-500">Important membership information</p>
              </div>
              <Switch
                id="pref-membership"
                checked={preferences.membershipUpdates}
                disabled={loading}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, membershipUpdates: Boolean(checked) }))
                }
              />
            </div>

            <div className="pt-2">
              <Button onClick={savePreferences} disabled={loading || saving}>
                {saving ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
