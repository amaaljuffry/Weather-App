import type { Dispatch, SetStateAction } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

type Props = {
  location: string
  setLocation: Dispatch<SetStateAction<string>>
  onMyLocation: () => void
}

export default function LocationDropdown({
  location,
  setLocation,
  onMyLocation,
}: Props) {
  return (
    <Select
      value={location === "custom" ? "my-location" : location}
      onValueChange={(value) => {
        if (value === "my-location") {
          onMyLocation()
        } else {
          setLocation(value)
        }
      }}
    >
      <SelectTrigger className="w-full xs:w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent className="z-1001">
        <SelectItem value="my-location">My Location</SelectItem>

        {locations.map((city) => (
          <SelectItem key={city} value={city}>
            {city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const locations = [
  "Bangkok",
  "Kuala Lumpur",
  "Tokyo",
  "Seoul",
  "Dubai",
  "Manila",
  "London",
  "New York",
  "Paris",
  "Berlin",
  "Madrid",
  "Rome",
  "Lisbon",
]
