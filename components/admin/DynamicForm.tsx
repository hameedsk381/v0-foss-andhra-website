"use client"

import { useState } from "react"
import { ContentField } from "@/lib/program-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import dynamic from "next/dynamic"
import ImageUpload from "@/components/admin/ImageUpload"

// TipTap editor with SSR disabled
const RichTextField = dynamic(
  () => import("@/components/admin/RichTextField"),
  { 
    ssr: false,
    loading: () => <div className="h-64 border rounded-md animate-pulse bg-muted" />
  }
)

interface DynamicFormProps {
  fields: ContentField[]
  initialData?: Record<string, any>
  onSubmit: (data: Record<string, any>) => Promise<void>
  isLoading?: boolean
  submitLabel?: string
}

export default function DynamicForm({
  fields,
  initialData = {},
  onSubmit,
  isLoading = false,
  submitLabel = "Save",
}: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`
      }

      // Validate JSON fields
      if (field.type === "json" && formData[field.name]) {
        try {
          JSON.parse(formData[field.name])
        } catch {
          newErrors[field.name] = "Invalid JSON format"
        }
      }

      // Validate URL fields
      if (field.type === "url" && formData[field.name]) {
        try {
          new URL(formData[field.name])
        } catch {
          newErrors[field.name] = "Invalid URL format"
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    await onSubmit(formData)
  }

  const renderField = (field: ContentField) => {
    const value = formData[field.name] || ""

    switch (field.type) {
      case "text":
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={isLoading}
          />
        )

      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={isLoading}
            rows={4}
          />
        )

      case "richtext":
        return (
          <RichTextField
            value={value}
            onChange={(content: string) => handleChange(field.name, content)}
            placeholder={field.placeholder}
          />
        )

      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) =>
              handleChange(field.name, parseInt(e.target.value) || 0)
            }
            placeholder={field.placeholder}
            disabled={isLoading}
          />
        )

      case "url":
        return (
          <Input
            type="url"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder || "https://example.com"}
            disabled={isLoading}
          />
        )

      case "image":
        return (
          <ImageUpload
            value={value}
            onChange={(url: string) => handleChange(field.name, url)}
            label={field.label}
            disabled={isLoading}
          />
        )

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                disabled={isLoading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date: Date | undefined) =>
                  handleChange(field.name, date?.toISOString())
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )

      case "select":
        return (
          <Select
            value={value}
            onValueChange={(val) => handleChange(field.name, val)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "json":
        return (
          <Textarea
            value={typeof value === "string" ? value : JSON.stringify(value, null, 2)}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder || '{"key": "value"}'}
            disabled={isLoading}
            rows={6}
            className="font-mono text-sm"
          />
        )

      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {field.description && (
            <p className="text-sm text-muted-foreground">{field.description}</p>
          )}
          {renderField(field)}
          {errors[field.name] && (
            <p className="text-sm text-red-500">{errors[field.name]}</p>
          )}
        </div>
      ))}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  )
}
