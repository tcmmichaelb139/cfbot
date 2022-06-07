import LineChart from "../../Charts/LineChart";

function UserRatingGraph(props) {
    const userRating = props.data;

    let date = [];
    let rating = [];

    for (const i = 0; i < userRating.length; i++) {
        const unixDate = new Date(userRating[i].ratingUpdateTimeSeconds * 1000);

        const newDate =
            unixDate.toLocaleDateString("en-US") +
            " : " +
            userRating[i].contestId;

        date.push(newDate);
        rating.push(userRating[i].newRating);
    }

    const allData = {
        labels: date,
        datasets: [
            {
                label: props.handle,
                data: rating,
                borderColor: "rgb(16, 185, 129)", // Tailwind emerald 500
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: 1.5,
        scales: {
            y: {
                title: {
                    display: true,
                    text: "Rating",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Date : Contest ID",
                },
            },
        },
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Rating Change: " + props.handle,
            },
            tooltip: {},
        },
    };

    return <LineChart data={allData} options={options} />;
}

export default UserRatingGraph;
