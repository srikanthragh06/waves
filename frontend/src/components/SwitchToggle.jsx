export default function SwitchToggle({
    className,
    toggleState,
    setToggleState,
    toggleTrueText,
    toggleFalseText,
}) {
    return (
        <div
            className={
                "bg-transparent  justify-center flex text-lg sm:text-2xl" +
                " " +
                className
            }
        >
            <button
                className="text-white bg-transparent px-3 w-full transition py-2"
                style={toggleState ? { borderBottom: "solid white 2px" } : {}}
                onClick={(e) => {
                    setToggleState(true);
                }}
            >
                {toggleTrueText}
            </button>
            <button
                className="text-white bg-transparent  px-3 w-full transition py-2"
                style={!toggleState ? { borderBottom: "solid white 2px" } : {}}
                onClick={(e) => {
                    setToggleState(false);
                }}
            >
                {toggleFalseText}
            </button>
        </div>
    );
}
