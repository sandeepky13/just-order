import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // Electronics
  {
    id: 'prod-elec-1',
    name: 'Sony WH-1000XM5 ANC Headphones',
    description: 'Industry leading noise canceling wireless headphones with crystal clear hands-free calling and Alexa voice control.',
    price: 349,
    discount: 15,
    rating: 4.8,
    stockStatus: 'In Stock',
    stockCount: 15,
    category: 'Electronics',
    brand: 'Sony',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'prod-elec-2',
    name: '4K Ultra-Wide Curved Monitor 34"',
    description: 'Immersive curved gaming and productivity monitor with HDR400, 144Hz refresh rate, and height-adjustable stand.',
    price: 599,
    discount: 10,
    rating: 4.6,
    stockStatus: 'Low Stock',
    stockCount: 4,
    category: 'Electronics',
    brand: 'LG',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=80'
  },

  // Mobiles
  {
    id: 'prod-mob-1',
    name: 'iPhone 15 Pro Max Titanium',
    description: 'The ultimate titanium iPhone featuring the breakthrough A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
    price: 1199,
    discount: 8,
    rating: 4.9,
    stockStatus: 'In Stock',
    stockCount: 22,
    category: 'Mobiles',
    brand: 'Apple',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'prod-mob-2',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Unleash your creativity with the integrated S Pen, stunning 200MP camera resolution, and AI-powered nightography.',
    price: 1299,
    discount: 12,
    rating: 4.7,
    stockStatus: 'In Stock',
    stockCount: 18,
    category: 'Mobiles',
    brand: 'Samsung',
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=500&q=80'
  },

  // Laptops
  {
    id: 'prod-lap-1',
    name: 'MacBook Pro 16" M3 Max',
    description: 'The absolute powerhouse laptop for creators, developers, and power users. 36GB Unified Memory, 1TB SSD superfast storage.',
    price: 2499,
    discount: 5,
    rating: 4.9,
    stockStatus: 'In Stock',
    stockCount: 8,
    category: 'Laptops',
    brand: 'Apple',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'prod-lap-2',
    name: 'Dell XPS 13 Plus OLED',
    description: 'A masterpiece of compact design. InfinityEdge touch OLED display, 13th Gen Intel Core i7, and minimalist haptic trackpad.',
    price: 1499,
    discount: 10,
    rating: 4.5,
    stockStatus: 'Low Stock',
    stockCount: 3,
    category: 'Laptops',
    brand: 'Dell',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=500&q=80'
  },

  // Accessories
  {
    id: 'prod-acc-1',
    name: 'Anker Magnetic Wireless Charger',
    description: 'MagSafe-compatible wireless charging stand with 15W high-speed charging and a premium metallic weighted base.',
    price: 49,
    discount: 20,
    rating: 4.4,
    stockStatus: 'In Stock',
    stockCount: 50,
    category: 'Accessories',
    brand: 'Anker',
    imageUrl: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=500&q=80'
  },

  // T-Shirts
  {
    id: 'prod-tshirt-1',
    name: 'Supima Cotton Crewneck Tee',
    description: 'Ultra-soft, heavyweight Peruvian Supima cotton T-shirt. Engineered to resist fading, shrinking, and stretching.',
    price: 29,
    discount: 10,
    rating: 4.6,
    stockStatus: 'In Stock',
    stockCount: 120,
    category: 'T-Shirts',
    brand: 'Just Order Basics',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80'
  },

  // Shirts
  {
    id: 'prod-shirt-1',
    name: 'Oxford Button-Down Dress Shirt',
    description: 'Classic fit premium Italian cotton dress shirt. Perfect for business casual looks or evening events.',
    price: 69,
    discount: 15,
    rating: 4.5,
    stockStatus: 'In Stock',
    stockCount: 80,
    category: 'Shirts',
    brand: 'Vincenzo',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80'
  },

  // Footwear & Shoes
  {
    id: 'prod-shoe-1',
    name: 'Handcrafted Leather Oxford Shoes',
    description: 'Timeless luxury oxfords crafted with full-grain Italian calf leather and durable Goodyear-welted soles.',
    price: 199,
    discount: 25,
    rating: 4.8,
    stockStatus: 'In Stock',
    stockCount: 35,
    category: 'Shoes',
    brand: 'Aethelgard',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'prod-foot-1',
    name: 'Cloud Cushion Comfort Footwear',
    description: 'Casual slips-on footwear with an orthotic-grade memory foam insole and responsive high-rebound outsole.',
    price: 79,
    discount: 10,
    rating: 4.3,
    stockStatus: 'In Stock',
    stockCount: 45,
    category: 'Footwear',
    brand: 'CloudWalk',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80'
  },

  // Watches
  {
    id: 'prod-watch-1',
    name: 'Chronograph Minimalist Noir Watch',
    description: 'Sleek matte black stainless steel analog watch with genuine black leather band and Japanese quartz movement.',
    price: 189,
    discount: 30,
    rating: 4.7,
    stockStatus: 'In Stock',
    stockCount: 30,
    category: 'Watches',
    brand: 'Just Order Luxury',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80'
  },

  // Fashion
  {
    id: 'prod-fash-1',
    name: 'Wool Blend Tailored Long Coat',
    description: 'A luxurious classic long coat made of a premium heavy wool blend, featuring detailed inner silk lining and tailored silhouette.',
    price: 249,
    discount: 20,
    rating: 4.7,
    stockStatus: 'In Stock',
    stockCount: 15,
    category: 'Fashion',
    brand: 'Atelier',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80'
  },

  // Home Appliances
  {
    id: 'prod-app-1',
    name: 'HEPA Smart Air Purifier Pro',
    description: 'Advanced medical-grade true HEPA air purifier with intelligent auto-mode, real-time air quality index, and whisper quiet sleep mode.',
    price: 219,
    discount: 15,
    rating: 4.6,
    stockStatus: 'In Stock',
    stockCount: 25,
    category: 'Home Appliances',
    brand: 'PureLife',
    imageUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=500&q=80'
  },

  // Kitchen
  {
    id: 'prod-kit-1',
    name: 'Elite Stainless Steel Chef Knife Set',
    description: 'Premium carbon German steel chef knife set with heavy-weight acacia wooden knife block block. Ergonomic full tang handles.',
    price: 129,
    discount: 10,
    rating: 4.8,
    stockStatus: 'In Stock',
    stockCount: 40,
    category: 'Kitchen',
    brand: 'Wusthof Elite',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=500&q=80'
  },

  // Beauty
  {
    id: 'prod-beau-1',
    name: 'Hydrating Botanical Skin Serum',
    description: 'Nourishing facial elixir blended with organic rosehip, cold-pressed jojoba, and pure hyaluronic acid for natural glow.',
    price: 45,
    discount: 15,
    rating: 4.5,
    stockStatus: 'In Stock',
    stockCount: 95,
    category: 'Beauty',
    brand: 'Lumière',
    imageUrl: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=500&q=80'
  },

  // Books
  {
    id: 'prod-book-1',
    name: 'The Craft of Minimal Design',
    description: 'Hardcover edition. A visual journey into modern aesthetics, spatial composition, and micro-design principles of the 21st century.',
    price: 35,
    discount: 5,
    rating: 4.9,
    stockStatus: 'In Stock',
    stockCount: 60,
    category: 'Books',
    brand: 'Press & Co.',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80'
  },

  // Sports
  {
    id: 'prod-sport-1',
    name: 'Carbon Fiber Smart Tennis Racket',
    description: 'Ultralight aerospace-grade carbon fiber frame. Integrated handle sensors connect with companion app to analyze your swing trajectory.',
    price: 279,
    discount: 12,
    rating: 4.6,
    stockStatus: 'Low Stock',
    stockCount: 2,
    category: 'Sports',
    brand: 'Wilson Tech',
    imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=500&q=80'
  },

  // Furniture
  {
    id: 'prod-furn-1',
    name: 'Mid-Century Modern Velvet Armchair',
    description: 'Elegant accent chair styled with luxurious charcoal grey velvet upholstery, deep seat cushioning, and solid tapered walnut wood legs.',
    price: 399,
    discount: 18,
    rating: 4.7,
    stockStatus: 'In Stock',
    stockCount: 10,
    category: 'Furniture',
    brand: 'Hygge Home',
    imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=500&q=80'
  }
];

export const ALL_CATEGORIES = [
  'Electronics',
  'Mobiles',
  'Laptops',
  'Accessories',
  'T-Shirts',
  'Shirts',
  'Footwear',
  'Shoes',
  'Watches',
  'Fashion',
  'Home Appliances',
  'Kitchen',
  'Beauty',
  'Books',
  'Sports',
  'Furniture'
];
