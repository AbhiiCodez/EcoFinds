import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { useAppContext } from '../contexts/AppContext';
import { Product } from '../types';
import { CATEGORIES } from '../constants';
import { ProductCard } from '../components/ProductCard';
// FIX: Import UserIcon to be used in the DashboardPage component.
import { BackIcon, PlusIcon, SearchIcon, EditIcon, TrashIcon, LeafIcon, SparklesIcon, UserIcon, HeartIcon, CloseIcon } from '../components/Icons';

// AuthPage Component
export const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, signup } = useAppContext();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        let success = false;
        if (isLogin) {
            success = login(email, password);
            if (!success) setError('Invalid email or password.');
        } else {
            success = signup(username, email, password);
            if (!success) setError('Email already exists.');
        }
        if (success) {
            navigate('/');
        }
    };

    const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400";

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
                <div className="text-center mb-8">
                    <LeafIcon className="w-16 h-16 mx-auto text-primary" />
                    <h2 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">
                        {isLogin ? 'Welcome Back!' : 'Create an Account'}
                    </h2>
                    <p className="text-gray-500 dark:text-slate-400 mt-2">Find and sell amazing pre-loved items.</p>
                </div>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required className={inputClasses} />
                    )}
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClasses} />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className={inputClasses} />
                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 transition duration-300">{isLogin ? 'Log In' : 'Sign Up'}</button>
                </form>
                <p className="text-center mt-6 text-sm">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-primary hover:text-green-700">{isLogin ? 'Sign Up' : 'Log In'}</button>
                </p>
            </div>
        </div>
    );
};

// QuickViewModal Component (for HomePage)
const QuickViewModal: React.FC<{ product: Product, onClose: () => void }> = ({ product, onClose }) => {
    const { currentUser, addToCart, addToWishlist, removeFromWishlist, isProductInWishlist } = useAppContext();
    const navigate = useNavigate();

    const inWishlist = isProductInWishlist(product.id);

    const handleWishlistToggle = () => {
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
    
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
    
        return () => {
          window.removeEventListener('keydown', handleEsc);
          document.body.style.overflow = 'unset';
        };
      }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-4 sm:p-6 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white" aria-label="Close quick view">
                        <CloseIcon className="w-6 h-6"/>
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <img src={product.imageUrl} alt={product.title} className="w-full h-auto max-h-[400px] object-cover rounded-lg" />
                        <div className="flex flex-col">
                            <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full self-start">{product.category}</span>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-3">{product.title}</h2>
                            <p className="text-4xl font-bold text-primary my-4">${product.price.toFixed(2)}</p>
                            <p className="text-gray-700 dark:text-slate-300 leading-relaxed flex-grow">{product.description}</p>
                            <div className="mt-6 space-y-4">
                                <div className="flex items-stretch gap-3">
                                    {currentUser && currentUser.id !== product.sellerId && (
                                        <button
                                            onClick={() => addToCart(product.id)}
                                            className="flex-grow bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 transition duration-300 flex items-center justify-center gap-2"
                                        >
                                            Add to Cart
                                        </button>
                                    )}
                                    {currentUser && (
                                        <button
                                            onClick={handleWishlistToggle}
                                            className={`p-3 border-2 rounded-md transition-colors ${inWishlist ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-300 hover:border-red-500 hover:text-red-500'}`}
                                            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                                        >
                                            <HeartIcon className="w-6 h-6" filled={inWishlist} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// HomePage Component
export const HomePage: React.FC = () => {
    const { products, currentUser } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const navigate = useNavigate();

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, searchTerm, selectedCategory]);

    return (
        <div className="relative">
            {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-slate-100 mb-2">Find Your Next Treasure</h1>
                <p className="text-lg text-gray-500 dark:text-slate-400">Browse thousands of unique second-hand items.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-6 sticky top-20 bg-slate-50 dark:bg-slate-900 py-4 z-10">
                <div className="relative flex-grow">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-800"
                    />
                </div>
                <div className="relative">
                     <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full md:w-auto px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-full appearance-none bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="All">All Categories</option>
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />)}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-xl text-gray-500 dark:text-slate-400">No products found. Try adjusting your search or filters!</p>
                </div>
            )}
             {currentUser && (
                <button
                    onClick={() => navigate('/add')}
                    className="fixed bottom-8 right-8 bg-accent hover:bg-orange-600 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110"
                    aria-label="Add new product"
                >
                    <PlusIcon className="w-8 h-8" />
                </button>
            )}
        </div>
    );
};

// ProductDetailPage Component
export const ProductDetailPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const { products, addToCart, currentUser, isProductInWishlist, addToWishlist, removeFromWishlist } = useAppContext();
    const navigate = useNavigate();
    const product = products.find(p => p.id === productId);

    if (!product) return <NotFoundPage />;

    const inWishlist = isProductInWishlist(product.id);

    const handleWishlistToggle = () => {
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


    return (
        <div>
            <Link to="/" className="flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-primary mb-6">
                <BackIcon className="w-5 h-5" /> Back to listings
            </Link>
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <img src={product.imageUrl} alt={product.title} className="w-full h-auto max-h-[500px] object-cover rounded-lg" />
                    </div>
                    <div>
                        <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full">{product.category}</span>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-3">{product.title}</h1>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">Sold by: {product.sellerName}</p>
                        <p className="text-4xl font-bold text-primary my-4">${product.price.toFixed(2)}</p>
                        <p className="text-gray-700 dark:text-slate-300 leading-relaxed">{product.description}</p>
                         <div className="mt-6 space-y-4">
                            <div className="flex items-stretch gap-3">
                                {currentUser && currentUser.id !== product.sellerId && (
                                    <button
                                        onClick={() => addToCart(product.id)}
                                        className="flex-grow bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 transition duration-300 flex items-center justify-center gap-2"
                                    >
                                        Add to Cart
                                    </button>
                                )}
                                {currentUser && (
                                    <button
                                        onClick={handleWishlistToggle}
                                        className={`p-3 border-2 rounded-md transition-colors ${inWishlist ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-300 hover:border-red-500 hover:text-red-500'}`}
                                        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                                    >
                                        <HeartIcon className="w-6 h-6" filled={inWishlist} />
                                    </button>
                                )}
                            </div>
                            {currentUser && currentUser.id === product.sellerId && (
                                <Link to={`/edit/${product.id}`} className="w-full bg-secondary text-white font-bold py-3 px-4 rounded-md hover:bg-slate-700 transition duration-300 flex items-center justify-center gap-2">
                                    Edit Your Listing
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// AddEditProductPage Component
export const AddEditProductPage: React.FC = () => {
    const { productId } = useParams<{ productId?: string }>();
    const navigate = useNavigate();
    const { products, addProduct, updateProduct, currentUser } = useAppContext();
    const isEditMode = Boolean(productId);
    
    const productToEdit = useMemo(() => isEditMode ? products.find(p => p.id === productId) : null, [products, productId, isEditMode]);

    useEffect(() => {
        if (isEditMode && productToEdit && productToEdit.sellerId !== currentUser?.id) {
            // Prevent editing others' products
            navigate('/my-listings');
        }
    }, [isEditMode, productToEdit, currentUser, navigate]);

    const [title, setTitle] = useState(productToEdit?.title || '');
    const [description, setDescription] = useState(productToEdit?.description || '');
    const [price, setPrice] = useState(productToEdit?.price || 0);
    const [category, setCategory] = useState(productToEdit?.category || CATEGORIES[0]);
    const [imagePreview, setImagePreview] = useState(productToEdit?.imageUrl || '');
    const [formError, setFormError] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [apiError, setApiError] = useState('');
    
    const inputClasses = "mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400";


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        if (!imagePreview) {
            setFormError("Please upload an image for the product.");
            return;
        }

        const productData = { title, description, price, category, imageUrl: imagePreview };
        if (isEditMode && productId) {
            updateProduct(productId, productData);
        } else {
            addProduct(productData);
        }
        navigate('/my-listings');
    };

    const handleGenerateDescription = async () => {
        if (!title) {
            setApiError('Please enter a title first to generate a description.');
            return;
        }
        setIsGenerating(true);
        setApiError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Write a compelling and brief product description for a second-hand item, suitable for an online marketplace called "EcoFinds". The item is in the '${category}' category with the title '${title}'. Keep it under 50 words. Highlight its value and sustainable nature as a pre-loved item. Do not use hashtags.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const text = response.text;
            setDescription(text.trim());

        } catch (error) {
            console.error("AI description generation failed:", error);
            setApiError('Failed to generate description. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };
    
    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-6">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Product Title</label>
                    <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className={inputClasses} />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Description</label>
                        <button
                            type="button"
                            onClick={handleGenerateDescription}
                            disabled={isGenerating || !title}
                            className="flex items-center gap-1 text-sm text-primary hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Generate description with AI"
                        >
                            <SparklesIcon className="w-4 h-4" />
                            {isGenerating ? 'Generating...' : 'Generate with AI'}
                        </button>
                    </div>
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={4} className={inputClasses} />
                    {apiError && <p className="text-sm text-red-600 mt-1">{apiError}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Price ($)</label>
                        <input id="price" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} required min="0" step="0.01" className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Category</label>
                        <select id="category" value={category} onChange={e => setCategory(e.target.value)} required className={inputClasses}>
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Product Image</label>
                    <div className="mt-2">
                        <input 
                            id="image-upload"
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                        />
                    </div>
                    {imagePreview && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 dark:text-slate-300">Image Preview:</p>
                            <img src={imagePreview} alt="Product Preview" className="mt-2 h-48 w-auto rounded-lg object-cover shadow-sm" />
                        </div>
                    )}
                </div>
                {formError && <p className="text-sm text-red-600">{formError}</p>}
                <div className="flex justify-end gap-4 pt-4">
                     <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-md hover:bg-green-700">{isEditMode ? 'Save Changes' : 'Submit Listing'}</button>
                </div>
            </form>
        </div>
    );
};

// MyListingsPage Component
export const MyListingsPage: React.FC = () => {
    const { products, currentUser, deleteProduct } = useAppContext();
    const navigate = useNavigate();
    const myListings = products.filter(p => p.sellerId === currentUser?.id);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">My Listings</h1>
                <button onClick={() => navigate('/add')} className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 flex items-center gap-2">
                    <PlusIcon className="w-5 h-5"/> Add New
                </button>
            </div>
            {myListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {myListings.map(product => (
                        <ProductCard key={product.id} product={product} actions={
                            <>
                                <button onClick={() => navigate(`/edit/${product.id}`)} className="p-2 text-secondary hover:text-blue-600" aria-label={`Edit ${product.title}`}><EditIcon className="w-5 h-5" /></button>
                                <button 
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to permanently delete this listing?')) {
                                            deleteProduct(product.id)
                                        }
                                    }} 
                                    className="p-2 text-secondary hover:text-red-600"
                                    aria-label={`Delete ${product.title}`}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </>
                        } />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow">
                    <p className="text-xl text-gray-500 dark:text-slate-400">You haven't listed any items yet.</p>
                    <button onClick={() => navigate('/add')} className="mt-4 bg-primary text-white font-bold py-2 px-6 rounded-md hover:bg-green-700">List Your First Item</button>
                </div>
            )}
        </div>
    );
};


// DashboardPage Component
export const DashboardPage: React.FC = () => {
    const { currentUser, updateUser } = useAppContext();
    const [username, setUsername] = useState(currentUser?.username || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [isSaved, setIsSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser({ username, email });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    if (!currentUser) return null;
    
    const inputClasses = "mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400";

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-6">User Dashboard</h1>
            <div className="flex items-center space-x-4 mb-8">
                 <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                    <UserIcon className="w-12 h-12 text-primary"/>
                 </div>
                 <div>
                    <h2 className="text-2xl font-semibold">{currentUser.username}</h2>
                    <p className="text-gray-500 dark:text-slate-400">{currentUser.email}</p>
                 </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Username</label>
                    <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Email Address</label>
                    <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClasses} />
                </div>
                 <div className="flex justify-end items-center gap-4">
                    {isSaved && <p className="text-sm text-primary">Changes saved!</p>}
                    <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-md hover:bg-green-700">Save Changes</button>
                </div>
            </form>
        </div>
    );
};

// CartPage Component
export const CartPage: React.FC = () => {
    const { getCartItems, removeFromCart, checkout } = useAppContext();
    const cartItems = getCartItems();
    const navigate = useNavigate();
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

    const handleCheckout = () => {
        checkout();
        alert('Thank you for your purchase!');
        navigate('/purchases');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-6">My Cart</h1>
            {cartItems.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow flex items-center gap-4">
                                <img src={item.imageUrl} alt={item.title} className="w-24 h-24 object-cover rounded-md" />
                                <div className="flex-grow">
                                    <h3 className="font-semibold">{item.title}</h3>
                                    <p className="text-gray-500 dark:text-slate-400 text-sm">{item.category}</p>
                                    <p className="text-primary font-bold mt-1">${item.price.toFixed(2)}</p>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-red-500"><TrashIcon className="w-6 h-6"/></button>
                            </div>
                        ))}
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow sticky top-24">
                            <h2 className="text-xl font-semibold border-b dark:border-slate-700 pb-4">Order Summary</h2>
                            <div className="flex justify-between items-center my-4">
                                <span className="text-gray-600 dark:text-slate-300">Subtotal</span>
                                <span className="font-bold">${totalPrice.toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between items-center my-4 text-lg">
                                <span className="text-gray-900 dark:text-white font-bold">Total</span>
                                <span className="font-extrabold text-primary">${totalPrice.toFixed(2)}</span>
                            </div>
                            <button onClick={handleCheckout} className="w-full bg-accent text-white font-bold py-3 rounded-md hover:bg-orange-600 transition">Checkout</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow">
                    <p className="text-xl text-gray-500 dark:text-slate-400">Your cart is empty.</p>
                    <Link to="/" className="mt-4 inline-block bg-primary text-white font-bold py-2 px-6 rounded-md hover:bg-green-700">Start Shopping</Link>
                </div>
            )}
        </div>
    );
};

// PurchasesPage Component
export const PurchasesPage: React.FC = () => {
    const { getPurchaseHistory } = useAppContext();
    const purchaseHistory = getPurchaseHistory();

    return (
         <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-6">Previous Purchases</h1>
             {purchaseHistory.length > 0 ? (
                <div className="space-y-4">
                    {purchaseHistory.map(item => (
                        <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow flex items-center gap-4">
                            <img src={item.imageUrl} alt={item.title} className="w-20 h-20 object-cover rounded-md" />
                            <div className="flex-grow">
                                <h3 className="font-semibold">{item.title}</h3>
                                <p className="text-gray-500 dark:text-slate-400 text-sm">{item.category}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
                                <p className="text-sm text-gray-500 dark:text-slate-400">Purchased</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow">
                    <p className="text-xl text-gray-500 dark:text-slate-400">You have no past purchases.</p>
                     <Link to="/" className="mt-4 inline-block bg-primary text-white font-bold py-2 px-6 rounded-md hover:bg-green-700">Start Shopping</Link>
                </div>
            )}
        </div>
    );
};

// WishlistPage Component
export const WishlistPage: React.FC = () => {
    const { getWishlistItems } = useAppContext();
    const wishlistItems = getWishlistItems();

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-6">My Wishlist</h1>
            {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlistItems.map(product => <ProductCard key={product.id} product={product} />)}
                </div>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow">
                    <p className="text-xl text-gray-500 dark:text-slate-400">Your wishlist is empty.</p>
                    <p className="text-gray-400 dark:text-slate-500 mt-2">Add items you love to your wishlist to keep track of them.</p>
                    <Link to="/" className="mt-4 inline-block bg-primary text-white font-bold py-2 px-6 rounded-md hover:bg-green-700">Explore Products</Link>
                </div>
            )}
        </div>
    );
};


// NotFoundPage Component
export const NotFoundPage: React.FC = () => (
    <div className="text-center py-20">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-2xl mt-4 text-gray-700 dark:text-slate-200">Page Not Found</p>
        <p className="text-gray-500 dark:text-slate-400 mt-2">Sorry, the page you are looking for does not exist.</p>
        <Link to="/" className="mt-6 inline-block bg-primary text-white font-bold py-3 px-8 rounded-md hover:bg-green-700">Go to Homepage</Link>
    </div>
);