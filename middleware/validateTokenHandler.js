import jwt from "jsonwebtoken";
import { STATUS_CODES } from "../constants/constants.js";
import { User } from "../model/user.model.js";

export const validateToken = async (req, res, next) => {
    try {
        let token;
        let authHeader = req.headers.Authorization || req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, "MySecret");
            const user = await User.findOne({
                _id: decoded._id,
                token: token,
            }).select("-password");

            if (!token || !user) {
                res.status(STATUS_CODES.UNAUTHORIZED);
                throw new Error("User is not Authorized or token is missing");
            }
            req.token = token;
            req.user = user;

            next();
        }
    } catch (error) {
        next(error);
    }
};
