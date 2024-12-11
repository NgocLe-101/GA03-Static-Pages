

import express from "express";
const router = express.Router();
import ProductModel from "../product/product.model.js";
// Route for initial page rendering with EJS
router.get("/", async (req, res) => {
    const { genre, language, age, rate, price, search, limit } = req.query;
    let filters = {
        genre: genre || "all",
        language: language || "all",
        age: age || "all",
        rate: rate || "all",
        price: price || "",
        search: search || "",
        limit: parseInt(limit) || 10,
    };
    console.log(filters);

    // Fetch movies based on filters
    let movies = await ProductModel.searchProducts(filters);

    // Render the initial page with EJS
    res.render("filter", { movies, filters });
});

// Route for handling AJAX requests (filters and search)
router.get("/results", async (req, res) => {
    const { genre, language, age, rate, price, search } = req.query;
    let filters = {
        genre: genre || "all",
        language: language || "all",
        age: age || "all",
        rate: rate || "all",
        price: price || "",
        search: search || "",
    };

    // Fetch filtered movies based on the parameters
    let movies = await ProductModel.searchProducts(filters);

    // Return filtered movies as JSON for the AJAX request
    res.json({ movies, filters });
});

export default router;
