import client from "./client";

export const getPostDetailsApi = async (postId) => {
    try {
        const res = await client.get(`/post/get-post-details/${postId}`);
        return res;
    } catch (err) {
        const { response } = err;
        return response;
    }
};

export const getPostMediaApi = async (postId) => {
    try {
        const res = await client.get(`/post/get-post-media/${postId}`, {
            responseType: "blob",
        });
        return res.data;
    } catch (error) {
        return { error: "Failed to get post media" };
    }
};

export const likePostApi = async (token, postId) => {
    try {
        const res = await client.post(
            "/post/like-post",
            { postId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    accept: "application/json",
                },
            }
        );
        return res;
    } catch (error) {
        const { response } = error;
        return response;
    }
};

export const dislikePostApi = async (token, postId) => {
    try {
        const res = await client.post(
            "/post/dislike-post",
            { postId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    accept: "application/json",
                },
            }
        );
        return res;
    } catch (error) {
        const { response } = error;
        return response;
    }
};

export const userLikesPostApi = async (userId, postId) => {
    try {
        const res = await client.get(
            `/post/user-likes-post/${userId}/${postId}`
        );
        return res;
    } catch (error) {
        const { response } = error;
        return response;
    }
};

export const getUserPostsApi = async (userId, page = 1, limit = 3) => {
    try {
        const res = await client.get(
            `/post/get-user-posts/${userId}?page=${page}&limit=${limit}`
        );
        return res;
    } catch (error) {
        const { response } = error;
        return response;
    }
};

export const createPostApi = async (token, formData) => {
    try {
        const res = await client.post("/post/create-post", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                accept: "application/json",
            },
        });
        return res;
    } catch (err) {
        const { response } = err;
        return response;
    }
};

export const deletePostApi = async (token, postId) => {
    try {
        const res = await client.delete(`/post/delete-post/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                accept: "application/json",
            },
        });
        return res;
    } catch (err) {
        const { response } = err;
        return response;
    }
};

export const getFeedPostsApi = async (userId, page = 1, limit = 5) => {
    try {
        const res = await client.get(
            `/post/get-feed-posts/${userId}?page=${page}&limit=${limit}`
        );
        return res;
    } catch (error) {
        const { response } = error;
        return response;
    }
};
