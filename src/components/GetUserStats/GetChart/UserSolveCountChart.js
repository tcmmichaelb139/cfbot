import { useState, useEffect, useRef } from "react";

import {
  select,
  line,
  axisBottom,
  axisLeft,
  scaleLinear,
  scaleTime,
  timeParse,
  extent,
  curveStepAfter,
  bisectCenter,
} from "d3";
import useResizeObserver from "../../Hooks/ResizeObserver";

function UserSolveCountChart(props) {
  const [data, setData] = useState(props.data);
  const wrapperRef = useRef();
  const svgRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    setData(props.data);
  }, [props]);

  useEffect(() => {
    const date = [];

    const solveCount = [];

    const dateVar = new Date();

    for (let i = 0; i < data.length; i++) {
      data[i].creationTimeSeconds -= dateVar.getTimezoneOffset() * 60;
      data[i].creationTimeSeconds -=
        (data[i].creationTimeSeconds % 86400) - 86400;
    }

    let currentDate = data[0].creationTimeSeconds;
    let currentValue = 0;

    const solvedProblem = {};

    for (const problem of data) {
      if (problem.verdict === "OK") {
        if (solvedProblem[problem.problem.contestId] == undefined)
          solvedProblem[problem.problem.contestId] = {};
        if (
          solvedProblem[problem.problem.contestId][problem.problem.index] ==
          undefined
        ) {
          solvedProblem[problem.problem.contestId][problem.problem.index] = 1;
          if (currentDate != problem.creationTimeSeconds) {
            date.push(currentDate);
            solveCount.push(currentValue);
            currentDate = problem.creationTimeSeconds;
            currentValue = 0;
          }
          currentValue++;
        }
      }
    }

    date.push(currentDate);
    solveCount.push(currentValue);

    date.sort();
    solveCount.reverse();

    for (let i = 1; i < solveCount.length; i++)
      solveCount[i] += solveCount[i - 1];

    const allData = [];

    for (let i = 0; i < solveCount.length; i++) {
      date[i] = timeParse("%Q")(date[i] * 1000);
      allData.push({
        date: date[i],
        solveCount: solveCount[i],
      });
    }

    if (!dimensions) return;
    const Margin = { top: 0, right: 0, bottom: 100, left: 90 };
    const Width = dimensions.width;
    const Height = dimensions.height;
    const innerWidth = Width - Margin.left - Margin.right;
    const innerHeight = Height - Margin.bottom - Margin.top;

    // create graph
    const svg = select(svgRef.current)
      .attr("width", Width)
      .attr("height", Height)
      .attr("viewBox", "0 0 " + svgRef.current.clientWidth + " 300");

    svg.selectAll("defs").remove();

    svg
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", innerWidth - Margin.left + 10)
      .attr("height", innerHeight)
      .attr("x", Margin.left)
      .attr("y", Margin.top);

    svg.selectAll(".contentGraph").remove();

    const svgContent = svg
      .append("g")
      .attr("class", "contentGraph")
      .attr("clip-path", "url(#clip)");

    // axis

    const [xFirstDate, xSecondDate] = extent(date);

    const xScale = scaleTime()
      .domain([xFirstDate, xSecondDate])
      .range([Margin.left + 10, innerWidth - 10]);

    const yScale = scaleLinear()
      .domain([0, solveCount[solveCount.length - 1] + 10])
      .range([innerHeight - 10, 0]);

    // axis lines

    const xAxis = axisBottom(xScale);

    svg.selectAll(".xAxis").remove();

    svg
      .append("g")
      .attr("class", "xAxis")
      .style("transform", "translate(0, " + innerHeight + "px)")
      .style("color", "#262626") // between tailwind neutral 800 and 900
      .call(xAxis);

    svg.selectAll(".xAxis text").attr("fill", "#525252"); // tailwind 600

    const yAxis = axisLeft(yScale);

    svg.selectAll(".yAxis").remove();

    svg
      .append("g")
      .attr("class", "yAxis")
      .style("font-weight", 300)
      .style("transform", "translate(" + Margin.left + "px, 0)")
      .style("color", "#262626") // between tailwind neutral 800 and 900
      .call(yAxis);

    svg.selectAll(".yAxis text").attr("fill", "#525252"); // tailwind 600

    // axis labels

    svg.selectAll(".xLabel").remove();

    svg
      .append("text")
      .attr("class", "xLabel")
      .attr("text-anchor", "end")
      .attr("x", innerWidth - 10)
      .attr("y", Height - (Margin.bottom / 5) * 3)
      .attr("fill", "rgba(163, 163, 163, 0.8)") // tailwind neutral 500
      .attr("font-size", 13)
      .style("font-weight", 500)
      .text("Date");

    svg.selectAll(".yLabel").remove();

    svg
      .append("text")
      .attr("class", "yLabel")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", Margin.left / 3)
      .attr("x", 0)
      .attr("fill", "rgba(163, 163, 163, 0.8)") // tailwind neutral 500
      .attr("font-size", 13)
      .style("font-weight", 500)
      .text("Problems solved");

    // create line
    const myLine = line()
      .x((value) => xScale(value.date))
      .y((value) => yScale(value.solveCount))
      .curve(curveStepAfter);

    svgContent
      .selectAll(".line")
      .data([allData])
      .join("path")
      .attr("class", "line")
      .attr("d", myLine)
      .style("fill", "none")
      .style("stroke", "#10b981");

    // change global stuff

    // fonts
    svg
      .selectAll("text")
      .style("font-family", "'Fira Code', monospace")
      .attr("font-weight", "300");
  }, [data, dimensions]);

  return (
    <>
      <div ref={wrapperRef} className="h-full">
        <svg ref={svgRef} className="h-full pt-0 translate-x-4"></svg>
      </div>
    </>
  );
}

export default UserSolveCountChart;
