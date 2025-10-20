"use client"

import { useState } from "react"
import { ContentType } from "@/lib/program-config"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, GripVertical } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useToast } from "@/hooks/use-toast"

interface DynamicListProps {
  contentType: ContentType
  data: any[]
  onEdit: (item: any) => void
  onDelete: (id: string) => void
  onView?: (item: any) => void
  programId: string
  onReorder?: () => void
}

interface SortableRowProps {
  item: any
  displayFields: string[]
  formatValue: (value: any, fieldName: string) => any
  onEdit: (item: any) => void
  onDelete: (id: string) => void
  onView?: (item: any) => void
  contentType: ContentType
}

function SortableRow({
  item,
  displayFields,
  formatValue,
  onEdit,
  onDelete,
  onView,
  contentType,
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-12">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      </TableCell>
      {displayFields.map((fieldName) => (
        <TableCell key={fieldName}>
          {formatValue(item[fieldName], fieldName)}
        </TableCell>
      ))}
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(item)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(item)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm(`Delete this ${contentType.singularName.toLowerCase()}?`)) {
                onDelete(item.id)
              }
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default function DynamicList({
  contentType,
  data,
  onEdit,
  onDelete,
  onView,
  programId,
  onReorder,
}: DynamicListProps) {
  const { toast } = useToast()
  const [items, setItems] = useState(data)
  const [isReordering, setIsReordering] = useState(false)

  // Update items when data changes
  useState(() => {
    setItems(data)
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Determine which fields to show in the table
  const displayFields = contentType.defaultOrder || 
    contentType.fields.slice(0, 4).map(f => f.name)

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = items.findIndex((item) => item.id === active.id)
    const newIndex = items.findIndex((item) => item.id === over.id)

    const newItems = arrayMove(items, oldIndex, newIndex)
    setItems(newItems)

    // Update order in database
    setIsReordering(true)
    try {
      const response = await fetch(
        `/api/admin/programs/${programId}/${contentType.id}/reorder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: newItems.map((item, index) => ({
              id: item.id,
              order: index,
            })),
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to reorder")
      }

      toast({
        title: "Success",
        description: "Order updated successfully",
      })

      if (onReorder) {
        onReorder()
      }
    } catch (error) {
      console.error("Reorder error:", error)
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      })
      // Revert on error
      setItems(data)
    } finally {
      setIsReordering(false)
    }
  }

  const formatValue = (value: any, fieldName: string) => {
    if (!value) return "-"

    const field = contentType.fields.find((f) => f.name === fieldName)

    // JSON field - show array items or truncated JSON
    if (field?.type === "json") {
      try {
        const parsed = typeof value === "string" ? JSON.parse(value) : value
        if (Array.isArray(parsed)) {
          return parsed.join(", ")
        }
        return JSON.stringify(parsed).substring(0, 50) + "..."
      } catch {
        return String(value).substring(0, 50)
      }
    }

    // Rich text - strip HTML and truncate
    if (field?.type === "richtext") {
      return value.replace(/<[^>]*>/g, "").substring(0, 100) + "..."
    }

    // Select field - show as badge
    if (field?.type === "select") {
      return <Badge variant="outline">{value}</Badge>
    }

    // Image - show thumbnail
    if (field?.type === "image") {
      return (
        <img
          src={value}
          alt="Thumbnail"
          className="w-10 h-10 object-cover rounded"
        />
      )
    }

    // URL - show as link
    if (field?.type === "url") {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Link ↗
        </a>
      )
    }

    // Date - format nicely
    if (field?.type === "date") {
      return new Date(value).toLocaleDateString()
    }

    // Number
    if (field?.type === "number") {
      return value.toLocaleString()
    }

    // Text/Textarea - truncate if too long
    return String(value).substring(0, 100)
  }

  const getFieldLabel = (fieldName: string) => {
    return contentType.fields.find((f) => f.name === fieldName)?.label || fieldName
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No {contentType.pluralName.toLowerCase()} yet.</p>
        <p className="text-sm">Create your first {contentType.singularName.toLowerCase()} using the form above.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {isReordering && (
        <div className="bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
          Updating order...
        </div>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </TableHead>
              {displayFields.map((fieldName) => (
                <TableHead key={fieldName}>
                  {getFieldLabel(fieldName)}
                </TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item) => (
                <SortableRow
                  key={item.id}
                  item={item}
                  displayFields={displayFields}
                  formatValue={formatValue}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                  contentType={contentType}
                />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </div>
  )
}
