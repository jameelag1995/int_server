import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function (value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(value);
                },
                message: "Invalid email address",
            },
        },
        username: {
            type: String,
            required: true,
            minlength: [2, "username must be more than 2 characters"],
        },
        password: {
            type: String,
            required: true,
            minlength: [2, "password must be more than 2 characters"],
        },
        token: { type: String },
    },
    {
        timestamps: true,
    }
);

userSchema.methods.generateAccessToken = async function () {
    const currUser = this;
    const token = jwt.sign(
        {
            _id: currUser._id.toString(),
        },
        "MySecret"
    );

    currUser.token = token;
    await currUser.save();
    return token;
};

export const User = mongoose.model("User", userSchema);
