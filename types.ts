export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // Should not be stored long-term, but used for signup/login logic
  cart: string[]; // Array of product IDs
  purchases: Product[];
  wishlist: string[]; // Array of product IDs
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
}

export type Theme = 'light' | 'dark';

export interface AppContextType {
  currentUser: User | null;
  users: User[];
  products: Product[];
  login: (email: string, password: string) => boolean;
  signup: (username: string, email: string, password: string) => boolean;
  logout: () => void;
  updateUser: (updatedUser: Omit<User, 'id' | 'cart' | 'purchases' | 'wishlist'>) => void;
  addProduct: (product: Omit<Product, 'id' | 'sellerId' | 'sellerName'>) => void;
  updateProduct: (productId: string, updatedProduct: Partial<Omit<Product, 'id' | 'sellerId' | 'sellerName'>>) => void;
  deleteProduct: (productId: string) => void;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  getCartItems: () => Product[];
  checkout: () => void;
  getPurchaseHistory: () => Product[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  getWishlistItems: () => Product[];
  isProductInWishlist: (productId: string) => boolean;
  theme: Theme;
  toggleTheme: () => void;
}