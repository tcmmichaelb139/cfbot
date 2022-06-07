import { useState, useEffect } from "react";

function UserStatus(handle) {
    const [getUserStatus, setGetUserStatus] = useState();
    const [userStatus, setUserStatus] = useState();

    useEffect(() => {
        fetch("https://codeforces.com/api/user.status?handle=" + handle)
            .then((response) => {
                if (!response.ok) {
                    return Promise.reject();
                }
                return response.json();
            })
            .then((data) => {
                setGetUserStatus(data);
                setUserStatus(data.result);
            })
            .catch(() => {
                setUserStatus("API Error");
            });
    }, []);

    if (userStatus === "API Error") return "API Error";

    if (getUserStatus === undefined) return "Unknown Error";

    if (getUserStatus.status !== "OK") {
        if (getUserStatus.comment === "handle: User " + handle + " not found")
            return "User Not Found";
        else return "API Error";
    }

    return userStatus;
}

export default UserStatus;
