import express from 'express';
import {configDotenv} from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";

import Logger from "./middleware/logger.mjs";
import router from './routes/routes.mjs';

configDotenv({path: '.env.production'});

const app = express();
const PORT = process.env.PORT || 3000;

// Server settings
app.use(express.json());
app.use(cookieParser('MEOMEO'));
app.use(session({
    secret: 'MEOMEO', saveUninitialized: false, resave: false,
}));

// Middleware
app.use(Logger);

// Router
app.use('/api', router);

app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});