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
    zoom,
    zoomTransform,
    bisectCenter,
    pointer,
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
        const rating = data.map((contest) => contest.newRating);
        const date = data.map((contest) => {
            return timeParse("%Q")(contest.ratingUpdateTimeSeconds * 1000);
        });

        const allData = data.map((contest) => {
            return {
                rating: contest.newRating,
                date: timeParse("%Q")(contest.ratingUpdateTimeSeconds * 1000),
                contestName: contest.contestName,
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

        const xScale = scaleTime()
            .domain(extent(date))
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
            .attr("x", innerWidth / 2)
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
            .attr("x", (-innerHeight / 5) * 2)
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
            .attr("r", 2)
            .attr("cx", (value) => xScale(value.date))
            .attr("cy", (value) => yScale(value.rating));

        // tooltip

        svg.selectAll(".tooltip").remove();

        const tooltip = svg
            .append("g")
            .attr("class", "tooltip")
            .style("pointer-events", "none");

        svgContent
            .on("pointerenter pointermove", (value) => {
                console.log(value);
            })
            .on("pointerleave", (value) => {
                console.log(value);
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
            });

        svg.selectAll(".brush").remove();

        svg.append("g").attr("class", "brush").call(brush);

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

        // ctrl+drag panning

        // const zoomBehavior = zoom()
        //     .scaleExtent([1, 1])
        //     .translateExtent([
        //         [0, 0],
        //         [innerWidth, innerHeight],
        //     ])
        //     .on("zoom", (event) => {
        //         if (event.ctrlKey) {
        //             console.log("lmao");
        //         }
        //     });

        // svgContent.call(zoomBehavior);

        // svgContent.on("drag", (event) => {
        //     if (!event.altKey) return;
        // });

        // change global stuff

        // fonts
        svg.selectAll("text")
            .style("font-family", "'Fira Code', monospace")
            .attr("font-weight", "300");
    }, [data, currentZoomState, animationTime, dimensions]);

    return (
        <>
            <div ref={wrapperRef} className="h-full">
                <svg ref={svgRef} className="h-full"></svg>
            </div>
        </>
    );
}

export default UserRatingGraph;
