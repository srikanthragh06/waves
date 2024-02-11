const express = require("express");

const {
    loginHandler,
    signupHandler,
    uploadProfilePicture,
    getProfilePicture,
    deleteProfilePicture,
    updateUserDetails,
    searchHandler,
    getProfileDetailsHandler,
    getIdThroughUsernameHandler,
    changePasswordHandler,
} = require("../controllers/user");
const {
    loginValidation,
    signupValidation,
    updateUserValidation,
    changePasswordValidation,
} = require("../middlewares/user");
const { isAuth } = require("../middlewares/auth");
const { sendSuccessResponse } = require("../utils/response-templates");
const { uploadProfilePictureFile } = require("../utils/upload");

//

const router = express.Router();

router.route("/login").post(loginValidation, loginHandler);

router.route("/signup").post(signupValidation, signupHandler);

router
    .route("/update-user-details")
    .patch(isAuth, updateUserValidation, updateUserDetails);

router
    .route("/change-password")
    .patch(isAuth, changePasswordValidation, changePasswordHandler);

router.route("/is-auth").get(isAuth, (req, res) => {
    const { user } = req;
    return sendSuccessResponse(req, res, "Auth successful", 200, {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            posts: user.posts,
            followers: user.followers,
            following: user.following,
        },
    });
});

router
    .route("/upload-profile-picture")
    .post(
        isAuth,
        uploadProfilePictureFile.single("profilePicture"),
        uploadProfilePicture
    );

router.route("/get-profile-picture/:userId").get(getProfilePicture);

router.route("/delete-profile-picture").delete(isAuth, deleteProfilePicture);

router.route("/search-user/:searchKey").get(searchHandler);

router.route("/get-profile-details/:userId").get(getProfileDetailsHandler);

router
    .route("/get-id-through-username/:username")
    .get(getIdThroughUsernameHandler);

module.exports = router;
