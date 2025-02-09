"use client";

import { loans } from "@/app/data/loan";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const statusCounts = loans.reduce(
    (acc, loan) => {
      acc[loan.status]++;
      return acc;
    },
    { Pendente: 0, Devolvido: 0 }
  );

  const chartData = {
    labels: ["Pendente", "Devolvido"],
    datasets: [
      {
        label: "Status dos Empréstimos",
        data: [statusCounts.Pendente, statusCounts.Devolvido],
        backgroundColor: ["#f39c12", "#27ae60"],
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Dashboard de Locações</h1>
      <Bar data={chartData} />
    </div>
  );
}
