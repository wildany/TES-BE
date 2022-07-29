import users from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateEmail } from "../validator/EmailValidator.js";


export const userRegister = async (req, res) => {
    const { name, username, email, password, photo } = req.body;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const data = {
        name: name,
        username: username,
        email: email,
        password: hashPassword,
        photo: photo
    }

    try {
        if (validateEmail(email) === null) {
            return res.status(400).json({
                "success": false,
                "message": "You have entered invalid email address",
                "data": null,
            })
        }
        const isDuplicate = await users.findOne(
            {
                where: {
                    email: email
                }
            }
        );
        if (isDuplicate !== null) {
            return res.status(400).json({
                "success": false,
                "message": "Duplicate Email",
                "data": null,
            })
        }

        await users.create(data);
        res.status(201).json({
            "success": true,
            "message": "Your account has been successfully created",
            "data": data,
        });
    } catch (error) {
        res.status(400).json({
            "success": false,
            "message": "Register unsuccessfully",
            "data": null,
        });
    }
}


export const userLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await users.findOne({
            where: {
                username: username
            }
        });

        if (user === null) {
            res.status(400).json({
                "success": false,
                "message": "Email not found",
                "data": null,
            });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            res.status(400).json({
                "success": false,
                "message": "Invalid password",
                "data": null,
            });
        }
        const userId = user.id;
        const name = user.name;
        const email = user.email;
        const token = jwt.sign({ userId, name, email }, process.env.SECRET_TOKEN, {
            expiresIn: '900s' //15menit
        })
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000
        });
        res.status(200).json({
            "success": true,
            "message": "Successfully logged in",
            "data": {
                "token": token
            },
        })

    } catch (error) {
        res.status(400).json({
            "success": false,
            "message": error.message,
            "data": null,
        });
    }

}


export const userLogout = async (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({
        "success": true,
        "message": "Successfully logout",
        "data": null,
    });
}



export const getUserById = async (req, res) => {
    try {
        const dataUser = await users.findOne({
            attributes: ['name', 'username', 'email', 'photo', 'createdAt', 'updatedAt'],
            where: {
                id: req.params.id
            }
        });
        if (dataUser === null) {
            return res.status(400).json({
                "success": false,
                "message": "Data not found",
                "data": null,
            })
        }
        res.status(200).json({
            "success": true,
            "message": "Successfully Get User",
            "data": {
                dataUser
            },
        })
    } catch (error) {
        return res.status(400).json({
            "success": false,
            "message": error.message,
            "data": null,
        })
    }
}


export const editUserById = async (req, res) => {
    const userId = req.params.id;
    const { name, username, email, photo } = req.body;
    try {
        if (validateEmail(email) === null) {
            return res.status(400).json({
                "success": false,
                "message": "You have entered invalid email address",
                "data": null,
            })
        }
        const isUserFound = await users.findOne({
            where: {
                id: userId
            }
        })
        if (isUserFound === null) {
            return res.status(400).json({
                "success": false,
                "message": "Data not found",
                "data": null,
            })
        }
        const updateUser = await users.update(
            {
                name: name,
                username: username,
                email: email,
                photo: photo,

            }, {
            where: {
                id: userId
            }
        });
        const getUser = await users.findOne({
            where: {
                id: userId
            }
        })
        res.status(200).json({
            "success": true,
            "message": "Successfully Update User",
            "data": {
                "name": name,
                "username": username,
                "email": email,
                "photo": photo,
                "createdAt": getUser.createdAt,
                "updatedAt": getUser.updatedAt
            },
        }
        );
    } catch (error) {
        return res.status(400).json({
            "success": false,
            "message": error.message,
            "data": null,
        })
    }
}

export const changePassword = async (req, res) => {
    const userId = req.params.id;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(newPassword, salt);

    try {
        const updatePassword = await users.update(
            {
                password: hashPassword

            }, {
            where: {
                id: userId
            }
        });

        if (updatePassword <= 0) {
            return res.status(400).json({
                "success": false,
                "message": "Data not found",
                "data": null,
            })

        }
        res.status(200).json({
            "success": true,
            "message": "Successfully Change Password",
            "data": null,
        })
    } catch (error) {
        return res.status(400).json({
            "success": false,
            "message": error.message,
            "data": null,
        })
    }
}