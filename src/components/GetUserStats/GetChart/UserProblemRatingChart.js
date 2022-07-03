import { useState, useEffect, useRef } from "react";

import {
  select,
  axisBottom,
  axisLeft,
  scaleBand,
  scaleLinear,
  stack,
  max,
  pointer,
  bisectCenter,
} from "d3";
import useResizeObserver from "../../Hooks/ResizeObserver";

function UserProblemRatingChart(props) {
  const [data, setData] = useState(props.data);
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const svgRef = useRef();

  useEffect(() => {
    setData(props.data);
  }, [props]);

  useEffect(() => {
    //gets all the data
    let solvedDataTemp = [];
    let solved = {};

    const keys = ["practice", "contest", "unofficial", "virtual"];
    const fillColors = {
      practice: "#F43F5E33", // tailwind rose 500
      contest: "#0EA5E933", // tailwind sky 500
      unofficial: "#F59E0B33", // tailwind amber 500
      virtual: "#10B98133", // tailwind emerald 500
    };
    // practice: "rgba(244, 63, 93, 0.2)", // tailwind rose 500
    // contest: "rgba(14, 164, 233, 0.2)", // tailwind sky 500
    // unofficial: "rgba(245, 158, 11, 0.2)", // tailwind amber 500
    // virtual: "rgba(16, 185, 129, 0.2)", // tailwind emerald 500
    const borderColors = {
      practice: "#F43F5E", // tailwind rose 500
      contest: "#0EA5E9", // tailwind sky 500
      unofficial: "#F59E0B", // tailwind amber 500
      virtual: "#10B981", // tailwind emerald 500
    };

    for (const i = data.length - 1; i >= 0; i--) {
      if (data[i].verdict !== "OK") continue;

      const participantType = data[i].author.participantType;
      const ratingCheck = data[i].problem.rating;
      const problem = data[i].problem;

      if (ratingCheck == undefined) continue;

      const rating = ratingCheck / 100 - 8;

      if (solvedDataTemp[rating] == undefined) {
        solvedDataTemp[rating] = {
          rating: (rating + 8) * 100,
          practice: 0,
          contest: 0,
          unofficial: 0,
          virtual: 0,
        };
      }
      if (solved[problem.contestId] == undefined) {
        solved[problem.contestId] = {};
      }
      if (solved[problem.contestId][problem.index] == undefined)
        solved[problem.contestId][problem.index] = 0;
      if (solved[problem.contestId][problem.index] >= 1) continue;
      solved[problem.contestId][problem.index]++;

      if (participantType === "PRACTICE") {
        solvedDataTemp[rating].practice++;
      } else if (participantType === "CONTESTANT") {
        solvedDataTemp[rating].contest++;
      } else if (participantType === "VIRTUAL") {
        solvedDataTemp[rating].virtual++;
      } else if (participantType === "OUT_OF_COMPETITION") {
        solvedDataTemp[rating].unofficial++;
      } else {
        console.log("Error didn't find participationType");
      }
    }

    let allData = [];

    for (const ratingPoint of solvedDataTemp) {
      if (ratingPoint === undefined) continue;
      allData.push(ratingPoint);
    }

    if (!dimensions) return;
    const Margin = { top: 0, right: 0, bottom: 100, left: 90 };
    const Width = dimensions.width;
    const Height = dimensions.height;
    const innerWidth = Width - Margin.left - Margin.right;
    const innerHeight = Height - Margin.bottom - Margin.top;

    // chart/graph

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

    // stacks -- broken sometimes idk why

    // console.log(allData);
    const stackGen = stack().keys(keys);
    const layers = stackGen(allData);
    const extent = [0, max(layers, (layer) => max(layer, (seq) => seq[1]))];

    // scales
    const xScale = scaleBand()
      .domain(allData.map((d) => d.rating))
      .range([Margin.left + 10, innerWidth - 10]);

    const yScale = scaleLinear()
      .domain(extent)
      .range([innerHeight - 10, 0]);

    // axis
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
      .text("Problem rating");

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

    // tooltip

    svg.selectAll(".tooltip").remove();

    const tooltip = svg
      .append("g")
      .attr("class", "tooltip")
      .style("display", "none");

    // bar
    svgContent
      .selectAll(".layer")
      .data(layers)
      .join("g")
      .attr("class", "layer")
      .attr("fill", (layer) => fillColors[layer.key])
      .attr("stroke", (layer) => borderColors[layer.key])
      .attr("stroke-width", 1)
      .selectAll("rect")
      .data((layer) => layer)
      .join("rect")
      .attr(
        "x",
        (seq) => xScale(seq.data.rating) + (xScale.bandwidth() * 1) / 10
      )
      .attr("width", (xScale.bandwidth() * 4) / 5)
      .attr("y", (seq) => yScale(seq[1]))
      .attr("height", (seq) => yScale(seq[0]) - yScale(seq[1]))
      .on("mouseenter mousemove", (event, index) => {
        const problems = index[1] - index[0];
        tooltip
          .style("display", null)
          .attr(
            "transform",
            "translate(" + event.layerX + ", " + event.layerY + ")"
          ); // - 43 to get exact points

        // get width of contest name
        function getTextWidth(text, font) {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          context.font = font || getComputedStyle(document.body).font;

          return context.measureText(text).width;
        }

        const textWidth = getTextWidth(problems);

        tooltip.selectAll(".tooltipRect").remove();

        tooltip
          .append("rect")
          .attr("class", "tooltipRect")
          .attr("width", textWidth + 20)
          .attr("height", 40)
          .attr("x", -(textWidth + 40) - 10)
          .attr("y", -33)
          .style("stroke", select(event.target.parentNode).attr("stroke"))
          .style("fill", "#171717")
          .style("fill-opacity", ".75");

        // adding solve count

        tooltip.selectAll(".solveCount").remove();

        tooltip
          .append("text")
          .attr("class", "solveCount")
          .attr("x", -(textWidth + 40))
          .attr("y", -7)
          // .style("fill", "rgba(163, 163, 163, 0.8)") // tailwind neutral 500
          .style("fill", select(event.target.parentNode).attr("stroke")) // tailwind neutral 500
          .style("font-weight", "500")
          .text(() => problems);
      })
      .on("mouseleave", (event, index) => {
        tooltip.style("display", "none");
      });

    // legend

    svg.selectAll(".legendMain").remove();

    svg
      .selectAll(".legendMain")
      .data(keys)
      .enter()
      .append("rect")
      .attr("class", "legendMain")
      .attr("x", innerWidth - 130)
      .attr("y", (d, i) => i * 25)
      .attr("width", 30)
      .attr("height", 10)
      .attr("fill", (layer) => fillColors[layer])
      .attr("stroke", (layer) => borderColors[layer])
      .attr("stroke-width", 1);

    svg.selectAll(".legendLabel").remove();

    svg
      .selectAll(".legendLabel")
      .data(keys)
      .enter()
      .append("text")
      .attr("class", "legendLabel")
      .attr("x", innerWidth - 130 + 40)
      .attr("y", (d, i) => 10 + i * 25)
      .attr("fill", (layer) => borderColors[layer])
      .text((d) => d)
      .attr("font-size", 13);
  }, [data, dimensions]);

  return (
    <>
      <div ref={wrapperRef} className="h-full">
        <svg ref={svgRef} className="h-full pt-0 translate-x-4"></svg>
      </div>
    </>
  );
}

export default UserProblemRatingChart;
