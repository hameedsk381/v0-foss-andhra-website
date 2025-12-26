"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Filter, X, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export interface FilterOption {
  id: string
  label: string
  type: "select" | "date" | "dateRange" | "text"
  options?: Array<{ value: string; label: string }>
  placeholder?: string
}

interface AdvancedFiltersProps {
  filters: FilterOption[]
  values: Record<string, any>
  onChange: (values: Record<string, any>) => void
  onReset?: () => void
}

export function AdvancedFilters({
  filters,
  values,
  onChange,
  onReset,
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (id: string, value: any) => {
    onChange({ ...values, [id]: value })
  }

  const activeFiltersCount = Object.values(values).filter(
    (v) => v !== undefined && v !== null && v !== "" && v !== "all"
  ).length

  const handleReset = () => {
    const resetValues: Record<string, any> = {}
    filters.forEach((filter) => {
      resetValues[filter.id] = filter.type === "select" ? "all" : ""
    })
    onChange(resetValues)
    if (onReset) onReset()
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filters</h4>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-8 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
          </div>
          <div className="space-y-3">
            {filters.map((filter) => (
              <div key={filter.id} className="space-y-2">
                <Label className="text-sm">{filter.label}</Label>
                {filter.type === "select" && (
                  <Select
                    value={values[filter.id] || "all"}
                    onValueChange={(value) => handleFilterChange(filter.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={filter.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {filter.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {filter.type === "text" && (
                  <Input
                    placeholder={filter.placeholder}
                    value={values[filter.id] || ""}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  />
                )}
                {filter.type === "date" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !values[filter.id] && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {values[filter.id] ? (
                          format(new Date(values[filter.id]), "PPP")
                        ) : (
                          <span>{filter.placeholder || "Pick a date"}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={values[filter.id] ? new Date(values[filter.id]) : undefined}
                        onSelect={(date) =>
                          handleFilterChange(filter.id, date?.toISOString())
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

