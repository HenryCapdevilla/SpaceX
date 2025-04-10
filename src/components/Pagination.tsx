import React from "react";
import { ArrowLeft, ArrowRight } from "react-feather"; // Asegúrate de tener este ícono o el que prefieras

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  changePage: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, changePage }) => {
  return (
    totalPages > 1 && (
      <div className="mt-6 flex justify-center gap-4 items-center">
        <button
          onClick={() => changePage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
        >
          <ArrowLeft size={16} /> Anterior
        </button>

        <span className="px-4 text-sm">
          Página {currentPage} de {totalPages}
        </span>

        <button
          onClick={() => changePage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
        >
          Siguiente <ArrowRight size={16} />
        </button>
      </div>
    )
  );
};

export default Pagination;
