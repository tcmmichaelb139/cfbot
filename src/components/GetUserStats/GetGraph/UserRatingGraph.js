import { useState, useEffect, useRef } from "react";

import {
    select,
    line,
    axisBottom,
    axisLeft,
    scaleLinear,
    scaleTime,
    brushX,
    timeParse,
    extent,
    bisectCenter,
    pointer,
    timeFormat,
    easeExpInOut,
} from "d3";
import useResizeObserver from "../../Hooks/ResizeObserver";

function UserRatingGraph(props) {
    const [data, setData] = useState(props.data);
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
    const [currentZoomState, setCurrentZoomState] = useState();
    const svgRef = useRef();
    const [animationTime, setAnimationTime] = useState(500);

    useEffect(() => {
        setData(props.data);
    }, [props]);

    useEffect(() => {
        if (data === []) return;
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
            };
        });

        if (!dimensions) return;
        const Margin = { top: 0, right: 0, bottom: 100, left: 80 };
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

        svg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", innerWidth - Margin.left)
            .attr("height", innerHeight)
            .attr("x", Margin.left)
            .attr("y", Margin.top);

        svg.selectAll(".contentGraph").remove();

        const svgContent = svg
            .append("g")
            .attr("class", "contentGraph")
            .attr("clip-path", "url(#clip)");

        // axis
        const yNumberOfTicks = parseInt((Math.max(...rating) + 999) / 500);

        const [xFirstDate, xSecondDate] = extent(date);

        xFirstDate.setDate(xFirstDate.getDate() - 30);
        xSecondDate.setDate(xSecondDate.getDate() + 30);

        const xScale = scaleTime()
            .domain([xFirstDate, xSecondDate])
            .range([Margin.left, innerWidth]);

        if (currentZoomState) {
            const newXScale = currentZoomState.rescaleX(xScale);
            xScale.domain(newXScale.domain());
        }

        const yScale = scaleLinear()
            .domain([0, parseInt((Math.max(...rating) + 999) / 500) * 500])
            .range([innerHeight, 0]);

        // axis lines

        const xAxis = axisBottom(xScale);

        svg.selectAll(".xAxis").remove();

        svg.append("g")
            .attr("class", "xAxis")
            .style("transform", "translate(0, " + innerHeight + "px)")
            .style("color", "#262626") // between tailwind neutral 800 and 900
            .call(xAxis);

        svg.selectAll(".xAxis text").attr("fill", "#525252"); // tailwind 600

        const yAxis = axisLeft(yScale).ticks(yNumberOfTicks);

        svg.selectAll(".yAxis").remove();

        svg.append("g")
            .attr("class", "yAxis")
            .style("font-weight", 300)
            .style("transform", "translate(" + Margin.left + "px, 0)")
            .style("color", "#262626") // between tailwind neutral 800 and 900
            .call(yAxis);

        svg.selectAll(".yAxis text").attr("fill", "#525252"); // tailwind 600

        // axis labels

        svg.selectAll(".xLabel").remove();

        svg.append("text")
            .attr("class", "xLabel")
            .attr("text-anchor", "end")
            .attr("x", innerWidth)
            .attr("y", Height - (Margin.bottom / 5) * 3)
            .attr("fill", "rgba(163, 163, 163, 0.8)") // tailwind neutral 500
            .attr("font-size", 13)
            .style("font-weight", 500)
            .text("Date");

        svg.selectAll(".yLabel").remove();

        svg.append("text")
            .attr("class", "yLabel")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", Margin.left / 3)
            .attr("x", 0)
            .attr("fill", "rgba(163, 163, 163, 0.8)") // tailwind neutral 500
            .attr("font-size", 13)
            .style("font-weight", 500)
            .text("Rating");

        // create line
        const myLine = line()
            .x((value) => xScale(value.date))
            .y((value) => yScale(value.rating));

        svgContent
            .selectAll(".line")
            .data([allData])
            .join("path")
            .attr("class", "line")
            .attr("d", myLine)
            .style("fill", "none")
            .style("stroke", "#10b981");

        svgContent.selectAll(".dotContainer").remove();

        svgContent
            .append("g")
            .attr("class", "dotContainer")
            .selectAll(".dots")
            .data(allData)
            .join("circle")
            .attr("class", "dots")
            .attr("stroke", "#10b981")
            .attr("fill", "#171717") // tailwind neutral 900
            .attr("r", 2)
            .attr("cx", (value) => xScale(value.date))
            .attr("cy", (value) => yScale(value.rating));

        // tooltip

        svg.selectAll(".tooltip").remove();

        const tooltip = svg
            .append("g")
            .attr("class", "tooltip")
            .style("display", "none");

        svg.on("pointerenter pointermove", (event) => {
            if (event.target.tagName == "rect") {
                // inside chart
                const index = bisectCenter(
                    date,
                    xScale.invert(pointer(event)[0])
                );
                tooltip
                    .style("display", null)
                    .attr(
                        "transform",
                        "translate(" +
                            xScale(allData[index].date) +
                            ", " +
                            yScale(allData[index].rating) +
                            ")"
                    );

                // get width of contest name
                function getTextWidth(text, font) {
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");

                    context.font = font || getComputedStyle(document.body).font;

                    return context.measureText(text).width;
                }

                const textWidth = Math.max(
                    getTextWidth(
                        allData[index].contestName,
                        "300 12px Fira Code, monospace"
                    ),
                    getTextWidth(
                        "Contest ID: " + allData[index].contestId,
                        "300 12px Fira Code, monospace"
                    )
                );

                // expand dot

                tooltip.selectAll(".tooltipDot").remove();

                tooltip
                    .append("circle")
                    .attr("class", "tooltipDot")
                    .attr("stroke", "#10b981")
                    .attr("fill", "#171717") // tailwind neutral 900
                    .attr("r", 4);

                // creating tooltip box

                tooltip.selectAll(".tooltipRect").remove();

                tooltip
                    .append("rect")
                    .attr("class", "tooltipRect")
                    .attr("width", textWidth + 20)
                    .attr("height", 80)
                    .attr("x", -(textWidth + 20) / 2)
                    .attr("y", 5)
                    .attr("stroke", "#525252")
                    .attr("fill", "#171717");

                // add rating

                tooltip.selectAll(".rating").remove();

                tooltip
                    .append("text")
                    .attr("class", "rating")
                    .attr("x", -textWidth / 2)
                    .attr("y", 25)
                    .style("fill", "rgba(163, 163, 163, 0.8)") // tailwind neutral 500
                    .text("Rating: " + allData[index].rating);
                // adding contest name

                tooltip.selectAll(".contestName").remove();

                tooltip
                    .append("text")
                    .attr("class", "contestName")
                    .attr("x", -textWidth / 2)
                    .attr("y", 40)
                    .style("fill", "rgba(163, 163, 163, 0.8)") // tailwind neutral 500
                    .text(() => {
                        let newContestName = allData[index].contestName;
                        if (newContestName.length > 15) {
                        }

                        return newContestName;
                    });

                // contest ID

                tooltip.selectAll(".contestId").remove();

                tooltip
                    .append("text")
                    .attr("class", "contestId")
                    .attr("x", -textWidth / 2)
                    .attr("y", 55)
                    .style("fill", "rgba(163, 163, 163, 0.8)") // tailwind neutral 500
                    .text("Contest ID: " + allData[index].contestId);

                // add date

                tooltip.selectAll(".date").remove();

                tooltip
                    .append("text")
                    .attr("class", "date")
                    .style("fill", "rgba(163, 163, 163, 0.8)") // tailwind neutral 500
                    .attr("x", -textWidth / 2)
                    .attr("y", 70)
                    .text(() => {
                        const formatDate = timeFormat("%b %d, %Y");

                        return formatDate(allData[index].date);
                    });

                tooltip.selectAll("text").attr("font-size", 12);
            } else {
                tooltip.style("display", "none");
                tooltip.selectAll("*").remove();
            }
        });

        // brush zoom

        let idleTimeout = null;

        function Idle() {
            idleTimeout = null;
        }

        const brush = brushX()
            .extent([
                [Margin.left, 0],
                [innerWidth, innerHeight],
            ])
            .on("end", (event) => {
                const extent = event.selection;

                if (!extent) {
                    if (!idleTimeout)
                        return (idleTimeout = setTimeout(Idle, 350));
                    xScale.domain([4, 8]);
                } else {
                    xScale.domain([
                        xScale.invert(extent[0]),
                        xScale.invert(extent[1]),
                    ]);
                    svg.select(".brush").call(brush.clear);
                }

                svg.select(".xAxis")
                    .transition()
                    .duration(animationTime)
                    .call(axisBottom(xScale));

                svg.selectAll(".xAxis text").attr("fill", "#525252"); // tailwind 600

                svg.select(".line")
                    .transition()
                    .duration(animationTime)
                    .attr("d", myLine);

                svg.selectAll(".dots")
                    .transition()
                    .duration(animationTime)
                    .attr("cx", (value) => xScale(value.date))
                    .attr("cy", (value) => yScale(value.rating));

                tooltip.selectAll("*").remove();
            });

        svg.selectAll(".brush").remove();

        svg.append("g").attr("class", "brush").call(brush);

        svg.selectAll("rect.selection")
            .attr("fill", "#262626")
            .attr("stroke", "#525252");

        svg.on("dblclick", () => {
            xScale.domain(extent(date));
            svg.select(".xAxis")
                .transition()
                .duration(animationTime)
                .call(axisBottom(xScale));

            svg.selectAll(".xAxis text").attr("fill", "#525252"); // tailwind 600

            svg.select(".line")
                .transition()
                .duration(animationTime)
                .attr(
                    "d",
                    line()
                        .x((value) => xScale(value.date))
                        .y((value) => yScale(value.rating))
                );

            svg.selectAll(".dots")
                .transition()
                .duration(animationTime)
                .attr("cx", (value) => xScale(value.date))
                .attr("cy", (value) => yScale(value.rating));
        });

        // change global stuff

        // fonts
        svg.selectAll("text")
            .style("font-family", "'Fira Code', monospace")
            .attr("font-weight", "300");
    }, [props, data, currentZoomState, animationTime, dimensions]);

    return (
        <>
            <div ref={wrapperRef} className="h-full">
                <svg ref={svgRef} className="h-full pt-0"></svg>
            </div>
        </>
    );
}

export default UserRatingGraph;
