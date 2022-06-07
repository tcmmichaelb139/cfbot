import { useState, useEffect } from "react";

function UserRating(handle) {
    const [getUserRating, setGetUserRating] = useState();
    const [userRating, setUserRating] = useState();

    useEffect(() => {
        fetch("https://codeforces.com/api/user.rating?handle=" + handle)
            .then((response) => {
                if (!response.ok) {
                    return Promise.reject();
                }
                return response.json();
            })
            .then((data) => {
                setGetUserRating(data);
                setUserRating(data.result);
            })
            .catch(() => {
                setUserRating("API Error");
            });
        return;
    }, [userRating]);

    if (userRating === "API Error") return "API Error";

    if (getUserRating === undefined) return "Unknown Error";

    if (getUserRating.status !== "OK") {
        if (getUserRating.comment === "handle: User " + handle + " not found")
            return "User Not Found";
        else return "API Error";
    }

    return userRating;
}

export default UserRating;
