"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Save, Database, Mail, CreditCard, Users, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [settings, setSettings] = useState({
    siteName: "FOSS Andhra",
    contactEmail: "info@fossandhra.org",
    siteDescription: "Promoting free and open source software in Andhra Pradesh",
    phone: "+91 98765 43210",
    address: "Visakhapatnam, Andhra Pradesh",
    membershipFee: "300",
    membershipDuration: "12",
    reminderDays: "30",
    autoRenewalReminders: "true",
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPass: "",
    fromEmail: "noreply@fossandhra.org",
    fromName: "FOSS Andhra",
    razorpayKeyId: "",
    razorpayKeySecret: "",
    razorpayTestMode: "true",
    enableCards: "true",
    enableUPI: "true",
    enableNetBanking: "true",
    enableWallets: "true",
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings")
      const data = await res.json()
      if (data.success && data.data) {
        setSettings((prev) => ({ ...prev, ...data.data }))
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (section: string) => {
    setSaving(true)
    try {
      // In a real app, we might only send the relevant fields for the section.
      // For simplicity here, we send all or just the ones changed.
      // Or we can send everything and the backend upserts everything.

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: "Settings Saved",
          description: `${section} settings updated successfully`,
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return <div className="p-8 text-center">Loading settings...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage CMS configuration and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="users">Admin Users</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>Basic website configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleChange("siteName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleChange("contactEmail", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Input
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleChange("siteDescription", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={settings.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button className="bg-primary" onClick={() => handleSave("General")} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Membership Settings</CardTitle>
              <CardDescription>Configure membership options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="membershipFee">Annual Membership Fee (₹)</Label>
                  <Input
                    id="membershipFee"
                    type="number"
                    value={settings.membershipFee}
                    onChange={(e) => handleChange("membershipFee", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="membershipDuration">Duration (months)</Label>
                  <Input
                    id="membershipDuration"
                    type="number"
                    value={settings.membershipDuration}
                    onChange={(e) => handleChange("membershipDuration", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-renewal Reminders</Label>
                  <p className="text-sm text-gray-500">Send email reminders before expiry</p>
                </div>
                <Switch
                  checked={settings.autoRenewalReminders === "true"}
                  onCheckedChange={(checked) => handleChange("autoRenewalReminders", String(checked))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminderDays">Reminder Days Before Expiry</Label>
                <Input
                  id="reminderDays"
                  type="number"
                  value={settings.reminderDays}
                  onChange={(e) => handleChange("reminderDays", e.target.value)}
                />
              </div>

              <div className="pt-4">
                <Button className="bg-primary" onClick={() => handleSave("Membership")} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
              <CardDescription>SMTP settings for sending emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    placeholder="smtp.gmail.com"
                    value={settings.smtpHost}
                    onChange={(e) => handleChange("smtpHost", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    placeholder="587"
                    value={settings.smtpPort}
                    onChange={(e) => handleChange("smtpPort", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    type="email"
                    placeholder="your-email@gmail.com"
                    value={settings.smtpUser}
                    onChange={(e) => handleChange("smtpUser", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPass">SMTP Password</Label>
                  <Input
                    id="smtpPass"
                    type="password"
                    placeholder="••••••••"
                    value={settings.smtpPass}
                    onChange={(e) => handleChange("smtpPass", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromEmail">From Email</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={settings.fromEmail}
                  onChange={(e) => handleChange("fromEmail", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromName">From Name</Label>
                <Input
                  id="fromName"
                  value={settings.fromName}
                  onChange={(e) => handleChange("fromName", e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="bg-primary" onClick={() => handleSave("Email")} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Configuration"}
                </Button>
                <Button variant="outline" type="button">Test Connection</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Razorpay Configuration
              </CardTitle>
              <CardDescription>Payment gateway settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="razorpayKeyId">Razorpay Key ID</Label>
                <Input
                  id="razorpayKeyId"
                  placeholder="rzp_test_xxxxx"
                  value={settings.razorpayKeyId}
                  onChange={(e) => handleChange("razorpayKeyId", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="razorpayKeySecret">Razorpay Key Secret</Label>
                <Input
                  id="razorpayKeySecret"
                  type="password"
                  placeholder="••••••••"
                  value={settings.razorpayKeySecret}
                  onChange={(e) => handleChange("razorpayKeySecret", e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Test Mode</Label>
                  <p className="text-sm text-gray-500">Use test credentials for development</p>
                </div>
                <Switch
                  checked={settings.razorpayTestMode === "true"}
                  onCheckedChange={(checked) => handleChange("razorpayTestMode", String(checked))}
                />
              </div>

              <div className="pt-4">
                <Button className="bg-primary" onClick={() => handleSave("Payment")} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Configuration"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Options</CardTitle>
              <CardDescription>Configure payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Similar switches can be added for enableCards, enableUPI, etc. if needed */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Credit/Debit Cards</Label>
                </div>
                <Switch
                  checked={settings.enableCards === "true"}
                  onCheckedChange={(checked) => handleChange("enableCards", String(checked))}
                />
              </div>
              {/* Add other payment switches similarly */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Admin Users
              </CardTitle>
              <CardDescription>Manage admin access (Coming Soon)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">User management features will be available in the next update.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Backup
              </CardTitle>
              <CardDescription>Backup and restore your data (Coming Soon)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Backup management features will be available in the next update.</p>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
