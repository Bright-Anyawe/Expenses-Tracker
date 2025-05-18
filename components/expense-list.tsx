"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import type { Expense } from "@/lib/types"
import { Edit, MoreHorizontal, Search, Trash2 } from "lucide-react"
import { getCategoryColor } from "@/lib/utils"

interface ExpenseListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter expenses based on search term
  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.amount.toString().includes(searchTerm),
  )

  // Sort expenses by date (newest first)
  const sortedExpenses = [...filteredExpenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Paginate expenses
  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage)
  const paginatedExpenses = sortedExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-4 fade-in">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 focus-ring transition-all border-none shadow-sm"
        />
      </div>

      {paginatedExpenses.length > 0 ? (
        <div className="border rounded-md shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedExpenses.map((expense, index) => (
                <tr
                  key={expense.id}
                  className="hover:bg-muted/50 transition-colors animate-in slide-in-from-left-5 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell>{format(parseISO(expense.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    <div className="transition-transform hover:scale-105 active:scale-95">
                      <Badge variant="outline" className={getCategoryColor(expense.category)}>
                        {expense.category}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${Number(expense.amount).toFixed(2)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{expense.notes || "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="transition-transform hover:scale-110 active:scale-90">
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(expense)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(expense.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </tr>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
          {searchTerm ? "No expenses match your search" : "No expenses recorded yet"}
        </div>
      )}

      {totalPages > 1 && (
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <div className="transition-transform hover:scale-105 active:scale-95">
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </div>
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <div className="transition-transform hover:scale-105 active:scale-95">
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={page === currentPage}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </div>
                </PaginationItem>
              ))}

              <PaginationItem>
                <div className="transition-transform hover:scale-105 active:scale-95">
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </div>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
