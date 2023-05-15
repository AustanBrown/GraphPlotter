export default function Equation({equationText, equationID, removeEqn})
{
    return (
        <div className="flex flex-row w-full px-2 py-2 my-4 rounded-[5px] text-white font-bold bg-[#845EC2]">
            <button className="rounded-full px-2 font-extrabold bg-[#B39CD0]" onClick={()=> removeEqn(equationID)}>&times;</button>
            <div className="w-full text-center">y = {equationText}</div>
            
        </div>
    );
}