import React, { useState, useEffect, useRef } from "react";

export default function InfiniteScroll({ fetchMoreData, children }) {
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;
            if (scrollHeight - scrollTop === clientHeight && !loading) {
                setLoading(true);
                fetchMoreData().then(() => setLoading(false));
            }
        };

        const scrollContainer = scrollRef.current;
        scrollContainer.addEventListener("scroll", handleScroll);
        return () => {
            scrollContainer.removeEventListener("scroll", handleScroll);
        };
    }, [fetchMoreData, loading]);

    return (
        <div
            ref={scrollRef}
            style={{
                overflowY: "scroll",
                height: "400px",
                border: "1px solid black",
            }}
        >
            {children}
            {loading && <div>Loading...</div>}
        </div>
    );
}
