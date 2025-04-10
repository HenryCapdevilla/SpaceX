import React from "react";

type LaunchStatus = "success" | "failed" | "upcoming" | string;

interface Launch {
  mission_name: string;
  rocket_id: string;
  launch_date: string | Date;
  status: LaunchStatus;
}

interface LaunchCardProps {
  launch: Launch;
}

const LaunchCard: React.FC<LaunchCardProps> = ({ launch }) => {
  const { mission_name, rocket_id, launch_date, status } = launch;

  const statusColors: Record<LaunchStatus, string> = {
    success: "bg-green-200 text-green-800",
    failed: "bg-red-200 text-red-800",
    upcoming: "bg-yellow-200 text-yellow-800",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg transition">
      <h2 className="text-xl font-semibold mb-2">{mission_name}</h2>
      <p className="text-sm">
        🚀 <strong>Cohete:</strong> {rocket_id}
      </p>
      <p className="text-sm">
        📅 <strong>Fecha:</strong>{" "}
        {new Date(launch_date).toLocaleDateString()}
      </p>
      <span
        className={`inline-block mt-3 px-3 py-1 text-sm font-medium rounded-full ${
          statusColors[status] || "bg-gray-300 text-gray-800"
        }`}
      >
        {status}
      </span>
    </div>
  );
};

export default LaunchCard;
