import React, { useEffect, useRef, useState } from "react";
import SearchBar from "../../components/SearchBar";
import useStretchDiv from "../../hooks/useStretchDiv";
import axios from "axios";
import { searchUserFollowersApi } from "../../api/following";
import { useParams } from "react-router-dom";
import useInfiniteScroll from "../../hooks/useInfiteScroll";
import UserItem from "../../components/UserItem";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function FollowersListDisplay() {
    const { userId: profileId } = useParams();

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
            setLoadingState(true);

            if (pageNumberState === 1) {
                try {
                    var res = await searchUserFollowersApi(
                        profileId,
                        1,
                        limit,
                        searchTextState
                    );
                    if (!res.data.error) {
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
    }, [searchTextState, pageNumberState, profileId]);

    useEffect(() => {
        const source = axios.CancelToken.source();

        const searchMoreUsers = async () => {
            setLoadingState(true);
 
            if (pageNumberState > 1) {
                try {
                    var res = await searchUserFollowersApi(
                        profileId,
                        pageNumberState,
                        limit,
                        searchTextState
                    );
                    if (!res.data.error) {
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
        <>
            <SearchBar
                placeholder={"Search followers..."}
                searchTextState={searchTextState}
                setSearchTextState={setSearchTextState}
            />
            <div
                className="overflow-y-scroll 
                            border-"
                ref={scrollRef}
            >
                {usersListState.map((user) => {
                    return <UserItem key={user.id} userDetails={user} />;
                })}
                {errorState && <p className="text-red-600">{errorState}</p>}
                {loadingState && (
                    <AiOutlineLoading3Quarters className="animate-spin text-3xl" />
                )}
            </div>
        </>
    );
}
