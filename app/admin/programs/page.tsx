"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Plus, Edit, Trash2, Users, FileText, Briefcase, Database, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Program {
  id: string
  name: string
  title: string
  description: string
  tagline?: string
  mission?: string
  color: string
  logo?: string
  status: string
  displayOrder: number
  _count?: {
    initiatives: number
    team: number
    casestudies: number
    clubs: number
    projects: number
    startups: number
    repositories: number
  }
}

const programTypes = [
  { value: "fosstar", label: "FOSStar", color: "#015ba7" },
  { value: "fosserve", label: "FOSServe", color: "#9333ea" },
  { value: "fossync", label: "FOSSynC", color: "#16a34a" },
  { value: "fosstorm", label: "FOSStorm", color: "#ea580c" },
  { value: "fosstart", label: "FOSStart", color: "#dc2626" },
  { value: "fossterage", label: "FOSSterage", color: "#0891b2" },
  { value: "fosspeaks", label: "FOSSpeaks", color: "#db2777" },
]

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [programToDelete, setProgramToDelete] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    tagline: "",
    mission: "",
    color: "#015ba7",
    logo: "",
    status: "active",
    displayOrder: 0,
  })

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const response = await fetch("/api/admin/programs")
      if (!response.ok) throw new Error("Failed to fetch programs")
      const data = await response.json()
      setPrograms(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch programs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingProgram
        ? `/api/admin/programs?id=${editingProgram.id}`
        : "/api/admin/programs"
      
      const response = await fetch(url, {
        method: editingProgram ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save program")

      toast({
        title: "Success",
        description: `Program ${editingProgram ? "updated" : "created"} successfully`,
      })

      resetForm()
      fetchPrograms()
      setActiveTab("overview")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save program",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (program: Program) => {
    setEditingProgram(program)
    setFormData({
      name: program.name,
      title: program.title,
      description: program.description,
      tagline: program.tagline || "",
      mission: program.mission || "",
      color: program.color,
      logo: program.logo || "",
      status: program.status,
      displayOrder: program.displayOrder,
    })
    setActiveTab("edit")
  }

  const handleDelete = async () => {
    if (!programToDelete) return

    try {
      const response = await fetch(`/api/admin/programs?id=${programToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete program")

      toast({
        title: "Success",
        description: "Program deleted successfully",
      })

      fetchPrograms()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete program",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setProgramToDelete(null)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      title: "",
      description: "",
      tagline: "",
      mission: "",
      color: "#015ba7",
      logo: "",
      status: "active",
      displayOrder: 0,
    })
    setEditingProgram(null)
  }

  const getColorName = (color: string) => {
    const program = programTypes.find(p => p.color === color)
    return program ? program.label : color
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Programs Management</h1>
          <p className="text-gray-500 mt-1">Manage all FOSS Andhra programs</p>
        </div>
        <Button onClick={() => setActiveTab("edit")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Program
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="edit">{editingProgram ? "Edit" : "Add"} Program</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {programs.map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${program.color}20` }}
                      >
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: program.color }}
                        />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {program.title}
                          <Badge variant={program.status === "active" ? "default" : "secondary"}>
                            {program.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{program.tagline || program.name}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(program)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setProgramToDelete(program.id)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{program.description}</p>
                  
                  {program.mission && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium mb-1">Mission</p>
                      <p className="text-sm text-gray-600">{program.mission}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span>{program._count?.initiatives || 0} Initiatives</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{program._count?.team || 0} Team Members</span>
                    </div>
                    {program.name === "fosserve" && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-gray-500" />
                        <span>{program._count?.casestudies || 0} Case Studies</span>
                      </div>
                    )}
                    {program.name === "fossync" && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{program._count?.clubs || 0} Clubs</span>
                      </div>
                    )}
                    {program.name === "fosstorm" && (
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <span>{program._count?.projects || 0} Projects</span>
                      </div>
                    )}
                    {program.name === "fosstart" && (
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <span>{program._count?.startups || 0} Startups</span>
                      </div>
                    )}
                    {program.name === "fossterage" && (
                      <div className="flex items-center gap-2 text-sm">
                        <Database className="h-4 w-4 text-gray-500" />
                        <span>{program._count?.repositories || 0} Repositories</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/admin/programs/${program.name}/initiatives`}>
                        Manage Initiatives
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/admin/programs/${program.name}/team`}>
                        Manage Team
                      </a>
                    </Button>
                    {program.name === "fosserve" && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/admin/programs/${program.name}/casestudies`}>
                          Case Studies
                        </a>
                      </Button>
                    )}
                    {program.name === "fossync" && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/admin/programs/${program.name}/clubs`}>
                          Manage Clubs
                        </a>
                      </Button>
                    )}
                    {program.name === "fosstorm" && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/admin/programs/${program.name}/projects`}>
                          Manage Projects
                        </a>
                      </Button>
                    )}
                    {program.name === "fosstart" && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/admin/programs/${program.name}/startups`}>
                          Manage Startups
                        </a>
                      </Button>
                    )}
                    {program.name === "fossterage" && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/admin/programs/${program.name}/repositories`}>
                          Manage Repositories
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>{editingProgram ? "Edit" : "Add"} Program</CardTitle>
              <CardDescription>
                {editingProgram ? "Update" : "Create a new"} program information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Program ID</Label>
                    <Select
                      value={formData.name}
                      onValueChange={(value) => {
                        const program = programTypes.find(p => p.value === value)
                        setFormData({
                          ...formData,
                          name: value,
                          color: program?.color || "#015ba7",
                        })
                      }}
                      disabled={!!editingProgram}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select program type" />
                      </SelectTrigger>
                      <SelectContent>
                        {programTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Program Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., FOSStar"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="Brief tagline for the program"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Program description"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mission">Mission Statement</Label>
                  <Textarea
                    id="mission"
                    value={formData.mission}
                    onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                    placeholder="Program mission statement"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="color">Brand Color</Label>
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayOrder">Display Order</Label>
                    <Input
                      id="displayOrder"
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) =>
                        setFormData({ ...formData, displayOrder: parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="/logos/fosstar-logo.svg"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingProgram ? "Update" : "Create"} Program
                  </Button>
                  {editingProgram && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        resetForm()
                        setActiveTab("overview")
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the program and all its related data (initiatives, team
              members, etc.). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProgramToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
