import { memo, useEffect, useRef } from "react";
import * as d3 from "d3";
import * as math from "mathjs";
import { AdjustmentsHorizontalIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { toBlob } from 'html-to-image';

import Tooltip from "./Tooltip";

const TICK_COUNT = 21;
const SAMPLE_STEP = 0.03125;

const convertRadiansToDegrees = rad => rad * (180 / Math.PI);

const createScale = (domain, range) =>
{
    return d3.scaleLinear().domain(domain).range(range);
}

// Pure: samples an equation over the domain. A malformed equation string makes mathjs
// throw, so everything is guarded and a bad equation simply yields no points instead of
// blanking the whole graph.
const calculatePoints = (eqn, domain, axesModeId) =>
{
    const points = [];
    try
    {
        const f = math.evaluate(`f(x) = ${eqn}`);
        for(let x = domain[0]; x <= domain[1]; x = x + SAMPLE_STEP)
        {
            const y = f(x);
            if(!isNaN(y))
            {
                switch(axesModeId)
                {
                    case 'DEG':
                        points.push([convertRadiansToDegrees(x), y]);
                        break;

                    case 'RAD':
                    case 'RECT':
                    default:
                        points.push([x, y]);
                        break;
                }
            }
        }
    }
    catch
    {
        // Invalid equation: keep whatever was sampled before the failure (usually nothing)
        // so the remaining equations still plot.
    }
    return points;
}

function Grid({equations, domain, range, axesToggleHandler, axesMode})
{
    const svgRef = useRef(null);
    const tooltipRef = useRef(null);
    // The zoom behaviour is created once and kept in a ref; the transform is kept in a ref
    // as well so panning/zooming survives a redraw (new equation, new domain, ...).
    const zoomRef = useRef(null);
    const transformRef = useRef(d3.zoomIdentity);

    useEffect(() =>
    {
        const svgEl = svgRef.current;
        if(svgEl === null)
        {
            return undefined;
        }

        const canvas = d3.select(svgEl);
        // Start from a clean slate: under StrictMode this effect runs, is cleaned up and
        // runs again, so the draw must never append on top of a previous pass.
        canvas.selectAll("*").remove();

        const bounds = svgEl.getBoundingClientRect();
        const width = bounds.width;
        const height = bounds.height;

        const baseXScale = createScale(domain, [0, width]);
        const baseYScale = createScale(range, [height, 0]);

        // Stable containers, so zooming only updates attributes instead of re-creating nodes.
        const xAxisSelection = canvas.append("g").attr("id", "x-axis");
        const yAxisSelection = canvas.append("g").attr("id", "y-axis");
        const gridGroup = canvas.append("g").attr("id", "grid-lines");
        const graphGroup = canvas.append("g").attr("id", "graphs");

        // Scales currently on screen. Reassigned by draw() and read by the pointer handlers,
        // which are attached once and therefore must not close over a fixed scale.
        let xScale = baseXScale;
        let yScale = baseYScale;

        const showTooltip = event =>
        {
            const tooltipEl = tooltipRef.current;
            if(tooltipEl === null)
            {
                return;
            }
            const [pointerX, pointerY] = d3.pointer(event, svgEl);
            tooltipEl.textContent = `x = ${xScale.invert(pointerX)} y = ${yScale.invert(pointerY)}`;
            tooltipEl.style.visibility = "visible";
        }

        const moveTooltip = event =>
        {
            const tooltipEl = tooltipRef.current;
            if(tooltipEl === null)
            {
                return;
            }
            tooltipEl.style.top = `${event.pageY}px`;
            tooltipEl.style.left = `${event.pageX}px`;
        }

        const hideTooltip = () =>
        {
            const tooltipEl = tooltipRef.current;
            if(tooltipEl !== null)
            {
                tooltipEl.style.visibility = "hidden";
            }
        }

        const drawGridLines = () =>
        {
            gridGroup.selectAll("line.horizontalGrid")
            .data(yScale.ticks(TICK_COUNT))
            .join("line")
            .attr("class", "horizontalGrid")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", d => yScale(d))
            .attr("y2", d => yScale(d))
            .attr("stroke", "grey")
            .attr("stroke-dasharray", "4")
            .attr("stroke-width", "1");

            gridGroup.selectAll("line.verticalGrid")
            .data(xScale.ticks(TICK_COUNT))
            .join("line")
            .attr("class", "verticalGrid")
            .attr("x1", d => xScale(d))
            .attr("x2", d => xScale(d))
            .attr("y1", 0)
            .attr("y2", height)
            .attr("stroke", "grey")
            .attr("stroke-dasharray", "4")
            .attr("stroke-width", "1");
        }

        // Redraws everything for a given zoom transform. Sampled points never change here,
        // only the scales, so the paths keep their data and just get a new "d".
        const draw = transform =>
        {
            xScale = transform.rescaleX(baseXScale);
            yScale = transform.rescaleY(baseYScale);

            xAxisSelection.call(d3.axisBottom(xScale).ticks(TICK_COUNT)).attr("transform", `translate(0, ${yScale(0)})`);
            yAxisSelection.call(d3.axisRight(yScale).ticks(TICK_COUNT)).attr("transform", `translate(${xScale(0)}, 0)`);

            drawGridLines();

            const line = d3.line()
            .x(d => xScale(d[0]))
            .y(d => yScale(d[1]))
            .defined(d => !isNaN(yScale(d[1])))
            .curve(d3.curveCardinal);

            graphGroup.selectAll("path.graph").attr("d", line);
        }

        // Each path carries its sampled points as its datum; draw() only re-runs the line
        // generator over them, so zooming never re-evaluates the equations.
        equations.forEach(eqn =>
        {
            graphGroup.append("path")
            .datum(calculatePoints(eqn.equation, domain, axesMode['id']))
            .attr("id", eqn.id)
            .attr("class", "graph")
            .attr("fill", "none")
            .attr("stroke", eqn.colour)
            .attr("stroke-width", 2.5)
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseout", hideTooltip);
        });

        if(zoomRef.current === null)
        {
            zoomRef.current = d3.zoom().scaleExtent([1, 8]);
        }
        const zoomBehaviour = zoomRef.current;
        zoomBehaviour.on("zoom", event =>
        {
            transformRef.current = event.transform;
            draw(event.transform);
        });

        canvas.call(zoomBehaviour);
        // Re-applying the stored transform both restores the previous zoom/pan after a
        // redraw and emits a zoom event, which performs the initial draw.
        canvas.call(zoomBehaviour.transform, transformRef.current);

        return () =>
        {
            zoomBehaviour.on("zoom", null);
            canvas.on(".zoom", null);
            canvas.selectAll("*").remove();
            hideTooltip();
        };
    }, [equations, domain, range, axesMode]);

    const saveGraphToImg = () =>
    {
        const svgEl = svgRef.current;
        if(svgEl === null)
        {
            return;
        }
        // html-to-image resolves to null rather than rejecting when it cannot
        // rasterise the node, so both paths have to be handled.
        toBlob(svgEl).then(blobData =>
        {
            if(blobData === null)
            {
                return;
            }
            const url = URL.createObjectURL(blobData);
            const link = document.createElement("a");
            link.href = url;
            link.download = "graph.png";
            link.click();
            URL.revokeObjectURL(url);
        });
    }

    return (
        <div className="col-span-9 bg-white">
            <div className="bg-[#B39CD0] flex flex-col mr-2 px-3 py-3 mt-2 z-40 right-0 fixed rounded-sm opacity-80 text-white font-bold">
                <button type="button" aria-label="Axes properties" onClick={axesToggleHandler}>
                    <AdjustmentsHorizontalIcon className="w-6 h-6 cursor-pointer" aria-hidden="true"/>
                </button>
                <button type="button" aria-label="Download graph as PNG" onClick={saveGraphToImg}>
                    <ArrowDownTrayIcon className="w-6 h-6 cursor-pointer" aria-hidden="true"/>
                </button>

            </div>
            <svg ref={svgRef} className="h-full w-full" id="canvas">

            </svg>
            <Tooltip ref={tooltipRef} />
        </div>
    );
}

export default memo(Grid);
