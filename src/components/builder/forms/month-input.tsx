"use client";

import { useMemo } from "react";

type MonthInputProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  title?: string;
};

const MONTH_OPTIONS = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

function parseYearMonth(value: string): { year: string; month: string } {
  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) return { year: "", month: "" };
  return { year: match[1], month: match[2] };
}

function buildYearOptions(): string[] {
  const currentYear = new Date().getFullYear();
  const fromYear = 1970;
  const toYear = currentYear + 10;
  const years: string[] = [];

  for (let y = toYear; y >= fromYear; y -= 1) {
    years.push(String(y));
  }

  return years;
}

export function MonthInput({
  value,
  onChange,
  className,
  disabled,
  required,
  title,
}: MonthInputProps) {
  const years = useMemo(() => buildYearOptions(), []);
  const { year, month } = parseYearMonth(value);

  return (
    <div className="grid grid-cols-2 gap-2">
      <select
        value={month}
        onChange={(e) => {
          const nextMonth = e.target.value;
          onChange(year && nextMonth ? `${year}-${nextMonth}` : "");
        }}
        className={className}
        disabled={disabled}
        required={required}
        aria-label="Select month"
        title={title}
      >
        <option value="">Month</option>
        {MONTH_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={year}
        onChange={(e) => {
          const nextYear = e.target.value;
          onChange(nextYear && month ? `${nextYear}-${month}` : "");
        }}
        className={className}
        disabled={disabled}
        required={required}
        aria-label="Select year"
        title={title}
      >
        <option value="">Year</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
