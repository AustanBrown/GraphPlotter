import { useState } from "react";

import Dialog from "./Dialog";
import Button from './Button';

const toNumber = value =>
{
    if(value.trim() === '')
    {
        return null;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
}

export default function AxesProperties({closeHandler, minDomain, maxDomain, minRange, maxRange, modifyDomain, modifyRange, modes, setDefaultMode, defaultMode})
{
    const [minX, setMinX] = useState(String(minDomain));
    const [maxX, setMaxX] = useState(String(maxDomain));
    const [minY, setMinY] = useState(String(minRange));
    const [maxY, setMaxY] = useState(String(maxRange));

    const numericMinX = toNumber(minX);
    const numericMaxX = toNumber(maxX);
    const numericMinY = toNumber(minY);
    const numericMaxY = toNumber(maxY);

    const formIsInvalid = numericMinX === null || numericMaxX === null || numericMinY === null || numericMaxY === null
        || numericMaxX <= numericMinX || numericMaxY <= numericMinY;

    const submitForm = e =>
    {
        e.preventDefault();
        modifyDomain(numericMinX, numericMaxX);
        modifyRange(numericMinY, numericMaxY);
        closeHandler();
    }

    const coordinateSystemChange = e =>
    {
        const setMode = modes.filter(mode => mode['id'] === e.target.value);
        setDefaultMode(setMode[0]);
    }

    return (
        <Dialog dismissHandler={closeHandler} label="Axes Properties">
            <h1 className="text-xl">Axes Properties</h1>
            <form onSubmit={submitForm}>
                <div className="grid grid-cols-12 gap-x-4">
                    <div className="col-span-12">
                        <label htmlFor="coord-mode">Coordinate System: </label>
                        <select id="coord-mode" name="coord-mode" value={defaultMode['id']} className="form-input w-full" onChange={coordinateSystemChange}>
                            {modes.map(mode => <option value={mode['id']} key={mode['id']}>{mode['name']}</option>)}
                        </select>
                    </div>
                    <div className="col-span-6">
                        <span className="font-bold block">x-axis</span>
                        <label htmlFor="min-x">Min: </label>
                        <input type="number" name="min-x" id="min-x" value={minX} onChange={e => setMinX(e.target.value)} required className="form-input w-full" />
                        <label htmlFor="max-x">Max: </label>
                        <input type="number" name="max-x" id="max-x" value={maxX} onChange={e => setMaxX(e.target.value)} required className="form-input w-full" />
                    </div>

                    <div className="col-span-6">
                        <span className="font-bold block">y-axis</span>
                        <label htmlFor="min-y">Min: </label>
                        <input type="number" name="min-y" id="min-y" value={minY} onChange={e => setMinY(e.target.value)} required className="form-input w-full" />
                        <label htmlFor="max-y">Max: </label>
                        <input type="number" name="max-y" id="max-y" value={maxY} onChange={e => setMaxY(e.target.value)} required className="form-input w-full" />
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
