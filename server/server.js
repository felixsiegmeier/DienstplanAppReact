import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv"
import doctorRouter from "./src/routes/Doctor/doctorRouter.js"
import planRouter from "./src/routes/Plan/planRouter.js"
import wishRouter from "./src/routes/Wish/wishRouter.js"

dotenv.config()
const app = express()
const port = process.env.PORT || 8000

mongoose.connect(process.env.DATABASE, {useNewUrlParser: true})

app.use(cors())
app.use(express.json())


app.use("/doctors", doctorRouter)

app.use("/plans", planRouter)

app.use("/wish", wishRouter)

app.listen(port, () => {
    console.log(`api up an runnung on Port ${port}`)
})