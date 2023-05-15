import Button from "./Button";

export default function Dialog({children, dismissHandler, visible})
{
    /*const [isVisible, setIsVisible] = useState(true);

    const onVisibilityChange = () =>
    {
        setIsVisible(!isVisible);
    }*/

    //bg-[#D9D9D9] rounded-[6px] p-5 text-[#845EC2]
    return (
        <div className={`fixed ${visible === false ? "hidden" : "" } inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full`}>
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-[6px] bg-[#D9D9D9] text-[#845EC2]">
                {children}
            </div>
        </div>
    );
}