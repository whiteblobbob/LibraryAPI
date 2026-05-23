import express, { json } from "express";
import router from "./routes/index.route.js";
import logger from "./configs/logger.config.js";

const PORT = 3000
const app = express()

app.use(json())
app.use(router)

app.listen(PORT, () => {
    logger.info(`Listening to port ${PORT}`)
})