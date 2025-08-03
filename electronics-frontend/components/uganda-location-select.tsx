"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const ugandaLocations = [
  { name: "Kampala", fee: 5000 },
  { name: "Entebbe", fee: 8000 },
  { name: "Wakiso", fee: 7000 },
  { name: "Mukono", fee: 10000 },
  { name: "Jinja", fee: 15000 },
  { name: "Mbale", fee: 20000 },
  { name: "Gulu", fee: 25000 },
  { name: "Mbarara", fee: 22000 },
  { name: "Fort Portal", fee: 20000 },
  { name: "Masaka", fee: 18000 },
  { name: "Soroti", fee: 25000 },
  { name: "Lira", fee: 23000 },
  { name: "Arua", fee: 30000 },
  { name: "Kabale", fee: 25000 },
  { name: "Hoima", fee: 20000 },
]

interface UgandaLocationSelectProps {
  onLocationChange: (location: string, fee: number) => void
  value?: string
}

export function UgandaLocationSelect({ onLocationChange, value }: UgandaLocationSelectProps) {
  const handleLocationChange = (locationName: string) => {
    const location = ugandaLocations.find((loc) => loc.name === locationName)
    if (location) {
      onLocationChange(location.name, location.fee)
    }
  }

  return (
    <Select value={value} onValueChange={handleLocationChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select your location" />
      </SelectTrigger>
      <SelectContent>
        {ugandaLocations.map((location) => (
          <SelectItem key={location.name} value={location.name}>
            {location.name} - UGX {location.fee.toLocaleString()} shipping
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
