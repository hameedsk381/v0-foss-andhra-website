"use client"

import { CheckCircle2, Calendar, CreditCard, Award, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface ActivityItem {
  id: string
  type: "membership" | "event" | "payment" | "certificate" | "notification"
  title: string
  description?: string
  date: Date
  status?: "success" | "pending" | "failed"
}

interface ActivityTimelineProps {
  activities: ActivityItem[]
  limit?: number
}

const iconMap = {
  membership: CreditCard,
  event: Calendar,
  payment: CreditCard,
  certificate: Award,
  notification: Bell,
}

const statusColors = {
  success: "bg-green-500",
  pending: "bg-yellow-500",
  failed: "bg-red-500",
}

export function ActivityTimeline({ activities, limit = 10 }: ActivityTimelineProps) {
  const displayedActivities = activities.slice(0, limit)

  return (
    <div className="space-y-4">
      {displayedActivities.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          No recent activity
        </p>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
          
          <div className="space-y-6">
            {displayedActivities.map((activity, index) => {
              const Icon = iconMap[activity.type]
              const isLast = index === displayedActivities.length - 1

              return (
                <div key={activity.id} className="relative flex gap-4">
                  {/* Icon */}
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
                    <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    {activity.status && (
                      <div
                        className={cn(
                          "absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800",
                          statusColors[activity.status]
                        )}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {activity.title}
                        </p>
                        {activity.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {activity.description}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                        {formatDistanceToNow(new Date(activity.date), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

