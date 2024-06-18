import express,{urlencoded} from 'express';
import cookieParser from 'cookie-parser';
const app = express();
import cors from "cors";
const PORT = 4000
import routes from './routes/index.js';

import dbConnection from "./config/dbConnect.js"

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Serve static files from the 'public' directory
app.use(express.static(join(__dirname, 'public')));
app.use(express.json());
app.use(urlencoded({ extended: false }));

app.use(cookieParser());
app.use(cors({
    origin: ['https://trust-guru-frontend.vercel.app', "https://www.trustyourguru.com"],
    credentials: true, // Allow cookies to be sent
}));
dbConnection()
app.get('/', (req, res) => {
    res.status(200).send("Welcome to fv bankend")
})


app.use("/api/", routes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});