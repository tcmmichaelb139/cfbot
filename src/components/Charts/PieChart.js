import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

function PieChart(props) {
    return <Pie data={props.data} options={props.options} />;
}

export default PieChart;
