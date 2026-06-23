'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  createServiceOrderSchema,
  serviceOrderDeliverySchema,
  type CreateServiceOrderInput,
  type ServiceOrderCartLine,
  type ServiceOrderDeliveryInput,
} from '@/schemas/service-order'
import {
  calculateServiceOrderSubtotal,
  calculateServiceOrderTotal,
  formatServicePrice,
} from '@/utils/services'

interface ServiceOrderFormProps {
  providerId: string
  listingId?: string
  deliveryFee: number
  cart: ServiceOrderCartLine[]
  defaultPhone?: string
  defaultDelivery?: {
    city?: string
    area?: string
    address?: string
  }
  isPending?: boolean
  onSubmit: (data: CreateServiceOrderInput) => Promise<void>
}

export function ServiceOrderForm({
  providerId,
  listingId,
  deliveryFee,
  cart,
  defaultPhone,
  defaultDelivery,
  isPending,
  onSubmit,
}: ServiceOrderFormProps) {
  const t = useTranslations()
  const tServices = useTranslations('services')
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ServiceOrderDeliveryInput>({
    resolver: zodResolver(serviceOrderDeliverySchema),
    defaultValues: {
      customerPhone: defaultPhone ?? '',
      deliveryCity: defaultDelivery?.city ?? '',
      deliveryArea: defaultDelivery?.area ?? '',
      deliveryAddress: defaultDelivery?.address ?? '',
      notes: '',
    },
  })

  const subtotal = calculateServiceOrderSubtotal(cart)
  const total = calculateServiceOrderTotal(cart, deliveryFee)

  async function handleFormSubmit(formData: ServiceOrderDeliveryInput) {
    const payload = {
      providerId,
      ...(listingId ? { listingId } : {}),
      items: cart.map(({ menuItemId, quantity, notes }) => ({
        menuItemId,
        quantity,
        ...(notes ? { notes } : {}),
      })),
      customerPhone: formData.customerPhone,
      deliveryCity: formData.deliveryCity,
      deliveryArea: formData.deliveryArea,
      deliveryAddress: formData.deliveryAddress,
      ...(formData.notes ? { notes: formData.notes } : {}),
    }

    const parsed = createServiceOrderSchema.safeParse(payload)
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0]
        if (typeof field === 'string' && field in formData) {
          setError(field as keyof ServiceOrderDeliveryInput, { message: issue.message })
        }
      })
      return
    }

    await onSubmit(parsed.data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
        <p className="font-medium text-slate-900">{tServices('orderSummary')}</p>
        <ul className="mt-2 space-y-1 text-slate-600">
          {cart.map((line) => (
            <li
              key={`${line.menuItemId ?? line.name}-${line.quantity}`}
              className="flex justify-between gap-2"
            >
              <span>
                {line.name} × {line.quantity}
              </span>
              <span>{formatServicePrice(line.unitPrice * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 border-t border-slate-200 pt-2 text-slate-600">
          <div className="flex justify-between">
            <span>{tServices('subtotal')}</span>
            <span>{formatServicePrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>{tServices('deliveryFeeLabel')}</span>
            <span>{formatServicePrice(deliveryFee)}</span>
          </div>
          <div className="flex justify-between font-semibold text-primary">
            <span>{tServices('total')}</span>
            <span>{formatServicePrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="customerPhone">{tServices('customerPhone')}</Label>
        <Input
          id="customerPhone"
          type="tel"
          dir="ltr"
          className="text-left"
          placeholder={tServices('phonePlaceholder')}
          {...register('customerPhone')}
        />
        {errors.customerPhone && (
          <p className="text-sm text-red-600">{errors.customerPhone.message}</p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="deliveryCity">{tServices('deliveryCity')}</Label>
          <Input id="deliveryCity" {...register('deliveryCity')} />
          {errors.deliveryCity && (
            <p className="text-sm text-red-600">{errors.deliveryCity.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="deliveryArea">{tServices('deliveryArea')}</Label>
          <Input id="deliveryArea" {...register('deliveryArea')} />
          {errors.deliveryArea && (
            <p className="text-sm text-red-600">{errors.deliveryArea.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deliveryAddress">{tServices('deliveryAddress')}</Label>
        <Textarea id="deliveryAddress" rows={2} {...register('deliveryAddress')} />
        {errors.deliveryAddress && (
          <p className="text-sm text-red-600">{errors.deliveryAddress.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">{tServices('notesOptional')}</Label>
        <Textarea id="notes" rows={2} {...register('notes')} />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? t('common.submittingOrder') : t('common.confirmOrder')}
      </Button>
    </form>
  )
}
