import type { Expense } from "./types"

const STORAGE_KEY = "expenses"

/**
 * Save expenses to localStorage
 */
export function saveExpenses(expenses: Expense[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
    return true
  } catch (error) {
    console.error("Error saving expenses to localStorage:", error)
    return false
  }
}

/**
 * Load expenses from localStorage
 */
export function loadExpenses(): Expense[] | null {
  try {
    const savedExpenses = localStorage.getItem(STORAGE_KEY)
    return savedExpenses ? JSON.parse(savedExpenses) : null
  } catch (error) {
    console.error("Error loading expenses from localStorage:", error)
    return null
  }
}

/**
 * Clear all expenses from localStorage
 */
export function clearExpenses(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error("Error clearing expenses from localStorage:", error)
    return false
  }
}

/**
 * Check if localStorage is available in the browser
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = "__storage_test__"
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}
