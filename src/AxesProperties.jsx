import { useState, useRef } from "react";

import Dialog from "./Dialog";
import Button from './Button';

export default function AxesProperties()
{
    const [isVisible, setIsVisible] = useState(true);
    const minXRef = useRef(-10);
    const minYRef = useRef(-10);
    const maxXRef = useRef(10);
    const maxYRef = useRef(10);

    const submitForm = e =>
    {
        e.preventDefault();
    }

    const changeHandler = (ref) => (e) =>
    {
        ref.current = e.target.value;
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
                    <div className="col-span-6">
                        <span className="text-bold block">x-axis</span>
                        <label htmlFor="min-x">Min: </label>
                        <input type="number" name="min-x" id="min-x" onChange={changeHandler(minXRef)} required className="form-input w-full" />
                        <label htmlFor="max-x">Max: </label>
                        <input type="number" name="max-x" id="max-x" required className="form-input w-full" />
                    </div>

                    <div className="col-span-6">
                        <span className="text-bold block">y-axis</span>
                        <label htmlFor="min-y">Min: </label>
                        <input type="number" name="min-y" id="min-y" required className="form-input w-full" />
                        <label htmlFor="max-y">Max: </label>
                        <input type="number" name="max-y" id="max-y" required className="form-input w-full" />
                    </div>
                </div>

                <div className="flex space-x-2 mt-2">
                    <Button type="submit">Save</Button>
                    <Button type="button" clickHandler={dismiss}>Close</Button>
                </div>
            </form>
        </Dialog>
    );
}