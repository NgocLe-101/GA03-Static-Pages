import ProductModel from "../product/product.model.js";

// Hàm tìm kiếm phim và render EJS hoặc trả về JSON
const getMovies = async (req, res) => {
  try {
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

    // Tìm kiếm các bộ phim theo các bộ lọc
    let movies = await ProductModel.searchProducts(filters);

    if (req.xhr || req.headers.accept.indexOf("json") > -1) {
      // Nếu là yêu cầu AJAX (hoặc yêu cầu dữ liệu JSON)
      return res.json({ movies, filters });
    } else {
      // Nếu là yêu cầu render trang đầu tiên (EJS)
      return res.render("filter", { movies, filters });
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    return res.status(500).json({ message: "Error fetching movies", error });
  }
};

export default { getMovies };
