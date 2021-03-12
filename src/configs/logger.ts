import morgan from "morgan";
import fs from "fs";
import path from "path";

const fileName = "../logs/access-" + Date.now() + ".log";
const accessLogStream = fs.createWriteStream(path.join(__dirname, fileName), { flags: "a" });

export default morgan("short", { stream: accessLogStream });