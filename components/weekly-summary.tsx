"use client"

import { useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Expense, ExpenseCategory } from "@/lib/types"
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns"
import { getCategoryColor, getCategoryColorHex } from "@/lib/utils"
import { TrendingDown, TrendingUp } from "lucide-react"

interface WeeklySummaryProps {
  expenses: Expense[]
}

export function WeeklySummary({ expenses }: WeeklySummaryProps) {
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

  // Calculate daily totals
  const dailyTotals = useMemo(() => {
    const totals: { [key: string]: number } = {}

    daysOfWeek.forEach((day) => {
      const dateStr = format(day, "yyyy-MM-dd")
      totals[dateStr] = 0
    })

    weeklyExpenses.forEach((expense) => {
      const dateStr = expense.date
      totals[dateStr] = (totals[dateStr] || 0) + Number(expense.amount)
    })

    return totals
  }, [weeklyExpenses, daysOfWeek])

  // Calculate category totals
  const categoryTotals = useMemo(() => {
    const categories: ExpenseCategory[] = ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Other"]
    const totals: { [key in ExpenseCategory]: number } = {
      Food: 0,
      Transport: 0,
      Entertainment: 0,
      Shopping: 0,
      Bills: 0,
      Other: 0,
    }

    weeklyExpenses.forEach((expense) => {
      totals[expense.category] += Number(expense.amount)
    })

    return totals
  }, [weeklyExpenses])

  // Calculate weekly total
  const weeklyTotal = useMemo(() => {
    return weeklyExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
  }, [weeklyExpenses])

  // Find highest and lowest days
  const { highestDay, lowestDay } = useMemo(() => {
    let highest = { date: "", amount: 0 };
    let lowest = { date: "", amount: Number.MAX_VALUE };
    
    Object.entries(dailyTotals).forEach(([date, amount]) => {
      if (amount > highest.amount) {
        highest = { date, amount };
      }
      if (amount < lowest.amount && amount > 0) {
        lowest = { date, amount };
      }
    });
    
    // Default lowest if all days are 0
    if (lowest.amount === Number.MAX_VALUE) {
      lowest = { date: Object.keys(dailyTotals)[0] || "", amount: 0 };
    }
    
    return {
      highestDay: {
        date: highest.date ? format(parseISO(highest.date), "EEEE") : "",
        amount: highest.amount
      },
      lowestDay: {
        date: lowest.date ? format(parseISO(lowest.date), "EEEE") : "",
        amount: lowest.amount
      }
    };
  }, [dailyTotals]);

  return (
    <div className="space-y-6 fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 slide-up">
        <Card className="gradient-blue border-none shadow-md card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Weekly Total</h3>
              <span className="h-5 w-5 text-blue-500 flex items-center justify-center font-bold">₵</span>
            </div>
            <p className="text-3xl font-bold mt-2">₵{weeklyTotal.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d")}
            </p>
          </CardContent>
        </Card>
        
        <Card className="gradient-green border-none shadow-md card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Lowest Day</h3>
              <TrendingDown className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold mt-2">₵{lowestDay.amount.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-1">{lowestDay.date}</p>
          </CardContent>
        </Card>
        
        <Card className="gradient-red border-none shadow-md card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Highest Day</h3>
              <TrendingUp className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold mt-2">₵{highestDay.amount.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-1">{highestDay.date}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="slide-up">
          <Card className="shadow-md border-none card-hover">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Daily Spending</h3>
              {daysOfWeek.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd")
                const amount = dailyTotals[dateStr] || 0
                const percentage = weeklyTotal > 0 ? (amount / weeklyTotal) * 100 : 0

                return (
                  <div key={dateStr} className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{format(day, "EEE, MMM d")}</span>
                      <span className="text-sm font-medium">${amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-2 transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        <div className="slide-up">
          <Card className="shadow-md border-none card-hover">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Category Breakdown</h3>
              {Object.entries(categoryTotals)
                .filter(([_, amount]) => amount > 0)
                .sort(([_, a], [__, b]) => Number(b) - Number(a))
                .map(([category, amount]) => {
                  const percentage = weeklyTotal > 0 ? (amount / weeklyTotal) * 100 : 0
                  const color = getCategoryColorHex(category as ExpenseCategory)
                  
                  return (
                    <div key={category} className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <Badge variant="outline" className={getCategoryColor(category as ExpenseCategory)}>
                            {category}
                          </Badge>
                        </div>
                        <span className="text-sm font-medium">${amount.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${percentage}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  )
                })
              }
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground gradient-blue p-4 rounded-lg shadow-sm slide-up">
        <p>
          Week of {format(weekStart, "MMMM d")} - {format(weekEnd, "MMMM d, yyyy")}
        </p>
        <p className="mt-1 font-medium">Total expenses: ${weeklyTotal.toFixed(2)}</p>
      </div>
    </div>
  )
}
