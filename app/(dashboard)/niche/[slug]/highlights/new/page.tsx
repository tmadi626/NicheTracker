"use client"

import { useState, use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Plus, ExternalLink } from 'lucide-react'
import { getNicheBySlug, getIdeasByNiche } from '@/lib/queries'

export default function NewHighlightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const [niche, setNiche] = useState<Awaited<ReturnType<typeof getNicheBySlug>> | null>(null)
  const [ideas, setIdeas] = useState<Awaited<ReturnType<typeof getIdeasByNiche>>>([])
  const [formData, setFormData] = useState({
    quote: '',
    permalink: '',
    subreddit: '',
    author: '',
    upvotes: 0,
    notes: '',
    tags: '',
    ideaId: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const nicheData = await getNicheBySlug(slug)
        if (!nicheData) {
          router.push('/')
          return
        }
        setNiche(nicheData)
        const ideasData = await getIdeasByNiche(nicheData.id)
        setIdeas(ideasData)
      } catch (error) {
        console.error('Error loading data:', error)
        router.push('/')
      } finally {
        setIsLoadingData(false)
      }
    }
    loadData()
  }, [slug, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!niche) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/highlights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          nicheId: niche.id,
          ideaId: formData.ideaId || null
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create highlight')
      }

      // Redirect back to niche detail page
      router.push(`/niche/${slug}`)
    } catch (error) {
      console.error('Error creating highlight:', error)
      alert('Failed to create highlight. Please try again.')
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
          <h1 className="text-3xl font-bold text-gray-900">Add New Highlight</h1>
          <p className="text-gray-600">Save an interesting Reddit comment or post</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Highlight Details</CardTitle>
              <CardDescription>
                Save interesting quotes, comments, or posts from Reddit for future reference.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="quote" className="text-sm font-medium text-gray-700">
                    Quote/Content *
                  </label>
                  <Textarea
                    id="quote"
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    placeholder="Paste the interesting quote, comment, or post content here"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="permalink" className="text-sm font-medium text-gray-700">
                    Reddit Permalink *
                  </label>
                  <Input
                    id="permalink"
                    type="url"
                    value={formData.permalink}
                    onChange={(e) => setFormData({ ...formData, permalink: e.target.value })}
                    placeholder="https://reddit.com/r/subreddit/comments/..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="subreddit" className="text-sm font-medium text-gray-700">
                      Subreddit *
                    </label>
                    <Input
                      id="subreddit"
                      type="text"
                      value={formData.subreddit}
                      onChange={(e) => setFormData({ ...formData, subreddit: e.target.value })}
                      placeholder="r/subreddit"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="author" className="text-sm font-medium text-gray-700">
                      Author
                    </label>
                    <Input
                      id="author"
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="u/username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="upvotes" className="text-sm font-medium text-gray-700">
                    Upvotes
                  </label>
                  <Input
                    id="upvotes"
                    type="number"
                    value={formData.upvotes}
                    onChange={(e) => setFormData({ ...formData, upvotes: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="ideaId" className="text-sm font-medium text-gray-700">
                    Link to Idea (Optional)
                  </label>
                  <Select value={formData.ideaId || "none"} onValueChange={(value) => setFormData({ ...formData, ideaId: value === "none" ? "" : value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an idea to link this highlight to" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No idea linked</SelectItem>
                      {ideas.map((idea) => (
                        <SelectItem key={idea.id} value={idea.id}>
                          {idea.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add your own thoughts or context about this highlight"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="tags" className="text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <Input
                    id="tags"
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="tag1, tag2, tag3 (comma-separated)"
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
                    disabled={isLoading || !formData.quote.trim() || !niche}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {isLoading ? 'Creating...' : 'Create Highlight'}
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
              <CardTitle className="text-lg">Tips for Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Save interesting quotes, advice, or insights</li>
                <li>• Include the full Reddit permalink for reference</li>
                <li>• Link highlights to related ideas when possible</li>
                <li>• Add your own notes for context</li>
                <li>• Use tags to organize and find highlights later</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How to Get Reddit Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>1. Find an interesting comment or post</p>
                <p>2. Click "Share" → "Copy Link"</p>
                <p>3. Paste the link in the permalink field</p>
                <p>4. The subreddit and author will auto-populate</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
