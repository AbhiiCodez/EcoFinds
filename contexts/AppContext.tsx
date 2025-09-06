import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Product, AppContextType, Theme } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { MOCK_PRODUCTS } from '../constants';

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useLocalStorage<User[]>('ecofinds_users', []);
  const [products, setProducts] = useLocalStorage<Product[]>('ecofinds_products', []);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [theme, setTheme] = useLocalStorage<Theme>('ecofinds_theme', 'light');

  useEffect(() => {
    // Seed initial data if none exists
    if (products.length === 0) {
      const initialProducts = MOCK_PRODUCTS.map((p, index) => ({
        ...p,
        id: `prod-${Date.now()}-${index}`,
        sellerId: 'system',
        sellerName: 'EcoFinds Staff',
      }));
      setProducts(initialProducts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const signup = (username: string, email: string, password: string): boolean => {
    if (users.some(u => u.email === email)) {
      return false; // Email already exists
    }
    const newUser: User = { id: `user-${Date.now()}`, username, email, password, cart: [], purchases: [], wishlist: [] };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUser = (updatedUserInfo: Omit<User, 'id' | 'cart' | 'purchases' | 'wishlist'>) => {
    if (!currentUser) return;
    const updatedUsers = users.map(u => 
      u.id === currentUser.id ? { ...u, ...updatedUserInfo } : u
    );
    setUsers(updatedUsers);
    setCurrentUser({ ...currentUser, ...updatedUserInfo });
  };
  
  const addProduct = (productData: Omit<Product, 'id' | 'sellerId' | 'sellerName'>) => {
    if (!currentUser) return;
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.username,
    };
    setProducts([newProduct, ...products]);
  };

  const updateProduct = (productId: string, updatedProductData: Partial<Omit<Product, 'id' | 'sellerId' | 'sellerName'>>) => {
      if (!currentUser) return;
      const productToUpdate = products.find(p => p.id === productId);
      if (productToUpdate?.sellerId !== currentUser.id) return; // Can only edit own products

      setProducts(products.map(p => p.id === productId ? { ...p, ...updatedProductData } : p));
  };

  const deleteProduct = (productId: string) => {
      if (!currentUser) return;
      const productToDelete = products.find(p => p.id === productId);
      if (productToDelete?.sellerId !== currentUser.id) return; // Can only delete own products

      setProducts(products.filter(p => p.id !== productId));
  };

  const addToCart = (productId: string) => {
    if (!currentUser || currentUser.cart.includes(productId)) return;
    const updatedUser = { ...currentUser, cart: [...currentUser.cart, productId] };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const removeFromCart = (productId: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, cart: currentUser.cart.filter(id => id !== productId) };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const getCartItems = (): Product[] => {
    if (!currentUser) return [];
    return products.filter(p => currentUser.cart.includes(p.id));
  };

  const checkout = () => {
    if (!currentUser) return;
    const cartItems = getCartItems();
    const updatedUser: User = {
        ...currentUser,
        cart: [],
        purchases: [...currentUser.purchases, ...cartItems]
    };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    // Remove purchased items from market
    const purchasedIds = new Set(cartItems.map(p => p.id));
    setProducts(products.filter(p => !purchasedIds.has(p.id)));
  };

  const getPurchaseHistory = (): Product[] => {
    return currentUser?.purchases || [];
  };

  const addToWishlist = (productId: string) => {
    if (!currentUser || currentUser.wishlist.includes(productId)) return;
    const updatedUser = { ...currentUser, wishlist: [...currentUser.wishlist, productId] };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const removeFromWishlist = (productId: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, wishlist: currentUser.wishlist.filter(id => id !== productId) };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const getWishlistItems = (): Product[] => {
    if (!currentUser) return [];
    return products.filter(p => currentUser.wishlist.includes(p.id));
  };
  
  const isProductInWishlist = (productId: string): boolean => {
    return currentUser?.wishlist.includes(productId) || false;
  };


  const value = {
    currentUser,
    users,
    products,
    login,
    signup,
    logout,
    updateUser,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    getCartItems,
    checkout,
    getPurchaseHistory,
    addToWishlist,
    removeFromWishlist,
    getWishlistItems,
    isProductInWishlist,
    theme,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};