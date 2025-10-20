"use client"

import { useEffect, useState } from "react"
import { notFound, useParams, useRouter } from "next/navigation"
import { getProgramConfig, getContentTypeConfig } from "@/lib/program-config"
import DynamicForm from "@/components/admin/DynamicForm"
import DynamicList from "@/components/admin/DynamicList"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function ContentTypeManagementPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const programId = params.id as string
  const contentTypeId = params.contentType as string

  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)

  const program = getProgramConfig(programId)
  const contentType = getContentTypeConfig(programId, contentTypeId)

  useEffect(() => {
    fetchData()
  }, [programId, contentTypeId])

  if (!program || !contentType) {
    notFound()
  }

  const fetchData = async () => {
    setIsFetching(true)
    try {
      const response = await fetch(
        `/api/admin/programs/${programId}/${contentTypeId}`
      )
      if (response.ok) {
        const result = await response.json()
        setData(result.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      })
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (formData: Record<string, any>) => {
    setIsLoading(true)
    try {
      const url = editingItem
        ? `/api/admin/programs/${programId}/${contentTypeId}/${editingItem.id}`
        : `/api/admin/programs/${programId}/${contentTypeId}`

      const method = editingItem ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save")
      }

      toast({
        title: "Success",
        description: `${contentType.singularName} ${editingItem ? "updated" : "created"} successfully`,
      })

      // Reset form and refresh data
      setEditingItem(null)
      setShowForm(false)
      fetchData()
    } catch (error) {
      console.error("Failed to save:", error)
      toast({
        title: "Error",
        description: "Failed to save. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `/api/admin/programs/${programId}/${contentTypeId}/${id}`,
        { method: "DELETE" }
      )

      if (!response.ok) {
        throw new Error("Failed to delete")
      }

      toast({
        title: "Success",
        description: `${contentType.singularName} deleted successfully`,
      })

      fetchData()
    } catch (error) {
      console.error("Failed to delete:", error)
      toast({
        title: "Error",
        description: "Failed to delete. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/programs/${programId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: program.color }}>
              {contentType.pluralName}
            </h1>
            <p className="text-muted-foreground">{contentType.description}</p>
          </div>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            style={{ backgroundColor: program.color }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add {contentType.singularName}
          </Button>
        )}
      </div>

      {/* Form Card */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingItem ? "Edit" : "Create New"} {contentType.singularName}
            </CardTitle>
            <CardDescription>
              Fill in the details below to {editingItem ? "update" : "create"} a{" "}
              {contentType.singularName.toLowerCase()}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DynamicForm
              fields={contentType.fields}
              initialData={editingItem || {}}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              submitLabel={editingItem ? "Update" : "Create"}
            />
            {editingItem && (
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="w-full mt-4"
              >
                Cancel Edit
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Data List */}
      <Card>
        <CardHeader>
          <CardTitle>All {contentType.pluralName}</CardTitle>
          <CardDescription>
            {isFetching ? "Loading..." : `${data.length} item(s) found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : (
            <DynamicList
              contentType={contentType}
              data={data}
              onEdit={handleEdit}
              onDelete={handleDelete}
              programId={programId}
              onReorder={fetchData}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
