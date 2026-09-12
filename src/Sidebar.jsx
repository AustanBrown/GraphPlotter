import { PlusIcon, TableCellsIcon } from "@heroicons/react/24/solid";
import Equation from "./Equation";

export default function Sidebar({equations, addEquationHandler, removeEquationHandler})
{
    return (
        <div className="col-span-3 h-full bg-white px-4 py-2" id="sidebar">
            <div className="w-full flex flex-row-reverse bg-[#B39CD0] px-1.5 py-1.5">
                <button type="button" aria-label="Add equation" onClick={addEquationHandler}>
                    <PlusIcon className="h-6 w-6 mx-2 text-white font-bold" aria-hidden="true"/>
                </button>
                <button type="button" aria-label="Show table of values">
                    <TableCellsIcon className="h-6 w-6 text-white font-bold" aria-hidden="true"/>
                </button>
            </div>
            {equations.map(eqn => (
                <Equation key={eqn.id} equationText={eqn.equation} equationID={eqn.id} removeEqn={removeEquationHandler}/>
            ))}
        </div>
    );
}
