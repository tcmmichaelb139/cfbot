function UserProblemRatingChart(props) {
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
}

export default UserProblemRatingChart;
