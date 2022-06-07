import BarChart from "../../Charts/BarChart";

function UserTagGraph(props) {
    const userStatus = props.data;

    let numTags = {};
    let solveNumTags = [];

    for (const problem of userStatus) {
        const contestId = problem.problem.contestId;
        const index = problem.problem.index;
        if (problem.verdict === "OK") {
            if (
                solveNumTags[contestId] == NaN ||
                solveNumTags[contestId] == undefined
            ) {
                solveNumTags[contestId] = {};
            }
            if (
                solveNumTags[contestId][index] == NaN ||
                solveNumTags[contestId][index] == undefined
            ) {
                solveNumTags[contestId][index] = 0;
            }
            if (solveNumTags[contestId][index] > 0) {
                solveNumTags[contestId][index]++;
                continue;
            }
            solveNumTags[contestId][index]++;
            for (let tag of problem.problem.tags) {
                if (numTags[tag] == NaN || numTags[tag] == undefined)
                    numTags[tag] = 0;
                numTags[tag]++;
                if (numTags[tag] == undefined) console.log(tag, numTags[tag]);
            }
        }
    }

    // Sorting numTags

    let sortedNumTagsArray = [];
    for (const tag in numTags) sortedNumTagsArray.push([tag, numTags[tag]]);

    sortedNumTagsArray.sort((a, b) => {
        return b[1] - a[1];
    });

    let tags = [];
    let sortedNumTags = [];

    for (const tag of sortedNumTagsArray) {
        tags.push(tag[0]);
        sortedNumTags.push(tag[1]);
    }

    // create graph
    const allData = {
        labels: tags,
        datasets: [
            {
                label: props.handle,
                data: sortedNumTags,
                backgroundColor: "rgba(16, 185, 129, .2)", // Tailwind emerald 500
                borderColor: "rgba(16, 185, 129, 1)", // Tailwind emerald 500
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Solved Problem Tags: " + props.handle,
            },
        },
    };

    return <BarChart data={allData} options={options} />;
}

export default UserTagGraph;
