"use client"

import { useState, use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { getNicheBySlug } from '@/lib/queries'

export default function EditNichePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [nicheId, setNicheId] = useState<string | null>(null)

  useEffect(() => {
    async function loadNiche() {
      try {
        const niche = await getNicheBySlug(slug)
        if (niche) {
          setNicheId(niche.id)
          setFormData({
            name: niche.name,
            description: niche.description || ''
          })
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('Error loading niche:', error)
        router.push('/')
      } finally {
        setIsLoadingData(false)
      }
    }
    loadNiche()
  }, [slug, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nicheId) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/niches/${nicheId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update niche')
      }

      // Redirect back to niche detail page
      router.push(`/niche/${slug}`)
    } catch (error) {
      console.error('Error updating niche:', error)
      alert('Failed to update niche. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!nicheId) return
    
    if (!confirm('Are you sure you want to delete this niche? This action cannot be undone.')) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/niches/${nicheId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete niche')
      }

      // Redirect to home page
      router.push('/')
    } catch (error) {
      console.error('Error deleting niche:', error)
      alert('Failed to delete niche. Please try again.')
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!nicheId) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Niche not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href={`/niche/${slug}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Niche
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Niche</h1>
          <p className="text-gray-600">Update your niche information</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Niche Details</CardTitle>
          <CardDescription>
            Update the name and description of your niche category.
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
                placeholder="Enter niche name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter niche description"
                rows={4}
              />
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Niche
              </Button>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  disabled={isLoading}
                >
                  <Link href={`/niche/${slug}`}>
                    Cancel
                  </Link>
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !formData.name.trim()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}