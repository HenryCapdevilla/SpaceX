import React, { useEffect, useState } from "react";
import { Moon, Sun, ArrowLeft, ArrowRight } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale } from "chart.js";
import { motion, AnimatePresence } from "framer-motion";
import LaunchCard from "./components/LaunchCard";
import Loader from "./components/Loader";
import "./App.css";

import Pagination from "./components/Pagination";
import ChartFieldSelector from "./components/ChartFieldSelector";
import ValueField from "./components/ValueField";

Chart.register(BarElement, CategoryScale, LinearScale);

const chartFields = [
  { label: "Estado del lanzamiento", value: "status" },
  { label: "ID del cohete", value: "rocket_id" },
  { label: "Año de lanzamiento", value: "launch_date" },
];

const cardFilterFields = [
  { label: "Nombre de misión", value: "mission_name" },
  { label: "Estado", value: "status" },
  { label: "Fecha", value: "launch_date" },
  { label: "ID del cohete", value: "rocket_id" },
  { label: "ID de lanzamiento", value: "launch_id" },
];


export default function App() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartField, setChartField] = useState("status");
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState(0);
  const [cardFilterField, setCardFilterField] = useState("mission_name");
  const [cardFilterValue, setCardFilterValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const launchDates = launches.map((l) => new Date(l.launch_date));
  const minAvailableDate = new Date(Math.min(...launchDates));
  const maxAvailableDate = new Date(Math.max(...launchDates));
  const [sortAsc, setSortAsc] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(cardFilterValue.toLowerCase())
  );

  const itemsPerPage = 6;

  useEffect(() => {
    fetch("https://3b2ymzd1x4.execute-api.us-east-1.amazonaws.com/launches")
      .then((res) => res.json())
      .then((data) => {
        setLaunches(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener datos:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const uniqueValues = Array.from(
      new Set(
        launches
          .map((l) => {
            let val = l[cardFilterField];
            if (cardFilterField === "launch_date") {
              val = new Date(val).toISOString().split("T")[0];
            }
            return val;
          })
          .filter(Boolean)
      )
    );
    setSuggestions(uniqueValues);
  }, [cardFilterField, launches]);

  const filteredCards = launches.filter((l) => {
    const field = cardFilterField;

    if (field === "launch_date") {
      const launchDate = new Date(l.launch_date);

      if (startDate && endDate) {
        return launchDate >= startDate && launchDate <= endDate;
      } else if (startDate && !endDate) {
        return launchDate.toDateString() === startDate.toDateString();
      }

      return true;
    }

    const query = cardFilterValue.toLowerCase();
    const value =
      l[field]?.toLowerCase?.() || l[field]?.toString().toLowerCase?.();
    return value?.includes(query);
  });

  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
  const sortedCards = [...filteredCards].sort((a, b) => {
    const field = cardFilterField;
  
    if (field === "launch_date") {
      const dateA = new Date(a.launch_date);
      const dateB = new Date(b.launch_date);
  
      return sortAsc ? dateA - dateB : dateB - dateA;
    }
  
    return sortAsc
      ? String(a[field]).localeCompare(String(b[field]))
      : String(b[field]).localeCompare(String(a[field]));
  });
  

  const paginatedLaunches = sortedCards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const generateUniqueColors = (count) => {
    const colors = [];
    const saturation = 70;
    const lightness = 50;
    for (let i = 0; i < count; i++) {
      const hue = Math.round((360 / count) * i);
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
  };
  
  const getChartData = () => {
    const countByField = launches.reduce((acc, launch) => {
      let key = launch[chartField];
      if (chartField === "launch_date") {
        key = new Date(key).getFullYear().toString();
      }
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  
    const labels = Object.keys(countByField);
    const values = Object.values(countByField);
    const colors = generateUniqueColors(labels.length);
  
    return {
      labels,
      datasets: [
        {
          label: `Cantidad por ${chartField}`,
          data: values,
          backgroundColor: colors,
        },
      ],
    };
  };
  
  const changePage = (newPage) => {
    setDirection(newPage > currentPage ? 1 : -1);
    setCurrentPage(newPage);
  };
  

  return (
    <div>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">🚀 Lanzamientos SpaceX</h1>
        </div>

        {/* Selector de campo para la gráfica */}
        <div>
          <ChartFieldSelector
            chartField={chartField}
            setChartField={setChartField}
            chartFields={chartFields}
          />
        </div>

        {/* Gráfico */}
        {!loading && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6 w-full max-w-5xl mx-auto h-auto">
            {getChartData().labels.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                📉 No hay datos suficientes para mostrar la gráfica.
              </div>
            ) : (
              <div className="flex flex-col-reverse md:flex-row relative md:h-[460px]">
                {/* Gráfico */}
                <div className="flex-1 h-[300px] md:h-full">
                  <Bar
                    data={getChartData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          ticks: {
                            display: false,
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
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          callbacks: {
                            title: (tooltipItems) =>
                              `Categoría: ${tooltipItems[0].label}`,
                            label: (context) => `${context.raw} lanzamientos`,
                          },
                        },
                      },
                    }}
                  />
                </div>

                {/* Leyenda personalizada */}
                <div
                  className="bg-gray-700 text-white text-sm rounded p-4 shadow-md space-y-2 
                        w-full md:w-[500px] md:absolute md:top-4 md:right-4 
                        max-h-[240px] md:max-h-[460px] overflow-auto mb-4 md:mb-0"
                >
                  {getChartData()
                    .labels.slice(0, 16)
                    .map((label, index) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-3"
                      >
                        <div
                          className="w-3 h-3 rounded-sm"
                          style={{
                            backgroundColor:
                              getChartData().datasets[0].backgroundColor?.[
                                index
                              ] || "#ccc",
                          }}
                        />
                        <span className="flex-1 truncate font-medium">
                          {label}
                        </span>
                        <span>{getChartData().datasets[0].data[index]}</span>
                      </div>
                    ))}

                  {getChartData().labels.length > 16 && (
                    <div className="text-xs italic text-gray-300 mt-2 text-center">
                      +{getChartData().labels.length - 16} más...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filtro personalizado con sugerencias visuales */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row items-start gap-4 mb-2">
            <div>
              <label className="text-sm block mb-1 font-semibold">
                🔎 Filtrar por:
              </label>
              <select
                value={cardFilterField}
                onChange={(e) => {
                  setCardFilterField(e.target.value);
                  setCardFilterValue("");
                  setStartDate(null);
                  setEndDate(null);
                }}
                className="w-full md:w-64 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              >
                {cardFilterFields.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Campo de valor según tipo */}
            <ValueField
              cardFilterField={cardFilterField}
              cardFilterValue={cardFilterValue}
              setCardFilterValue={setCardFilterValue}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              minAvailableDate={minAvailableDate}
              maxAvailableDate={maxAvailableDate}
              setCurrentPage={setCurrentPage}
            />
          </div>

          {/* Sugerencias dinámicas como botones */}
          {filteredSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {filteredSuggestions.slice(0, 10).map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCardFilterValue(sug);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-blue-500 hover:text-white transition"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="px-4 py-2 rounded border text-sm bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-blue-500 hover:text-white transition"
          >
            Ordenar {sortAsc ? "↑ Ascendente" : "↓ Descendente"}
          </button>
        </div>

        {/* Cards */}
        {loading ? (
          <Loader />
        ) : filteredCards.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 my-10">
            ❌ No se encontraron resultados para las tarjetas.
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {paginatedLaunches.map((launch) => (
                <LaunchCard key={launch.launch_id} launch={launch} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Navegación */}
        <div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            changePage={changePage}
          />
        </div>
      </div>
    </div>
  );
}
