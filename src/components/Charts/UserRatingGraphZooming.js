// This is just a template example for others, not actually used
import { useState, useEffect, useRef } from "react";

import {
    select,
    line,
    axisBottom,
    axisLeft,
    scaleLinear,
    zoom,
    zoomTransform,
} from "d3";
import useResizeObserver from "../Hooks/ResizeObserver";

function UserRatingGraph(props) {
    const [data, setData] = useState(props.data);
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
    const [currentZoomState, setCurrentZoomState] = useState();
    const svgRef = useRef();

    console.log(dimensions);

    useEffect(() => {
        const rating = data.map((contest) => contest.newRating);
        const date = data.map((contest) => {
            const unixDate = new Date(contest.ratingUpdateTimeSeconds * 1000);
            return unixDate.toLocaleDateString("en-US");
        });
        const contestName = data.map((contest) => contest.contestName);

        if (!dimensions) return;
        const Margin = { top: 0, right: 0, bottom: 120, left: 50 };
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
            .attr("width", innerWidth)
            .attr("height", innerHeight)
            .attr("x", Margin.left)
            .attr("y", Margin.top);

        svg.selectAll(".contentGraph").remove();

        const svgContent = svg
            .append("g")
            .attr("class", "contentGraph")
            .attr("clip-path", "url(#clip)");

        // axis
        const xNumberOfTicks = Math.min(data.length - 1, 25);
        const yNumberOfTicks = parseInt((Math.max(...rating) + 999) / 500);

        const xScale = scaleLinear()
            .domain([0, data.length - 1])
            .range([Margin.left, innerWidth]);

        if (currentZoomState) {
            const newXScale = currentZoomState.rescaleX(xScale);
            xScale.domain(newXScale.domain());
        }

        const yScale = scaleLinear()
            .domain([0, parseInt((Math.max(...rating) + 999) / 500) * 500])
            .range([innerHeight, 0]);

        // grid lines

        // axis lines

        const xAxis = axisBottom(xScale)
            .ticks(xNumberOfTicks)
            .tickFormat((index) => {
                return date[index];
            });

        svg.selectAll(".xAxis").remove();

        svg.append(".xAxis")
            .style("transform", "translate(0, " + innerHeight + "px)")
            .style("color", "#202020") // between tailwind neutral 800 and 900
            .style("stroke", "#525252")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .style("transform", "rotate(-65deg)");

        const yAxis = axisLeft(yScale).ticks(yNumberOfTicks);

        svg.selectAll(".yAxis").remove();

        svg.append(".yAxis")
            .style("transform", "translate(" + Margin.left + "px, 0)")
            .style("color", "#525252")
            .style("color", "#202020") // between tailwind neutral 800 and 900
            .style("stroke", "#525252")
            .call(yAxis);

        // create line
        const myLine = line()
            .x((value, index) => xScale(index))
            .y((value) => yScale(value));

        svgContent
            .selectAll(".line")
            .data([rating])
            .join("path")
            .attr("class", "line")
            .attr("d", (value) => myLine(value))
            .style("fill", "none")
            .style("stroke", "#10b981");

        svgContent
            .selectAll(".dots")
            .data(rating)
            .join("circle")
            .attr("class", "dots")
            .attr("stroke", "#10b981")
            .attr("r", 2)
            .attr("cx", (value, index) => xScale(index))
            .attr("cy", yScale);

        // zoom
        const zoomBehavior = zoom()
            .scaleExtent([1, 10])
            .translateExtent([
                [0, 0],
                [Width, Height],
            ])
            .on("zoom", () => {
                const zoomState = zoomTransform(svg.node());
                setCurrentZoomState(zoomState);
                console.log(zoomState);
            });

        svg.call(zoomBehavior);

        console.log(svg);
    }, [data, currentZoomState, dimensions]);

    return (
        <>
            <div ref={wrapperRef} className="h-full">
                <svg ref={svgRef} className="h-full"></svg>
            </div>
        </>
    );
}

export default UserRatingGraph;
