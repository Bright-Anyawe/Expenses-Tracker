import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ExpenseCategory } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCategoryColor(category: ExpenseCategory): string {
  switch (category) {
    case "Food":
      return "bg-green-100 text-green-800 hover:bg-green-200"
    case "Transport":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    case "Entertainment":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200"
    case "Shopping":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    case "Bills":
      return "bg-red-100 text-red-800 hover:bg-red-200"
    case "Other":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}

export function getCategoryColorHex(category: ExpenseCategory): string {
  switch (category) {
    case "Food":
      return "#22c55e"
    case "Transport":
      return "#3b82f6"
    case "Entertainment":
      return "#a855f7"
    case "Shopping":
      return "#eab308"
    case "Bills":
      return "#ef4444"
    case "Other":
      return "#6b7280"
    default:
      return "#6b7280"
  }
}
