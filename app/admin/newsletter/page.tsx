"use client"

import "./editor.css"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Blockquote from "@tiptap/extension-blockquote"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import { ArrowLeft, Plus, Pencil, Trash2, ChevronUp, ChevronDown, Mail, Send, Users, CheckCircle, XCircle, Loader2 } from "lucide-react"

interface Subscriber {
  id: string
  email: string
  name: string | null
  status: string
  subscribedAt: Date
  unsubscribedAt: Date | null
}

export default function NewsletterPage() {
  const router = useRouter()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [testEmailDialogOpen, setTestEmailDialogOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    subject: "",
    content: "",
    testEmail: "",
  })

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    unsubscribed: 0,
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Blockquote,
      HorizontalRule,
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }))
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[500px] p-6',
      },
    },
  })

  useEffect(() => {
    fetchSubscribers()
  }, [])

  useEffect(() => {
    if (editor && formData.content !== editor.getHTML()) {
      editor.commands.setContent(formData.content)
    }
  }, [formData.content, editor])

  const fetchSubscribers = async () => {
    try {
      const res = await fetch("/api/admin/newsletter/subscribers?status=all")
      if (res.ok) {
        const data = await res.json()
        setSubscribers(data)
        
        // Calculate stats
        setStats({
          total: data.length,
          active: data.filter((s: Subscriber) => s.status === "active").length,
          unsubscribed: data.filter((s: Subscriber) => s.status === "unsubscribed").length,
        })
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendNewsletter = async (isTest: boolean = false) => {
    if (!formData.subject || !formData.content) {
      alert("Please fill in subject and content")
      return
    }

    if (isTest && !formData.testEmail) {
      alert("Please enter test email address")
      return
    }

    if (!isTest && !confirm(`Send newsletter to ${stats.active} subscribers?`)) {
      return
    }

    setSending(true)
    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: formData.subject,
          content: formData.content,
          testEmail: isTest ? formData.testEmail : undefined,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        if (isTest) {
          alert("Test email sent successfully!")
          setTestEmailDialogOpen(false)
        } else {
          alert(`Newsletter sent to ${data.sentTo} subscribers!${data.failed > 0 ? `\nFailed: ${data.failed}` : ''}`)
          setFormData({ subject: "", content: "", testEmail: "" })
          editor?.commands.setContent("")
        }
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error("Error sending newsletter:", error)
      alert("Failed to send newsletter")
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return

    try {
      const res = await fetch(`/api/admin/newsletter/subscribers?id=${deletingId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setDeleteDialogOpen(false)
        setDeletingId(null)
        fetchSubscribers()
      }
    } catch (error) {
      console.error("Error deleting subscriber:", error)
    }
  }

  const openDeleteDialog = (id: string) => {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const activeSubscribers = subscribers.filter(s => s.status === "active")
  const unsubscribedSubscribers = subscribers.filter(s => s.status === "unsubscribed")

  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="compose" className="h-full">
        <div className="border-b bg-background sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold">Newsletter Management</h1>
                <p className="text-muted-foreground mt-1">
                  Manage subscribers and send newsletters
                </p>
              </div>
              {/* Stats in header */}
              <div className="flex gap-3">
                <div className="text-center px-4 py-2 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div className="text-center px-4 py-2 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{stats.active}</div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
                <div className="text-center px-4 py-2 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-700">{stats.unsubscribed}</div>
                  <div className="text-xs text-muted-foreground">Unsubscribed</div>
                </div>
              </div>
            </div>
            
            <TabsList>
              <TabsTrigger value="compose">
                <Mail className="mr-2 h-4 w-4" />
                Compose Newsletter
              </TabsTrigger>
              <TabsTrigger value="subscribers">
                <Users className="mr-2 h-4 w-4" />
                Subscribers ({stats.active})
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Compose Newsletter */}
        <TabsContent value="compose" className="m-0">
          <div className="h-[calc(100vh-180px)] flex flex-col">
            {/* Editor Container */}
            <div className="flex-1 flex gap-6 p-6 overflow-hidden">
              {/* Left Side - Editor */}
              <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                <div>
                  <Label htmlFor="subject" className="text-base font-semibold">Subject Line</Label>
                  <Input
                    id="subject"
                    placeholder="Enter newsletter subject..."
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="mt-2 text-lg h-12"
                  />
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                  <Label className="text-base font-semibold mb-2">Newsletter Content</Label>
                  <div className="flex-1 border rounded-lg overflow-hidden flex flex-col bg-white">
                    {/* Toolbar */}
                    <div className="border-b p-3 flex gap-1 flex-wrap bg-muted/30">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={editor?.isActive("heading", { level: 1 }) ? "bg-secondary" : ""}
                      >
                        H1
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={editor?.isActive("heading", { level: 2 }) ? "bg-secondary" : ""}
                      >
                        H2
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={editor?.isActive("heading", { level: 3 }) ? "bg-secondary" : ""}
                      >
                        H3
                      </Button>
                      <div className="w-px h-6 bg-border mx-1" />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        className={editor?.isActive("bold") ? "bg-secondary" : ""}
                      >
                        <strong>B</strong>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        className={editor?.isActive("italic") ? "bg-secondary" : ""}
                      >
                        <em>I</em>
                      </Button>
                      <div className="w-px h-6 bg-border mx-1" />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => editor?.chain().focus().toggleBulletList().run()}
                        className={editor?.isActive("bulletList") ? "bg-secondary" : ""}
                      >
                        • List
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                        className={editor?.isActive("orderedList") ? "bg-secondary" : ""}
                      >
                        1. List
                      </Button>
                      <div className="w-px h-6 bg-border mx-1" />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                        className={editor?.isActive("blockquote") ? "bg-secondary" : ""}
                      >
                        Quote
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                      >
                        —
                      </Button>
                    </div>
                    {/* Editor Content */}
                    <div className="flex-1 overflow-y-auto">
                      <EditorContent 
                        editor={editor} 
                        className="prose prose-sm max-w-none p-6 min-h-full focus:outline-none" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Preview & Actions */}
              <div className="w-96 flex flex-col gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Newsletter Preview</CardTitle>
                    <CardDescription className="text-sm">
                      How your email will look
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {formData.subject && (
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Subject:</div>
                          <div className="font-semibold text-sm">{formData.subject}</div>
                        </div>
                      )}
                      <div className="border rounded-lg p-4 bg-gradient-to-br from-primary/5 to-primary/10 max-h-64 overflow-y-auto">
                        <div className="text-xs font-semibold text-primary mb-2">FOSS Andhra Foundation</div>
                        {formData.content ? (
                          <div 
                            className="prose prose-xs max-w-none"
                            dangerouslySetInnerHTML={{ __html: formData.content }}
                          />
                        ) : (
                          <p className="text-xs text-muted-foreground italic">Start typing to see preview...</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Send Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Recipients:</span>
                      <span className="font-semibold">{stats.active} subscribers</span>
                    </div>
                    <Button
                      onClick={() => setTestEmailDialogOpen(true)}
                      variant="outline"
                      className="w-full"
                      disabled={sending || !formData.subject || !formData.content}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Send Test Email
                    </Button>
                    <Button
                      onClick={() => handleSendNewsletter(false)}
                      disabled={sending || !formData.subject || !formData.content || stats.active === 0}
                      className="w-full"
                      size="lg"
                    >
                      {sending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Newsletter
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Subscribers List */}
        <TabsContent value="subscribers" className="m-0">
          <div className="h-[calc(100vh-180px)] overflow-y-auto">
            <div className="container mx-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Active Subscribers */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                      Active Subscribers ({activeSubscribers.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {activeSubscribers.map((subscriber) => (
                      <Card key={subscriber.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium">{subscriber.email}</div>
                              {subscriber.name && (
                                <div className="text-sm text-muted-foreground">{subscriber.name}</div>
                              )}
                              <div className="text-xs text-muted-foreground mt-1">
                                Subscribed: {new Date(subscriber.subscribedAt).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-green-50">
                                Active
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDeleteDialog(subscriber.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {activeSubscribers.length === 0 && (
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                          <Users className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">No active subscribers</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>

                {/* Unsubscribed */}
                {unsubscribedSubscribers.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-semibold text-lg flex items-center mb-4">
                      <XCircle className="mr-2 h-5 w-5 text-red-600" />
                      Unsubscribed ({unsubscribedSubscribers.length})
                    </h3>
                    <div className="space-y-2">
                      {unsubscribedSubscribers.map((subscriber) => (
                        <Card key={subscriber.id} className="opacity-60">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-medium">{subscriber.email}</div>
                                {subscriber.name && (
                                  <div className="text-sm text-muted-foreground">{subscriber.name}</div>
                                )}
                                <div className="text-xs text-muted-foreground mt-1">
                                  Unsubscribed: {subscriber.unsubscribedAt ? new Date(subscriber.unsubscribedAt).toLocaleDateString() : 'N/A'}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-red-50">
                                  Unsubscribed
                                </Badge>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openDeleteDialog(subscriber.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Test Email Dialog */}
      <Dialog open={testEmailDialogOpen} onOpenChange={setTestEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Test Email</DialogTitle>
            <DialogDescription>
              Enter an email address to send a test newsletter
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="testEmail">Test Email Address</Label>
              <Input
                id="testEmail"
                type="email"
                placeholder="test@example.com"
                value={formData.testEmail}
                onChange={(e) => setFormData({ ...formData, testEmail: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTestEmailDialogOpen(false)}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button onClick={() => handleSendNewsletter(true)} disabled={sending || !formData.testEmail}>
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Test
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscriber</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this subscriber? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
