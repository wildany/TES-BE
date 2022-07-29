import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import users from "./User.js";

const { DataTypes } = Sequelize;

const posts = db.define('Post', {
    userId: {
        type: DataTypes.INTEGER,
    },
    caption: {
        type: DataTypes.STRING
    },
    tags: {
        type: DataTypes.STRING
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    image: {
        type: DataTypes.STRING
    }
}, {

    freezeTableName: true
})


posts.belongsTo(users, { foreignKey: 'userId', targetKey: "id" });

export default posts;