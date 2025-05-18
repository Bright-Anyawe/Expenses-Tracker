"use client"

import { useMemo, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Expense, ExpenseCategory } from "@/lib/types"
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, subDays } from "date-fns"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
} from "@/components/ui/chart"
import { 
  Bar, 
  BarChart, 
  Cell, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Line, 
  LineChart, 
  CartesianGrid, 
  Tooltip,
  Legend as RechartsLegend
} from "recharts"
import { getCategoryColorHex } from "@/lib/utils"

interface ExpenseChartProps {
  expenses: Expense[]
}

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  const [chartType, setChartType] = useState<"daily" | "category" | "trend" | "doughnut">("daily")

  // Get current week's start and end dates
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }) // Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 }) // Sunday

  // Get all days of the current week
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Filter expenses for the current week
  const weeklyExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const expenseDate = parseISO(expense.date)
      return expenseDate >= weekStart && expenseDate <= weekEnd
    })
  }, [expenses, weekStart, weekEnd])

  // Prepare data for daily chart
  const dailyChartData = useMemo(() => {
    const data = daysOfWeek.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd")
      const dayExpenses = weeklyExpenses.filter((expense) => expense.date === dateStr)
      const total = dayExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)

      return {
        name: format(day, "EEE"),
        value: total,
        fullDate: format(day, "MMM d, yyyy"),
      }
    })

    return data
  }, [weeklyExpenses, daysOfWeek])

  // Prepare data for category chart
  const categoryChartData = useMemo(() => {
    const categories: ExpenseCategory[] = ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Other"]
    const categoryTotals: { [key in ExpenseCategory]: number } = {
      Food: 0,
      Transport: 0,
      Entertainment: 0,
      Shopping: 0,
      Bills: 0,
      Other: 0,
    }

    weeklyExpenses.forEach((expense) => {
      categoryTotals[expense.category] += Number(expense.amount)
    })

    return categories
      .map((category) => ({
        name: category,
        value: categoryTotals[category],
        color: getCategoryColorHex(category),
      }))
      .filter((item) => item.value > 0)
  }, [weeklyExpenses])

  // Data for trend chart (last 14 days)
  const trendChartData = useMemo(() => {
    const days = Array.from({ length: 14 }, (_, i) => subDays(today, 13 - i))
    
    return days.map(day => {
      const dateStr = format(day, "yyyy-MM-dd")
      const dayExpenses = expenses.filter(expense => expense.date === dateStr)
      const total = dayExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
      
      return {
        name: format(day, "MMM d"),
        value: total,
        date: dateStr
      }
    })
  }, [expenses, today])

  // Custom tooltip component for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-md text-sm">
          <p className="font-medium">{payload[0].payload.fullDate || label}</p>
          <p className="text-blue-600">₵{payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 fade-in">
      <Tabs value={chartType} onValueChange={(value) => setChartType(value as "daily" | "category" | "trend" | "doughnut")}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="category">Categories</TabsTrigger>
          <TabsTrigger value="doughnut">Doughnut</TabsTrigger>
          <TabsTrigger value="trend">Trend</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="h-[300px] slide-up">
        {chartType === "daily" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `₵${value}`} width={50} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
        
        {chartType === "category" && (
          <div className="flex h-full">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`₵${value.toFixed(2)}`, 'Amount']}
                  />
                  <RechartsLegend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {chartType === "doughnut" && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryChartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {categoryChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`₵${value.toFixed(2)}`, 'Amount']}
              />
              <RechartsLegend />
            </PieChart>
          </ResponsiveContainer>
        )}

        {chartType === "trend" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `₵${value}`} width={50} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {weeklyExpenses.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">No expenses recorded for this week</div>
      )}
    </div>
  )
}
