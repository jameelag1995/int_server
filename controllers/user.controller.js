import { User } from "../model/user.model.js";
import bcrypt from "bcrypt";
import { STATUS_CODES } from "../constants/constants.js";
//@desc Register a user
//@route POST /api/users/register
//@access public
export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(STATUS_CODES.VALIDATION_ERROR);
            throw new Error("All fields are mandatory!");
        }
        const userAvailable = await User.findOne({ email });
        if (userAvailable) {
            res.status(STATUS_CODES.VALIDATION_ERROR);
            throw new Error("User already registered!");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        if (user) {
            const accessToken = await user.generateAccessToken();
            res.status(STATUS_CODES.CREATED).json({
                accessToken,
            });
        } else {
            res.status(STATUS_CODES.VALIDATION_ERROR);
            throw new Error("User data is not valid");
        }
    } catch (error) {
        next(error);
    }
};

//@desc Login a user
//@route PATCH /api/users/login
//@access public
export const loginUser = async (req, res, next) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(STATUS_CODES.VALIDATION_ERROR);
            throw new Error("All fields are mandatory");
        }
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const accessToken = await user.generateAccessToken();
            res.status(STATUS_CODES.OK).send({ accessToken });
        } else {
            res.status(STATUS_CODES.UNAUTHORIZED);
            throw new Error("Email or Password is not valid");
        }
    } catch (error) {
        next(error);
    }
};

//@desc Logout a user
//@route POST /api/users/logout
//@access private
export const logout = async (req, res, next) => {
    try {
        req.user.token = "";
        await req.user.save();
        res.send("logged out");
    } catch (error) {
        next(error);
    }
};
