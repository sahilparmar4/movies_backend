import express, { Express } from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { router } from "./routes/route";
import path from 'path';
import fs from 'fs';

dotenv.config();
import('./db/conn');
const app: Express = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cors())

const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use('/api/uploads', express.static(uploadsDir));

app.use("/api", router)

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});