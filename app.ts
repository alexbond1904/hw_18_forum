import 'reflect-metadata';
import express, {Application} from 'express';
import {useExpressServer} from "routing-controllers";
import PostController from "./forum/controllers/PostController";
import dotenv from 'dotenv';
import * as mongoose from "mongoose";
import {CustomErrorHandler} from "./forum/middlware/CustomErrorHandler";
import UserController from "./accounting/controllers/UserController";

dotenv.config();

mongoose.connect(process.env.MONGO_URI!, {dbName:'forum'})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) =>{
        console.error('MongoDb connection error: ' + err);
        process.exit(1);
    })

const app: Application = express();
const PORT = 8080;

app.use(express.json());


useExpressServer(app, {
    controllers: [PostController, UserController],
    middlewares: [CustomErrorHandler],
    defaultErrorHandler: false
})


async function startServer() {
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
    })
}

startServer().catch(console.error);