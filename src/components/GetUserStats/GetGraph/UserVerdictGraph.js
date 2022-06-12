function UserVerdictGraph(props) {
    const userStatus = props.data;

    let allVerdicts = {};

    for (const problem of userStatus) {
        if (allVerdicts[problem.verdict] == undefined)
            allVerdicts[problem.verdict] = 0;
        allVerdicts[problem.verdict]++;
    }

    let verdicts = [];
    let numVerdicts = [];
    let verdictBackgroundColor = [];
    let verdictBorderColor = [];

    for (const verdict in allVerdicts) {
        numVerdicts.push(allVerdicts[verdict]);
        if (verdict === "OK") {
            verdicts.push("Accepted");
            verdictBackgroundColor.push("rgba(16, 185, 129, 0.2)"); // tailwind emerald 500
            verdictBorderColor.push("rgba(16, 185, 129, 1)"); // tailwind emerald 500
        } else if (verdict === "WRONG_ANSWER") {
            verdicts.push("Wrong Answer");
            verdictBackgroundColor.push("rgba(244, 63, 93, 0.2)"); // tailwind rose 500
            verdictBorderColor.push("rgba(244, 63, 93, 1)"); // tailwind rose 500
        } else if (verdict === "MEMORY_LIMIT_EXCEEDED") {
            verdicts.push("Memory Limit Exceeded");
            verdictBackgroundColor.push("rgba(139, 92, 246, 0.2)"); // tailwind violet 500
            verdictBorderColor.push("rgba(139, 92, 246, 1)"); // tailwind violet 500
        } else if (verdict === "RUNTIME_ERROR") {
            verdicts.push("Runtime Error");
            verdictBackgroundColor.push("rgba(245, 159, 11, 0.2)"); // tailwind amber 500
            verdictBorderColor.push("rgba(245, 159, 11, 1)"); // tailwind amber 500
        } else if (verdict === "TIME_LIMIT_EXCEEDED") {
            verdicts.push("Time Limit Exceeded");
            verdictBackgroundColor.push("rgba(24, 165, 233, 0.2)"); // tailwind sky 500
            verdictBorderColor.push("rgba(24, 165, 233, 1)"); // tailwind sky 500
        } else if (verdict === "PRESENTATION_ERROR") {
            verdicts.push("Presentation Error");
            verdictBackgroundColor.push("rgba(107, 114, 128, 0.2)"); // tailwind gray 500
            verdictBorderColor.push("rgba(107, 114, 128, 1)"); // tailwind gray 500
        } else if (verdict === "IDLENESS_LIMIT_EXCEEDED") {
            verdicts.push("Idleness Limit Exceeded");
            verdictBackgroundColor.push("rgba(100, 116, 139, 0.2)"); // tailwind slate 500
            verdictBorderColor.push("rgba(100, 116, 139, 1)"); // tailwind slate 500
        } else if (verdict === "COMPILATION_ERROR") {
            verdicts.push("Compilation Error");
            verdictBackgroundColor.push("rgba(234, 178, 8, 0.2)"); // tailwind yellow 500
            verdictBorderColor.push("rgba(234, 178, 8, 1)"); // tailwind yellow 500
        } else {
            verdicts.push(verdict);
            verdictBackgroundColor.push("rgba(115, 115, 115, 0.2)"); // tailwind neutral 500
            verdictBorderColor.push("rgba(115, 115, 115, 1)"); // tailwind neutral 500
        }
    }
}

export default UserVerdictGraph;
