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

import convertToTimeZone from "../../Util/convertToTimeZone";

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

function SolveCountChart(props) {
  const [data, setData] = useState(props.data);
  const [jsxChart, setJsxChart] = useState();

  useEffect(() => {
    setData(props.data);
  }, [props]);

  useEffect(() => {
    const date = [];

    const solveCount = [];

    for (let i = 0; i < data.length; i++) {
      data[i].creationTimeSeconds = convertToTimeZone(
        data[i].creationTimeSeconds
      );
    }

    let currentDate = data[0].creationTimeSeconds;
    let currentValue = 0;

    const solvedProblem = {};

    for (const problem of data) {
      if (problem.verdict === "OK") {
        if (solvedProblem[problem.problem.contestId] == undefined)
          solvedProblem[problem.problem.contestId] = {};
        if (
          solvedProblem[problem.problem.contestId][problem.problem.index] ==
          undefined
        ) {
          solvedProblem[problem.problem.contestId][problem.problem.index] = 1;
          if (currentDate != problem.creationTimeSeconds) {
            date.push(currentDate);
            solveCount.push(currentValue);
            currentDate = problem.creationTimeSeconds;
            currentValue = 0;
          }
          currentValue++;
        }
      }
    }

    date.push(currentDate);
    solveCount.push(currentValue);

    date.sort();
    solveCount.reverse();

    for (let i = 1; i < solveCount.length; i++)
      solveCount[i] += solveCount[i - 1];

    const allData = [];

    for (let i = 0; i < solveCount.length; i++) {
      date[i] = new Date(date[i] * 1000);
      allData.push({
        date: date[i],
        solveCount: solveCount[i],
      });
    }

    const graphData = allData.map((contest) => {
      return {
        x: contest.date,
        y: contest.solveCount,
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
      elements: {
        point: {
          radius: 0,
        },
      },
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
            text: "Problems solved",
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

export default SolveCountChart;
