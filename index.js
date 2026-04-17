import express, { json } from "express";
import router from "./routes/index.route.js";

const PORT = 3000
const app = express()

app.use(json())
app.use(router)

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})