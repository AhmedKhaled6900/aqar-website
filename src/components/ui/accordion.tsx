'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionContextValue {
  openItems: string[]
  toggle: (id: string) => void
  type: 'single' | 'multiple'
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)

interface AccordionProps {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  className?: string
  children: React.ReactNode
}

export function Accordion({
  type = 'multiple',
  defaultValue,
  className,
  children,
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>(() => {
    if (!defaultValue) return []
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
  })

  const toggle = React.useCallback(
    (id: string) => {
      setOpenItems((prev) => {
        if (type === 'single') {
          return prev.includes(id) ? [] : [id]
        }
        return prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      })
    },
    [type],
  )

  return (
    <AccordionContext.Provider value={{ openItems, toggle, type }}>
      <div className={cn('divide-y divide-slate-200', className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  value: string
  title: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function AccordionItem({ value, title, children, className }: AccordionItemProps) {
  const ctx = React.useContext(AccordionContext)
  if (!ctx) throw new Error('AccordionItem must be used within Accordion')

  const isOpen = ctx.openItems.includes(value)

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => ctx.toggle(value)}
        className="flex w-full items-center justify-between gap-2 py-3 text-right text-sm font-semibold text-slate-900 transition-colors hover:text-primary"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-200 ease-out',
          isOpen ? 'grid-rows-[1fr] pb-4 opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
