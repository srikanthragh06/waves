import client from "./client";

export const signUpUser = async (userInfo) => {
    try {
        const { data } = await client.post("/user/signup", userInfo);
        return data;
    } catch (err) {
        const { response } = err;
        if (response?.data) return response.data;
        return { error: err.message || err };
    }
};

export const loginUser = async (userInfo) => {
    try {
        const { data } = await client.post("/user/login", userInfo);
        return data;
    } catch (err) {
        const { response } = err;
        if (response?.data) return response.data;
        return { error: err.message || err };
    }
};

export const updateUserDetails = async (token, userDetails) => {
    try {
        const { data } = await client.patch(
            "/user/update-user-details",
            userDetails,
            {
                headers: {
                    Authorization: "Bearer" + " " + token,
                    accept: "application/json",
                },
            }
        );
        return data;
    } catch (err) {
        const { response } = err;
        if (response?.data) return response.data;
        return { error: err.message || err };
    }
};

export const getIsAuth = async (token) => {
    try {
        const { data } = await client.get("/user/is-auth", {
            headers: {
                Authorization: "Bearer" + " " + token,
                accept: "application/json",
            },
        });
        return data;
    } catch (error) {
        const { response } = error;
        if (response?.data) return response.data;

        return { error: error.message || error };
    }
};

export const getProfilePicture = async (token) => {
    try {
        const res = await client.get("/user/get-profile-picture", {
            headers: {
                Authorization: "Bearer" + " " + token,
                accept: "application/json",
            },
            responseType: "blob",
        });
        return res.data;
    } catch (error) {
        return { error: "Failed to get profile picture" };
    }
};

export const removeProfilePicture = async (token) => {
    try {
        const { data } = await client.delete("/user/delete-profile-picture", {
            headers: {
                Authorization: "Bearer" + " " + token,
                accept: "application/json",
            },
        });
        return data;
    } catch (err) {
        const { response } = err;
        if (response?.data) return response.data;
        return { error: err.message || err };
    }
};

export const uploadProfilePicture = async (token, formData) => {
    try {
        const { data } = await client.post(
            "/user/upload-profile-picture",
            formData,
            {
                headers: {
                    Authorization: "Bearer" + " " + token,
                    accept: "application/json",
                },
            }
        );
        return data;
    } catch (err) {
        const { response } = err;
        if (response?.data) return response.data;
        return { error: err.message || err };
    }
};
