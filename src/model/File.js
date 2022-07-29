import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const file = db.define('File', {
    url: {
        type: DataTypes.STRING,
    },
    filename: {
        type: DataTypes.STRING
    },
    mimetype: {
        type: DataTypes.STRING
    }
}, {

    freezeTableName: true
})




export default file;