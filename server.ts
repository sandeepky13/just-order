import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Database, SEED_CATEGORIES } from "./server/db-adapter.js";

const JWT_SECRET = process.env.JWT_SECRET || "just-order-secret-key-2026";
const PORT = 3000;

async function startServer() {
  // Initialize Database Adapter
  await Database.initialize();

  const app = express();
  app.use(express.json());

  // Middleware to extract user from JWT
  const authenticateToken = async (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      req.user = null;
      return next();
    }

    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = await Database.getUserById(decoded.userId);
      req.user = user;
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  };

  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    next();
  };

  app.use(authenticateToken);

  // Helper to get client info for analytics
  const getClientInfo = (req: any) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "";
    
    // Simple browser detection
    let browser = "Other";
    if (userAgent.includes("Chrome")) browser = "Chrome";
    else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari";
    else if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Edg")) browser = "Edge";

    // Simple device detection
    let device = "Desktop";
    if (/Mobi|Android|iPhone/i.test(userAgent)) device = "Mobile";
    else if (/Tablet|iPad/i.test(userAgent)) device = "Tablet";

    return { ip: typeof ip === "string" ? ip : ip[0], browser, device };
  };

  // --- Auth APIs ---

  // Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { fullName, email, mobile, address, password, confirmPassword, state } = req.body;

      // Validate fields
      if (!fullName || !email || !mobile || !address || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
      }

      // Check existing user
      const existingEmail = await Database.findUserByEmailOrMobile(email);
      if (existingEmail) {
        return res.status(400).json({ error: "A user with this email already exists" });
      }

      const existingMobile = await Database.findUserByEmailOrMobile(mobile);
      if (existingMobile) {
        return res.status(400).json({ error: "A user with this mobile number already exists" });
      }

      // Hash password and store
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await Database.createUser(fullName, email, mobile, passwordHash, address, state || "Delhi");

      // Generate token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

      // Track registration
      const info = getClientInfo(req);
      await Database.logUserEvent(user.id, "Register", "/", 0, info.device, info.browser);

      res.status(201).json({ token, user: { id: user.id, fullName: user.fullName, email: user.email, mobile: user.mobile, address: user.address, state: user.state } });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error during registration" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { identifier, password } = req.body; // identifier can be email or mobile

      if (!identifier || !password) {
        return res.status(400).json({ error: "Email/Mobile and password are required" });
      }

      const user = await Database.findUserByEmailOrMobile(identifier);
      if (!user) {
        return res.status(401).json({ error: "Invalid Email/Mobile or Password" });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid Email/Mobile or Password" });
      }

      // Successful login
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

      // Log event
      const info = getClientInfo(req);
      await Database.logUserEvent(user.id, "Login", "/dashboard", 0, info.device, info.browser);

      res.json({ token, user: { id: user.id, fullName: user.fullName, email: user.email, mobile: user.mobile, address: user.address, state: user.state } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error during login" });
    }
  });

  // Get Profile/State Info
  app.get("/api/auth/me", requireAuth, async (req: any, res) => {
    try {
      const cart = await Database.getCartItems(req.user.id);
      const wishlist = await Database.getWishlist(req.user.id);
      const orders = await Database.getOrders(req.user.id);

      res.json({
        user: {
          id: req.user.id,
          fullName: req.user.fullName,
          email: req.user.email,
          mobile: req.user.mobile,
          address: req.user.address,
          state: req.user.state || "Delhi",
          createdAt: req.user.createdAt
        },
        cart,
        wishlist,
        orders
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch profile details" });
    }
  });

  // --- E-Commerce Products & Categories ---

  // Get Categories
  app.get("/api/categories", (req, res) => {
    res.json(SEED_CATEGORIES);
  });

  // Get Products
  app.get("/api/products", async (req: any, res: any) => {
    try {
      const search = req.query.search as string || "";
      const category = req.query.category as string || "";

      const products = await Database.getProducts(search, category);

      // Track Search Analytics
      if (search) {
        const info = getClientInfo(req);
        const userId = req.user ? req.user.id : null;
        await Database.logSearch(userId, search, info.ip, info.device, info.browser, category || "All");
      }

      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get Single Product & Track Click Analytics
  app.get("/api/products/:id", async (req: any, res: any) => {
    try {
      const product = await Database.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Track click event automatically
      const info = getClientInfo(req);
      const userId = req.user ? req.user.id : null;
      await Database.logClick(
        userId,
        product.id,
        product.name,
        product.category,
        "View Detail",
        `/product/${product.id}`,
        info.ip,
        info.device,
        info.browser
      );

      res.json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch product details" });
    }
  });

  // --- Cart Management ---

  app.get("/api/cart", requireAuth, async (req: any, res) => {
    try {
      const cart = await Database.getCartItems(req.user.id);
      res.json(cart);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", requireAuth, async (req: any, res) => {
    try {
      const { productId, quantity } = req.body;
      if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
      }

      const item = await Database.addToCart(req.user.id, productId, quantity || 1);

      // Log behavior event
      const info = getClientInfo(req);
      await Database.logClick(
        req.user.id,
        productId,
        item.product?.name || "Product",
        item.product?.category || "Unknown",
        "Add to Cart",
        "/products",
        info.ip,
        info.device,
        info.browser
      );

      res.status(201).json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/:id", requireAuth, async (req: any, res) => {
    try {
      const { quantity } = req.body;
      if (quantity === undefined || quantity <= 0) {
        return res.status(400).json({ error: "Valid quantity is required" });
      }

      const item = await Database.updateCartItem(req.user.id, req.params.id, quantity);
      if (!item) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      // Log cart update
      const info = getClientInfo(req);
      await Database.logClick(
        req.user.id,
        item.productId,
        item.product?.name || "Product",
        item.product?.category || "Unknown",
        `Quantity set to ${quantity}`,
        "/cart",
        info.ip,
        info.device,
        info.browser
      );

      res.json(item);
    } catch (err) {
      res.status(500).json({ error: "Failed to update quantity" });
    }
  });

  app.delete("/api/cart/:id", requireAuth, async (req: any, res) => {
    try {
      const success = await Database.removeCartItem(req.user.id, req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      res.json({ message: "Item removed from cart" });
    } catch (err) {
      res.status(500).json({ error: "Failed to remove item" });
    }
  });

  app.delete("/api/cart", requireAuth, async (req: any, res) => {
    try {
      await Database.clearCart(req.user.id);
      res.json({ message: "Cart cleared successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to clear cart" });
    }
  });

  // --- Wishlist Management ---

  app.get("/api/wishlist", requireAuth, async (req: any, res) => {
    try {
      const items = await Database.getWishlist(req.user.id);
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch wishlist" });
    }
  });

  app.post("/api/wishlist", requireAuth, async (req: any, res) => {
    try {
      const { productId } = req.body;
      if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
      }

      const { added } = await Database.toggleWishlist(req.user.id, productId);
      const product = await Database.getProductById(productId);

      // Click log
      const info = getClientInfo(req);
      await Database.logClick(
        req.user.id,
        productId,
        product?.name || "Product",
        product?.category || "Unknown",
        added ? "Add to Wishlist" : "Remove from Wishlist",
        "/products",
        info.ip,
        info.device,
        info.browser
      );

      res.json({ added, message: added ? "Added to Wishlist" : "Removed from Wishlist" });
    } catch (err) {
      res.status(500).json({ error: "Failed to toggle wishlist" });
    }
  });

  // --- Checkout & Orders ---

  app.post("/api/orders", requireAuth, async (req: any, res) => {
    try {
      const { items, amount } = req.body; // Array of { productId, name, price, quantity }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Cart items are required to place an order" });
      }

      const order = await Database.createOrder(req.user.id, items, amount);

      // Clear the user's cart on successful checkout
      await Database.clearCart(req.user.id);

      // Log behavior event
      const info = getClientInfo(req);
      for (const item of items) {
        await Database.logClick(
          req.user.id,
          item.productId,
          item.name,
          "E-commerce Checkout",
          "Order Completed",
          "/checkout",
          info.ip,
          info.device,
          info.browser
        );
      }

      res.status(201).json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders", requireAuth, async (req: any, res) => {
    try {
      const orders = await Database.getOrders(req.user.id);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders/:id/cancel", requireAuth, async (req: any, res) => {
    try {
      const { reason } = req.body || { reason: "Customer Cancelled" };
      const success = await Database.cancelOrder(req.user.id, req.params.id, reason);
      if (!success) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json({ message: "Order cancelled successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to cancel order" });
    }
  });

  app.post("/api/orders/:id/return", requireAuth, async (req: any, res) => {
    try {
      const { reason } = req.body || { reason: "Defective item" };
      const success = await Database.returnOrder(req.user.id, req.params.id, reason);
      if (!success) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json({ message: "Order returned request filed" });
    } catch (err) {
      res.status(500).json({ error: "Failed to return order" });
    }
  });

  // --- General Telemetry API ---

  app.post("/api/analytics/click", async (req: any, res: any) => {
    try {
      const { productId, productName, category, buttonClicked, pageUrl } = req.body;
      const info = getClientInfo(req);
      const userId = req.user ? req.user.id : null;

      if (productId && productName && category && buttonClicked) {
        await Database.logClick(userId, productId, productName, category, buttonClicked, pageUrl || "/", info.ip, info.device, info.browser);
      }
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: "Failed to log event" });
    }
  });

  app.post("/api/analytics/page-visit", async (req: any, res: any) => {
    try {
      const { pageUrl } = req.body;
      const info = getClientInfo(req);
      const userId = req.user ? req.user.id : null;

      if (pageUrl) {
        await Database.logUserEvent(userId, "PageVisit", pageUrl, 0, info.device, info.browser);
      }
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: "Failed to log event" });
    }
  });

  // --- Admin Analytics Reports API ---
  app.get("/api/admin/analytics", async (req, res) => {
    try {
      const report = await Database.getAdminAnalytics();
      res.json(report);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to load dashboard report" });
    }
  });

  // Dev server & Frontend serve logic
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server and Vite frontend running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Critical server bootstrap failure", err);
});
