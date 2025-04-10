import { User, Cart, Product, CartProduct } from "../data/database.js";

export const getUserCartProducts = async (req, res) => {
    const userId = parseInt(req.user.id, 10);

    try {
        // Find the user and include the associated Cart and its Products, including the CartProduct attribute "quantity".
        const user = await User.findOne({
            where: { id: userId },
            include: [
                {
                    model: Cart,
                    as: "cart",
                    include: [
                        {
                            model: Product,
                            as: "products",
                            through: {
                                attributes: ["quantity"],
                            },
                        },
                    ],
                },
            ],
        });

        // If no user is found, return a 404.
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // (Optional) If the user exists but the cart hasn't been created.
        if (!user.cart) {
            return res.status(404).json({ message: "Cart not found for the user." });
        }

        // Map through the products to flatten the structure. Each product will now include the quantity at top-level.
        const products = user.cart.products.map((product) => {
            const plainProduct = product.get({ plain: true });
            return {
                id: plainProduct.id,
                name: plainProduct.name,
                price: plainProduct.price,
                quantity: plainProduct.CartProduct.quantity,
            };
        });

        return res.status(200).json({ products });
    } catch (error) {
        console.error("Error retrieving cart products:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const addProductToCart = async (req, res) => {
    const userId = parseInt(req.user.id, 10);
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ message: "productId is required" });
    }

    try {
        // product exists
        const product = await Product.findOne({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // get the cart for the user
        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found for the user." });
        }

        // find the cart product entry (product in the cart)
        let cartProduct = await CartProduct.findOne({
            where: { cartId: cart.id, productId: product.id },
        });
        let isNew = false;

        if (cartProduct) {
            // If it already exists, increment the quantity by one.
            cartProduct.quantity += 1;
            await cartProduct.save();
        } else {
            // Otherwise, create a new entry with a quantity of one.
            cartProduct = await CartProduct.create({
                cartId: cart.id,
                productId: product.id,
                quantity: 1,
            });
            isNew = true;
        }

        const productData = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: cartProduct.quantity,
        };

        if (isNew) {
            return res.status(201).json({
                message: "Product added to the cart.",
                product: productData,
            });
        } else {
            return res.status(200).json({
                message: "Product quantity incremented in the cart.",
                product: productData,
            });
        }
    } catch (error) {
        console.error("Error adding product to cart:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const removeProductFromCart = async (req, res) => {
    const userId = parseInt(req.user.id, 10);
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ message: "productId is required" });
    }

    try {
        // Check if the product exists
        const product = await Product.findOne({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Retrieve the cart for the user.
        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found for the user." });
        }

        // Find the cart product entry (i.e. the product in the cart).
        const cartProduct = await CartProduct.findOne({
            where: { cartId: cart.id, productId: product.id },
        });

        if (!cartProduct) {
            return res.status(404).json({ message: "Product not found in the cart." });
        }

        // If more than one unit exists, decrement the quantity.
        if (cartProduct.quantity > 1) {
            cartProduct.quantity -= 1;
            await cartProduct.save();

            const productData = {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: cartProduct.quantity,
            };

            return res.status(200).json({
                message: "Product quantity decremented in the cart.",
                product: productData,
            });
        } else {
            // Quantity is 1, so remove the entry from the cart entirely.
            await cartProduct.destroy();

            const productData = {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 0,
            };

            return res.status(200).json({
                message: "Product removed from the cart.",
                product: productData,
            });
        }
    } catch (error) {
        console.error("Error removing product from cart:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
