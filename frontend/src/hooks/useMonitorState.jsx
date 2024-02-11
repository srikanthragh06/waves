import { useEffect } from "react";

export default function useMonitorState(state, stateName = "state") {
    useEffect(() => {
        console.log({ [stateName]: state });
    }, [state, stateName]);
}
