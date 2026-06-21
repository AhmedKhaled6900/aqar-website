'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  createServiceOrderSchema,
  type CreateServiceOrderFormInput,
  type ServiceOrderCartLine,
} from '@/schemas/service-order'
import {
  calculateServiceOrderSubtotal,
  calculateServiceOrderTotal,
  formatServicePrice,
} from '@/utils/services'
import { z } from 'zod'

const deliverySchema = createServiceOrderSchema.omit({
  listingId: true,
  items: true,
  deliveryFee: true,
})

type DeliveryFormInput = z.infer<typeof deliverySchema>

interface ServiceOrderFormProps {
  listingId: string
  deliveryFee: number
  cart: ServiceOrderCartLine[]
  defaultDelivery?: {
    city?: string
    area?: string
    address?: string
  }
  isPending?: boolean
  onSubmit: (data: CreateServiceOrderFormInput) => Promise<void>
}

export function ServiceOrderForm({
  listingId,
  deliveryFee,
  cart,
  defaultDelivery,
  isPending,
  onSubmit,
}: ServiceOrderFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DeliveryFormInput>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      deliveryCity: defaultDelivery?.city ?? '',
      deliveryArea: defaultDelivery?.area ?? '',
      deliveryAddress: defaultDelivery?.address ?? '',
      notes: '',
    },
  })

  const subtotal = calculateServiceOrderSubtotal(cart)
  const total = calculateServiceOrderTotal(cart, deliveryFee)

  async function handleFormSubmit(formData: DeliveryFormInput) {
    const payload = {
      listingId,
      items: cart.map(({ name, quantity, unitPrice }) => ({
        name,
        quantity,
        unitPrice,
      })),
      deliveryCity: formData.deliveryCity,
      deliveryArea: formData.deliveryArea,
      deliveryAddress: formData.deliveryAddress,
      deliveryFee,
      notes: formData.notes,
    }

    const parsed = createServiceOrderSchema.safeParse(payload)
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0]
        if (typeof field === 'string' && field in formData) {
          setError(field as keyof DeliveryFormInput, { message: issue.message })
        }
      })
      return
    }

    await onSubmit(parsed.data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
        <p className="font-medium text-slate-900">ملخص الطلب</p>
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
            <span>المجموع</span>
            <span>{formatServicePrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>رسوم التوصيل</span>
            <span>{formatServicePrice(deliveryFee)}</span>
          </div>
          <div className="flex justify-between font-semibold text-primary">
            <span>الإجمالي</span>
            <span>{formatServicePrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="deliveryCity">مدينة التوصيل</Label>
          <Input id="deliveryCity" {...register('deliveryCity')} />
          {errors.deliveryCity && (
            <p className="text-sm text-red-600">{errors.deliveryCity.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="deliveryArea">منطقة التوصيل</Label>
          <Input id="deliveryArea" {...register('deliveryArea')} />
          {errors.deliveryArea && (
            <p className="text-sm text-red-600">{errors.deliveryArea.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deliveryAddress">عنوان التوصيل</Label>
        <Textarea id="deliveryAddress" rows={2} {...register('deliveryAddress')} />
        {errors.deliveryAddress && (
          <p className="text-sm text-red-600">{errors.deliveryAddress.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">ملاحظات (اختياري)</Label>
        <Textarea id="notes" rows={2} {...register('notes')} />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'جاري إرسال الطلب...' : 'تأكيد الطلب'}
      </Button>
    </form>
  )
}
