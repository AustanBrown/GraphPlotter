import { useMemo, useState } from "react";
import * as math from "mathjs";

import Dialog from "./Dialog";
import Button from "./Button";

export default function GraphProperties({ equationHandler, closeHandler })
{
    const [equation, setEquation] = useState("");
    const [colour, setColour] = useState("#000000");

    const hasError = useMemo(() =>
    {
        if(equation.trim() === "")
        {
            return true;
        }

        try
        {
            math.evaluate(`f(x)=${equation}`);
            return false;
        }
        catch
        {
            return true;
        }
    }, [equation]);

    const submitForm = e =>
    {
        e.preventDefault();
        equationHandler(equation, colour);
        closeHandler();
    }

    return (
        <Dialog dismissHandler={closeHandler} label="Add Graph">
            <h1 className="text-xl">Add Graph</h1>
            <form onSubmit={submitForm} autoComplete="off">
                <label htmlFor="equation">Equation: </label>
                f(x)=<input type="text" name="equation" id="equation" value={equation} onChange={e => setEquation(e.target.value)} required className="form-input w-full" autoFocus/>
                
                <div className="flex space-x-2 mt-2">
                    <label htmlFor="color">Colour: </label>
                    <input type="color" name="color" id="color" value={colour} onChange={e => setColour(e.target.value)} required className="rounded-md w-full"/> 
                </div>
                <div className="flex space-x-2 mt-2">
                    <Button type="submit" disabled={hasError}>Save</Button>
                    <Button type="button" clickHandler={closeHandler}>Close</Button>
                </div>
            </form>
        </Dialog>
    );
}
