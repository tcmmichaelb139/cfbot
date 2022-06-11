import React, { useState, useEffect } from "react";
import axios from "axios";

import ApiError from "../Errors/ApiError";
import UserNotFound from "../Errors/UserNotFound";

function GetProblem(props) {
    const [problemsetProblems, setProblemsetProblems] = useState();
    const [userStatus, setUserStatus] = useState();
    const [problemRating, setProblemRating] = useState();

    useEffect(() => {
        setProblemRating(props.rating);
    }, [props]);

    useEffect(() => {
        axios
            .get("https://codeforces.com/api/problemset.problems")
            .then((response) => {
                setProblemsetProblems(response.data.result.problems);
            })
            .catch((error) => {
                setProblemsetProblems(error.code);
            });
    }, [props]);

    useEffect(() => {
        axios
            .get(
                "https://codeforces.com/api/user.status?handle=" + props.handle
            )
            .then((response) => {
                setUserStatus(response.data.result);
            })
            .catch((error) => {
                setUserStatus(error.code);
            });
    }, [props]);

    if (problemsetProblems === undefined || userStatus == undefined) return;
    if (
        problemsetProblems === "ERR_BAD_RESPONSE" ||
        userStatus == "ERR_BAD_RESPONSE"
    )
        return <ApiError />;
    if (
        problemsetProblems === "ERR_BAD_REQUEST" ||
        userStatus == "ERR_BAD_REQUEST"
    )
        return <UserNotFound />;
    if (problemsetProblems === "ERR_NETWORK" || userStatus == "ERR_NETWORK")
        return <NetworkError />;

    const tried = {};

    for (const problem of userStatus) {
        if (tried[problem.contestId] == undefined)
            tried[problem.contestId] = {};
        if (tried[problem.contestId][problem.problem.index] == undefined)
            tried[problem.contestId][problem.problem.index] = 1;
    }

    // Knuth Shuffle
    function shuffle(array) {
        let currentIndex = array.length,
            randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }

        return array;
    }

    const shuffledProblems = shuffle(problemsetProblems);

    let problemChosen;

    for (let problem of shuffledProblems) {
        if (
            problem.rating == problemRating &&
            (tried[problem.contestId] == undefined ||
                tried[problem.contestId] == undefined)
        ) {
            problemChosen =
                "https://codeforces.com/problemset/problem/" +
                problem.contestId +
                "/" +
                problem.index;
            break;
        }
    }

    return (
        <>
            <a href={problemChosen} target="_blank" rel="noopener noreferrer">
                Problem Link
            </a>
        </>
    );
}

export default GetProblem;
