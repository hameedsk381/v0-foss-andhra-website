/**
 * Export utilities for admin panel
 * CSV, Excel, PDF export functionality
 */

export interface ExportOptions {
  filename?: string
  includeHeaders?: boolean
}

/**
 * Export data to CSV
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  columns: Array<{ key: keyof T; header: string }>,
  options: ExportOptions = {}
): void {
  const { filename = "export", includeHeaders = true } = options

  // Create CSV content
  let csvContent = ""

  // Add headers
  if (includeHeaders) {
    csvContent += columns.map((col) => col.header).join(",") + "\n"
  }

  // Add data rows
  data.forEach((row) => {
    const values = columns.map((col) => {
      const value = row[col.key]
      // Handle commas, quotes, and newlines in values
      if (value === null || value === undefined) return ""
      const stringValue = String(value)
      if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    })
    csvContent += values.join(",") + "\n"
  })

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export data to JSON
 */
export function exportToJSON<T>(data: T[], filename: string = "export"): void {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: "application/json" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.json`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Print table data
 */
export function printTable<T extends Record<string, any>>(
  data: T[],
  columns: Array<{ key: keyof T; header: string }>,
  title: string = "Table"
): void {
  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        @media print {
          body { padding: 0; }
          @page { margin: 1cm; }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <table>
        <thead>
          <tr>
            ${columns.map((col) => `<th>${col.header}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (row) =>
                `<tr>${columns
                  .map((col) => `<td>${row[col.key] || ""}</td>`)
                  .join("")}</tr>`
            )
            .join("")}
        </tbody>
      </table>
      <p style="margin-top: 20px; font-size: 12px; color: #666;">
        Generated on ${new Date().toLocaleString()}
      </p>
    </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => {
    printWindow.print()
  }, 250)
}

