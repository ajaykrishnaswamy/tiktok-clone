"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export default function TestPage() {
  const { user, isLoaded } = useUser()
  const [unprotectedResult, setUnprotectedResult] = useState("")
  const [protectedResult, setProtectedResult] = useState("")
  const [feedResult, setFeedResult] = useState("")

  const getCurlCommand = (endpoint: string) => {
    const cookies = document.cookie.split(';')
      .map(cookie => cookie.trim())
      .filter(cookie => 
        cookie.startsWith('__client_uat=') ||
        cookie.startsWith('__session=') ||
        cookie.startsWith('__clerk_db_jwt=')
      )
      .join('; ')

    return `curl 'http://localhost:3000${endpoint}' \\
-H 'Cookie: ${cookies}'`
  }

  const testUnprotectedRoute = async () => {
    try {
      const res = await fetch('/api/hello')
      const data = await res.json()
      setUnprotectedResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setUnprotectedResult('Error: ' + error)
    }
  }

  const testProtectedRoute = async () => {
    try {
      const res = await fetch('/api/test/hello')
      const data = await res.json()
      setProtectedResult(JSON.stringify({
        ...data,
        curl_command: getCurlCommand('/api/test/hello')
      }, null, 2))
    } catch (error) {
      setProtectedResult('Error: ' + error)
    }
  }

  const testVideoFeed = async () => {
    try {
      const res = await fetch('/api/videos/feed')
      const data = await res.json()
      setFeedResult(JSON.stringify({
        ...data,
        curl_command: getCurlCommand('/api/videos/feed')
      }, null, 2))
    } catch (error) {
      setFeedResult('Error: ' + error)
    }
  }

  if (!isLoaded) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-4 max-w-2xl space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">API Test Page</h1>
        <p className="text-muted-foreground">
          {user ? `Logged in as: ${user.emailAddresses[0]?.emailAddress}` : 'Not logged in'}
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg space-y-4">
          <h2 className="font-semibold">Unprotected Route Test</h2>
          <Button onClick={testUnprotectedRoute}>
            Test /api/hello
          </Button>
          {unprotectedResult && (
            <pre className="p-4 bg-muted rounded-lg overflow-auto">
              {unprotectedResult}
            </pre>
          )}
        </div>

        <div className="p-4 border rounded-lg space-y-4">
          <h2 className="font-semibold">Protected Route Test</h2>
          <Button onClick={testProtectedRoute}>
            Test /api/test/hello
          </Button>
          {protectedResult && (
            <pre className="p-4 bg-muted rounded-lg overflow-auto whitespace-pre-wrap">
              {protectedResult}
            </pre>
          )}
        </div>

        <div className="p-4 border rounded-lg space-y-4">
          <h2 className="font-semibold">Video Feed Test</h2>
          <Button onClick={testVideoFeed}>
            Test /api/videos/feed
          </Button>
          {feedResult && (
            <pre className="p-4 bg-muted rounded-lg overflow-auto whitespace-pre-wrap">
              {feedResult}
            </pre>
          )}
        </div>

        <div className="p-4 border rounded-lg space-y-4">
          <h2 className="font-semibold">Current Curl Commands</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Protected Hello:</h3>
              <pre className="p-4 bg-muted rounded-lg overflow-auto whitespace-pre-wrap">
                {getCurlCommand('/api/test/hello')}
              </pre>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Video Feed:</h3>
              <pre className="p-4 bg-muted rounded-lg overflow-auto whitespace-pre-wrap">
                {getCurlCommand('/api/videos/feed')}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 