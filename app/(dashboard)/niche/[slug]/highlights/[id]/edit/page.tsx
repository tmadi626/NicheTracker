"use client"

import { useState, use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, Trash2, ExternalLink } from 'lucide-react'
import { getNicheBySlug, getHighlightById, getIdeasByNiche } from '@/lib/queries'

export default function EditHighlightPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = use(params)
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
        const [nicheData, highlightData] = await Promise.all([
          getNicheBySlug(slug),
          getHighlightById(id)
        ])
        
        if (!nicheData || !highlightData) {
          router.push(`/niche/${slug}`)
          return
        }
        
        setNiche(nicheData)
        setFormData({
          quote: highlightData.quote,
          permalink: highlightData.permalink || '',
          subreddit: highlightData.subreddit || '',
          author: highlightData.author || '',
          upvotes: highlightData.upvotes || 0,
          notes: highlightData.notes || '',
          tags: highlightData.tags || '',
          ideaId: highlightData.idea_id || ''
        })
        
        const ideasData = await getIdeasByNiche(nicheData.id)
        setIdeas(ideasData)
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
      const response = await fetch(`/api/highlights/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ideaId: formData.ideaId || null
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update highlight')
      }

      // Redirect back to niche detail page
      router.push(`/niche/${slug}`)
    } catch (error) {
      console.error('Error updating highlight:', error)
      alert('Failed to update highlight. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this highlight? This action cannot be undone.')) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/highlights/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete highlight')
      }

      // Redirect back to niche detail page
      router.push(`/niche/${slug}`)
    } catch (error) {
      console.error('Error deleting highlight:', error)
      alert('Failed to delete highlight. Please try again.')
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Highlight</h1>
          <p className="text-gray-600">Update your saved highlight</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Highlight Details</CardTitle>
              <CardDescription>
                Update your saved highlight information.
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
                  <div className="flex gap-2">
                    <Input
                      id="permalink"
                      type="url"
                      value={formData.permalink}
                      onChange={(e) => setFormData({ ...formData, permalink: e.target.value })}
                      placeholder="https://reddit.com/r/subreddit/comments/..."
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(formData.permalink, '_blank')}
                      disabled={!formData.permalink}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
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

                <div className="flex justify-between items-center pt-4">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Highlight
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
                    disabled={isLoading || !formData.quote.trim()}
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
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-700">{formData.subreddit}</div>
                  <div className="text-xs text-gray-500">
                    by {formData.author || 'Unknown'} • {formData.upvotes} upvotes
                  </div>
                </div>
                <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-700 text-sm">
                  "{formData.quote}"
                </blockquote>
                {formData.notes && (
                  <div className="text-xs text-gray-600">
                    <strong>Notes:</strong> {formData.notes}
                  </div>
                )}
                {formData.tags && (
                  <div className="text-xs text-gray-500">
                    <strong>Tags:</strong> {formData.tags}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
