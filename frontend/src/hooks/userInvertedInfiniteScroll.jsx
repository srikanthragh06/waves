import { useEffect } from "react";

const useInvertedInfiniteScroll = (
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
                container.scrollTop -
                    container.clientHeight +
                    container.scrollHeight <=
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

export default useInvertedInfiniteScroll;
