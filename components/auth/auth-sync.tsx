'use client'

import { useAuth } from '@clerk/nextjs'
import { useEffect, useRef } from 'react'

export function AuthSync() {
  const { userId, getToken } = useAuth()
  const hasSynced = useRef(false)

  useEffect(() => {
    const syncUser = async () => {
      // Only sync once per session
      if (!userId || hasSynced.current) return

      try {
        console.log('Syncing user data...', userId)
        const token = await getToken()
        const response = await fetch('/api/auth/sync', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`Sync failed with status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Sync response:', data)
        
        // Mark as synced
        hasSynced.current = true
      } catch (error) {
        console.error('Failed to sync user:', error)
      }
    }

    syncUser()

    // Reset sync state when userId changes
    return () => {
      hasSynced.current = false
    }
  }, [userId, getToken])

  return null
} 