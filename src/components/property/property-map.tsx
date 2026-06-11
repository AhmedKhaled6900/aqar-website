interface PropertyMapProps {
  latitude?: number | null
  longitude?: number | null
  address: string
}

export function PropertyMap({ latitude, longitude, address }: PropertyMapProps) {
  if (!latitude || !longitude) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500">
        الموقع: {address}
      </div>
    )
  }

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01}%2C${latitude - 0.01}%2C${longitude + 0.01}%2C${latitude + 0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <iframe
        title="خريطة الموقع"
        src={src}
        className="aspect-video w-full"
        loading="lazy"
      />
    </div>
  )
}
