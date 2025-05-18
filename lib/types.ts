export type ExpenseCategory = "Food" | "Transport" | "Entertainment" | "Shopping" | "Bills" | "Other"

export interface Expense {
  id: string
  date: string
  amount: string | number
  category: ExpenseCategory
  notes?: string
}
