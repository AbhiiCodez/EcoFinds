import { useState, useEffect } from 'react';
import api from '../services/api';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCart();
    fetchCartCount();
    fetchCartTotal();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getCart();
      setCartItems(response.cartItems);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const response = await api.getCartCount();
      setCount(response.count);
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
    }
  };

  const fetchCartTotal = async () => {
    try {
      const response = await api.getCartTotal();
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch cart total:', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setError(null);
      
      await api.addToCart(productId, quantity);
      
      // Refresh cart data
      await Promise.all([fetchCart(), fetchCartCount(), fetchCartTotal()]);
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setError(null);
      
      await api.updateCartItem(productId, quantity);
      
      // Refresh cart data
      await Promise.all([fetchCart(), fetchCartCount(), fetchCartTotal()]);
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setError(null);
      
      await api.removeCartItem(productId);
      
      // Refresh cart data
      await Promise.all([fetchCart(), fetchCartCount(), fetchCartTotal()]);
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      
      await api.clearCart();
      
      // Clear local state
      setCartItems([]);
      setCount(0);
      setTotal(0);
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const refetch = () => {
    fetchCart();
    fetchCartCount();
    fetchCartTotal();
  };

  return {
    cartItems,
    count,
    total,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refetch,
  };
};
