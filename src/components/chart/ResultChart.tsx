import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getResultChartOptions } from "./getResultChartOptions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

type ResultChartProps = {
  className?: string;
  dataSet: any[];
};

export const ResultChart = ({ className, dataSet }: ResultChartProps) => {
  const data = {
    labels: dataSet.map((_, i) => i + 1),
    datasets: [
      {
        label: "Words per Minute",
        data: dataSet,
        borderColor: "rgb(253, 224, 71)",
      },
    ],
  };

  const maxWpm = Math.max(...dataSet);
  const options = getResultChartOptions(maxWpm + 20);

  return (
    <div className={className}>
      {/* @ts-ignore */}
      <Line options={options} data={data} />
    </div>
  );
};
