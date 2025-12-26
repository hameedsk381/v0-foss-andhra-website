"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PushSubscription } from "@/components/push-subscription"
import { Bell, Settings } from "lucide-react"

export default function MemberSettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account preferences and notifications
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Push Notifications
            </CardTitle>
            <CardDescription>
              Enable push notifications to stay updated with events, blog posts,
              and important announcements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Browser Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive notifications even when the app is closed
                </p>
              </div>
              <PushSubscription />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Choose what types of notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Event Reminders</p>
                <p className="text-sm text-gray-500">
                  Get notified about upcoming events
                </p>
              </div>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Blog Posts</p>
                <p className="text-sm text-gray-500">
                  Notifications for new blog content
                </p>
              </div>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Membership Updates</p>
                <p className="text-sm text-gray-500">
                  Important membership information
                </p>
              </div>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

