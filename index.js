import express from "express";
const app = express();
import cors from "cors";
const PORT = 4000
import routes from './routes/index.js';

import dbConnection from "./config/dbConnect.js"

app.use(express.json());
app.use(cors());
dbConnection()
app.get('/', (req, res) => {
    res.status(200).send("Welcome to fv bankend")
})


app.use("/api/", routes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});