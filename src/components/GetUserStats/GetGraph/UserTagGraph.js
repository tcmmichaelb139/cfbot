import { useState } from "react";

function UserTagGraph(props) {
    const userStatus = props.data;

    const numTags = {};
    const solveNumTags = [];

    for (const problem of userStatus) {
        const contestId = problem.problem.contestId;
        const index = problem.problem.index;
        if (problem.verdict === "OK") {
            if (solveNumTags[contestId] == undefined) {
                solveNumTags[contestId] = {};
            }
            if (solveNumTags[contestId][index] == undefined) {
                solveNumTags[contestId][index] = 0;
            }
            if (solveNumTags[contestId][index] > 0) {
                solveNumTags[contestId][index]++;
                continue;
            }
            solveNumTags[contestId][index]++;
            for (let tag of problem.problem.tags) {
                if (numTags[tag] == undefined) numTags[tag] = 0;
                numTags[tag]++;
                if (numTags[tag] == undefined) console.log(tag, numTags[tag]);
            }
        }
    }

    // Sorting numTags

    const sortedNumTagsArray = [];
    for (const tag in numTags) sortedNumTagsArray.push([tag, numTags[tag]]);

    sortedNumTagsArray.sort((a, b) => {
        return b[1] - a[1];
    });

    const tags = [];
    const sortedNumTags = [];

    for (const tag of sortedNumTagsArray) {
        tags.push(tag[0]);
        sortedNumTags.push(tag[1]);
    }

    console.log(tags);
    console.log(sortedNumTags);
}

export default UserTagGraph;
