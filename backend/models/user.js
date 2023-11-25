const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// required: username, password,email
// unique: username,email
const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            minlength: 4,
            maxlength: 32,
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            required: false,
        },
        password: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Others"],
            required: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        bio: {
            type: String,
            required: false,
            maxlength: 200,
        },
        hasProfilePicture: {
            type: Boolean,
            default: false,
            required: true,
        },
        profilePictureFileType: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
