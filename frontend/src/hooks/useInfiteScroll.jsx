import { useEffect } from "react";

const useInfiniteScroll = (
    scrollRef,
    callback,
    loading = false,
    hasMore = true,
    threshold = 1
) => {
    useEffect(() => {
        const handleScroll = () => {
            const container = scrollRef.current;
            if (
                container.scrollHeight -
                    container.scrollTop -
                    container.clientHeight <=
                    threshold &&
                !loading &&
                hasMore
            ) {
                callback();
            }
        };

        const container = scrollRef.current;
        container.addEventListener("scroll", handleScroll);

        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, [scrollRef, callback, threshold, loading, hasMore]);
};

export default useInfiniteScroll;
