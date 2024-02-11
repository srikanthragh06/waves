export default function SwitchToggle2({
    className,
    toggleState,
    setToggleState,
    toggleTrueText,
    toggleFalseText,
}) {
    const selectedStyle = {
        backgroundColor: "white",
        color: "#0b0117",
        fontWeight: "bold",
    };

    return (
        <div
            className={
                "bg-transparent  justify-center flex text-lg sm:text-2xl border-white border-[0.5px] rounded-full" +
                " " +
                className
            }
        >
            <button
                className="text-white bg-transparent px-3 w-full transition py-2 rounded-full"
                style={toggleState ? selectedStyle : {}}
                onClick={(e) => {
                    setToggleState(true);
                }}
            >
                {toggleTrueText}
            </button>
            <button
                className="text-white bg-transparent  px-3 w-full transition py-2 rounded-full"
                style={!toggleState ? selectedStyle : {}}
                onClick={(e) => {
                    setToggleState(false);
                }}
            >
                {toggleFalseText}
            </button>
        </div>
    );
}
