import ProductModel from "../product.model.js";

const getDetailPage = async (req, res) => {
  const id = req.params.id;
  const [product, relatedProducts] = await Promise.all([
    ProductModel.getProductById(id),
    ProductModel.getAllProducts(),
  ]);
  const sameCategoryProducts = relatedProducts.filter(
    (otherProduct) => otherProduct.genre === product.genre
  );
  if (sameCategoryProducts.length < 4) {
    sameCategoryProducts.push(
      ...relatedProducts.sort((a, b) => b.rating - a.rating)
    );
  }
  res.render("detail", {
    movie: product,
    relatedMovies: relatedProducts
      .filter((product) => product.id != id)
      .slice(0, 4)
      .map((product) => ({
        ...product,
        rating: Math.round(product.rating / 2),
      })),
  }); // Render detail page
};

export default { getDetailPage };
