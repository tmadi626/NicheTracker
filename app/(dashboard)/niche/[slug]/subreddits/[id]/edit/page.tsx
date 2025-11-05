"use client"

import { useState, use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, Trash2, ExternalLink, Users } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import { getNicheBySlug, getSubredditById } from '@/lib/queries'

export default function EditSubredditPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = use(params)
  const router = useRouter()
  const [niche, setNiche] = useState<Awaited<ReturnType<typeof getNicheBySlug>> | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    subscriberCount: 0,
    notes: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [nicheData, subredditData] = await Promise.all([
          getNicheBySlug(slug),
          getSubredditById(id)
        ])
        
        if (!nicheData || !subredditData) {
          router.push(`/niche/${slug}`)
          return
        }
        
        setNiche(nicheData)
        setFormData({
          name: subredditData.name,
          url: subredditData.url,
          subscriberCount: subredditData.subscriber_count,
          notes: subredditData.notes || ''
        })
      } catch (error) {
        console.error('Error loading data:', error)
        router.push(`/niche/${slug}`)
      } finally {
        setIsLoadingData(false)
      }
    }
    loadData()
  }, [slug, id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/subreddits/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update subreddit')
      }

      // Redirect back to niche detail page
      router.push(`/niche/${slug}`)
    } catch (error) {
      console.error('Error updating subreddit:', error)
      alert('Failed to update subreddit. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this subreddit? This action cannot be undone.')) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/subreddits/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete subreddit')
      }

      // Redirect back to niche detail page
      router.push(`/niche/${slug}`)
    } catch (error) {
      console.error('Error deleting subreddit:', error)
      alert('Failed to delete subreddit. Please try again.')
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!niche) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href={`/niche/${slug}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {niche.name}
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Subreddit</h1>
          <p className="text-gray-600">Update your subreddit tracking information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Subreddit Details</CardTitle>
              <CardDescription>
                Update your subreddit tracking information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Subreddit Name *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="r/subreddit"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="url" className="text-sm font-medium text-gray-700">
                    Subreddit URL *
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="url"
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://reddit.com/r/subreddit"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(formData.url, '_blank')}
                      disabled={!formData.url}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subscriberCount" className="text-sm font-medium text-gray-700">
                    Subscriber Count
                  </label>
                  <Input
                    id="subscriberCount"
                    type="number"
                    value={formData.subscriberCount}
                    onChange={(e) => setFormData({ ...formData, subscriberCount: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                  />
                  <p className="text-xs text-gray-500">
                    Current: {formatNumber(formData.subscriberCount)} subscribers
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Why is this subreddit relevant? What insights are you looking for?"
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
                    Delete Subreddit
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
                      disabled={isLoading || !formData.name.trim() || !formData.url.trim()}
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

        {/* Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-lg font-semibold">{formData.name}</div>
                  <div className="text-sm text-gray-600">
                    {formatNumber(formData.subscriberCount)} subscribers
                  </div>
                </div>
                <a 
                  href={formData.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm block"
                >
                  {formData.url}
                </a>
                {formData.notes && (
                  <div className="text-sm text-gray-600">
                    <strong>Notes:</strong> {formData.notes}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subscribers:</span>
                  <span className="font-medium">{formatNumber(formData.subscriberCount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Added:</span>
                  <span className="font-medium">Jan 15, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">Jan 15, 2025</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
