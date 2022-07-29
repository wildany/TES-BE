import express from "express";
import dotenv from "dotenv";
import db from "./config/Database.js";
import route from "./routes/route.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";

//untuk generate db.sync
import posts from "./model/Post.js";
import users from "./model/User.js";
import userLiked from "./model/UserLiked.js";
import file from "./model/File.js";


dotenv.config();
const port = process.env.PORT;
const app = express();

try {
    await db.authenticate();
    console.log("Database connected...");

    await db.sync(({ alter: true })); //hapus jika tidak dibutuhkan untuk generate tabel

} catch (error) {
    console.error(error);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());
app.use(route);

app.listen(port, () => {
    console.info(`Server start on port ${port}`);
})