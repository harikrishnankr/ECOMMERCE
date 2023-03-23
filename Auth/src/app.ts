require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import config from "config";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { AppDataSource } from "./dataSource";
import AppError from "./utils/appError";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
// import validateEnv from "./utils/validateEnv";
import redisClient from "./utils/connectRedis";

AppDataSource.initialize()
  .then(async () => {
    // VALIDATE ENV
    // validateEnv();

    const app = express();

    // TEMPLATE ENGINE

    // MIDDLEWARE

    // 1. Body parser
    app.use(express.json({ limit: "10kb" }));

    // 2. Logger
    if (process.env.NODE_ENV === "development") {
        app.use(morgan("dev"));
    }

    // 3. Cookie Parser
    app.use(cookieParser());

    const whitelist = config.get<string>("origin");
    const corsOptions = {
        origin: function (origin, callback) {
            console.log(origin);
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new AppError(403, 'Not allowed by CORS'))
            }
        },
        credentials: true,
    };

    // 4. Cors
    if (process.env.NODE_ENV === "production") {
        app.use(cors(corsOptions));
    }

    // ROUTES
    app.get("/api/v1/health", (req, res) => {
        res.send("Auth Service is up and running...")
    });
    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/user", userRouter);

    // HEALTH CHECKER
    app.get("/api/healthChecker", async (_, res: Response) => {
        const message = await redisClient.get("try");

        res.status(200).json({
            status: "success",
            message,
        });
    });

    // UNHANDLED ROUTE
    app.all("*", (req: Request, res: Response, next: NextFunction) => {
        next(new AppError(404, `Route ${req.originalUrl} not found`));
    });

    // GLOBAL ERROR HANDLER
    app.use(
        (error: AppError, req: Request, res: Response, next: NextFunction) => {
            error.status = error.status || "error";
            error.statusCode = error.statusCode || 500;

            res
            .status(error.statusCode)
            .json({
                status: error.status,
                message: error.message,
            });
        }
    );

    const port = config.get<number>("port");
    app.listen(port, () => {
        console.log(`Server started on port: ${port}...`);
    });

})
.catch((error) => console.log(error));
