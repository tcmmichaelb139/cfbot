import axios from "axios";
import { useState, useEffect } from "react";

import UserRatingGraph from "./GetGraph/UserRatingGraph";
import UserTagGraph from "./GetGraph/UserTagGraph";
import UserVerdictGraph from "./GetGraph/UserVerdictGraph";

import ApiError from "../Errors/ApiError";
import UserNotFound from "../Errors/UserNotFound";

function GetUserStats(props) {
    const [userRating, setUserRating] = useState();
    const [userStatus, setUserStatus] = useState();

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
    }, []);

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
    }, []);

    if (userRating === undefined || userStatus == undefined) return;
    if (userRating === "ERR_BAD_RESPONSE" || userStatus === "ERR_BAD_RESPONSE")
        return <ApiError />;

    return (
        <div className="mx-[15%] mb-10">
            <div className="h-80">
                <UserRatingGraph handle={props.handle} data={userRating} />
            </div>
            <div className="h-96">
                <UserTagGraph handle={props.handle} data={userStatus} />
            </div>
            <div className="h-80">
                <UserVerdictGraph handle={props.handle} data={userStatus} />
            </div>
        </div>
    );
}

export default GetUserStats;
