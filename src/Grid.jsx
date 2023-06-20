import { useEffect } from "react";
import * as d3 from "d3";
import * as math from "mathjs";
import { AdjustmentsHorizontalIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import domtoimage from 'dom-to-image';

import Tooltip from "./Tooltip";

export default function Grid({equations, domain, range, axesToggleHandler, axesMode})
{
    console.log(`axesMode is ${axesMode['id']}`);
    const canvas = d3.select("#canvas");
    let xScale = null;
    let yScale = null;
    let xAxis = null;
    let yAxis = null;
    let xAxisSelection = null;
    let yAxisSelection = null;
    let newXScale = null;
    let newYScale = null;
    let width = 0;
    let sidebarWidth = 0;
    let height = 0;
    let line = null;

    const createScale = (domain, range) =>
    {
        return d3.scaleLinear().domain(domain).range(range);
    }

    const convertRadiansToDegrees = rad => rad * (180 / Math.PI);

    const convertRadiansToGradians = rad => rad  / 400 * 2 * Math.PI;

    const calculatePoints = eqn =>
    {
        let points = [];
        const simplifiedEqn = math.simplify(eqn).toString();
        const f = math.evaluate(`f(x) = ${eqn}`);
        for(let x = domain[0]; x <= domain[1]; x = x + 0.03125)
        {
            let y = f(x);
            if(!isNaN(y))
            {
                //points.push([x, y]);
                switch(axesMode['id'])
                {
                    case 'RECT':
                        points.push([x, y]);
                        break;

                    case 'DEG':
                        points.push([convertRadiansToDegrees(x), y]);
                        break;
                    
                    case 'RAD':
                        points.push([x, y]);
                        break;
                }
            }
        }
        return points;
    }

    const drawGraph = (eqn, selector, xScale, yScale) =>
    {
        const sidebar = d3.select("#sidebar");
        const sidebarWidth = sidebar.style("width");
        const sidebarHeight = sidebar.style("height");
        const width = +sidebarWidth.slice(0, sidebarWidth.length - 2);
        const height = parseInt(sidebarHeight.slice(0, sidebarHeight.length - 2));
        line = d3.line()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]))
        .defined(d => !isNaN(yScale(d[1])))
        .curve(d3.curveCardinal);

        const newGraph = selector.append("path")
        .datum(calculatePoints(eqn.equation))
        .attr("id", eqn.id)
        .attr("class", "graph")
        .attr("fill", "none")
        .attr("stroke", eqn.colour)
        .attr("stroke-width", 2.5)
        .attr("d", line);

        newGraph.on("mouseover", (d, i) =>
        {
            const tooltip = d3.select("#graphTooltip");
            tooltip.style("visibility", "visible");
            tooltip.html(`<p>x = ${xScale.invert(d.pageX - width)} y = ${yScale.invert(d.pageY)}</p>`);
        })
        .on("mousemove", (d, i) =>
        {
            d3.select("#graphTooltip").style("top", (d.pageY)+"px").style("left", (d.pageX)+"px");
        })
        .on("mouseout", (d, i) =>
        {
            d3.select("#graphTooltip").style("visibility", "hidden");
        });
    }

    const removeGridLines = () =>
    {
        d3.selectAll("line.horizontalGrid").remove();
        d3.selectAll("line.verticalGrid").remove();
    }

    const saveGraphToImg = () =>
    {
        var canvas = document.getElementById("canvas");
        domtoimage.toBlob(canvas).then(blobData =>
        {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blobData);
            link.download = "graph.png";
            link.click();
            URL.revokeObjectURL(link.href);
        });
    }

    const zoomFunc = d3.zoom()
    .scaleExtent([1, 8])
    .on('zoom', event =>
    {
        //removeGridLines();
        newXScale = event.transform.rescaleX(xScale);
        newYScale = event.transform.rescaleY(yScale);
        let xAxisPos = newYScale(0);
        let yAxisPos = newXScale(0)
        xAxisSelection.call(d3.axisBottom(newXScale)).attr("transform", `translate(0, ${newYScale(0)})`);
        yAxisSelection.call(d3.axisLeft(newYScale)).attr("transform", `translate(${newXScale(0)}, 0)`);
        line = d3.line()
        .x(d => newXScale(d[0]))
        .y(d => newYScale(d[1]))
        .defined(d => !isNaN(yScale(d[1])))
        .curve(d3.curveCardinal);
        drawGridLines();
        let existingGraphs = d3.selectAll("path.graph").attr("d", line);
        existingGraphs.on("mouseover", (d, i) =>
        {
            const tooltip = d3.select("#graphTooltip");
            tooltip.style("visibility", "visible");
            tooltip.html(`<p>x = ${newXScale.invert(((d.pageX - sidebarWidth)))} y = ${newYScale.invert(d.pageY)}</p>`);
        })
        .on("mousemove", (d, i) =>
        {
            d3.select("#graphTooltip").style("top", (d.pageY)+"px").style("left", (d.pageX)+"px");
        })
        .on("mouseout", (d, i) =>
        {
            d3.select("#graphTooltip").style("visibility", "hidden");
        });

    });

    const drawGridLines = (xTicks, yTicks) =>
    {
        d3.selectAll(".horizontalGrid").remove();
        d3.selectAll(".verticalGrid").remove();
        if(xTicks === undefined && yTicks === undefined)
        {
            let tempYTicks = d3.select("#y-axis").selectAll(".tick").data();
            canvas.selectAll("line.horizontalGrid").data(tempYTicks).enter()
            .append("line")
            .attr("class", "horizontalGrid")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", d => newYScale(d))
            .attr("y2", d => newYScale(d))
            .attr("stroke", "grey")
            .attr("stroke-dasharray", "4")
            .attr("stroke-width", "1");

            let tempXTicks = d3.select("#x-axis").selectAll(".tick").data();
            canvas.selectAll("line.verticalGrid").data(tempXTicks).enter()
            .append("line")
            .attr("class", "verticalGrid")
            .attr("x1", d => newXScale(d))
            .attr("x2", d => newXScale(d))
            .attr("y1", 0)
            .attr("y2", height)
            .attr("stroke", "grey")
            .attr("stroke-dasharray", "4")
            .attr("stroke-width", "1");
        }
        else
        {
            canvas.selectAll("line.horizontalGrid").data(yTicks).enter()
            .append("line")
            .attr("class", "horizontalGrid")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", d => yScale(d))
            .attr("y2", d => yScale(d))
            .attr("stroke", "grey")
            .attr("stroke-dasharray", "4")
            .attr("stroke-width", "1");

            canvas.selectAll("line.verticalGrid").data(xTicks).enter()
            .append("line")
            .attr("class", "verticalGrid")
            .attr("x1", d => xScale(d))
            .attr("x2", d => xScale(d))
            .attr("y1", 0)
            .attr("y2", height)
            .attr("stroke", "grey")
            .attr("stroke-dasharray", "4")
            .attr("stroke-width", "1");
        }
    }

    const drawAxes = () =>
    {
        const canvas = d3.select("#canvas");
        canvas.selectAll("*").remove();
        const gridWidth = canvas.style("width");
        const gridHeight = canvas.style("height");
        const width = +gridWidth.slice(0, gridWidth.length - 2);
        const height = parseInt(gridHeight.slice(0, gridHeight.length - 2));
        
        xScale = createScale(domain, [0, width]);
        yScale = createScale(range, [height, 0]);

        xAxis = d3.axisBottom(xScale).ticks(21);
        yAxis = d3.axisRight(yScale).ticks(21);

        xAxisSelection = canvas.append("g").attr("id", "x-axis").call(xAxis).attr("transform", `translate(0, ${yScale(0)})`);
        yAxisSelection = canvas.append("g").attr("id", "y-axis").call(yAxis).attr("transform", `translate(${xScale(0)}, 0)`);

        let xTicks = xScale.ticks(21);
        let yTicks = yScale.ticks(21);

        drawGridLines(xTicks, yTicks);

        //.attr("style", "stroke:rgb(0,0,0);stroke-width:1");
        if(equations.length > 0)
        {
            equations.map((eqn, i) =>
            {
                let points = calculatePoints(eqn.equation);
                drawGraph(eqn, canvas, xScale, yScale);
            });
        }
    }

    useEffect(() => 
    {
        removeGridLines();
        const canvas = d3.select("#canvas");

        const gridWidth = canvas.style("width");
        const gridHeight = canvas.style("height");
        width = +gridWidth.slice(0, gridWidth.length - 2);
        let sidebarPixels = d3.select("#sidebar").style("width");
        sidebarWidth = +sidebarPixels.slice(0, sidebarPixels.length - 2);
        height = parseInt(gridHeight.slice(0, gridHeight.length - 2));
        drawAxes();
        canvas.call(zoomFunc);
    });

    //canvas.call(zoomFunc);
    
    return (
        <div className="col-span-9 bg-white">
            <div className="bg-[#B39CD0] flex flex-col mr-2 px-3 py-3 mt-2 z-40 right-0 fixed rounded opacity-80 text-white font-bold">
                <AdjustmentsHorizontalIcon className="w-6 h-6 cursor-pointer" onClick={() => axesToggleHandler()}/>
                <ArrowDownTrayIcon className="w-6 h-6  cursor-pointer" onClick={() => saveGraphToImg() }/>

            </div>
            <svg className="h-full w-full" id="canvas">

            </svg>
            <Tooltip />
        </div>
    );
}