"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, Plus, Edit, Trash2, Ticket, ShoppingCart, Tag, Users, 
  DollarSign, TrendingUp, Calendar, Clock, Save, QrCode
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Event {
  id: string
  title: string
  description: string
  date: string
  status: string
  enableTicketing: boolean
  currentAttendees: number
}

interface TicketType {
  id: string
  name: string
  description: string
  type: string
  price: number
  quantity: number | null
  quantitySold: number
  salesStart: string | null
  salesEnd: string | null
  active: boolean
  order: number
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  totalAmount: number
  status: string
  createdAt: string
  tickets: any[]
}

export default function EventDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const eventId = params.id as string

  const [event, setEvent] = useState<Event | null>(null)
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [showTicketDialog, setShowTicketDialog] = useState(false)
  const [editingTicket, setEditingTicket] = useState<TicketType | null>(null)
  const [saving, setSaving] = useState(false)

  const [ticketForm, setTicketForm] = useState({
    name: "",
    description: "",
    type: "free",
    price: 0,
    quantity: null as number | null,
    salesStart: "",
    salesEnd: "",
    minDonation: 0,
    maxDonation: 1000,
    hidden: false,
    active: true,
  })

  useEffect(() => {
    if (eventId) {
      fetchEventDetails()
      fetchTicketTypes()
      fetchOrders()
    }
  }, [eventId])

  const fetchEventDetails = async () => {
    try {
      const res = await fetch(`/api/admin/events/${eventId}`)
      const data = await res.json()
      if (data.success) {
        setEvent(data.data)
      }
    } catch (error) {
      console.error("Error fetching event:", error)
    }
  }

  const fetchTicketTypes = async () => {
    try {
      const res = await fetch(`/api/admin/events/${eventId}/tickets`)
      const data = await res.json()
      if (data.success) {
        setTicketTypes(data.data)
      }
    } catch (error) {
      console.error("Error fetching tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/admin/events/${eventId}/orders`)
      const data = await res.json()
      if (data.success) {
        setOrders(data.data)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  const openNewTicketDialog = () => {
    setEditingTicket(null)
    setTicketForm({
      name: "",
      description: "",
      type: "free",
      price: 0,
      quantity: null,
      salesStart: "",
      salesEnd: "",
      minDonation: 0,
      maxDonation: 1000,
      hidden: false,
      active: true,
    })
    setShowTicketDialog(true)
  }

  const openEditTicketDialog = (ticket: TicketType) => {
    setEditingTicket(ticket)
    setTicketForm({
      name: ticket.name,
      description: ticket.description || "",
      type: ticket.type,
      price: ticket.price,
      quantity: ticket.quantity,
      salesStart: ticket.salesStart ? ticket.salesStart.split("T")[0] : "",
      salesEnd: ticket.salesEnd ? ticket.salesEnd.split("T")[0] : "",
      minDonation: 0,
      maxDonation: 1000,
      hidden: false,
      active: ticket.active,
    })
    setShowTicketDialog(true)
  }

  const saveTicketType = async () => {
    if (!ticketForm.name) {
      toast({
        title: "Validation Error",
        description: "Ticket name is required",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const url = editingTicket
        ? `/api/admin/events/${eventId}/tickets/${editingTicket.id}`
        : `/api/admin/events/${eventId}/tickets`
      const method = editingTicket ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketForm),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: "Success!",
          description: `Ticket type ${editingTicket ? "updated" : "created"} successfully`,
        })
        setShowTicketDialog(false)
        fetchTicketTypes()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingTicket ? "update" : "create"} ticket type`,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const deleteTicketType = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ticket type?")) return

    try {
      const res = await fetch(`/api/admin/events/${eventId}/tickets/${id}`, {
        method: "DELETE",
      })
      const data = await res.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Ticket type deleted successfully",
        })
        fetchTicketTypes()
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete ticket type",
        variant: "destructive",
      })
    }
  }

  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.totalAmount, 0)

  const totalTicketsSold = ticketTypes.reduce((sum, t) => sum + t.quantitySold, 0)

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (!event) {
    return <div className="p-8 text-center">Event not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/events")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            <p className="text-gray-600 mt-1">Manage tickets and orders</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => router.push(`/admin/events/${eventId}/check-in`)}>
            <QrCode className="h-4 w-4 mr-2" />
            Check-In
          </Button>
          <Badge className={event.status === "upcoming" ? "bg-green-500" : "bg-gray-500"}>
            {event.status}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tickets Sold</p>
                <p className="text-2xl font-bold">{totalTicketsSold}</p>
              </div>
              <Ticket className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attendees</p>
                <p className="text-2xl font-bold">{event.currentAttendees}</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">
            <Ticket className="h-4 w-4 mr-2" />
            Ticket Types
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="promo-codes">
            <Tag className="h-4 w-4 mr-2" />
            Promo Codes
          </TabsTrigger>
        </TabsList>

        {/* Ticket Types Tab */}
        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Ticket Types</CardTitle>
                <CardDescription>Manage different ticket tiers and pricing</CardDescription>
              </div>
              <Button onClick={openNewTicketDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Ticket Type
              </Button>
            </CardHeader>
            <CardContent>
              {ticketTypes.length === 0 ? (
                <p className="text-center py-8 text-gray-500">
                  No ticket types yet. Create your first one!
                </p>
              ) : (
                <div className="space-y-3">
                  {ticketTypes.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{ticket.name}</h3>
                          <Badge
                            variant={ticket.type === "free" ? "secondary" : "default"}
                            className="text-xs"
                          >
                            {ticket.type}
                          </Badge>
                          {!ticket.active && (
                            <Badge variant="outline" className="text-xs">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        {ticket.description && (
                          <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span className="font-semibold text-gray-900">
                            ₹{ticket.price.toLocaleString()}
                          </span>
                          <span>
                            Sold: {ticket.quantitySold}
                            {ticket.quantity && ` / ${ticket.quantity}`}
                          </span>
                          {ticket.salesStart && (
                            <span>
                              Sales start: {new Date(ticket.salesStart).toLocaleDateString()}
                            </span>
                          )}
                          {ticket.salesEnd && (
                            <span>Sales end: {new Date(ticket.salesEnd).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditTicketDialog(ticket)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteTicketType(ticket.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>View and manage ticket orders</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 10).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-sm font-semibold">
                            {order.orderNumber}
                          </span>
                          <Badge
                            className={
                              order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-900">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{order.customerEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">₹{order.totalAmount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">
                          {order.tickets.length} ticket{order.tickets.length > 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Promo Codes Tab */}
        <TabsContent value="promo-codes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Promo Codes</CardTitle>
              <CardDescription>Coming soon - Create discount codes for your event</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-500">
                Promo code management will be available in the next update
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ticket Type Dialog */}
      <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTicket ? "Edit Ticket Type" : "Create Ticket Type"}</DialogTitle>
            <DialogDescription>
              {editingTicket ? "Update ticket type details" : "Create a new ticket tier"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ticket Name *</Label>
              <Input
                id="name"
                value={ticketForm.name}
                onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                placeholder="e.g., Early Bird, VIP, General Admission"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={ticketForm.description}
                onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                placeholder="Ticket description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={ticketForm.type}
                  onValueChange={(value) => setTicketForm({ ...ticketForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="donation">Donation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {ticketForm.type === "paid" && (
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={ticketForm.price}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, price: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              )}
            </div>

            {ticketForm.type === "donation" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minDonation">Min Donation (₹)</Label>
                  <Input
                    id="minDonation"
                    type="number"
                    value={ticketForm.minDonation}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, minDonation: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxDonation">Max Donation (₹)</Label>
                  <Input
                    id="maxDonation"
                    type="number"
                    value={ticketForm.maxDonation}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, maxDonation: parseFloat(e.target.value) || 1000 })
                    }
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity Available (leave empty for unlimited)</Label>
              <Input
                id="quantity"
                type="number"
                value={ticketForm.quantity || ""}
                onChange={(e) =>
                  setTicketForm({
                    ...ticketForm,
                    quantity: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                placeholder="Unlimited"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salesStart">Sales Start Date</Label>
                <Input
                  id="salesStart"
                  type="date"
                  value={ticketForm.salesStart}
                  onChange={(e) => setTicketForm({ ...ticketForm, salesStart: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salesEnd">Sales End Date</Label>
                <Input
                  id="salesEnd"
                  type="date"
                  value={ticketForm.salesEnd}
                  onChange={(e) => setTicketForm({ ...ticketForm, salesEnd: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                checked={ticketForm.active}
                onChange={(e) => setTicketForm({ ...ticketForm, active: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="active" className="cursor-pointer">
                Active (visible to customers)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTicketDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveTicketType} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : editingTicket ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
