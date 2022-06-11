function UserProblemRatingGraph(props) {
    const userStatus = props.data;

    let solvedRating = [];
    let solvedPractice = []; // CONTESTANT
    let solvedContest = []; // PRACTICE
    let solvedVirtual = []; // VIRTUAL
    let solvedUnofficial = []; // VIRTUAL
    let solved = {};

    for (const i = 0; i <= 50; i++)
        solvedPractice[i] =
            solvedContest[i] =
            solvedVirtual[i] =
            solvedUnofficial[i] =
                0;

    for (const i = userStatus.length - 1; i >= 0; i--) {
        if (userStatus[i].verdict !== "OK") continue;

        const participantType = userStatus[i].author.participantType;
        const ratingCheck = userStatus[i].problem.rating;
        const problem = userStatus[i].problem;

        if (ratingCheck == undefined) continue;

        const rating = ratingCheck / 100 - 8;

        if (solved[problem.contestId] == undefined)
            solved[problem.contestId] = {};
        if (solved[problem.contestId][problem.index] == undefined)
            solved[problem.contestId][problem.index] = 0;
        if (solved[problem.contestId][problem.index] >= 1) continue;
        if (solvedRating.indexOf((rating + 8) * 100) === -1)
            solvedRating.push((rating + 8) * 100);
        solved[problem.contestId][problem.index]++;

        if (participantType === "PRACTICE") {
            solvedPractice[rating]++;
        } else if (participantType === "CONTESTANT") {
            solvedContest[rating]++;
        } else if (participantType === "VIRTUAL") {
            solvedVirtual[rating]++;
        } else if (participantType === "OUT_OF_COMPETITION") {
            solvedUnofficial[rating]++;
        } else {
            console.log("error didn't find participationType");
        }
    }

    const data = {
        labels: solvedRating,
        datasets: [
            {
                label: "Practice",
                data: solvedPractice,
                backgroundColor: "rgba(244, 63, 93, 0.2)", // tailwind rose 500
                borderColor: "rgba(244, 63, 93, 1)", // tailwind rose 500
                borderWidth: 2,
            },
            {
                label: "Contest",
                data: solvedContest,
                backgroundColor: "rgba(24, 165, 233, 0.2)", // tailwind sky 500
                borderColor: "rgba(24, 165, 233, 1)", // tailwind sky 500
                borderWidth: 2,
            },
            {
                label: "Virtual",
                data: solvedVirtual,
                backgroundColor: "rgba(16, 185, 129, 0.2)", // tailwind emerald 500
                borderColor: "rgba(16, 185, 129, 1)", // tailwind emerald 500
                borderWidth: 2,
            },
            {
                label: "Unofficial",
                data: solvedUnofficial,
                backgroundColor: "rgba(245, 159, 11, 0.2)", // tailwind amber 500
                borderColor: "rgba(245, 159, 11, 1)", // tailwind amber 500
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: 1.5,
        scales: {
            x: {
                stacked: true,
                title: {
                    display: true,
                    text: "Problem rating",
                },
            },
            y: {
                stacked: true,
                title: {
                    display: true,
                    text: "Number solved",
                },
            },
        },
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Solved Problem Rating: " + props.handle,
            },
        },
    };
}

export default UserProblemRatingGraph;
