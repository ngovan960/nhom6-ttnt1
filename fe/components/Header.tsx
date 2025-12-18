import React, { useState, useEffect, useRef } from 'react';
import { productService } from '../services/product.service';
import { Product } from '../types';

export interface User {
  name: string;
  avatar: string;
}

interface HeaderProps {
  onLoginClick: () => void;
  onCartClick: () => void;
  onUserClick: () => void;
  onSearch: (query: string) => void;
  onAISearchClick?: () => void;
  initialQuery?: string;
  user?: User | null;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onCartClick, onUserClick, onSearch, onAISearchClick, initialQuery = '', user }) => {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<{ type: 'keyword' | 'product' | 'category'; text: string; product?: Product }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  const onInputChange = (v: string) => {
    setQuery(v);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!v.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    // debounce
    debounceRef.current = window.setTimeout(async () => {
      try {
        const resp = await productService.suggest(v.trim());
        const kws = (resp.keywords || []).slice(0, 6).map((k: string) => ({ type: 'keyword' as const, text: k }));
        const prods = (resp.products || []).slice(0, 6).map((p: Product) => ({ type: 'product' as const, text: p.name, product: p }));
        const cats = (resp.categories || []).slice(0, 4).map((c: any) => ({ type: 'category' as const, text: c.name || c }));
        setSuggestions([...kws, ...prods, ...cats].slice(0, 8));
        setShowSuggestions(true);
      } catch (err) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e5e5e0] dark:border-[#3a392a] bg-white/90 dark:bg-[#1f1e0d]/90 backdrop-blur-md px-4 py-3 md:px-10 transition-colors duration-200">
      <div className="flex items-center gap-4 md:gap-8 w-full">
        {/* Logo */}
        <div className="flex items-center gap-2 text-[#181811] dark:text-white shrink-0 cursor-pointer" onClick={() => window.location.href = '/'}>
          <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-[#181811]">
            <span className="material-symbols-outlined">bolt</span>
          </div>
          <h2 className="hidden md:block text-lg font-bold leading-tight tracking-[-0.015em]">TechZone</h2>
        </div>

        {/* Search Bar */}
        <label className="flex flex-col min-w-0 max-w-[600px] flex-1 h-12 relative group">
          <div ref={containerRef} className="flex w-full flex-1 items-center rounded-full bg-[#f5f5f0] dark:bg-[#343323] overflow-hidden transition-all group-focus-within:ring-2 ring-primary/50 relative">
            <div className="flex items-center justify-center pl-4 text-[#8c8b5f] dark:text-[#a0a090]">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              value={query}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex w-full min-w-0 flex-1 bg-transparent border-none focus:ring-0 text-[#181811] dark:text-white placeholder:text-[#8c8b5f] px-3 text-base font-normal h-full outline-none"
              placeholder="Tìm laptop, điện thoại, phụ kiện…"
            />
            {query && (
              <button
                onClick={handleClear}
                className="flex items-center justify-center px-2 text-[#8c8b5f] hover:text-[#181811] dark:hover:text-white transition-colors"
                title="Clear search"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
            <button
              onClick={onAISearchClick}
              className="flex items-center justify-center pr-4 text-primary cursor-pointer hover:brightness-110 transition-transform hover:scale-110"
              title="AI Search"
            >
              <span className="material-symbols-outlined">auto_awesome</span>
            </button>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#1b1b12] border border-[#e6e6db] dark:border-[#3a3a2a] rounded-lg shadow-lg z-40 max-h-64 overflow-auto">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setShowSuggestions(false);
                      if (s.type === 'product' && s.product) {
                        onSearch(s.product.name);
                      } else {
                        onSearch(s.text);
                      }
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-[#2a2a1f] flex items-center gap-3"
                  >
                    {s.type === 'product' && s.product?.image ? (
                      <img src={s.product.image} alt={s.text} className="w-8 h-8 object-contain rounded" />
                    ) : (
                      <span className="material-symbols-outlined text-[18px] text-[#8c8b5f]">search</span>
                    )}
                    <span className="truncate">{s.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </label>

        {/* Nav Actions */}
        <div className="flex flex-1 justify-end gap-4 shrink-0">
          <div className="hidden lg:flex items-center gap-6">
            <a className="text-[#181811] dark:text-[#e0e0d0] text-sm font-medium hover:text-primary transition-colors" href="#">Laptop</a>
            <a className="text-[#181811] dark:text-[#e0e0d0] text-sm font-medium hover:text-primary transition-colors" href="#">Điện thoại</a>
            <a className="text-[#181811] dark:text-[#e0e0d0] text-sm font-medium hover:text-primary transition-colors" href="#">Tablet</a>
            <a className="text-[#181811] dark:text-[#e0e0d0] text-sm font-medium hover:text-primary transition-colors" href="#">Khuyến mãi</a>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCartClick}
              className="flex items-center justify-center rounded-full size-10 bg-[#f5f5f0] dark:bg-[#343323] text-[#181811] dark:text-white hover:bg-primary hover:text-black transition-colors relative"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              <span className="absolute top-1 right-1 size-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#343323]"></span>
            </button>

            {user ? (
              <button
                onClick={onUserClick}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-[#f5f5f0] dark:bg-[#343323] text-[#181811] dark:text-white hover:bg-primary/20 transition-all border border-transparent hover:border-primary/50"
              >
                <div
                  className="size-8 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${user.avatar}')` }}
                ></div>
                <span className="text-sm font-medium hidden sm:block truncate max-w-[100px]">Hi, {user.name.split(' ').pop()}</span>
              </button>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center justify-center rounded-full size-10 bg-[#f5f5f0] dark:bg-[#343323] text-[#181811] dark:text-white hover:bg-primary hover:text-black transition-colors"
              >
                <span className="material-symbols-outlined">person</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;