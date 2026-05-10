import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { es } from "react-day-picker/locale";
import "react-day-picker/style.css";

const parseLocalDate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatLocalDate = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const stripTime = (date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

export default function BookingCalendar({
  checkInDate,
  checkOutDate,
  occupiedDates = [],
  onRangeChange,
  isLoading = false,
}) {
  const today = useMemo(() => stripTime(new Date()), []);
  const [hoveredDate, setHoveredDate] = useState(null);

  const occupiedAsDates = useMemo(
    () => occupiedDates.map((value) => parseLocalDate(value)).filter(Boolean),
    [occupiedDates]
  );

  const selected = useMemo(
    () => ({
      from: parseLocalDate(checkInDate) || undefined,
      to: parseLocalDate(checkOutDate) || undefined,
    }),
    [checkInDate, checkOutDate]
  );

  const previewDates = useMemo(() => {
    if (!selected.from || selected.to || !hoveredDate) return [];
    const start = stripTime(selected.from);
    const end = stripTime(hoveredDate);
    if (end <= start) return [];
    const dates = [];
    for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
      dates.push(new Date(day));
    }
    return dates;
  }, [selected.from, selected.to, hoveredDate]);

  const handleSelect = (range) => {
    if (!range) {
      onRangeChange({ checkInDate: "", checkOutDate: "" });
      return;
    }
    onRangeChange({
      checkInDate: formatLocalDate(range.from),
      checkOutDate: formatLocalDate(range.to),
    });
  };

  const disabled = [{ before: today }, ...occupiedAsDates];

  return (
    <div>
      <div className="rounded-md border border-gray-200 bg-white px-3 py-2 inline-block">
        <DayPicker
          mode="range"
          locale={es}
          selected={selected}
          onSelect={handleSelect}
          onDayMouseEnter={(day) => setHoveredDate(day)}
          onDayMouseLeave={() => setHoveredDate(null)}
          disabled={disabled}
          modifiers={{
            occupied: occupiedAsDates,
            preview: previewDates,
          }}
          modifiersClassNames={{
            occupied: "rdp-occupied",
            preview: "rdp-preview",
          }}
          showOutsideDays
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-600">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-green-700" />
          Seleccionado
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-green-200" />
          Rango
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-red-200 border border-red-400" />
          Ocupada
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-gray-200" />
          No disponible
        </span>
        {isLoading && <span className="text-gray-500">Cargando fechas...</span>}
      </div>
    </div>
  );
}
