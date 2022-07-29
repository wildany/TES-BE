import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import posts from "./Post.js";
import users from "./User.js";


const { DataTypes } = Sequelize;

const userLiked = db.define('UserLiked', {
    postId: {
        type: DataTypes.INTEGER,
    },
    userId: {
        type: DataTypes.INTEGER,
    },
}, {
    timestamps: false,
    freezeTableName: true
})
userLiked.removeAttribute('id');
userLiked.belongsTo(posts, { foreignKey: 'postId', targetKey: "id" });
userLiked.belongsTo(users, { foreignKey: 'userId', targetKey: "id" });

export default userLiked;