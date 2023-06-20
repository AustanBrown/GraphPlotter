import { useState, useRef } from "react";

import Dialog from "./Dialog";
import Button from './Button';
import { compositionDependencies } from "mathjs";

export default function AxesProperties({closeHandler, minDomain, maxDomain, minRange, maxRange, modifyDomain, modifyRange, modes, setDefaultMode, defaultMode})
{
    const [isVisible, setIsVisible] = useState(true);
    const [formIsInvalid, setFormIsInvalid] = useState(false);
    const minX = useRef(minDomain);
    const minY = useRef(minRange);
    const maxX = useRef(maxDomain);
    const maxY = useRef(maxRange);
    const modeList = modes.map(mode => 
        <option value={mode['id']} key={mode['id']}>{mode['name']}</option>
    );

    const validateMaxMin = (max, min) => 
    {
       return max > min;
    }

    const submitForm = e =>
    {
        e.preventDefault();
        modifyDomain(minX.current, maxX.current);
        modifyRange(minY.current, maxY.current);
        closeHandler();
    }

    const coordinateSystemChange =  e =>
    {
        const setMode = modes.filter(mode => mode['id'] === e.target.value);
        setDefaultMode(setMode[0]);
        console.log(`The new mode is ${setMode[0]['id']}`);
    }

    const changeHandler = (ref) => (e) =>
    {
        ref = e.target.value;
        let refID = e.target.id;
        if(ref === '' || isNaN(ref))
        {
            setFormIsInvalid(true);
        }
        else
        {
            switch(refID)
            {
                case 'min-x':
                    minX.current = parseInt(ref);
                    break;

                case 'max-x':
                    maxX.current = parseInt(ref);
                    break;

                case 'min-y':
                    minY.current = parseInt(ref);
                    break;

                case 'max-y':
                    maxY.current = parseInt(ref);
                    break;
            }
            if((validateMaxMin(maxX.current, minX.current) === false) || (validateMaxMin(maxY.current, minY.current) === false))
            {
                setFormIsInvalid(true);
            }
            else
            {
                setFormIsInvalid(false);
            }
        }
    }

    const dismiss = () =>
    {
        setIsVisible(false);
    }

    return (
        <Dialog dismissHandler={() => alert("You dismissed me!")} visible={isVisible}>
            <h1 className="text-xl">Axes Properties</h1>
            <form onSubmit={submitForm}>
                <div className="grid grid-cols-12 gap-x-4">
                    <div className="col-span-12">
                        <label htmlFor="coord-mode">Coordinate System: </label>
                        <select id="coord-mode" name="coord-mode" defaultValue={defaultMode['id']} className="form-input w-full" onChange={coordinateSystemChange}>
                            {modeList}
                        </select>
                    </div>
                    <div className="col-span-6">
                        <span className="text-bold block">x-axis</span>
                        <label htmlFor="min-x">Min: </label>
                        <input type="number" name="min-x" id="min-x" defaultValue={minX.current} onChange={changeHandler(minX.current)} required className="form-input w-full" />
                        <label htmlFor="max-x">Max: </label>
                        <input type="number" name="max-x" id="max-x" defaultValue={maxX.current} onChange={changeHandler(maxX.current)} required className="form-input w-full" />
                    </div>

                    <div className="col-span-6">
                        <span className="text-bold block">y-axis</span>
                        <label htmlFor="min-y">Min: </label>
                        <input type="number" name="min-y" id="min-y" defaultValue={minY.current} onChange={changeHandler(minY.current)} required className="form-input w-full" />
                        <label htmlFor="max-y">Max: </label>
                        <input type="number" name="max-y" id="max-y" defaultValue={maxY.current} onChange={changeHandler(maxY.current)} required className="form-input w-full" />
                    </div>
                </div>

                <div className="flex space-x-2 mt-2">
                    <Button type="submit" disabled={formIsInvalid}>Save</Button>
                    <Button type="button" clickHandler={closeHandler}>Close</Button>
                </div>
            </form>
        </Dialog>
    );
}