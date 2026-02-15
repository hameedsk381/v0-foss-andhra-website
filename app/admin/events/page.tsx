"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Calendar, Plus, Edit, Trash2, Save, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { DataTable, Column } from "@/components/admin/data-table"
import { BulkActions } from "@/components/admin/bulk-actions"
import { AdvancedFilters, FilterOption } from "@/components/admin/advanced-filters"
import { exportToCSV, printTable } from "@/components/admin/export-utils"
import { format } from "date-fns"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  type: string
  status: string
  maxAttendees: number
  currentAttendees: number
  program: string
}

export default function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [saving, setSaving] = useState(false)
  const [filterValues, setFilterValues] = useState({
    type: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
  })
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([])
  const { toast } = useToast()

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "Workshop",
    status: "upcoming",
    maxAttendees: 50,
    program: "",
    externalTicketUrl: "",
    externalRegisterUrl: "",
    gallery: [] as string[],
  })

  useEffect(() => {
    fetchEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValues.type, filterValues.status])

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams()
      if (filterValues.type !== "all") params.append("type", filterValues.type)
      if (filterValues.status !== "all") params.append("status", filterValues.status)

      const res = await fetch(`/api/admin/events?${params.toString()}`)
      const data = await res.json()
      if (data.success) {
        setEvents(data.data)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const openNewEventDialog = () => {
    setEditingEvent(null)
    setEventForm({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      type: "Workshop",
      status: "upcoming",
      maxAttendees: 50,
      program: "",
      externalTicketUrl: "",
      externalRegisterUrl: "",
      gallery: [],
    })
    setShowDialog(true)
  }

  const openEditEventDialog = (event: Event) => {
    setEditingEvent(event)
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0],
      time: event.time,
      location: event.location,
      type: event.type,
      status: event.status,
      maxAttendees: event.maxAttendees,
      program: event.program || "",
      externalTicketUrl: (event as any).externalTicketUrl || "",
      externalRegisterUrl: (event as any).externalRegisterUrl || "",
      gallery: (event as any).gallery ? JSON.parse((event as any).gallery) : [],
    })
    setShowDialog(true)
  }

  const saveEvent = async () => {
    if (!eventForm.title || !eventForm.date || !eventForm.location) {
      toast({
        title: "Validation Error",
        description: "Title, date, and location are required",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const url = editingEvent ? `/api/admin/events/${editingEvent.id}` : "/api/admin/events"
      const method = editingEvent ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventForm),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: "Success!",
          description: `Event ${editingEvent ? "updated" : "created"} successfully`,
        })
        setShowDialog(false)
        fetchEvents()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingEvent ? "update" : "create"} event`,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const deleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
      })
      const data = await res.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Event deleted successfully",
        })
        fetchEvents()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      })
    }
  }

  const handleExport = (items: Event[]) => {
    const columns = [
      { key: "title" as keyof Event, header: "Title" },
      { key: "type" as keyof Event, header: "Type" },
      { key: "status" as keyof Event, header: "Status" },
      { key: "location" as keyof Event, header: "Location" },
    ]
    exportToCSV(items, columns, { filename: "events" })
    toast({
      title: "Export Started",
      description: `Exporting ${items.length} event(s)`,
    })
  }

  const handlePrint = () => {
    const columns = [
      { key: "title" as keyof Event, header: "Title" },
      { key: "type" as keyof Event, header: "Type" },
      { key: "status" as keyof Event, header: "Status" },
      { key: "location" as keyof Event, header: "Location" },
    ]
    printTable(filteredEvents, columns, "Events Report")
  }

  const filterOptions: FilterOption[] = [
    {
      id: "type",
      label: "Event Type",
      type: "select",
      options: [
        { value: "Conference", label: "Conference" },
        { value: "Workshop", label: "Workshop" },
        { value: "Hackathon", label: "Hackathon" },
        { value: "Meetup", label: "Meetup" },
      ],
    },
    {
      id: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "upcoming", label: "Upcoming" },
        { value: "ongoing", label: "Ongoing" },
        { value: "past", label: "Past" },
        { value: "cancelled", label: "Cancelled" },
      ],
    },
    {
      id: "dateFrom",
      label: "From Date",
      type: "date",
      placeholder: "Start date",
    },
    {
      id: "dateTo",
      label: "To Date",
      type: "date",
      placeholder: "End date",
    },
  ]

  const columns: Column<Event>[] = [
    {
      id: "title",
      header: "Title",
      accessor: (event) => (
        <div>
          <div className="font-medium">{event.title}</div>
          <div className="text-xs text-gray-500">{event.program || "General"}</div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "type",
      header: "Type",
      accessor: (event) => <Badge variant="outline">{event.type}</Badge>,
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      accessor: (event) => (
        <Badge
          className={
            event.status === "upcoming"
              ? "bg-green-100 text-green-800"
              : event.status === "ongoing"
              ? "bg-blue-100 text-blue-800"
              : event.status === "cancelled"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }
        >
          {event.status}
        </Badge>
      ),
      sortable: true,
    },
    {
      id: "date",
      header: "Date",
      accessor: (event) => format(new Date(event.date), "MMM dd, yyyy"),
      sortable: true,
    },
    {
      id: "time",
      header: "Time",
      accessor: (event) => event.time,
    },
    {
      id: "location",
      header: "Location",
      accessor: (event) => event.location,
    },
    {
      id: "attendees",
      header: "Attendees",
      accessor: (event) => `${event.currentAttendees}/${event.maxAttendees}`,
    },
  ]

  const actions = (event: Event) => (
    <>
      <Button variant="ghost" size="sm" title="Edit" onClick={() => openEditEventDialog(event)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        title="Delete"
        onClick={() => deleteEvent(event.id)}
        className="text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  )

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (filterValues.type !== "all" && event.type !== filterValues.type) return false
      if (filterValues.status !== "all" && event.status !== filterValues.status) return false
      if (filterValues.dateFrom) {
        const eventDate = new Date(event.date)
        if (eventDate < new Date(filterValues.dateFrom)) return false
      }
      if (filterValues.dateTo) {
        const eventDate = new Date(event.date)
        if (eventDate > new Date(filterValues.dateTo)) return false
      }
      return true
    })
  }, [events, filterValues])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">Events Management</h1>
          <p className="text-gray-600 mt-1">Manage FOSS Andhra events</p>
        </div>
        <Button onClick={openNewEventDialog} className="w-full bg-primary sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <AdvancedFilters
              filters={filterOptions}
              values={filterValues}
              onChange={(values) => setFilterValues(values as typeof filterValues)}
            />
            <div className="hidden flex-1 xl:block" />
            <Button variant="outline" onClick={handlePrint} className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Print / Export
            </Button>
            <Button variant="outline" onClick={() => handleExport(filteredEvents)} className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedEvents.length > 0 && (
        <BulkActions selected={selectedEvents} onExport={handleExport} />
      )
      }

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredEvents}
            columns={columns}
            searchable
            searchPlaceholder="Search events by title, location, or program..."
            searchKeys={["title", "location", "program"]}
            pagination
            pageSize={10}
            selectable
            onSelectionChange={setSelectedEvents}
            loading={loading}
            emptyMessage="No events found"
            actions={actions}
          />
        </CardContent>
      </Card>

      {/* Event Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
            <DialogDescription>
              {editingEvent ? "Update event details" : "Create a new event for your community"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                placeholder="Enter event title"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Event Type *</Label>
                <Select value={eventForm.type} onValueChange={(value) => setEventForm({ ...eventForm, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conference">Conference</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Hackathon">Hackathon</SelectItem>
                    <SelectItem value="Meetup">Meetup</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={eventForm.status} onValueChange={(value) => setEventForm({ ...eventForm, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                placeholder="Event venue"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <RichTextEditor
                content={eventForm.description}
                onChange={(content) => setEventForm({ ...eventForm, description: content })}
                placeholder="Write detailed event information..."
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxAttendees">Max Attendees</Label>
                <Input
                  id="maxAttendees"
                  type="number"
                  value={eventForm.maxAttendees}
                  onChange={(e) => setEventForm({ ...eventForm, maxAttendees: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="program">Program</Label>
                <Select value={eventForm.program} onValueChange={(value) => setEventForm({ ...eventForm, program: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FOSStar">FOSStar</SelectItem>
                    <SelectItem value="FOSServe">FOSServe</SelectItem>
                    <SelectItem value="FOSSynC">FOSSynC</SelectItem>
                    <SelectItem value="FOSStorm">FOSStorm</SelectItem>
                    <SelectItem value="FOSStart">FOSStart</SelectItem>
                    <SelectItem value="FOSSterage">FOSSterage</SelectItem>
                    <SelectItem value="FOSSpeaks">FOSSpeaks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="externalTicketUrl">Ticket URL (Hi Events or External)</Label>
              <Input
                id="externalTicketUrl"
                value={eventForm.externalTicketUrl}
                onChange={(e) => setEventForm({ ...eventForm, externalTicketUrl: e.target.value })}
                placeholder="https://tickets.example.com/event"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="externalRegisterUrl">Registration URL (Optional)</Label>
              <Input
                id="externalRegisterUrl"
                value={eventForm.externalRegisterUrl}
                onChange={(e) => setEventForm({ ...eventForm, externalRegisterUrl: e.target.value })}
                placeholder="https://register.example.com/event"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveEvent} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : editingEvent ? "Update Event" : "Create Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
