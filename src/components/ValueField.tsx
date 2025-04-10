import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ValueFieldProps {
  cardFilterField: string;
  cardFilterValue: string;
  setCardFilterValue: React.Dispatch<React.SetStateAction<string>>;
  startDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  endDate: Date | null;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  minAvailableDate: Date;
  maxAvailableDate: Date;
  setCurrentPage: (page: number) => void;
  suggestions: string[];
}

const ValueField: React.FC<ValueFieldProps> = ({
  cardFilterField,
  cardFilterValue,
  setCardFilterValue,
  setStartDate,
  setEndDate,
  minAvailableDate,
  maxAvailableDate,
  setCurrentPage,
}) => {
  const [dateFilterType, setDateFilterType] = useState<"exact" | "year" | "month">("exact");

  const handleDateChange = (date: Date | null) => {
    if (!date) {
      setCardFilterValue("");
      return;
    }

    const formatted = {
      exact: date.toISOString().slice(0, 10), // yyyy-mm-dd
      year: date.getFullYear().toString(), // yyyy
      month: date.toISOString().slice(0, 7), // yyyy-mm
    };

    setCardFilterValue(formatted[dateFilterType]);
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 w-full relative">
      <label className="text-sm block mb-1 font-semibold">Buscar:</label>

      {cardFilterField === "launch_date" ? (
        <div className="flex flex-col md:flex-row gap-2">
          {/* Selector de tipo de filtro de fecha */}
          <select
            value={dateFilterType}
            onChange={(e) => {
              setDateFilterType(e.target.value as "exact" | "year" | "month");
              setCardFilterValue("");
              setCurrentPage(1);
            }}
            className="w-full md:w-1/4 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
          >
            <option value="exact">Por fecha exacta</option>
            <option value="year">Por año</option>
            <option value="month">Por mes</option>
          </select>

          {/* Selector de fecha flexible según tipo */}
          <div className="w-full md:w-3/4">
            <DatePicker
              selected={
                cardFilterValue
                  ? new Date(cardFilterValue)
                  : null
              }
              onChange={handleDateChange}
              dateFormat={
                dateFilterType === "exact"
                  ? "yyyy-MM-dd"
                  : dateFilterType === "month"
                  ? "yyyy-MM"
                  : "yyyy"
              }
              showYearPicker={dateFilterType === "year"}
              showMonthYearPicker={dateFilterType === "month"}
              placeholderText={
                dateFilterType === "exact"
                  ? "Selecciona una fecha exacta"
                  : dateFilterType === "month"
                  ? "Selecciona un mes"
                  : "Selecciona un año"
              }
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              minDate={minAvailableDate}
              maxDate={maxAvailableDate}
              isClearable
            />
          </div>
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Escribe o haz clic en una sugerencia..."
            value={cardFilterValue}
            onChange={(e) => {
              setCardFilterValue(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 pr-10 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
          />
          {cardFilterValue && (
            <button
              onClick={() => {
                setCardFilterValue("");
                setCurrentPage(1);
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
              aria-label="Limpiar filtro"
            >
              ×
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ValueField;
