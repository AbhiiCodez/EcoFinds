const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      console.log('Making API request to:', url);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || 'Something went wrong' };
        }
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API response:', data);
      return data;
    } catch (error) {
      console.error('API Error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Product endpoints
  async getProducts(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/products?${params}`);
  }

  async getFeaturedProducts(limit = 8) {
    return this.request(`/products/featured?limit=${limit}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async addToCart(productId, quantity = 1) {
    return this.request(`/products/${productId}/cart`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    });
  }

  async markAsSold(id) {
    return this.request(`/products/${id}/sold`, {
      method: 'PATCH',
    });
  }

  // Cart endpoints
  async getCart() {
    return this.request('/cart');
  }

  async addCartItem(productId, quantity) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(productId, quantity) {
    return this.request(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeCartItem(productId) {
    return this.request(`/cart/${productId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request('/cart', {
      method: 'DELETE',
    });
  }

  async getCartCount() {
    return this.request('/cart/count');
  }

  async getCartTotal() {
    return this.request('/cart/total');
  }

  // Category endpoints
  async getCategories() {
    return this.request('/categories');
  }

  async getCategory(id) {
    return this.request(`/categories/${id}`);
  }

  async getCategoryProducts(id, page = 1, limit = 20) {
    return this.request(`/categories/${id}/products?page=${page}&limit=${limit}`);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService();
