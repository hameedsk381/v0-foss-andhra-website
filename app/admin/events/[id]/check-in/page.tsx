"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Scan, Search, Users, UserCheck } from "lucide-react"

interface Ticket {
  id: string
  attendeeName: string
  attendeeEmail: string
  attendeePhone: string | null
  checkInStatus: string
  checkInTime: string | null
  price: number
  ticketType: {
    name: string
  }
  order: {
    orderNumber: string
  }
}

interface EventStats {
  totalTickets: number
  checkedIn: number
  pending: number
  cancelled: number
}

export default function CheckInPage() {
  const params = useParams()
  const eventId = params.id as string
  
  const [qrInput, setQrInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [scanning, setScanning] = useState(false)
  const [message, setMessage] = useState<{type: "success" | "error", text: string} | null>(null)
  const [stats, setStats] = useState<EventStats | null>(null)
  const [recentCheckIns, setRecentCheckIns] = useState<Ticket[]>([])
  const [searchResults, setSearchResults] = useState<Ticket[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    fetchStats()
    fetchRecentCheckIns()
  }, [eventId])

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/admin/events/${eventId}/check-in/stats`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const fetchRecentCheckIns = async () => {
    try {
      const response = await fetch(`/api/admin/events/${eventId}/check-in/recent`)
      if (response.ok) {
        const data = await response.json()
        setRecentCheckIns(data)
      }
    } catch (error) {
      console.error("Failed to fetch recent check-ins:", error)
    }
  }

  const handleQRScan = async () => {
    if (!qrInput.trim()) return

    setScanning(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/admin/events/${eventId}/check-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrData: qrInput })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: `✅ ${data.ticket.attendeeName} checked in successfully!` })
        setQrInput("")
        fetchStats()
        fetchRecentCheckIns()
        
        // Auto-clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: "error", text: data.error || "Check-in failed" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to process check-in" })
    } finally {
      setScanning(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(
        `/api/admin/events/${eventId}/check-in/search?q=${encodeURIComponent(searchQuery)}`
      )
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data)
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleManualCheckIn = async (ticketId: string) => {
    try {
      const response = await fetch(`/api/admin/events/${eventId}/check-in/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId })
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Manual check-in successful!" })
        fetchStats()
        fetchRecentCheckIns()
        handleSearch() // Refresh search results
        setTimeout(() => setMessage(null), 3000)
      } else {
        const data = await response.json()
        setMessage({ type: "error", text: data.error || "Manual check-in failed" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to process manual check-in" })
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Event Check-In</h1>
          <p className="text-muted-foreground">Scan QR codes or search attendees</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTickets}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Checked In</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.checkedIn}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalTickets > 0 ? Math.round((stats.checkedIn / stats.totalTickets) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Scan className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Message Alert */}
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* QR Scanner Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              QR Code Scanner
            </CardTitle>
            <CardDescription>Scan or paste the QR code data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Paste QR code data here..."
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleQRScan()}
                autoFocus
              />
              <Button 
                onClick={handleQRScan} 
                disabled={scanning || !qrInput.trim()}
              >
                {scanning ? "Processing..." : "Check In"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Tip: Focus this field and use a barcode scanner to scan QR codes quickly
            </p>
          </CardContent>
        </Card>

        {/* Manual Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Manual Search
            </CardTitle>
            <CardDescription>Search by name, email, or order number</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search attendees..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (!e.target.value.trim()) setSearchResults([])
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {searchResults.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{ticket.attendeeName}</p>
                      <p className="text-sm text-muted-foreground">{ticket.attendeeEmail}</p>
                      <p className="text-xs text-muted-foreground">
                        {ticket.ticketType.name} • Order #{ticket.order.orderNumber}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        ticket.checkInStatus === "checked_in" ? "default" : 
                        ticket.checkInStatus === "cancelled" ? "destructive" : 
                        "secondary"
                      }>
                        {ticket.checkInStatus}
                      </Badge>
                      {ticket.checkInStatus === "pending" && (
                        <Button 
                          size="sm" 
                          onClick={() => handleManualCheckIn(ticket.id)}
                        >
                          Check In
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Check-Ins */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Check-Ins</CardTitle>
          <CardDescription>Last 10 attendees checked in</CardDescription>
        </CardHeader>
        <CardContent>
          {recentCheckIns.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No check-ins yet</p>
          ) : (
            <div className="space-y-2">
              {recentCheckIns.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">{ticket.attendeeName}</p>
                      <p className="text-sm text-muted-foreground">{ticket.attendeeEmail}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{ticket.ticketType.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {ticket.checkInTime ? new Date(ticket.checkInTime).toLocaleString() : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
