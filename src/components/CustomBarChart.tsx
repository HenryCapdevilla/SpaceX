import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import React from "react";

// Paleta de colores mejorada para hasta 20 items únicos
const colors = [
  "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
  "#FF9F40", "#C9CBCF", "#8DD1E1", "#FFB6C1", "#C0C0C0",
  "#B0E0E6", "#00FA9A", "#FFD700", "#DDA0DD", "#90EE90",
  "#E6E6FA", "#FFA07A", "#A52A2A", "#7B68EE", "#3CB371",
];

const getColor = (index: number) => colors[index % colors.length];

export default function CustomBarChart({ getChartData, loading }: any) {
  const chartData = getChartData();

  // Agregar colores al dataset
  if (chartData?.datasets[0]) {
    chartData.datasets[0].backgroundColor = chartData.labels.map((_, index) =>
      getColor(index)
    );
  }

  return (
    !loading && (
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6 max-w-xl mx-auto h-[460px] relative">
        {Object.keys(chartData.labels || {}).length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            📉 No hay datos suficientes para mostrar la gráfica.
          </div>
        ) : (
          <>
            {/* Leyenda con scroll si hay muchos elementos */}
            <div className="absolute top-4 right-4 bg-gray-700 text-white text-sm rounded p-3 max-h-[300px] overflow-y-auto shadow-md space-y-2 w-64">
              {chartData.labels.map((label: string, index: number) => (
                <div key={label} className="flex items-center justify-between gap-2">
                  {/* Cuadro de color */}
                  <div
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: getColor(index) }}
                  />
                  <span className="flex-1 text-base font-semibold truncate">{label}</span>
                  <span className="text-base">{chartData.datasets[0].data[index]}</span>
                </div>
              ))}
            </div>

            {/* Gráfico */}
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    ticks: {
                      display: false, // Oculta los labels del eje X
                    },
                    grid: {
                      display: false,
                    },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      color: "#ffffff",
                      stepSize: 20,
                    },
                  },
                },
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      title: (items) => `Categoría: ${items[0].label}`,
                      label: (context) => `${context.raw} lanzamientos`,
                    },
                  },
                },
              }}
            />
          </>
        )}
      </div>
    )
  );
}
