import { useEffect } from "react";

const useWindowInfiniteScroll = (
    callback,
    loading = false,
    hasMore = true,
    threshold = 1
) => {
    useEffect(() => {
        const handleScroll = () => {
            console.log("check");
            const { scrollTop, scrollHeight, clientHeight } = document.body;
            if (
                scrollHeight - scrollTop - clientHeight <= threshold &&
                !loading &&
                hasMore
            ) {
                callback();
            }
        };

        document.body.addEventListener("scroll", handleScroll);

        return () => {
            document.body.removeEventListener("scroll", handleScroll);
        };
    }, [callback, threshold, loading, hasMore]);
};

export default useWindowInfiniteScroll;
