import React, { useState, useEffect } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";

import ApiError from "../Errors/ApiError";
import UserNotFound from "../Errors/UserNotFound";
import NetworkError from "../Errors/NetworkError";

function GetProblem(props) {
    const [loading, setLoading] = useState(true);

    const [problemsetProblems, setProblemsetProblems] = useState(
        props.problemset
    );
    const [userStatus, setUserStatus] = useState();
    const [problemRating, setProblemRating] = useState();
    const [problemLink, setProblemLink] = useState();

    useEffect(() => {
        setLoading(true);
        setProblemRating(props.rating);
    }, [props.rating]);

    useEffect(() => {
        setLoading(true);
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
    }, [props.handle]);

    useEffect(() => {
        setLoading(true);
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

        for (let problem of shuffledProblems) {
            if (
                problem.rating == problemRating &&
                (tried[problem.contestId] == undefined ||
                    tried[problem.contestId] == undefined)
            ) {
                setProblemLink(
                    "https://codeforces.com/problemset/problem/" +
                        problem.contestId +
                        "/" +
                        problem.index
                );
                break;
            }
        }
        setLoading(false);
    }, [props, problemRating, problemsetProblems, userStatus]);

    return (
        <>
            <div className="absolute right-0 top-12 w-20 h-20">
                <HashLoader color="#10b981" loading={loading} size={50} />
            </div>
            <a href={problemLink} target="_blank" rel="noopener noreferrer">
                Problem: {problemLink}
            </a>
        </>
    );
}

export default GetProblem;
