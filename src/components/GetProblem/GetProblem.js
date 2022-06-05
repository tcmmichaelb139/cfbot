import React, { useState, useEffect } from "react";

import ApiError from "../Errors/ApiError";
import UserNotFound from "../Errors/UserNotFound";

function GetProblem(props) {
    const [checkUserStatus, setCheckUserStatus] = useState();
    const [userStatus, setUserStatus] = useState();

    useEffect(() => {
        fetch("https://codeforces.com/api/user.status?handle=" + props.handle)
            .then(async (response) => {
                if (!response.ok) {
                    return Promise.reject();
                }
                return response.json();
            })
            .then((data) => {
                setCheckUserStatus(data);
                setUserStatus(data.result);
            })
            .catch(() => {
                setUserStatus("API Error");
            });
    }, []);

    if (userStatus === "API Error") return <ApiError />;

    if (checkUserStatus === undefined) return;

    if (checkUserStatus.status !== "OK") {
        if (
            checkUserStatus.comment ===
            "handle: User " + props.handle + " not found"
        )
            return <UserNotFound />;
        else return <ApiError />;
    }

    console.log(userStatus);

    // do stuff with userStatus
    return <>test</>;
}

export default GetProblem;
