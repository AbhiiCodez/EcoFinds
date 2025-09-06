import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { CartIcon, UserIcon, LogoutIcon, LeafIcon, MoonIcon, SunIcon } from './Icons';

const Header: React.FC = () => {
    const { currentUser, logout, getCartItems, theme, toggleTheme } = useAppContext();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const cartItemCount = getCartItems().length;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const activeLinkStyle = {
      fontWeight: 'bold',
      color: '#16a34a' // primary color
    };

    return (
        <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <NavLink to="/" className="flex items-center space-x-2 text-2xl font-bold text-primary">
                            <LeafIcon className="w-8 h-8"/>
                            <span>EcoFinds</span>
                        </NavLink>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <NavLink to="/" className="text-gray-500 dark:text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Shop</NavLink>
                            {currentUser && (
                                <>
                                    <NavLink to="/my-listings" className="text-gray-500 dark:text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>My Listings</NavLink>
                                    <NavLink to="/purchases" className="text-gray-500 dark:text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Purchases</NavLink>
                                    <NavLink to="/wishlist" className="text-gray-500 dark:text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Wishlist</NavLink>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center">
                         <div className="hidden md:flex items-center space-x-4">
                             <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-gray-400 hover:text-primary focus:outline-none"
                                aria-label="Toggle dark mode"
                            >
                                {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                            </button>
                            {currentUser ? (
                                <>
                                    <NavLink to="/cart" className="relative p-1 rounded-full text-gray-400 hover:text-primary focus:outline-none">
                                        <span className="sr-only">View cart</span>
                                        <CartIcon className="h-6 w-6" />
                                        {cartItemCount > 0 && <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-accent text-white text-xs flex items-center justify-center">{cartItemCount}</span>}
                                    </NavLink>
                                    <NavLink to="/dashboard" className="p-1 rounded-full text-gray-400 hover:text-primary focus:outline-none">
                                        <UserIcon className="h-6 w-6" />
                                    </NavLink>
                                    <button onClick={handleLogout} className="p-1 rounded-full text-gray-400 hover:text-primary focus:outline-none">
                                        <LogoutIcon className="h-6 w-6" />
                                    </button>
                                </>
                            ) : (
                                <NavLink to="/auth" className="text-gray-500 dark:text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Login/Sign Up</NavLink>
                            )}
                        </div>
                        <div className="-mr-2 flex md:hidden">
                             <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-gray-400 hover:text-primary focus:outline-none"
                                aria-label="Toggle dark mode"
                            >
                                {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                            </button>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary focus:outline-none">
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <NavLink to="/" className="text-gray-500 dark:text-gray-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium" onClick={()=>setIsMenuOpen(false)}>Shop</NavLink>
                        {currentUser && (
                          <>
                            <NavLink to="/my-listings" className="text-gray-500 dark:text-gray-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium" onClick={()=>setIsMenuOpen(false)}>My Listings</NavLink>
                            <NavLink to="/purchases" className="text-gray-500 dark:text-gray-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium" onClick={()=>setIsMenuOpen(false)}>Purchases</NavLink>
                            <NavLink to="/wishlist" className="text-gray-500 dark:text-gray-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium" onClick={()=>setIsMenuOpen(false)}>Wishlist</NavLink>
                            <NavLink to="/cart" className="text-gray-500 dark:text-gray-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium" onClick={()=>setIsMenuOpen(false)}>Cart</NavLink>
                            <NavLink to="/dashboard" className="text-gray-500 dark:text-gray-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium" onClick={()=>setIsMenuOpen(false)}>Dashboard</NavLink>
                            <button onClick={() => {handleLogout(); setIsMenuOpen(false);}} className="text-gray-500 dark:text-gray-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left">Logout</button>
                          </>
                        )}
                         {!currentUser && (
                            <NavLink to="/auth" className="text-gray-500 dark:text-gray-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium" onClick={()=>setIsMenuOpen(false)}>Login/Sign Up</NavLink>
                         )}
                    </div>
                </div>
            )}
        </header>
    );
};


export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} EcoFinds. All rights reserved.
        </div>
      </footer>
    </div>
  );
};