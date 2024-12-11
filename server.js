import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';  // Ensure this line is added

// Get the current file's path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);  // Ensure this is imported and used

import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';  // Import connect-pg-simple correctly
const PgSession = connectPgSimple(session);  // Initialize it by passing `session`

import passport from 'passport';
import pkg from 'pg';  // Import the whole package as `pkg`
const { Pool } = pkg;  // Destructure Pool from `pkg`

import indexRouter from "./components/index/index.router.js";
import authRouter from "./components/auth/auth.router.js";
import productRouter from "./components/product/product.router.js";
import searchRouter from "./components/search/search.router.js";
import profileRouter from "./components/user/user.router.js";
import cartRouter from "./components/cart/cart.router.js";
import orderRoute from './components/order/order.route.js'
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Session middleware
app.use(
    session({
        store: new PgSession({
            pool: pool,
            tableName: "users_session",
        }),
        secret: process.env.SESSION_SECRET, // Secret used to sign the session ID cookie
        resave: false, // Don't save session if unmodified
        saveUninitialized: false, // Don't create session until something stored
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            secure: process.env.NODE_ENV === "production", // Ensure cookies are only used over HTTPS
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        },
        ssl: {
            rejectUnauthorized: false,
        },
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport config
import passportConfig from './configs/passport.js';
passportConfig(passport);  // Use the imported passport configuration

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/auth", authRouter);
app.use("/movies", productRouter);
app.use("/search", searchRouter);
app.use("/profile", profileRouter);
app.use("/cart", cartRouter);
app.use("/", indexRouter);
app.use("/orders", orderRoute);

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => {
    res.render("404");
});
app.listen('3000')
// export default app;
