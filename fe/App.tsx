import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { useAuthStore } from './store/useAuthStore';
import Hero from './components/Hero';
import CategoryChips from './components/CategoryChips';
import ProductCard from './components/ProductCard';
import AIRecommendations from './components/AIRecommendations';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import SearchResultsPage from './components/SearchResultsPage';
import ProductDetailPage from './components/ProductDetailPage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import UserProfilePage from './components/UserProfilePage';
import FavoritesPage from './components/FavoritesPage';
import AISearchPage from './components/AISearchPage';
import AIComparisonPage from './components/AIComparisonPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import { PRODUCTS } from './constants';
import { Product } from './types';
import { productService } from './services/product.service';
import { useCartStore } from './store/useCartStore';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'register' | 'search' | 'product-detail' | 'cart' | 'checkout' | 'user-profile' | 'favorites' | 'ai-search' | 'comparison' | 'reset-password'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [productsLoading, setProductsLoading] = useState(false);

  const storeUser = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [resetToken, setResetToken] = useState<string | null>(null);
  const loadCart = useCartStore((s) => s.loadCart);

  useEffect(() => {
    const m = window.location.pathname.match(/^\/reset-password\/([^/]+)/);
    if (m) {
      setResetToken(m[1]);
      setCurrentView('reset-password');
    }
    // fetch products once on mount
    (async () => {
      try {
        setProductsLoading(true);
        const list = await productService.getAll();
        setProducts(list);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setProductsLoading(false);
      }
    })();

    // load cart (if user logged in)
    (async () => {
      try {
        await loadCart();
      } catch (err) {
        /* ignore */
      }
    })();
  }, []);

  const headerUser = storeUser
    ? { name: storeUser.fullname, avatar: (storeUser as any).thumbnail || (storeUser as any).avatar || '' }
    : null;

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      setSearchQuery(trimmedQuery);

      // Call backend search
      (async () => {
        try {
          setProductsLoading(true);
          const resp = await productService.search(trimmedQuery);
          setSearchResults(resp.products);
        } catch (err) {
          console.error('Search failed', err);
          setSearchResults([]);
        } finally {
          setProductsLoading(false);
          setCurrentView('search');
        }
      })();
    } else {
      setSearchQuery('');
      setSearchResults([]);
      setCurrentView('home');
    }
  };

  const categoryToId: Record<string, number | 'all'> = {
    all: 'all',
    laptop: 6,
    phone: 7,
    tablet: 8,
    audio: 9,
    watch: 10,
  };

  const handleCategorySelect = async (categoryKey: string) => {
    const mapped = categoryToId[categoryKey];
    setProductsLoading(true);
    try {
      if (mapped === 'all') {
        const list = await productService.getAll();
        setProducts(list);
        setCurrentView('home');
      } else {
        const list = await productService.getByCategory(mapped as number);
        setProducts(list);
        setCurrentView('home');
      }
    } catch (err) {
      console.error('Failed to load category products', err);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    window.scrollTo(0, 0);
  };

  const handleLogin = () => {
    // After `LoginPage` calls `useAuthStore.login`, the store will hold the user.
    setCurrentView('home');
  };

  const handleLogout = () => {
    logout();
    setCurrentView('home');
  };

  const FloatingControls = () => {
    if (['login', 'register', 'ai-search'].includes(currentView)) return null;

    // Don't show floating comparison button if we are already on comparison page
    if (currentView === 'comparison') {
      return (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          <button
            onClick={() => setCurrentView('ai-search')}
            className="bg-primary text-[#181811] px-5 py-3 rounded-full shadow-lg shadow-primary/30 flex items-center gap-2 font-bold hover:scale-105 transition-transform"
          >
            <span className="material-symbols-outlined font-variation-filled">auto_awesome</span>
            <span>Hỏi AI</span>
          </button>
        </div>
      )
    }

    return (
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {/* Compare Button */}
        <button
          onClick={() => setCurrentView('comparison')}
          className="bg-white dark:bg-[#2a291c] text-[#181811] dark:text-white px-5 py-3 rounded-full shadow-lg border border-[#e5e5e0] dark:border-[#3a3a2a] flex items-center gap-2 font-bold hover:scale-105 transition-transform hover:border-primary group"
        >
          <span className="material-symbols-outlined">compare_arrows</span>
          <span className="hidden sm:inline">So sánh (2)</span>
        </button>

        {/* AI Search Button */}
        <button
          onClick={() => setCurrentView('ai-search')}
          className="bg-primary text-[#181811] px-5 py-3 rounded-full shadow-lg shadow-primary/30 flex items-center gap-2 font-bold hover:scale-105 transition-transform"
        >
          <span className="material-symbols-outlined font-variation-filled">auto_awesome</span>
          <span>Hỏi AI</span>
        </button>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'login':
        return (
          <LoginPage
            onBack={() => setCurrentView('home')}
            onRegister={() => setCurrentView('register')}
            onLoginSuccess={handleLogin}
          />
        );
      case 'register':
        return (
          <RegisterPage
            onBack={() => setCurrentView('home')}
            onLogin={() => setCurrentView('login')}
          />
        );
      case 'search':
        return (
          <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden transition-colors duration-200 font-display text-[#181811] dark:text-white">
            <div className="layout-container flex h-full grow flex-col">
              <Header
                onLoginClick={() => setCurrentView('login')}
                onCartClick={() => setCurrentView('cart')}
                onUserClick={() => setCurrentView('user-profile')}
                onSearch={handleSearch}
                onAISearchClick={() => setCurrentView('ai-search')}
                initialQuery={searchQuery}
                user={headerUser}
              />
              <main className="flex flex-1 flex-col px-4 md:px-10 lg:px-40 py-6 max-w-[1440px] mx-auto w-full">
                <SearchResultsPage
                  query={searchQuery}
                  results={searchResults}
                  onBack={() => setCurrentView('home')}
                  onSuggestionClick={handleSearch}
                  bestSellers={products}
                  onProductClick={handleProductClick}
                />
              </main>
              <Footer />
            </div>
            <FloatingControls />
          </div>
        );
      case 'product-detail':
        return (
          <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden transition-colors duration-200 font-display text-[#181811] dark:text-white">
            <div className="layout-container flex h-full grow flex-col">
              <Header
                onLoginClick={() => setCurrentView('login')}
                onCartClick={() => setCurrentView('cart')}
                onUserClick={() => setCurrentView('user-profile')}
                onSearch={handleSearch}
                onAISearchClick={() => setCurrentView('ai-search')}
                user={headerUser}
              />
              <main className="flex flex-1 flex-col px-4 md:px-8 py-6 max-w-[1440px] mx-auto w-full">
                {selectedProduct && (
                  <ProductDetailPage
                    product={selectedProduct}
                    onBack={() => setCurrentView('home')}
                    relatedProducts={PRODUCTS}
                    onProductClick={handleProductClick}
                  />
                )}
              </main>
              <Footer />
            </div>
            <FloatingControls />
          </div>
        );
      case 'cart':
        return (
          <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden transition-colors duration-200 font-display text-[#181811] dark:text-white">
            <div className="layout-container flex h-full grow flex-col">
              <Header
                onLoginClick={() => setCurrentView('login')}
                onCartClick={() => setCurrentView('cart')}
                onUserClick={() => setCurrentView('user-profile')}
                onSearch={handleSearch}
                onAISearchClick={() => setCurrentView('ai-search')}
                user={headerUser}
              />
              <CartPage onBack={() => setCurrentView('home')} onCheckout={() => setCurrentView('checkout')} />
              <Footer />
            </div>
          </div>
        );
      case 'checkout':
        return (
          <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden transition-colors duration-200 font-display text-[#181811] dark:text-white">
            <div className="layout-container flex h-full grow flex-col">
              <Header
                onLoginClick={() => setCurrentView('login')}
                onCartClick={() => setCurrentView('cart')}
                onUserClick={() => setCurrentView('user-profile')}
                onSearch={handleSearch}
                onAISearchClick={() => setCurrentView('ai-search')}
                user={headerUser}
              />
              <CheckoutPage onBack={() => setCurrentView('cart')} onComplete={() => setCurrentView('home')} />
              <Footer />
            </div>
          </div>
        );
      case 'user-profile':
        if (!storeUser) {
          // Redirect to login if not logged in
          setCurrentView('login');
          return null;
        }
        return (
          <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f5f5f8] dark:bg-[#101022] overflow-x-hidden transition-colors duration-200 font-display text-[#111118] dark:text-white">
            <div className="layout-container flex h-full grow flex-col">
              <Header
                onLoginClick={() => setCurrentView('login')}
                onCartClick={() => setCurrentView('cart')}
                onUserClick={() => setCurrentView('user-profile')}
                onSearch={handleSearch}
                onAISearchClick={() => setCurrentView('ai-search')}
                user={headerUser}
              />
              <UserProfilePage
                user={headerUser}
                onLogout={handleLogout}
                onBack={() => setCurrentView('home')}
                onFavoritesClick={() => setCurrentView('favorites')}
              />
              <Footer />
            </div>
          </div>
        );
      case 'favorites':
        if (!storeUser) {
          setCurrentView('login');
          return null;
        }
        return (
          <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f5f5f8] dark:bg-[#101022] overflow-x-hidden transition-colors duration-200 font-display text-[#111118] dark:text-white">
            <div className="layout-container flex h-full grow flex-col">
              <Header
                onLoginClick={() => setCurrentView('login')}
                onCartClick={() => setCurrentView('cart')}
                onUserClick={() => setCurrentView('user-profile')}
                onSearch={handleSearch}
                onAISearchClick={() => setCurrentView('ai-search')}
                user={headerUser}
              />
              <FavoritesPage
                onBack={() => setCurrentView('user-profile')}
                onCartClick={() => setCurrentView('cart')}
              />
              <Footer />
            </div>
            <FloatingControls />
          </div>
        );
      case 'ai-search':
        return (
          <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden transition-colors duration-200 font-display text-[#181811] dark:text-white">
            <div className="layout-container flex h-full grow flex-col">
              <Header
                onLoginClick={() => setCurrentView('login')}
                onCartClick={() => setCurrentView('cart')}
                onUserClick={() => setCurrentView('user-profile')}
                onSearch={handleSearch}
                onAISearchClick={() => setCurrentView('ai-search')}
                user={headerUser}
              />
              <AISearchPage />
              <Footer />
            </div>
          </div>
        );
      case 'reset-password':
        return (
          <div className="relative">
            <ResetPasswordPage
              token={resetToken}
              onBack={() => setCurrentView('home')}
              onSuccess={() => setCurrentView('login')}
            />
          </div>
        );
      case 'comparison':
        return (
          <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f9f8fc] dark:bg-[#131022] overflow-x-hidden transition-colors duration-200 font-space text-[#100d1c] dark:text-white">
            <div className="layout-container flex h-full grow flex-col">
              <Header
                onLoginClick={() => setCurrentView('login')}
                onCartClick={() => setCurrentView('cart')}
                onUserClick={() => setCurrentView('user-profile')}
                onSearch={handleSearch}
                onAISearchClick={() => setCurrentView('ai-search')}
                user={headerUser}
              />
              <AIComparisonPage />
              <Footer />
            </div>
            <FloatingControls />
          </div>
        );
      default: // 'home'
        return (
          <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden transition-colors duration-200 font-display text-[#181811] dark:text-white">
            <div className="layout-container flex h-full grow flex-col">
              <Header
                onLoginClick={() => setCurrentView('login')}
                onCartClick={() => setCurrentView('cart')}
                onUserClick={() => setCurrentView('user-profile')}
                onSearch={handleSearch}
                onAISearchClick={() => setCurrentView('ai-search')}
                user={headerUser}
              />

              <main className="flex flex-1 flex-col px-4 md:px-10 lg:px-40 py-6 max-w-[1440px] mx-auto w-full">
                <Hero />

                <CategoryChips onSelect={handleCategorySelect} />

                {/* Best Sellers Section */}
                <div className="flex flex-col gap-6 mb-12">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-[#181811] dark:text-white text-2xl font-bold tracking-tight">Sản phẩm bán chạy</h2>
                    <a
                      className="text-sm font-semibold text-[#8c8b5f] dark:text-[#a0a090] hover:text-primary flex items-center gap-1 transition-colors"
                      href="#"
                    >
                      Xem tất cả
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(productsLoading ? PRODUCTS : products).map((product) => (
                      <ProductCard key={product.id} product={product} onClick={handleProductClick} />
                    ))}
                  </div>
                </div>

                <AIRecommendations />
              </main>

              <Footer />
            </div>
            <FloatingControls />
          </div>
        );
    }
  };

  return renderContent();
};

export default App;