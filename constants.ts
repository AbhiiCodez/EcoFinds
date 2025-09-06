
import { Product } from './types';

export const CATEGORIES = [
  'Electronics',
  'Furniture',
  'Clothing',
  'Books',
  'Home Goods',
  'Toys & Games',
  'Other',
];

export const MOCK_PRODUCTS: Omit<Product, 'id' | 'sellerId' | 'sellerName'>[] = [
    {
      title: 'Vintage Leather Chair',
      description: 'A comfortable and stylish mid-century modern leather chair. Perfect for any living room. Minor wear and tear consistent with age.',
      price: 250,
      category: 'Furniture',
      imageUrl: 'https://picsum.photos/seed/chair/600/400',
    },
    {
      title: 'Retro Gaming Console',
      description: 'Classic gaming console with two controllers and three popular games included. In perfect working condition.',
      price: 120,
      category: 'Electronics',
      imageUrl: 'https://picsum.photos/seed/console/600/400',
    },
    {
      title: 'Designer Denim Jacket',
      description: 'A barely-worn designer denim jacket, size medium. Features custom embroidery on the back.',
      price: 85,
      category: 'Clothing',
      imageUrl: 'https://picsum.photos/seed/jacket/600/400',
    },
    {
      title: 'Hardcover Classic Novels Set',
      description: 'A collection of 10 classic novels in beautiful hardcover editions. Excellent condition.',
      price: 60,
      category: 'Books',
      imageUrl: 'https://picsum.photos/seed/books/600/400',
    },
    {
      title: 'Ceramic Dinnerware Set',
      description: 'A 16-piece ceramic dinnerware set for four. Includes dinner plates, salad plates, bowls, and mugs. No chips or cracks.',
      price: 75,
      category: 'Home Goods',
      imageUrl: 'https://picsum.photos/seed/dishes/600/400',
    },
    {
      title: 'Wooden Chess Set',
      description: 'A beautiful, hand-carved wooden chess set with a foldable board for storage. All pieces included.',
      price: 45,
      category: 'Toys & Games',
      imageUrl: 'https://picsum.photos/seed/chess/600/400',
    },
];
