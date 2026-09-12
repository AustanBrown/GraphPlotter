import { forwardRef } from "react";

// The tooltip is driven imperatively by Grid through this ref (position + text) so that
// moving the mouse over a curve does not trigger a React re-render on every pixel.
// It deliberately renders no children, so Grid can own its textContent safely.
const Tooltip = forwardRef(function Tooltip(props, ref)
{
    return (
        <div ref={ref} id="graphTooltip" className="absolute invisible z-10 w-32 p-2 -mt-1 text-sm leading-tight text-white bg-slate-700 rounded-lg shadow-lg"></div>
    );
});

export default Tooltip;
