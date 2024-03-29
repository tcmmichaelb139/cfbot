import { useState, useEffect } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-moment";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function RatingChart(props) {
  const [data, setData] = useState(props.data);
  const [jsxChart, setJsxChart] = useState();

  useEffect(() => {
    setData(props.data);
  }, [props]);

  useEffect(() => {
    const allData = data.map((contest) => {
      return {
        rating: contest.newRating,
        date: new Date(contest.ratingUpdateTimeSeconds * 1000),
        contestName: contest.contestName,
        contestId: contest.contestId,
        rank: contest.rank,
      };
    });

    const graphData = allData.map((contest) => {
      return {
        x: contest.date,
        y: contest.rating,
      };
    });

    const chartData = {
      datasets: [
        {
          label: props.handle,
          data: graphData,
          borderColor: "#10b981", // tailwind emerald 500
          borderWidth: 2,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      devicePixelRatio: 1.5,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "month",
            tooltipFormat: "MMM DD, YYYY",
            displayFormat: {
              month: "MMM YYYY",
            },
          },
          title: {
            display: true,
            text: "Date",
          },
        },
        y: {
          title: {
            display: true,
            text: "Rating",
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        position: "top",
        title: {
          display: true,
          text: props.handle + " Rating Graph",
        },
      },
    };
    setJsxChart(<Line options={chartOptions} data={chartData} />);
  }, [data]);

  return <>{jsxChart}</>;
}

export default RatingChart;
