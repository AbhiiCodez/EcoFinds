import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthPage, HomePage, ProductDetailPage, AddEditProductPage, MyListingsPage, DashboardPage, CartPage, PurchasesPage, WishlistPage, NotFoundPage } from './pages/Pages';
import { useAppContext } from './contexts/AppContext';

// A wrapper for routes that require authentication.
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAppContext();
  const location = useLocation();

  if (!currentUser) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they
    // log in, which is a nicer user experience than dropping them off on the home page.
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};


function App() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />

        {/* Protected Routes */}
        <Route path="/add" element={
          <ProtectedRoute>
            <AddEditProductPage />
          </ProtectedRoute>
        } />
        <Route path="/edit/:productId" element={
          <ProtectedRoute>
            <AddEditProductPage />
          </ProtectedRoute>
        } />
        <Route path="/my-listings" element={
          <ProtectedRoute>
            <MyListingsPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        } />
        <Route path="/purchases" element={
          <ProtectedRoute>
            <PurchasesPage />
          </ProtectedRoute>
        } />
        <Route path="/wishlist" element={
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        } />

        {/* Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default App;