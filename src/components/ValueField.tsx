import React from "react";
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
  dateFilterType: "exact" | "year";
  setDateFilterType: React.Dispatch<React.SetStateAction<"exact" | "year">>;
}

const ValueField: React.FC<ValueFieldProps> = ({
  cardFilterField,
  cardFilterValue,
  setCardFilterValue,
  minAvailableDate,
  maxAvailableDate,
  setCurrentPage,
  suggestions,
  dateFilterType,
  setDateFilterType,
}) => {
  const handleDateChange = (date: Date | null) => {
    if (!date) {
      setCardFilterValue("");
      return;
    }

    const formatted = {
      exact: date.toISOString().slice(0, 10),
      year: date.getFullYear().toString(),
    };

    setCardFilterValue(formatted[dateFilterType]);
    setCurrentPage(1);
  };

  const dateFormat = dateFilterType === "exact" ? "yyyy-MM-dd" : "yyyy";
  const placeholder =
    dateFilterType === "exact"
      ? "Selecciona una fecha exacta"
      : "Selecciona un año";
  
  const selectedDate =
    dateFilterType === "year"
    ? /^\d{4}$/.test(cardFilterValue)
      ? new Date(Number(cardFilterValue), 0, 1)
      : null
    : cardFilterValue && !isNaN(Date.parse(cardFilterValue))
    ? new Date(cardFilterValue)
    : null;
    
  return (
    <div className="flex-1 w-full">
      <label className="text-sm block mb-1 font-semibold">Buscar:</label>

      {cardFilterField === "launch_date" ? (
        <div className="flex flex-col md:flex-row gap-2">
          <select
            value={dateFilterType}
            onChange={(e) => {
              setDateFilterType(e.target.value as "exact" | "year");
              setCardFilterValue("");
              setCurrentPage(1);
            }}
            className="w-full md:w-1/4 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
          >
            <option value="exact">Por fecha exacta</option>
            <option value="year">Por año</option>
          </select>

          <div className="w-full md:w-3/4">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat={dateFormat}
              showYearPicker={dateFilterType === "year"}
              placeholderText={placeholder}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              minDate={minAvailableDate}
              maxDate={maxAvailableDate}
              isClearable
            />
          </div>
        </div>
      ) : (
        <div className="relative w-1/4">
          <input
            type="text"
            placeholder="Escribe o haz clic en una sugerencia..."
            value={cardFilterValue}
            onChange={(e) => {
              setCardFilterValue(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 pr-8 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
          />
          {cardFilterValue && (
            <button
              onClick={() => {
                setCardFilterValue("");
                setCurrentPage(1);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 text-lg leading-none"
              aria-label="Limpiar filtro"
            >
              ×
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ValueField;
