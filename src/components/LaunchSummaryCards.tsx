import React from 'react';

const LaunchSummaryCards = ({ total, successful }) => {
    return (
      <div className="flex flex-col h-[400px] w-60 justify-between">
        {/* Tarjeta 1 */}
        <div className="bg-blue-100 p-4 rounded-2xl shadow flex-1 flex flex-col justify-center items-center">
          <h3 className="text-lg font-semibold text-blue-800">Lanzamientos totales</h3>
          <p className="text-3xl font-bold text-blue-900">{total}</p>
        </div>
  
        {/* Tarjeta 2 */}
        <div className="bg-green-100 p-4 rounded-2xl shadow flex-1 flex flex-col justify-center items-center mt-4">
          <h3 className="text-lg font-semibold text-green-800">Éxitos</h3>
          <p className="text-3xl font-bold text-green-900">{successful}</p>
        </div>
      </div>
    );
  };

export default LaunchSummaryCards;