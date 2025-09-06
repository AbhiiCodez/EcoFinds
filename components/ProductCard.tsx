import React from 'react';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { HeartIcon, EyeIcon } from './Icons';

interface ProductCardProps {
  product: Product;
  actions?: React.ReactNode;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, actions, onQuickView }) => {
  const navigate = useNavigate();
  const { currentUser, addToWishlist, removeFromWishlist, isProductInWishlist } = useAppContext();
  
  const inWishlist = isProductInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent card click navigation
    if (!currentUser) {
        navigate('/auth');
        return;
    }
    if (inWishlist) {
        removeFromWishlist(product.id);
    } else {
        addToWishlist(product.id);
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent navigation if an action button was clicked
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col group" onClick={handleCardClick}>
      <div className="relative">
        <img className="w-full h-48 object-cover" src={product.imageUrl} alt={product.title} />
        {currentUser && (
            <button 
                onClick={handleWishlistToggle}
                className={`absolute top-2 right-2 rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100 ${inWishlist ? 'text-red-500 bg-white/80' : 'text-gray-600 bg-white/70 hover:text-red-500'}`}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
                <HeartIcon className="w-6 h-6" filled={inWishlist} />
            </button>
        )}
        {onQuickView && (
            <button 
                onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
                className="absolute top-2 left-2 rounded-full p-2 bg-white/70 text-gray-600 hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-300"
                aria-label="Quick view"
            >
                <EyeIcon className="w-6 h-6" />
            </button>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 truncate">{product.title}</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{product.category}</p>
        <div className="mt-4 flex-grow">
          <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
        </div>
        {actions && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-end space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};