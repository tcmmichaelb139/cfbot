import axios from "axios";
import { useState, useEffect } from "react";

import UserRatingGraph from "./GetGraph/UserRatingGraph";
import UserTagGraph from "./GetGraph/UserTagGraph";
import UserVerdictGraph from "./GetGraph/UserVerdictGraph";
import UserProblemRatingGraph from "./GetGraph/UserProblemRatingGraph";

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
                    <UserRatingGraph handle={props.handle} data={userRating} />
                </div>
            );
    }, [props, userRating]);

    return (
        <div className="mx-[5%] my-10">
            {jsxCharts}
            {/* <div className="">
                <div className="bg-neutral-800/40 h-80 m-1 p-[1%]">
                    <UserVerdictGraph handle={props.handle} data={userStatus} />
                </div>
            </div> */}
            {/* <div className="bg-neutral-900 shadow-md h-96 m-1 p-[1%]">
                <UserTagGraph handle={props.handle} data={userStatus} />
            </div> */}
            {/* <div className="bg-neutral-900 shaodw-md h-96 m-1 p-[1%]">
                <UserProblemRatingGraph
                    handle={props.handle}
                    data={userStatus}
                />
                </ */}
        </div>
    );
}

export default GetUserStats;
