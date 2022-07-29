import { Sequelize } from "sequelize";

const db = new Sequelize('social_media', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

export default db;