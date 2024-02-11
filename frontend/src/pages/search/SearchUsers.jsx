import React, { useEffect, useRef, useState } from "react";
import SearchBar from "../../components/SearchBar";
import { searchUserApi } from "../../api/user";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import UserItem from "../../components/UserItem";
import useInfiniteScroll from "../../hooks/useInfiteScroll";
import useStretchDiv from "../../hooks/useStretchDiv";

export default function SearchUsers() {
    const [searchTextState, setSearchTextState] = useState("");
    const [pageNumberState, setPageNumberState] = useState(1);

    const limit = 10;
    const hasMoreRef = useRef(true);

    const [loadingState, setLoadingState] = useState(false);
    const [errorState, setErrorState] = useState("");

    const scrollRef = useRef();

    const [usersListState, setUsersListState] = useState([]);

    useEffect(() => {
        const source = axios.CancelToken.source();

        const searchUsers = async () => {
            if (!searchTextState) return;

            setLoadingState(true);

            if (pageNumberState === 1) {
                try {
                    var res = await searchUserApi(searchTextState, 1, limit);
                    if (!res.data.error) {
                        setErrorState("");
                        setUsersListState([...res.data.users]);
                        hasMoreRef.current = true;
                    } else {
                        setErrorState(res.data.error);
                    }
                } catch (err) {
                } finally {
                    setLoadingState(false);
                }
            }
        };
        searchUsers();

        return () => {
            source.cancel(
                "Request canceled due to component unmount or searchTextState change"
            );
        };
    }, [searchTextState, pageNumberState]);

    useEffect(() => {
        const source = axios.CancelToken.source();

        const searchMoreUsers = async () => {
            if (!searchTextState) return;
            setLoadingState(true);

            if (pageNumberState > 1) {
                try {
                    var res = await searchUserApi(
                        searchTextState,
                        pageNumberState,
                        limit
                    );
                    if (!res.data.error) {
                        setErrorState("");
                        setUsersListState((prev) => {
                            return [...prev, ...res.data.users];
                        });
                        if (res.data.users.length < limit)
                            hasMoreRef.current = false;
                    } else {
                        setErrorState(res.data.error);
                    }
                } catch (err) {
                } finally {
                    setLoadingState(false);
                }
            }
        };

        searchMoreUsers();

        return () => {
            source.cancel(
                "Request canceled due to component unmount or searchTextState change"
            );
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumberState]);

    useEffect(() => {
        if (searchTextState) {
            setPageNumberState(1);
            const container = scrollRef.current;
            container.scrollTop = 0;
        }
    }, [searchTextState]);

    useInfiniteScroll(
        scrollRef,
        () => setPageNumberState((prev) => prev + 1),
        loadingState,
        hasMoreRef.current
    );

    useStretchDiv(scrollRef);

    return (
        <div
            className="w-full
                        lg:max-w-[800px] 
                        sm:max-w-[500px] 
                        sm:pt-4
                        flex flex-col space-y-2
                        border-"
        >
            <SearchBar
                searchTextState={searchTextState}
                setSearchTextState={setSearchTextState}
                placeholder={"Find new people..."}
            />
            <div
                ref={scrollRef}
                className="overflow-y-scroll
                                border-"
            >
                {usersListState.map((user) => {
                    return <UserItem key={user.id} userDetails={user} />;
                })}
                {errorState && <p className="text-red-600">{errorState}</p>}
                {loadingState && (
                    <AiOutlineLoading3Quarters className="animate-spin text-3xl" />
                )}
            </div>
        </div>
    );
}
