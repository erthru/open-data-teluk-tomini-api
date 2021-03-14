import express from "express";
import cors from "cors";
import routes from "./routes";
import * as environments from "./helpers/environments";
import { createServer } from "http";
import db from "./configs/db";
import logger from "./configs/logger";

const app = express();
const PORT = environments.PORT;

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cors());
app.use(routes);

const server = createServer(app);

export default server.listen(PORT, async () => {
    await db();

    if (process.env.NODE_ENV !== "test") {
        console.log("⚡️[DATABASE]: CONNECTED");
        console.log("⚡️[SERVER]: RUNNING");
        console.log(`⚡️[PORT]: ${PORT}`);
        console.log("⚡️[MESSAGE]: エブリシングOK、頑張ってねー、エルトホルくん。ヽ(o＾▽＾o)ノ");
    }
});
