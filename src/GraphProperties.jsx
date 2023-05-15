import { useState, useRef } from "react";
import * as math from "mathjs";

import Dialog from "./Dialog";
import Button from "./Button";

export default function GraphProperties({ graph, equationHandler, closeHandler, domain })
{
    const [isVisible, setIsVisible] = useState(true);
    const [hasError, setHasError] = useState(true);
    let eqn = useRef(null);
    let eqnColour = useRef("#000000");

    const dismiss = () =>
    {
        setIsVisible(false);
        closeHandler();
    }
    
    const submitForm = e =>
    {
        e.preventDefault();
        equationHandler(eqn.current, eqnColour.current);
        dismiss();
    }

    const changeEquationHandler = (ref) =>  e =>
    {
        try
        {
            math.evaluate(`f(x)=${e.target.value}`);
            setHasError(false);
        }
        catch(error)
        {
            setHasError(true);
        }
        ref.current = e.target.value;
    }

    const changeColourHandler = (ref) => e =>
    {
        ref.current = e.target.value;
    }

    return (
        <Dialog dismissHandler={() => alert("You dismissed me!")} visible={isVisible}>
            <h1 className="text-xl">{ (graph === undefined) ? "Add Graph" : "Modify Graph" }</h1>
            <form onSubmit={submitForm} autoComplete="off">
                <label htmlFor="equation">Equation: </label>
                f(x)=<input type="text" name="equation" id="equation" onChange={changeEquationHandler(eqn)} required className="form-input w-full" autoFocus/>
                
                <div className="flex space-x-2 mt-2">
                    <label htmlFor="color">Colour: </label>
                    <input type="color" name="color" id="color" onChange={changeColourHandler(eqnColour)} required className="rounded-md w-full"/> 
                </div>
                <div className="flex space-x-2 mt-2">
                    <Button type="submit" disabled={hasError}>Save</Button>
                    <Button type="button" clickHandler={dismiss}>Close</Button>
                </div>
            </form>
        </Dialog>
    );
}