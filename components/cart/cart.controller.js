import CartModel from "../cart/cart.model.js";
import OrderModel from "../order/order.model.js";
import ProductModel from "../product/product.model.js";

const getCartPage = async (req, res) => {
  const { cartId } = req.cart.id;
  try {
    const cartItems = await CartModel.getCartItems(cartId);
    res.render("cart", { cartItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { cartId } = req.cart.id;
    const { movieId } = req.params;
    const { quantity = 1 } = req.body;
    const movie = await ProductModel.getProductById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const price = movie.price;

    await CartModel.addCartItem(cartId, movieId, quantity, price);
    res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { cartId } = req.cart.id;
    const { id } = req.params;
    const { quantity } = req.body;
    const movie = await ProductModel.getProductById(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const updatedCart = await CartModel.updateItem(cartId, id, quantity);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { cartId } = req.cart.id;
    const { id } = req.params;

    const updatedCart = await CartModel.removeItem(cartId, id);
    res.json({ success: true, cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkout = async (req, res) => {
  try {
    const order = await OrderModel.createFromCart(req.user.id);
    await CartModel.clear(req.user.id);
    res.json({ success: true, orderId: order.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getCartPage,
  addToCart,
  updateCartItem,
  removeFromCart,
  checkout,
};