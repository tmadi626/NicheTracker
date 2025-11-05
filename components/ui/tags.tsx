import React from 'react'
import { Badge } from '@/components/ui/badge'
import { parseTags } from '@/lib/utils'

interface TagsProps {
  tags: string | null
  className?: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

export function Tags({ tags, className = '', variant = 'secondary' }: TagsProps) {
  const tagList = parseTags(tags)
  
  if (tagList.length === 0) return null

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {tagList.map((tag, index) => (
        <Badge key={index} variant={variant} className="text-xs">
          {tag}
        </Badge>
      ))}
    </div>
  )
}
