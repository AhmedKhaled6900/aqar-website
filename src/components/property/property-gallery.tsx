'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { PropertyImage } from '@/lib/types'

interface PropertyGalleryProps {
  images: PropertyImage[]
  title: string
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const sorted = [...images].sort((a, b) => a.order - b.order)
  const [activeIndex, setActiveIndex] = useState(0)
  const active = sorted[activeIndex] ?? sorted[0]

  if (!active) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        لا توجد صور
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-100">
        <Image
          src={active.imageUrl}
          alt={`${title} - ${activeIndex + 1}`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                'relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2',
                i === activeIndex ? 'border-emerald-600' : 'border-transparent',
              )}
            >
              <Image
                src={img.imageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
