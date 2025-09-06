import { useState, useEffect } from 'react';
import api from '../services/api';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getProducts(filters);
      setProducts(response.products);
      setPagination(response.pagination);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    pagination,
    refetch,
  };
};

export const useFeaturedProducts = (limit = 8) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [limit]);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getFeaturedProducts(limit);
      setProducts(response.products);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    refetch: fetchFeaturedProducts,
  };
};

export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getProduct(id);
      setProduct(response.product);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
};
