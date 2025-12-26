"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { MoreHorizontal, Trash2, Mail, Download, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BulkActionsProps<T extends { id: string }> {
  selected: T[]
  onDelete?: (ids: string[]) => Promise<void>
  onExport?: (items: T[]) => void
  onSendEmail?: (items: T[]) => Promise<void>
  onApprove?: (ids: string[]) => Promise<void>
  onReject?: (ids: string[]) => Promise<void>
  customActions?: Array<{
    label: string
    icon?: React.ReactNode
    onClick: (items: T[]) => void | Promise<void>
    variant?: "default" | "destructive"
  }>
}

export function BulkActions<T extends { id: string }>({
  selected,
  onDelete,
  onExport,
  onSendEmail,
  onApprove,
  onReject,
  customActions,
}: BulkActionsProps<T>) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  if (selected.length === 0) return null

  const handleDelete = async () => {
    if (!onDelete) return

    setIsProcessing(true)
    try {
      await onDelete(selected.map((item) => item.id))
      toast({
        title: "Success",
        description: `${selected.length} item(s) deleted successfully`,
      })
      setShowDeleteDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete items",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleExport = () => {
    if (onExport) {
      onExport(selected)
      toast({
        title: "Export Started",
        description: `Exporting ${selected.length} item(s)`,
      })
    }
  }

  const handleSendEmail = async () => {
    if (!onSendEmail) return

    setIsProcessing(true)
    try {
      await onSendEmail(selected)
      toast({
        title: "Success",
        description: `Email sent to ${selected.length} recipient(s)`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send emails",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleApprove = async () => {
    if (!onApprove) return

    setIsProcessing(true)
    try {
      await onApprove(selected.map((item) => item.id))
      toast({
        title: "Success",
        description: `${selected.length} item(s) approved`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve items",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!onReject) return

    setIsProcessing(true)
    try {
      await onReject(selected.map((item) => item.id))
      toast({
        title: "Success",
        description: `${selected.length} item(s) rejected`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject items",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
          {selected.length} item(s) selected
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isProcessing}>
              <MoreHorizontal className="h-4 w-4 mr-2" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {onExport && (
              <DropdownMenuItem onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export Selected
              </DropdownMenuItem>
            )}
            {onSendEmail && (
              <DropdownMenuItem onClick={handleSendEmail}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </DropdownMenuItem>
            )}
            {onApprove && (
              <DropdownMenuItem onClick={handleApprove}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Selected
              </DropdownMenuItem>
            )}
            {onReject && (
              <DropdownMenuItem onClick={handleReject}>
                <XCircle className="h-4 w-4 mr-2" />
                Reject Selected
              </DropdownMenuItem>
            )}
            {customActions?.map((action, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => action.onClick(selected)}
                className={action.variant === "destructive" ? "text-red-600" : ""}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </DropdownMenuItem>
            ))}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selected.length} item(s). This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

