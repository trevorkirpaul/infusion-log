import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import React, { useMemo } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface IProps {
  userId: string;
  infusionDataForChart: [string, number][];
  title?: string;
}

export const PieChart: React.FC<IProps> = ({
  infusionDataForChart,
  title = "Infusions By Month",
}) => {
  const options = useMemo(() => {
    return {
      responsive: true,
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: true,
          text: title,
        },
      },
    };
  }, [title]);

  const data = useMemo(() => {
    return {
      labels: infusionDataForChart.map(([date, _]) => date),
      datasets: [
        {
          label: "Infusions",
          data: infusionDataForChart.map(([_, count]) => count),
          borderColor: "grey",
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
            "rgba(255, 159, 64, 0.5)",
          ],
        },
      ],
    };
  }, [infusionDataForChart]);

  return (
    <div className="border rounded p-5 my-5 border-gray-500 inline-block w-96">
      <Pie options={options} data={data} />
    </div>
  );
};
