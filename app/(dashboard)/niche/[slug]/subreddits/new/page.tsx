"use client"

import { useState, use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Plus, ExternalLink, Users } from 'lucide-react'
import { getNicheBySlug } from '@/lib/queries'

export default function NewSubredditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
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
    async function loadNiche() {
      try {
        const nicheData = await getNicheBySlug(slug)
        if (!nicheData) {
          router.push('/')
        } else {
          setNiche(nicheData)
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
    if (!niche) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/subreddits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          nicheId: niche.id
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create subreddit')
      }

      // Redirect back to niche detail page
      router.push(`/niche/${slug}`)
    } catch (error) {
      console.error('Error creating subreddit:', error)
      alert('Failed to create subreddit. Please try again.')
    } finally {
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
          <h1 className="text-3xl font-bold text-gray-900">Add New Subreddit</h1>
          <p className="text-gray-600">Track a subreddit related to {niche.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Subreddit Details</CardTitle>
              <CardDescription>
                Add a subreddit to track for insights and community engagement.
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
                    You can update this later or leave it blank
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

                <div className="flex justify-end gap-2 pt-4">
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
                    <Plus className="h-4 w-4 mr-2" />
                    {isLoading ? 'Creating...' : 'Create Subreddit'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Why Track Subreddits?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Monitor community discussions and trends</li>
                <li>• Find inspiration for new ideas</li>
                <li>• Understand your target audience better</li>
                <li>• Discover pain points and opportunities</li>
                <li>• Track engagement and growth over time</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Finding Subreddits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>1. Search for keywords related to your niche</p>
                <p>2. Look at related subreddits in the sidebar</p>
                <p>3. Check r/findareddit for recommendations</p>
                <p>4. Browse subreddit directories</p>
                <p>5. Ask in relevant communities</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips for Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Add notes about why each subreddit matters</li>
                <li>• Update subscriber counts periodically</li>
                <li>• Look for patterns in popular posts</li>
                <li>• Save interesting highlights as you browse</li>
                <li>• Consider engagement rate, not just size</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
