import React from "react";

interface ChartFieldSelectorProps {
  chartField: string;
  setChartField: (field: string) => void;
  chartFields: { value: string; label: string }[];
}

const ChartFieldSelector: React.FC<ChartFieldSelectorProps> = ({ chartField, setChartField, chartFields }) => {
  return (
    <div className="mb-6">
      <label className="text-sm block mb-1 font-semibold">
        📊 Comparar en gráfica por:
      </label>
      <select
        value={chartField}
        onChange={(e) => setChartField(e.target.value)}
        className="w-full md:w-64 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
      >
        {chartFields.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChartFieldSelector;
