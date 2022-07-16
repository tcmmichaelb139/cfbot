import axios from "axios";
import { useState, useEffect } from "react";
import { defaults } from "chart.js";

// loading
import { HashLoader } from "react-spinners";

// line charts
import RatingChart from "./Charts/RatingChart";
import SolveCountChart from "./Charts/SolveCountChart";

import ApiError from "../Errors/ApiError";
import UserNotFound from "../Errors/UserNotFound";
import NetworkError from "../Errors/NetworkError";
import UserZeroContents from "../Errors/UserZeroContests";
import UserNoSolves from "../Errors/UserNoSolves";

// defaults
defaults.font.family = "'Fira Code', monospace";
defaults.color = "rgba(115, 115, 115, 1)"; // tailwind neutral 500
defaults.borderColor = "rgba(38, 38, 38, 1)"; // tailwind neutral 500
defaults.backgroundColor = "rgba(23, 23, 23, 1)"; // tailwind neutral 500
defaults.plugins.title.color = "rgba(163, 163, 163, 0.8)"; // tailwind neutral 400

function ChartsJs(props) {
  const [loading, setLoading] = useState(true);

  const [userRating, setUserRating] = useState();
  const [userStatus, setUserStatus] = useState();
  const [jsxCharts, setJsxCharts] = useState();

  // gets userRating aka contests
  useEffect(() => {
    setLoading(true);
    axios
      .get("https://codeforces.com/api/user.rating?handle=" + props.handle)
      .then((response) => {
        setUserRating(response.data.result);
      })
      .catch((error) => {
        setUserRating(error.code);
      });
  }, [props]);

  // gets userStatus aka submissions
  useEffect(() => {
    setLoading(true);
    axios
      .get("https://codeforces.com/api/user.status?handle=" + props.handle)
      .then((response) => {
        setUserStatus(response.data.result);
      })
      .catch((error) => {
        setUserStatus(error.code);
      });
  }, [props]);

  useEffect(() => {
    setLoading(true);
    if (userRating === undefined || userStatus == undefined) setLoading(true);
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
    else if (!userRating.length && !userStatus.length) {
      setJsxCharts(
        <div>
          <UserZeroContents />
          <UserNoSolves />
        </div>
      );
    } else if (!userRating.length && userStatus.length) {
      setJsxCharts(
        <div>
          <UserZeroContents />
          <div className="bg-neutral-900 shadow-md h-96 mb-4">
            <SolveCountChart handle={props.handle} data={userStatus} />
          </div>
        </div>
      );
    } else {
      setJsxCharts(
        <div>
          <div className="bg-neutral-900 shadow-md h-96 p-1 mb-4">
            <RatingChart handle={props.handle} data={userRating} />
          </div>
          <div className="bg-neutral-900 shadow-md h-96 p-1 mb-4">
            <SolveCountChart handle={props.handle} data={userStatus} />
          </div>
        </div>
      );
    }
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [props, userRating, userStatus]);

  return (
    <div className="">
      <div className="absolute right-0 top-12 w-20 h-20">
        <HashLoader color="#10b981" loading={loading} size={50} />
      </div>
      {jsxCharts}
    </div>
  );
}

export default ChartsJs;
