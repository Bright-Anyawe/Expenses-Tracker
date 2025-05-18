import type { Expense } from "./types"
import { format, parseISO } from "date-fns"

export function exportToCSV(expenses: Expense[], filename: string) {
  // Filter and sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Define CSV headers
  const headers = ["Date", "Category", "Amount", "Notes"]

  // Convert expenses to CSV rows
  const rows = sortedExpenses.map((expense) => [
    format(parseISO(expense.date), "yyyy-MM-dd"),
    expense.category,
    Number(expense.amount).toFixed(2),
    expense.notes || "",
  ])

  // Combine headers and rows
  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

  // Create a download link
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}-${format(new Date(), "yyyy-MM-dd")}.csv`)
  link.style.visibility = "hidden"

  // Append the link to the document
  document.body.appendChild(link)

  // Trigger the download
  link.click()

  // Clean up
  document.body.removeChild(link)
}
