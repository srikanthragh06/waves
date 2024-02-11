import React, { createContext, useRef } from "react";

export const MainPageContext = createContext();

export default function MainPage({ children, className, style }) {
    const mainPageRef = useRef();

    return (
        <MainPageContext.Provider value={{ mainPageRef }}>
            <div
                ref={mainPageRef}
                style={style}
                className={`w-full h-full overflow-y-scroll overflow-x-
                            flex flex-col items-center ${className} `}
            >
                {children}
            </div>
        </MainPageContext.Provider>
    );
}
