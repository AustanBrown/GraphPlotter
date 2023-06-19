import { PlusIcon } from "@heroicons/react/24/solid";
import { TableCellsIcon } from "@heroicons/react/24/solid";
import Equation from "./Equation";

export default function Sidebar({equations, addEquationHandler, removeEquationHandler})
{
    return (
        <div className="col-span-3 h-full bg-white px-4 py-2" id="sidebar">
            <div className="w-full flex flex-row-reverse bg-[#B39CD0] px-1.5 py-1.5">
                <button onClick={addEquationHandler}><PlusIcon className="h-6 w-6 mx-2 text-white font-bold"/></button>
                <button><TableCellsIcon className="h-6 w-6 text-white font-bold"/></button>
            </div>
            {equations.map(eqn => 
            {
                return <Equation equationText={eqn.equation} equationID={eqn.id} key={eqn.id} removeEqn={removeEquationHandler}/>;
            })}
        </div>
    );
}