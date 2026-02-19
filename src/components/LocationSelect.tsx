import type { LocationDto } from "../types";

interface Props {
  locations: LocationDto[];
  selectedLocationId: string;
  onChange: (locationId: string) => void;
}

export function LocationSelect({
  locations,
  selectedLocationId,
  onChange,
}: Props) {
  return (
    <label className="stack">
      <span className="fieldLabel">Location</span>
      <select
        value={selectedLocationId}
        onChange={(event) => onChange(event.target.value)}
      >
        {locations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </select>
    </label>
  );
}
