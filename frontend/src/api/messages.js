import client from "./client";

export const getConversationMessagesApi = async (
    token,
    conversationId,
    page,
    limit
) => {
    try {
        const res = await client.get(
            `/message/get-conversation-messages/${conversationId}?page=${page}&limit=${limit}`,
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

export const addMessageApi = async (token, formData) => {
    try {
        const res = await client.post(`/message/add-message`, formData, {
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

export const setIsReadApi = async (token, conversationId) => {
    try {
        const res = await client.patch(
            `/message/set-is-read`,
            { conversationId },
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

export const deleteMessageApi = async (token, messageId) => {
    try {
        const res = await client.delete(
            `/message/delete-message/${messageId}`,
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

export const getMessageMediaApi = async (token, messageId) => {
    try {
        const res = await client.get(
            `/message/get-message-media/${messageId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    accept: "application/json",
                },
                responseType: "blob",
            }
        );
        return res.data;
    } catch (error) {
        return { error: "Failed to get message media" };
    }
};
