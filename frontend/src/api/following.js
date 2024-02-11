import client from "./client";

export const isFollowingApi = async (followerId, followingId) => {
    try {
        const res = await client.get(
            `/following/is-following/${followerId}/${followingId}`
        );
        return res;
    } catch (err) {
        const { response } = err;
        return response;
    }
};

export const followUserApi = async (token, followingId) => {
    try {
        const res = await client.post(
            `/following/follow-user`,
            { followingId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    accept: "application/json",
                },
            }
        );
        return res;
    } catch (err) {
        const { response } = err;
        return response;
    }
};

export const unfollowUserApi = async (token, followingId) => {
    try {
        const res = await client.post(
            `/following/unfollow-user`,
            { followingId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    accept: "application/json",
                },
            }
        );
        return res;
    } catch (err) {
        const { response } = err;
        return response;
    }
};

export const searchUserFollowersApi = async (
    userId,
    page,
    limit,
    searchKey = ""
) => {
    try {
        const res = await client.get(
            searchKey
                ? `/following/search-user-followers/${userId}?searchKey=${searchKey}&page=${page}&limit=${limit}`
                : `/following/search-user-followers/${userId}?page=${page}&limit=${limit}`
        );
        return res;
    } catch (err) {
        const { response } = err;
        return response;
    }
};

export const searchUserFollowingApi = async (
    userId,
    page,
    limit,
    searchKey = ""
) => {
    try {
        const res = await client.get(
            searchKey
                ? `/following/search-user-following/${userId}?searchKey=${searchKey}&page=${page}&limit=${limit}`
                : `/following/search-user-following/${userId}?page=${page}&limit=${limit}`
        );
        return res;
    } catch (err) {
        const { response } = err;
        return response;
    }
};
