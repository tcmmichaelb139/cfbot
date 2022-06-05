import { useState, useEffect, useRef } from "react";

import LineChart from "../../Charts/LineChart";

import ApiError from "../../Errors/ApiError";
import UserNotFound from "../../Errors/UserNotFound";

function UserRating(props) {
    const [getUserRating, setGetUserRating] = useState();
    const [userRating, setUserRating] = useState();
    const svg = useRef(null);

    useEffect(() => {
        fetch("https://codeforces.com/api/user.rating?handle=" + props.handle)
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
    }, []);

    if (userRating === "API Error") return <ApiError />;

    if (getUserRating === undefined) return <></>;

    if (getUserRating.status !== "OK") {
        if (
            getUserRating.comment ===
            "handle: User " + props.handle + " not found"
        )
            return <UserNotFound />;
        else return <ApiError />;
    }

    // unix time

    let date = [];
    let rating = [];

    for (const contest of userRating) {
        const unixDate = new Date(contest.ratingUpdateTimeSeconds * 1000);

        const newDate =
            unixDate.toLocaleDateString("en-US") + " : " + contest.contestId;

        date.push(newDate);
        rating.push(contest.newRating);
    }

    const allData = {
        labels: date,
        datasets: [
            {
                label: props.handle + " rating",
                data: rating,
                borderColor: "rgb(16, 185, 129)", // Tailwind emerald 500
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index",
        },
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Rating Change of Handle: " + props.handle,
            },
            tooltip: {},
        },
    };

    return <LineChart data={allData} options={options} />;
}

export default UserRating;
