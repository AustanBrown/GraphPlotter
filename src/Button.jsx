export default function Button({children, type, disabled, clickHandler})
{
    return <button type = {type === null ? "button" : type} className="block bg-[#845EC2] text-white rounded-[6px] px-3 py-1.5 mt-2 disabled:bg-gray-400 disabled:text-slate-700" disabled={disabled === null ? false : disabled} onClick={clickHandler}>{children}</button>;
}