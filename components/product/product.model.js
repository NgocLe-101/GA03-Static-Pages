import db from "../../dbs/db.js";

const ProductModel = {
  createProduct: async ({ id, title, description, price, image_url }) => {
    try {
      const [productId] = await db("products").insert({
        id,
        title,
        description,
        price,
        image_url,
      });
      return productId;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  findOne: async (condition) => {
    try {
      return await db("products")
        .join("product_images", "products.id", "=", "product_images.product_id")
        .where(condition)
        .first();
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getProductById: async (id) => {
    try {
      return await db("products")
        .join("product_images", "products.id", "=", "product_images.product_id")
        .where("products.id", id) // Fully qualify the "id" column here
        .first();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getAllProducts: async (skip = 0, limit = 20) => {
    // Default limit is set to 20
    try {
      // Get total number of products for pagination
      const totalQuery = db("products").count({ total: "*" }).first();

      // Base query to fetch products and their images
      let query = db("products")
        // .select("products.*")
        .select("products.*");
      const images = await db("product_images").select("*");
      // Apply pagination if `limit` is provided
      if (limit) {
        query = query.limit(limit).offset(skip);
      }

      // Run both queries in parallel
      const [totalResult, products] = await Promise.all([totalQuery, query]);
      // Return the total count and products list
      return {
        total: totalResult.total,
        products: products.map((product) => {
          return {
            ...product,
            image_url: images.find((image) => image.product_id === product.id)
              .image_url,
          };
        }),
      };
    } catch (error) {
      // Log the error and rethrow with a specific message
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products. Please try again later.");
    }
  },

  searchProducts: async (filters = {}) => {
    try {
      let query = db("products")
        .select(
          "products.*",
          "genres.name as genre_name",
          "age_ratings.name as age_rating_name",
          "languages.name as language_name",
          "product_images.image_url"
        )
        .join("product_images", "products.id", "=", "product_images.product_id")
        .join("genres", "products.genre", "=", "genres.id")
        .join("age_ratings", "products.age_rating", "=", "age_ratings.id")
        .join("languages", "products.language", "=", "languages.id");
      console.log(filters.search);
      console.log(filters.genre);
      // Kiểm tra các giá trị trong filters và áp dụng bộ lọc tương ứng
      if (filters.search) {
        // Sử dụng ilike để kiểm tra các trường hợp khác nhau (viết hoa, viết thường)
        query = query.where("products.title", "ilike", `%${filters.search}%`);
      }
      // Không có trường title nên không cần xử lý
      //   if (filters.title) {
      //     query = query.where("products.title", "ilike", `%${filters.title}%`);
      //   }

      if (filters.description) {
        query = query.where(
          "products.description",
          "like",
          `%${filters.description}%`
        );
      }

      if (filters.price) {
        query = query.where("products.price", ">=", filters.price);
      }

      if (filters.image_url) {
        query = query.where(
          "products.image_url",
          "like",
          `%${filters.image_url}%`
        );
      }

      // Áp dụng bộ lọc cho genre nếu không phải là 'all'
      if (filters.genre && filters.genre !== "all") {
        query = query.where("genres.name", "like", `%${filters.genre}%`);
      }

      // Áp dụng bộ lọc cho age_rating nếu không phải là 'all'
      if (filters.age && filters.age !== "all") {
        query = query.where("age_ratings.name", "like", `%${filters.age}%`);
      }

      // Áp dụng bộ lọc cho language nếu không phải là 'all'
      if (filters.language && filters.language !== "all") {
        query = query.where("languages.name", "like", `%${filters.language}%`);
      }

      // Áp dụng limit nếu có
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      // Thực hiện truy vấn và trả về kết quả
      const results = await query;
      return results;
    } catch (error) {
      console.error("Error while searching products:", error); // Thêm thông báo lỗi chi tiết
      throw new Error(error.message); // Trả về lỗi với thông báo chi tiết
    }
  },
  getProductsByGenre: async (genre, skip = 0, limit = null) => {
    try {
      const totalQuery = db("products as p")
        .join("product_images", "products.id", "=", "product_images.product_id")
        .join("genres as g", "p.genre", "=", "g.id")
        .where("g.name", "ilike", `%${genre}%`)
        .count({ total: "*" })
        .first();

      let query = db("products as p")
        .join("product_images", "products.id", "=", "product_images.product_id")
        .join("genres as g", "p.genre", "=", "g.id")
        .select("p.*", "g.name as genre_name")
        .where("g.name", "ilike", `%${genre}%`)
        .orderBy("p.rating", "DESC");

      if (limit) {
        query = query.limit(limit).offset(skip);
      }

      const [totalResult, products] = await Promise.all([totalQuery, query]);
      return { total: totalResult.total, products };
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export default ProductModel;
