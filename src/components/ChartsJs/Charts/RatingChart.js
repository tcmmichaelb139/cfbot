import { useState, useEffect, useRef } from "react";

function RatingChart(props) {
  const [data, setData] = useState(props.data);

  useEffect(() => {
    setData(props.data);
  }, [props]);

  useEffect(() => {
    const rating = data.map((contest) => contest.newRating);
    const date = data.map((contest) => {
      return timeParse("%Q")(contest.ratingUpdateTimeSeconds * 1000);
    });

    const allData = data.map((contest) => {
      return {
        rating: contest.newRating,
        date: timeParse("%Q")(contest.ratingUpdateTimeSeconds * 1000),
        contestName: contest.contestName,
        contestId: contest.contestId,
        rank: contest.rank,
      };
    });
  }, [data]);

  return <></>;
}

export default RatingChart;
