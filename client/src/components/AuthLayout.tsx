
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus, Store } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  type: 'login' | 'register';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, type }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-lg">
                <Store className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Lovable
              </h1>
            </div>
            
            <nav className="flex gap-2">
              <Link
                to="/login"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  type === 'login'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              
              <Link
                to="/register"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  type === 'register'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <UserPlus className="h-4 w-4" />
                Register
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center py-12">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
