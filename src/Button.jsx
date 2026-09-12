export default function Button({children, type = "button", disabled = false, clickHandler, className = "", ...rest})
{
    const baseClassName = "block bg-[#845EC2] text-white rounded-[6px] px-3 py-1.5 mt-2 disabled:bg-gray-400 disabled:text-slate-700";

    return <button type={type} className={`${baseClassName} ${className}`.trim()} disabled={disabled} onClick={clickHandler} {...rest}>{children}</button>;
}
