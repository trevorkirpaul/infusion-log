import { Line, Pie } from "react-chartjs-2";
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

export const LineChart: React.FC<IProps> = ({
  infusionDataForChart,
  title = "Infusions By Month",
}) => {
  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
          display: false,
        },
        title: {
          display: true,
          text: title,
        },
      },
    };
  }, [title]);

  const data = useMemo(() => {
    const labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return {
      labels,
      datasets: [
        {
          label: "Infusions",
          data: labels.map((month) => {
            const infusionData = infusionDataForChart.find(([date, _]) => {
              return date.includes(month);
            });
            return infusionData ? infusionData[1] : 0;
          }),
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
    <div className="border rounded p-5 my-5 border-gray-500 inline-block">
      <Line options={options} data={data} width="100%" />
    </div>
  );
};
