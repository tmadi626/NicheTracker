"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tags } from '@/components/ui/tags'
import { Plus, Lightbulb, Bookmark, Users } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { getNiches } from '@/lib/queries'

export default function HomePage() {
  const [niches, setNiches] = useState<Awaited<ReturnType<typeof getNiches>>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNiches() {
      try {
        const data = await getNiches()
        setNiches(data)
      } catch (error) {
        console.error('Error fetching niches:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchNiches()
  }, [])

  if (loading) {
    return (
      <div className="mb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Niches</h1>
          <p className="text-gray-600">
            Track subreddits, ideas, and highlights organized by business niche categories
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Niches</h1>
        <p className="text-gray-600">
          Track subreddits, ideas, and highlights organized by business niche categories
        </p>
      </div>

      {niches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {niches.map((niche) => (
            <Card key={niche.id} className="hover:shadow-md transition cursor-pointer">
              <Link href={`/niche/${niche.slug}`} className="block">
                <CardHeader>
                  <CardTitle className="text-xl">{niche.name}</CardTitle>
                  {niche.description && (
                    <CardDescription className="text-sm">
                      {niche.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Lightbulb className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {niche.ideasCount}
                      </div>
                      <div className="text-xs text-gray-500">Ideas</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Bookmark className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {niche.highlightsCount}
                      </div>
                      <div className="text-xs text-gray-500">Highlights</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        {niche.subredditsCount}
                      </div>
                      <div className="text-xs text-gray-500">Subreddits</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      {formatDate(niche.created_at)}
                    </Badge>
                  </div>
                </CardContent>
              </Link>
              <div className="p-6 pt-0 flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault()
                    // Handle edit
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-800"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault()
                    // Handle delete
                  }}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <CardHeader>
            <CardTitle className="text-xl text-gray-600 mb-4">No niches yet!</CardTitle>
            <CardDescription className="text-gray-500 mb-6">
              Start by creating your first niche category.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/niche/new">
                <Plus className="h-4 w-4 mr-2" />
                Create First Niche
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
