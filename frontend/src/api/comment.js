import client from "./client";

export const getPostCommentsApi = async (postId, page = 1, limit = 5) => {
    try {
        const res = await client.get(
            `/comment/get-post-comments/${postId}?page=${page}&limit=${limit}`
        );
        return res;
    } catch (error) {
        const { response } = error;
        return response;
    }
};

export const addCommentApi = async (
    token,
    postId,
    content,
    replyCommentId = null
) => {
    try {
        const res = await client.post(
            `/comment/add-comment`,
            { postId, content, replyCommentId },
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

export const deleteCommentApi = async (token, commentId) => {
    try {
        const res = await client.delete(
            `/comment/delete-comment/${commentId}`,
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
