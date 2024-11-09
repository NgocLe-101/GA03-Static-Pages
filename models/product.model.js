const db = require("../dbs/db");

class ProductModel {
  static createProduct = async ({
    id,
    title,
    description,
    price,
    image_url,
  }) => {
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
  };

  static findOne = async (condition) => {
    try {
      return await db("products").where(condition).first();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static getProductById = async (id) => {
    try {
      return await db("products").where({ id }).first();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  static getAllProducts = async (limit) => {
    try {
      return await db("products").select("*").limit(limit);
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

module.exports = ProductModel;
