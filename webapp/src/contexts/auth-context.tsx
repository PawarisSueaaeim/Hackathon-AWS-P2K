'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  username: string
  email: string
  name: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users data
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Administrator',
    avatar: '/pic/ai-man.png'
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    password: 'user123',
    name: 'John Doe',
    avatar: '/pic/ai-woman.png'
  },
  {
    id: '3',
    username: 'demo',
    email: 'demo@example.com',
    password: 'demo123',
    name: 'Demo User',
    avatar: '/pic/ai-man.png'
  }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('auth_user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        localStorage.removeItem('auth_user')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('Login attempt:', { email, password: '***' })
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Find user in mock data
      const foundUser = mockUsers.find(u => 
        (u.email === email || u.username === email) && u.password === password
      )
      
      console.log('Found user:', foundUser ? 'Yes' : 'No')
      
      if (foundUser) {
        const userData: User = {
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
          name: foundUser.name,
          avatar: foundUser.avatar
        }
        
        setUser(userData)
        localStorage.setItem('auth_user', JSON.stringify(userData))
        console.log('User logged in successfully:', userData)
        setIsLoading(false)
        return { success: true }
      }
      
      const errorMessage = 'Invalid email/username or password'
      setError(errorMessage)
      console.log('Login failed:', errorMessage)
      setIsLoading(false)
      return { success: false, error: errorMessage }
    } catch (err) {
      const errorMessage = 'Login failed. Please try again.'
      setError(errorMessage)
      console.error('Login error:', err)
      setIsLoading(false)
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    setUser(null)
    setError(null)
    localStorage.removeItem('auth_user')
    console.log('User logged out')
  }

  const clearError = () => {
    setError(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
