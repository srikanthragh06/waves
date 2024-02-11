import client from "./client";

export const loginUserApi = async (userInfo) => {
    try {
        const res = await client.post("/user/login", userInfo);
        return res;
    } catch (err) {
        const { response } = err;
        return response;
    }
};

export const signupUserApi = async (userInfo) => {
    try {
        const res = await client.post("/user/signup", userInfo);
        return res;
    } catch (err) {
        const { response } = err;
        return response;
    }
};

export const getIsAuthApi = async (token) => {
    try {
        const res = await client.get("/user/is-auth", {
            headers: {
                Authorization: `Bearer ${token}`,
                accept: "application/json",
            },
        });
        return res;
    } catch (error) {
        const { response } = error;
        return response;
    }
};

export const getProfilePictureApi = async (userId) => {
    try {
        const res = await client.get(`/user/get-profile-picture/${userId}`, {
            headers: {
                accept: "application/json",
            },
            responseType: "blob",
        });
        return res.data;
    } catch (error) {
        return { error: "Failed to get profile picture" };
    }
};

export const getProfileDetailsApi = async (userId) => {
    try {
        const res = await client.get(`/user/get-profile-details/${userId}`);
        return res;
    } catch (error) {
        const { response } = error;
        return response;
    }
};

export const removeProfilePictureApi = async (token) => {
    try {
        const res = await client.delete("/user/delete-profile-picture", {
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

export const uploadProfilePictureApi = async (token, formData) => {
    try {
        const res = await client.post(
            "/user/upload-profile-picture",
            formData,
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

export const updateUserDetailsApi = async (token, userDetails) => {
    try {
        const res = await client.patch(
            "/user/update-user-details",
            userDetails,
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

export const changePasswordApi = async (token, oldPassword, newPassword) => {
    try {
        const res = await client.patch(
            "/user/change-password",
            { oldPassword, newPassword },
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

export const searchUserApi = async (searchKey, page, limit) => {
    try {
        const res = await client.get(
            `/user/search-user/${searchKey}?page=${page}&limit=${limit}`
        );
        return res;
    } catch (err) {
        const { response } = err;
        return response;
    }
};

export const getIdThroughUsernameApi = async (username) => {
    try {
        const res = await client.get(
            `/user/get-id-through-username/${username}`
        );
        return res;
    } catch (err) {
        const { response } = err;
        return response;
    }
};
