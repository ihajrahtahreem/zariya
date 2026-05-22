// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type PostureStatus = 'good' | 'warning' | 'bad' | 'very_bad'

export const postureConfig: Record<
  PostureStatus,
  {
    label: string
    color: string
    bgColor: string
    borderColor: string
    textColor: string
    dotColor: string
    emoji: string
    description: string
    deviationRange: string
  }
> = {
  good: {
    label: 'Good Posture',
    color: '#4f7e4f',
    bgColor: 'bg-sage-50',
    borderColor: 'border-sage-300',
    textColor: 'text-sage-700',
    dotColor: 'bg-sage-500',
    emoji: '🟢',
    description: 'Excellent! Your posture is healthy.',
    deviationRange: '0–10°',
  },
  warning: {
    label: 'Caution',
    color: '#d97706',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-700',
    dotColor: 'bg-amber-500',
    emoji: '🟡',
    description: 'Minor deviation detected. Adjust slightly.',
    deviationRange: '11–20°',
  },
  bad: {
    label: 'Poor Posture',
    color: '#dc2626',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    textColor: 'text-red-700',
    dotColor: 'bg-red-500',
    emoji: '🔴',
    description: 'Poor posture detected. Please sit upright.',
    deviationRange: '21–35°',
  },
  very_bad: {
    label: 'Critical',
    color: '#7f1d1d',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-500',
    textColor: 'text-red-900',
    dotColor: 'bg-red-700',
    emoji: '🔴',
    description: 'Critical posture! Correct immediately.',
    deviationRange: '36°+',
  },
}

export function getPostureStatus(posture: string): PostureStatus {
  if (['good', 'warning', 'bad', 'very_bad'].includes(posture)) {
    return posture as PostureStatus
  }
  return 'good'
}

export function formatDeviation(deviation: number): string {
  return `${deviation.toFixed(1)}°`
}

export function isAlertWorthy(posture: string): boolean {
  return posture === 'bad' || posture === 'very_bad'
}

export function generateAlertMessage(posture: string, deviation: number): string {
  if (posture === 'very_bad') {
    return `Critical posture alert! Spinal deviation of ${deviation.toFixed(1)}°. Please correct your posture immediately to avoid strain.`
  }
  if (posture === 'bad') {
    return `Poor posture detected. Deviation of ${deviation.toFixed(1)}°. Try to straighten your back and relax your shoulders.`
  }
  return `Posture reminder: ${deviation.toFixed(1)}° deviation detected.`
}

export function calculateGoodPosturePercentage(logs: Array<{ posture: string }>): number {
  if (logs.length === 0) return 0
  const good = logs.filter((l) => l.posture === 'good').length
  return Math.round((good / logs.length) * 100)
}

// Mock data generator for demo mode
export function generateMockPostureReading(): { posture: PostureStatus; deviation: number } {
  const rand = Math.random()
  let posture: PostureStatus
  let deviation: number

  if (rand < 0.55) {
    posture = 'good'
    deviation = Math.random() * 10
  } else if (rand < 0.75) {
    posture = 'warning'
    deviation = 11 + Math.random() * 9
  } else if (rand < 0.9) {
    posture = 'bad'
    deviation = 21 + Math.random() * 14
  } else {
    posture = 'very_bad'
    deviation = 36 + Math.random() * 20
  }

  return { posture, deviation: parseFloat(deviation.toFixed(2)) }
}
