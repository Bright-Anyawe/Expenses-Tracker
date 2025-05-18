import type { Expense } from "./types"
import { format, subDays } from "date-fns"

// Generate sample data for the past week
export const sampleExpenses: Expense[] = [
  {
    id: "1",
    date: format(subDays(new Date(), 0), "yyyy-MM-dd"),
    amount: "12.50",
    category: "Food",
    notes: "Lunch at cafe",
  },
  {
    id: "2",
    date: format(subDays(new Date(), 0), "yyyy-MM-dd"),
    amount: "5.75",
    category: "Transport",
    notes: "Bus fare",
  },
  {
    id: "3",
    date: format(subDays(new Date(), 1), "yyyy-MM-dd"),
    amount: "32.99",
    category: "Shopping",
    notes: "New t-shirt",
  },
  {
    id: "4",
    date: format(subDays(new Date(), 2), "yyyy-MM-dd"),
    amount: "8.25",
    category: "Food",
    notes: "Coffee and pastry",
  },
  {
    id: "5",
    date: format(subDays(new Date(), 2), "yyyy-MM-dd"),
    amount: "15.00",
    category: "Entertainment",
    notes: "Movie ticket",
  },
  {
    id: "6",
    date: format(subDays(new Date(), 3), "yyyy-MM-dd"),
    amount: "45.50",
    category: "Bills",
    notes: "Internet bill",
  },
  {
    id: "7",
    date: format(subDays(new Date(), 4), "yyyy-MM-dd"),
    amount: "22.75",
    category: "Food",
    notes: "Dinner with friends",
  },
  {
    id: "8",
    date: format(subDays(new Date(), 5), "yyyy-MM-dd"),
    amount: "9.99",
    category: "Entertainment",
    notes: "Music subscription",
  },
  {
    id: "9",
    date: format(subDays(new Date(), 6), "yyyy-MM-dd"),
    amount: "7.50",
    category: "Transport",
    notes: "Taxi ride",
  },
  {
    id: "10",
    date: format(subDays(new Date(), 6), "yyyy-MM-dd"),
    amount: "18.25",
    category: "Shopping",
    notes: "Household items",
  },
]
