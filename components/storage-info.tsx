"use client"

import { useState, useEffect } from "react"
import { Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { format } from "date-fns"

export function StorageInfo() {
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  useEffect(() => {
    // Update the last saved time whenever localStorage changes
    const handleStorageChange = () => {
      setLastSaved(format(new Date(), "h:mm:ss a"))
    }

    // Set initial last saved time
    setLastSaved(format(new Date(), "h:mm:ss a"))

    // Listen for storage events
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  return (
    <Alert className="mb-6">
      <Info className="h-4 w-4" />
      <AlertTitle>Local Storage Enabled</AlertTitle>
      <AlertDescription>
        Your expense data is automatically saved to your browser's local storage. This means your data will persist even
        if you close the browser, but it's only available on this device and browser.
        {lastSaved && <div className="text-xs mt-1">Last saved: {lastSaved}</div>}
      </AlertDescription>
    </Alert>
  )
}
