"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div className={cn("rounded-md border", className)} ref={ref} {...props} />
})
Chart.displayName = "Chart"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("p-4", className)} ref={ref} {...props} />
  },
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("rounded-md border bg-popover p-2 text-sm shadow-sm", className)} ref={ref} {...props} />
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn(className)} ref={ref} {...props} />
  },
)
ChartTooltip.displayName = "ChartTooltip"

const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("flex flex-col space-y-1 text-sm", className)} ref={ref} {...props} />
  },
)
ChartLegend.displayName = "ChartLegend"

const ChartLegendItem = React.forwardRef<
  HTMLDivElement,
  { color: string; label: string } & React.HTMLAttributes<HTMLDivElement>
>(({ className, color, label, ...props }, ref) => {
  return (
    <div className={cn("flex items-center space-x-2", className)} ref={ref} {...props}>
      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  )
})
ChartLegendItem.displayName = "ChartLegendItem"

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendItem }
