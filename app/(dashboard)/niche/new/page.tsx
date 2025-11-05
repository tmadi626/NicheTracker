"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Plus } from 'lucide-react'
import { slugify } from '@/lib/utils'

export default function NewNichePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/niches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create niche')
      }

      const result = await response.json()
      const newSlug = slugify(formData.name)
      
      // Redirect to the new niche detail page
      router.push(`/niche/${newSlug}`)
    } catch (error) {
      console.error('Error creating niche:', error)
      alert('Failed to create niche. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Niche</h1>
          <p className="text-gray-600">Add a new business niche category to track</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Niche Information</CardTitle>
          <CardDescription>
            Create a new niche category to organize your business ideas, highlights, and subreddits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Niche Name *
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Health & Fitness, Technology, Food & Cooking"
                required
              />
              <p className="text-xs text-gray-500">
                This will be used to create a URL slug: {slugify(formData.name) || 'niche-name'}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this niche covers and why it's interesting to you"
                rows={4}
              />
              <p className="text-xs text-gray-500">
                Optional: Add more context about this niche category
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                asChild
                disabled={isLoading}
              >
                <Link href="/">
                  Cancel
                </Link>
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !formData.name.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                {isLoading ? 'Creating...' : 'Create Niche'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tips for Creating Niches</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Choose broad categories that can contain multiple related ideas</li>
            <li>• Examples: "Health & Fitness", "Technology", "Food & Cooking", "Home Improvement"</li>
            <li>• You can always edit or delete niches later</li>
            <li>• Each niche will have its own page with ideas, highlights, and subreddits</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
