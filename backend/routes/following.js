const express = require("express");
const {
    followUserHandler,
    searchUserFollowingHandler: getUserFollowingHandler,
    unfollowUserHandler,
    searchUserFollowersHandler: getUserFollowersHandler,
    isFollowingHandler,
} = require("../controllers/following");
const { isAuth } = require("../middlewares/auth");

const router = express.Router();

router.route("/follow-user").post(isAuth, followUserHandler);

router.route("/unfollow-user").post(isAuth, unfollowUserHandler);

router.route("/is-following/:followerId/:followingId").get(isFollowingHandler);

router.route("/search-user-followers/:userId").get(getUserFollowersHandler);

router.route("/search-user-following/:userId").get(getUserFollowingHandler);

module.exports = router;
