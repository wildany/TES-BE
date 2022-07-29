import users from "../model/User.js";
import posts from "../model/Post.js";
import file from "../model/File.js";
import sequelize from "sequelize";
import userLiked from "../model/UserLiked.js";
import { Op } from "sequelize";



export const createPost = async (req, res) => {
    const { image, caption, tags, userId } = req.body;

    try {
        const createPost = await posts.create({
            userId: userId,
            caption: caption,
            tags: tags,
            image: image
        });
        const getPostedData = await posts.findAll({
            include: [{
                model: users,
                required: true
            }],
            where: {
                id: createPost.id
            }
        })
        const hasil = getPostedData[0];
        if (hasil === null) {
            return res.status(400).json({
                "success": false,
                "message": "Data not found",
                "data": null,
            })
        }
        res.status(200).json({
            "success": true,
            "message": "Successfully Create Post",
            "data": {
                "image": hasil.image,
                "caption": hasil.caption,
                "tags": hasil.tags,
                "likes": hasil.likes,
                "createdAt": hasil.createdAt,
                "updatedAt": hasil.updatedAt,
                "user": {
                    "name": hasil.User.name,
                    "username": hasil.User.username,
                    "email": hasil.User.email,
                    "photo": hasil.User.photo,
                }
            },
        })
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                "success": false,
                "message": "Data not found",
                "data": null,
            })
        }

    }
}

export const updatePost = async (req, res) => {
    const postId = req.params.id;
    const { image, caption, tags } = req.body;
    try {
        const update = await posts.update({
            image: image,
            caption: caption,
            tags: tags
        }, {
            where: {
                id: postId
            }
        })

        const findUserAndPost = await posts.findOne({
            attributes: ['image', 'caption', 'tags', 'likes', 'createdAt', 'updatedAt'],
            include: [{
                model: users,
                required: true,
                attributes: ['name', 'username', 'email', 'photo']
            }],
            where: {
                id: postId
            }
        })
        if (findUserAndPost === null) {
            return res.status(400).json({
                "success": false,
                "message": "Data not found",
                "data": null,
            }
            )
        }
        res.status(200).json(
            {
                "success": true,
                "message": "Successfully Update Post",
                "data": findUserAndPost
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
export const deletePost = async (req, res) => {
    const postId = req.params.id;
    try {
        const del = await posts.destroy({
            where: {
                id: postId
            }
        })
        if (del <= 0) {
            return res.status(400).json({
                "success": false,
                "message": "Data not found",
                "data": null,
            })
        }
        res.status(200).json({
            "success": true,
            "message": "Successfully Delete Post",
            "data": null,
        })
    } catch (error) {
        res.status(404).json({
            "success": true,
            "message": error.message,
            "data": null,
        })
    }

}

export const givingLikeToPost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.body.userId;

    try {
        const inputUserLiked = await userLiked.create({
            postId: postId,
            userId: userId
        });
        if (!inputUserLiked) {
            res.status(400).json({
                "success": false,
                "message": "Data not found",
                "data": null,
            })
        }

        const like = await posts.update({
            likes: sequelize.literal('likes + 1')
        }, {
            where: {
                id: postId
            }
        })

        if (like <= 0) {
            return res.status(400).json({
                "success": false,
                "message": "Data not found",
                "data": null,
            })
        }
        res.status(200).json({
            "success": true,
            "message": "Successfully Liked Post",
            "data": null
        })
    } catch (error) {
        return res.status(400).json({
            "success": false,
            "message": "Data not found",
            "data": null,
        })
    }

}

export const unlikePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.body.userId;

    try {
        const deleteUserLiked = await userLiked.destroy({
            where: {
                [Op.and]: {
                    postId: postId
                },
                [Op.and]: {
                    userId: userId
                }
            }
        });
        if (!deleteUserLiked) {
            return res.status(400).json({
                "success": false,
                "message": "Data not found",
                "data": null,
            })
        }

        const like = await posts.update({
            likes: sequelize.literal('likes - 1')
        }, {
            where: {
                id: postId
            }
        })

        res.status(200).json({
            "success": true,
            "message": "Successfully Unlike Post",
            "data": null
        })
    } catch (error) {
        return res.status(400).json({
            "success": false,
            "message": "Unsuccessfully Unlike Post",
            "data": null,
        })
    }
}

export const listPost = async (req, res) => {
    const page = req.query.page;
    const limit = req.query.limit;
    const searchBy = req.query.searchBy;
    const searchValue = req.query.search;
    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await posts.findAndCountAll({
            attributes: ['id', 'image', 'caption', 'tags', 'likes', 'createdAt', 'updatedAt'],
            include: [{
                model: users,
                required: true,
                attributes: ['name', 'username', 'email', 'photo']
            }],
            limit: parseInt(limit),
            offset: offset,
            where: {
                [Op.or]: [
                    {
                        [searchBy]: {
                            [Op.like]: `%${searchValue}%`
                        }
                    }
                ]
            }
        })

        if (count <= 0) {
            return res.status(400).json({
                "success": false,
                "message": "Data not found",
                "data": null,
            })
        }

        res.status(200).json({
            "success": true,
            "message": "Successfully Get Post",
            "data": rows,
            "pagination": {
                "total": count,
                "page": page,
                "limit": limit
            }
        });

    } catch (error) {
        return res.status(400).json({
            "success": false,
            "message": error.message,
            "data": null,
        })
    }
}

export const getPostById = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await posts.findAll({
            attributes: ['id', 'image', 'caption', 'tags', 'likes', 'createdAt', 'updatedAt'],
            include: [{
                model: users,
                required: true,
                attributes: ['name', 'username', 'email', 'photo']
            }],
            where: {
                id: postId
            }
        })

        if (post[0] === undefined) {
            return res.status(400).json({
                "success": false,
                "message": "Data not found",
                "data": null,
            })
        }

        res.status(200).json({
            "success": true,
            "message": "Successfully Get Post",
            "data": post[0],
        })
    } catch (error) {
        return res.status(400).json({
            "success": false,
            "message": error.message,
            "data": null,
        })
    }
}

export const uploadImage = async (req, res) => {
    if (!req.files) {
        return res.status(400).json({
            "success": false,
            "message": "No files were uploaded",
            "data": null,
        })
    }
    const fileUpload = req.files.file;
    const host = req.hostname;
    // req.get('host')
    const filePath = req.protocol + '://' + host + `/file/${fileUpload.name}`
    await fileUpload.mv('./file/' + fileUpload.name);
    try {
        const upload = await file.create({
            url: filePath,
            filename: fileUpload.name,
            mimetype: fileUpload.mimetype,
        })
        if (upload) {
            res.status(200).json({
                "success": true,
                "message": "Successfully Upload Image",
                "data": {
                    "id": upload.id,
                    "url": filePath,
                    "filename": fileUpload.name,
                    "mimetype": fileUpload.mimetype,
                },
            })
        }
        res.status(200).json({
            "success": false,
            "message": "Data not found",
            "data": null,
        })

    } catch (error) {
        res.status(200).json({
            "success": false,
            "message": "Data not found",
            "data": null,
        })
    }

}
