"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import type { Expense, ExpenseCategory } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Calendar, DollarSign, FileText, Tag } from "lucide-react"
import { getCategoryColorHex } from "@/lib/utils"

interface ExpenseFormProps {
  onSubmit: (expense: Expense) => void
  initialExpense: Expense | null
}

export function ExpenseForm({ onSubmit, initialExpense }: ExpenseFormProps) {
  const [expense, setExpense] = useState<Expense>({
    id: "",
    date: format(new Date(), "yyyy-MM-dd"),
    amount: "",
    category: "Food",
    notes: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialExpense) {
      setExpense(initialExpense)
    }
  }, [initialExpense])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setExpense({ ...expense, [name]: value })
    setError(null)
  }

  const handleCategoryChange = (value: string) => {
    setExpense({ ...expense, category: value as ExpenseCategory })
    setError(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!expense.date) {
      setError("Please select a date")
      return
    }

    if (!expense.amount || isNaN(Number(expense.amount)) || Number(expense.amount) <= 0) {
      setError("Please enter a valid amount greater than 0")
      return
    }

    if (!expense.category) {
      setError("Please select a category")
      return
    }

    setIsSubmitting(true)
    
    // Submit with slight delay for animation
    setTimeout(() => {
      onSubmit(expense)
      setIsSubmitting(false)
  
      // Reset form if not editing
      if (!initialExpense) {
        setExpense({
          id: "",
          date: format(new Date(), "yyyy-MM-dd"),
          amount: "",
          category: "Food",
          notes: "",
        })
      }
    }, 300)
  }

  // Get color for category button
  const getCategoryColor = (category: ExpenseCategory) => {
    const colorHex = getCategoryColorHex(category);
    return `bg-[${colorHex}] bg-opacity-10 border-[${colorHex}] text-[${colorHex}]`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 fade-in">
      {error && (
        <div className="animate-in slide-in-from-top duration-300">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="space-y-2 slide-up">
        <Label htmlFor="date" className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          Date
        </Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={expense.date}
          onChange={handleChange}
          max={format(new Date(), "yyyy-MM-dd")}
          className="border-input focus-ring transition-all"
        />
      </div>

      <div className="space-y-2 slide-up">
        <Label htmlFor="amount" className="flex items-center gap-2">
          <span className="h-4 w-4 text-muted-foreground flex items-center justify-center font-bold">₵</span>
          Amount
        </Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={expense.amount}
          onChange={handleChange}
          className="border-input focus-ring transition-all"
        />
      </div>

      <div className="space-y-2 slide-up">
        <Label htmlFor="category" className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          Category
        </Label>
        <Select value={expense.category} onValueChange={handleCategoryChange}>
          <SelectTrigger id="category" className="focus-ring transition-all">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Food">Food</SelectItem>
            <SelectItem value="Transport">Transport</SelectItem>
            <SelectItem value="Entertainment">Entertainment</SelectItem>
            <SelectItem value="Shopping">Shopping</SelectItem>
            <SelectItem value="Bills">Bills</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 slide-up">
        <Label htmlFor="notes" className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          Notes (Optional)
        </Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Add any additional details..."
          value={expense.notes}
          onChange={handleChange}
          rows={3}
          className="border-input focus-ring transition-all resize-none"
        />
      </div>

      <div className="slide-up">
        <Button 
          type="submit" 
          className="w-full relative"
          disabled={isSubmitting}
        >
          <span className={isSubmitting ? 'opacity-0' : 'opacity-100 transition-opacity'}>
            {initialExpense ? "Update Expense" : "Add Expense"}
          </span>
          
          {isSubmitting && (
            <div className="absolute inset-0 flex items-center justify-center animate-in fade-in-0">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </Button>
      </div>
    </form>
  )
}
