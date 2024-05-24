import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import cookieSession from "cookie-session";
import requestIp from "request-ip";
import connectDB from "./config/database.config.js";
import { log, rateLimiter, notFound, errorHandler } from "./middlewares/index.js";
import API from "./routes/index.js";

// initialize environment variables
dotenv.config();

// initialize express app
const app = express();

// connect to database
connectDB();

// set port
const PORT = process.env.PORT || 5005;

// initialize http server
const httpServer = createServer(app);

// set up middlewares
app.use(requestIp.mw());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieSession({
  name: 'session',
  keys: [process.env.COOKIE_KEY],
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
}));
app.use(cors({ origin: "*", credentials: true }));
app.use(rateLimiter);

app.get('/', (req, res) => res.json({ message: `${process.env.APP_NAME} - API`, data: null }));

app.use(log);
new API(app).registerGroups();
app.use(notFound);
app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold);
});
