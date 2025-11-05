import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function calculateIceScore(impact: number, confidence: number, effort: number): number {
  if (effort === 0) return 0
  return Number(((impact * confidence) / effort).toFixed(2))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Launched':
      return 'bg-green-100 text-green-800'
    case 'Building':
      return 'bg-blue-100 text-blue-800'
    case 'Validating':
      return 'bg-yellow-100 text-yellow-800'
    case 'Exploring':
      return 'bg-purple-100 text-purple-800'
    case 'Backlog':
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function parseTags(tags: string | null): string[] {
  if (!tags) return []
  return tags.split(',').map(tag => tag.trim()).filter(Boolean)
}

export function joinTags(tags: string[]): string {
  return tags.join(', ')
}
