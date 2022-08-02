const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const userRouter = require("./routes/userRoute");
const recordRouter = require("./routes/recordRoute")
const connectDB = require("./db/connect");

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI

//middlewares
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/record", recordRouter)


const start = async () => {
    try {
        await connectDB(MONGO_URI);
        app.listen(PORT, () => console.log(`server is listing on port : ${PORT}`))
    } catch (err) {
        console.log(err);
    }

}

start();
