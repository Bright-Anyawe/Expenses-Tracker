"use client"

import { useState, useEffect } from "react"
import { ExpenseForm } from "@/components/expense-form"
import { ExpenseList } from "@/components/expense-list"
import { WeeklySummary } from "@/components/weekly-summary"
import { ExpenseChart } from "@/components/expense-chart"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { exportToCSV } from "@/lib/export-utils"
import { sampleExpenses } from "@/lib/sample-data"
import type { Expense } from "@/lib/types"
import { StorageInfo } from "@/components/storage-info"
import { saveExpenses, loadExpenses, clearExpenses, isLocalStorageAvailable } from "@/lib/storage-utils"
import { AlertCircle, Download, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  // Check if localStorage is available
  const [storageAvailable, setStorageAvailable] = useState(true)

  // Load expenses from localStorage on initial render
  useEffect(() => {
    const isAvailable = isLocalStorageAvailable()
    setStorageAvailable(isAvailable)

    if (isAvailable) {
      const savedData = loadExpenses()
      if (savedData) {
        setExpenses(savedData)
      } else {
        // Use sample data if no saved expenses
        setExpenses(sampleExpenses)
      }
    } else {
      // If localStorage is not available, use sample data
      setExpenses(sampleExpenses)
    }
  }, [])

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (storageAvailable && expenses.length > 0) {
      saveExpenses(expenses)
    }
  }, [expenses, storageAvailable])

  const handleAddExpense = (expense: Expense) => {
    if (editingExpense) {
      setExpenses(expenses.map((e) => (e.id === expense.id ? expense : e)))
      setEditingExpense(null)
    } else {
      setExpenses([...expenses, { ...expense, id: Date.now().toString() }])
    }
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
  }

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  const handleExportCSV = () => {
    exportToCSV(expenses, "weekly-expenses")
  }

  const handleClearAllData = () => {
    if (window.confirm("Are you sure you want to clear all expense data? This cannot be undone.")) {
      if (clearExpenses()) {
        setExpenses([])
      }
    }
  }

  return (
    <main className="container mx-auto py-6 px-4 max-w-6xl custom-fade-in">
      <div className="flex flex-col items-center mb-8 custom-slide-up">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Personal Expense Tracker</h1>
        <p className="text-muted-foreground text-center max-w-2xl">
          Track your daily expenses, visualize spending patterns, and manage your personal finances with ease.
        </p>
      </div>

      {storageAvailable ? (
        <div className="custom-slide-up">
          <StorageInfo />
        </div>
      ) : (
        <div className="custom-slide-up">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Local Storage Unavailable</AlertTitle>
            <AlertDescription>
              Your browser doesn't support or has disabled local storage. Your expense data will not be saved between
              sessions.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1 custom-slide-up">
          <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300 card-hover">
            <CardHeader className="gradient-blue">
              <CardTitle>Add Expense</CardTitle>
              <CardDescription>Record your daily expenses</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ExpenseForm onSubmit={handleAddExpense} initialExpense={editingExpense} />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 custom-slide-up">
          <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300 card-hover">
            <CardHeader className="gradient-blue flex flex-row items-center justify-between">
              <div>
                <CardTitle>Weekly Overview</CardTitle>
                <CardDescription>Your spending summary and trends</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleExportCSV} variant="outline" size="sm" className="flex items-center gap-1 focus-ring">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
                <Button onClick={handleClearAllData} variant="outline" size="sm" className="text-destructive flex items-center gap-1 focus-ring">
                  <Trash2 className="h-4 w-4" />
                  <span>Clear All</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="chart" className="w-full">
                <TabsList className="mb-4 w-full grid grid-cols-2">
                  <TabsTrigger value="chart" className="focus-ring">Visualization</TabsTrigger>
                  <TabsTrigger value="summary" className="focus-ring">Summary</TabsTrigger>
                </TabsList>
                <TabsContent value="chart">
                  <ExpenseChart expenses={expenses} />
                </TabsContent>
                <TabsContent value="summary">
                  <WeeklySummary expenses={expenses} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="custom-slide-up">
        <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300 card-hover">
          <CardHeader className="gradient-blue">
            <CardTitle>Expense History</CardTitle>
            <CardDescription>View and manage your recorded expenses</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ExpenseList expenses={expenses} onEdit={handleEditExpense} onDelete={handleDeleteExpense} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
