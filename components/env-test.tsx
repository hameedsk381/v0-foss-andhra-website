"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EnvTest() {
  const [result, setResult] = useState<string>("")

  const testEnvVars = async () => {
    try {
      const response = await fetch("/api/test-env", {
        method: "POST",
      })
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Environment Variables Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testEnvVars}>Test Razorpay Config</Button>
        {result && <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">{result}</pre>}
      </CardContent>
    </Card>
  )
}
