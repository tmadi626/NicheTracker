"use client"

import { useState, use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Plus, Calculator } from 'lucide-react'
import { calculateIceScore } from '@/lib/utils'
import { getNicheBySlug } from '@/lib/queries'

const statusOptions = [
  { value: 'Backlog', label: 'Backlog' },
  { value: 'Exploring', label: 'Exploring' },
  { value: 'Validating', label: 'Validating' },
  { value: 'Building', label: 'Building' },
  { value: 'Launched', label: 'Launched' }
]

export default function NewIdeaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const [niche, setNiche] = useState<Awaited<ReturnType<typeof getNicheBySlug>> | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    problem: '',
    solution: '',
    audience: '',
    status: 'Backlog',
    impact: 1,
    confidence: 1,
    effort: 1,
    notes: '',
    sourceUrl: '',
    tags: ''
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

  const iceScore = calculateIceScore(formData.impact, formData.confidence, formData.effort)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!niche) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/ideas', {
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
        throw new Error(error.error || 'Failed to create idea')
      }

      // Redirect back to niche detail page
      router.push(`/niche/${slug}`)
    } catch (error) {
      console.error('Error creating idea:', error)
      alert('Failed to create idea. Please try again.')
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
          <h1 className="text-3xl font-bold text-gray-900">Add New Idea</h1>
          <p className="text-gray-600">Capture a new business idea for {niche.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Idea Details</CardTitle>
              <CardDescription>
                Describe your business idea and evaluate it using the ICE framework.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Idea Title *
                  </label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Brief, descriptive title for your idea"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="problem" className="text-sm font-medium text-gray-700">
                    Problem *
                  </label>
                  <Textarea
                    id="problem"
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    placeholder="What problem does this idea solve?"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="solution" className="text-sm font-medium text-gray-700">
                    Solution *
                  </label>
                  <Textarea
                    id="solution"
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    placeholder="How does your idea solve this problem?"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="audience" className="text-sm font-medium text-gray-700">
                    Target Audience
                  </label>
                  <Input
                    id="audience"
                    type="text"
                    value={formData.audience}
                    onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                    placeholder="Who would use this solution?"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium text-gray-700">
                    Additional Notes
                  </label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional thoughts, research, or context"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="sourceUrl" className="text-sm font-medium text-gray-700">
                    Source URL
                  </label>
                  <Input
                    id="sourceUrl"
                    type="url"
                    value={formData.sourceUrl}
                    onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                    placeholder="https://example.com (if idea came from somewhere specific)"
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
                    disabled={isLoading || !formData.title.trim() || !formData.problem.trim() || !formData.solution.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {isLoading ? 'Creating...' : 'Create Idea'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* ICE Score Calculator */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                ICE Score
              </CardTitle>
              <CardDescription>
                Rate your idea on Impact, Confidence, and Effort (1-5 scale)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Impact: {formData.impact}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: parseInt(e.target.value) })}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">How much impact will this have?</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Confidence: {formData.confidence}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.confidence}
                  onChange={(e) => setFormData({ ...formData, confidence: parseInt(e.target.value) })}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">How confident are you in this idea?</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Effort: {formData.effort}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.effort}
                  onChange={(e) => setFormData({ ...formData, effort: parseInt(e.target.value) })}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">How much effort will this require?</p>
              </div>

              <div className="pt-4 border-t">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{iceScore}</div>
                  <div className="text-sm text-gray-600">ICE Score</div>
                  <div className="text-xs text-gray-500 mt-1">
                    (Impact × Confidence) ÷ Effort
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ICE Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>Impact:</strong> How much will this idea impact your goals?
                </div>
                <div>
                  <strong>Confidence:</strong> How confident are you in this idea's success?
                </div>
                <div>
                  <strong>Effort:</strong> How much effort will this idea require?
                </div>
                <div className="pt-2 text-xs text-gray-500">
                  Higher scores indicate better ideas to prioritize.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
