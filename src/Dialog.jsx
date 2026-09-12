import { useEffect } from "react";

export default function Dialog({children, dismissHandler, label})
{
    useEffect(() =>
    {
        const keyDownHandler = e =>
        {
            if(e.key === "Escape")
            {
                dismissHandler?.();
            }
        };

        document.addEventListener("keydown", keyDownHandler);
        return () => document.removeEventListener("keydown", keyDownHandler);
    }, [dismissHandler]);

    return (
        <div className="fixed z-50 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={() => dismissHandler?.()}>
            <div role="dialog" aria-modal="true" aria-label={label} className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-[6px] bg-[#D9D9D9] text-[#845EC2]" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}
