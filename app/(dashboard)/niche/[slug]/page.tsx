"use client"

import { useState, use, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tags } from '@/components/ui/tags'
import { Plus, Edit, Trash2, Lightbulb, Bookmark, Users } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { 
  getNicheBySlug, 
  getIdeasByNiche, 
  getHighlightsByNiche, 
  getSubredditsByNiche 
} from '@/lib/queries'

export default function NicheDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [activeTab, setActiveTab] = useState('ideas')
  const [niche, setNiche] = useState<Awaited<ReturnType<typeof getNicheBySlug>> | null>(null)
  const [ideas, setIdeas] = useState<Awaited<ReturnType<typeof getIdeasByNiche>>>([])
  const [highlights, setHighlights] = useState<Awaited<ReturnType<typeof getHighlightsByNiche>>>([])
  const [subreddits, setSubreddits] = useState<Awaited<ReturnType<typeof getSubredditsByNiche>>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const nicheData = await getNicheBySlug(slug)
        setNiche(nicheData)
        
        if (nicheData) {
          const [ideasData, highlightsData, subredditsData] = await Promise.all([
            getIdeasByNiche(nicheData.id),
            getHighlightsByNiche(nicheData.id),
            getSubredditsByNiche(nicheData.id)
          ])
          
          setIdeas(ideasData)
          setHighlights(highlightsData)
          setSubreddits(subredditsData)
        }
      } catch (error) {
        console.error('Error fetching niche data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  const handleDelete = (type: string, id: string) => {
    // TODO: Implement delete functionality
    console.log(`Delete ${type} with id: ${id}`)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!niche) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Niche not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{niche.name}</h1>
          {niche.description && (
            <p className="text-gray-600 mt-2">{niche.description}</p>
          )}
          <div className="flex items-center gap-4 mt-4">
            <Badge variant="outline" className="text-xs">
              Created {formatDate(niche.created_at)}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/niche/${slug}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Niche
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => handleDelete('niche', niche.id)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ideas" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Ideas ({ideas.length})
          </TabsTrigger>
          <TabsTrigger value="highlights" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Highlights ({highlights.length})
          </TabsTrigger>
          <TabsTrigger value="subreddits" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Subreddits ({subreddits.length})
          </TabsTrigger>
        </TabsList>

        {/* Ideas Tab */}
        <TabsContent value="ideas" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Business Ideas</h2>
            <Button asChild>
              <Link href={`/niche/${slug}/ideas/new`}>
                <Plus className="h-4 w-4 mr-2" />
                Add Idea
              </Link>
            </Button>
          </div>
          <div className="grid gap-4">
            {ideas.map((idea) => (
              <Card key={idea.id} className="hover:shadow-md transition">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{idea.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {idea.problem}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{idea.status}</Badge>
                      <Badge variant="secondary">ICE: {idea.ice_score}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Solution:</strong> {idea.solution}</p>
                    <p><strong>Audience:</strong> {idea.audience}</p>
                    {idea.tags && (
                      <div className="mt-2">
                        <Tags tags={idea.tags} />
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>Impact: {idea.impact}/5</span>
                        <span>Confidence: {idea.confidence}/5</span>
                        <span>Effort: {idea.effort}/5</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/niche/${slug}/ideas/${idea.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete('idea', idea.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Highlights Tab */}
        <TabsContent value="highlights" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Highlights</h2>
            <Button asChild>
              <Link href={`/niche/${slug}/highlights/new`}>
                <Plus className="h-4 w-4 mr-2" />
                Add Highlight
              </Link>
            </Button>
          </div>
          <div className="grid gap-4">
            {highlights.map((highlight) => (
              <Card key={highlight.id} className="hover:shadow-md transition">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{highlight.subreddit}</CardTitle>
                      <CardDescription className="mt-1">
                        {highlight.author && `by ${highlight.author}`} {highlight.upvotes ? `• ${highlight.upvotes} upvotes` : ''}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{formatDate(highlight.created_at)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-700">
                    "{highlight.quote}"
                  </blockquote>
                  {highlight.notes && (
                    <p className="mt-2 text-sm text-gray-600">
                      <strong>Notes:</strong> {highlight.notes}
                    </p>
                  )}
                  {highlight.tags && (
                    <div className="mt-2">
                      <Tags tags={highlight.tags} />
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-4">
                    {highlight.permalink && (
                      <a 
                        href={highlight.permalink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View on Reddit
                      </a>
                    )}
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/niche/${slug}/highlights/${highlight.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete('highlight', highlight.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Subreddits Tab */}
        <TabsContent value="subreddits" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Subreddits</h2>
            <Button asChild>
              <Link href={`/niche/${slug}/subreddits/new`}>
                <Plus className="h-4 w-4 mr-2" />
                Add Subreddit
              </Link>
            </Button>
          </div>
          <div className="grid gap-4">
            {subreddits.map((subreddit) => (
              <Card key={subreddit.id} className="hover:shadow-md transition">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{subreddit.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {subreddit.subscriber_count.toLocaleString()} subscribers
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{formatDate(subreddit.created_at)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <a 
                      href={subreddit.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {subreddit.url}
                    </a>
                    {subreddit.notes && (
                      <p className="text-sm text-gray-600">
                        <strong>Notes:</strong> {subreddit.notes}
                      </p>
                    )}
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/niche/${slug}/subreddits/${subreddit.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete('subreddit', subreddit.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}