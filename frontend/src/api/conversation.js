import client from "./client";

export const getUserConversationsApi = async (token, page, limit) => {
    try {
        const res = await client.get(
            `/conversation/get-user-conversations?page=${page}&limit=${limit}`,
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

export const createConversationApi = async (token, receiverId) => {
    try {
        const res = await client.post(
            `/conversation/create-conversation`,
            { receiverId },
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
