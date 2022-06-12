import axios from "axios";
import { useState, useEffect } from "react";

// line charts
import UserRatingChart from "./GetChart/UserRatingChart";
import UserSolveCountChart from "./GetChart/UserSolveCountChart";

import UserTagChart from "./GetChart/UserTagChart";
import UserVerdictChart from "./GetChart/UserVerdictChart";
import UserProblemRatingChart from "./GetChart/UserProblemRatingChart";

import ApiError from "../Errors/ApiError";
import UserNotFound from "../Errors/UserNotFound";
import NetworkError from "../Errors/NetworkError";
import UserZeroContents from "../Errors/UserZeroContests";

function GetUserStats(props) {
    const [userRating, setUserRating] = useState();
    const [userStatus, setUserStatus] = useState();
    const [jsxCharts, setJsxCharts] = useState();

    useEffect(() => {
        axios
            .get(
                "https://codeforces.com/api/user.rating?handle=" + props.handle
            )
            .then((response) => {
                setUserRating(response.data.result);
            })
            .catch((error) => {
                setUserRating(error.code);
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

    useEffect(() => {
        if (userRating === undefined || userStatus == undefined) null;
        else if (
            userRating === "ERR_BAD_RESPONSE" ||
            userStatus === "ERR_BAD_RESPONSE"
        )
            setJsxCharts(<ApiError />);
        else if (
            userRating === "ERR_BAD_REQUEST" ||
            userStatus === "ERR_BAD_REQUEST"
        )
            setJsxCharts(<UserNotFound />);
        else if (userRating === "ERR_NETWORK" || userStatus === "ERR_NETWORK")
            setJsxCharts(<NetworkError />);
        else if (!userRating.length) setJsxCharts(<UserZeroContents />);
        else
            setJsxCharts(
                <div className="bg-neutral-900 shadow-md h-96">
                    <UserRatingChart handle={props.handle} data={userRating} />
                    <UserSolveCountChart
                        handle={props.handle}
                        data={userStatus}
                    />
                </div>
            );
    }, [props, userRating]);

    return <div className="">{jsxCharts}</div>;
}

export default GetUserStats;
