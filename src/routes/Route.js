import express from "express";
import { createPost, deletePost, getPostById, givingLikeToPost, listPost, unlikePost, updatePost, uploadImage } from "../controller/PostController.js";
import { changePassword, editUserById, getUserById, userLogin, userLogout, userRegister } from "../controller/usercontroller.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const route = express.Router();

//user router
route.post('/auth/register', userRegister);
route.post('/auth/login', userLogin);
route.post('/auth/logout', verifyToken, userLogout);
route.get('/user/:id', verifyToken, getUserById);
route.put('/user/:id', verifyToken, editUserById);
route.put('/user/change-password/:id', verifyToken, changePassword);

//post router
route.post('/post', verifyToken, createPost);
route.put('/post/:id', verifyToken, updatePost);
route.delete('/post/:id', verifyToken, deletePost);
route.put('/post/like/:id', verifyToken, givingLikeToPost);
route.put('/post/unlike/:id', verifyToken, unlikePost);
route.get('/post', verifyToken, listPost);
route.get('/post/:id', verifyToken, getPostById);

//file router
route.post('/file', verifyToken, uploadImage);

export default route;