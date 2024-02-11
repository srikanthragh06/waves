import { useEffect } from "react";

export default function useStretchDiv(scrollRef) {
    useEffect(() => {
        const setDivHeight = () => {
            const windowHeight = window.innerHeight;
            const { top } = scrollRef.current.getBoundingClientRect();
            const divHeight = windowHeight - top;
            scrollRef.current.style.height = `${divHeight - 10}px`;
        };

        setDivHeight();
        window.addEventListener("resize", setDivHeight);

        return () => {
            window.removeEventListener("resize", setDivHeight);
        };
    }, [scrollRef]);
}
