import { ALL_CATEGORIES } from '../data/products';
import { Product } from '../types';

interface SidebarProps {
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  products: Product[];
  onCategoryClick: (cat: string | null) => void;
}

export default function Sidebar({
  selectedCategory,
  setSelectedCategory,
  products,
  onCategoryClick
}: SidebarProps) {
  
  // Calculate product counts per category
  const getProductCount = (category: string) => {
    return products.filter(p => p.category === category).length;
  };

  return (
    <aside className="w-64 flex-none border-r border-zinc-800 p-4 overflow-y-auto bg-zinc-950/20">
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Categories</span>
        {selectedCategory && (
          <button 
            onClick={() => onCategoryClick(null)}
            className="text-[10px] text-blue-400 hover:underline cursor-pointer"
          >
            Clear Filter
          </button>
        )}
      </div>

      <ul className="space-y-1">
        {/* All Products Item */}
        <li 
          onClick={() => onCategoryClick(null)}
          className={`px-3 py-2 text-sm rounded cursor-pointer flex justify-between items-center transition-all ${
            selectedCategory === null 
              ? 'sidebar-active text-white font-medium bg-zinc-900/50' 
              : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
          }`}
        >
          <span>All Categories</span>
          <span className="text-zinc-500 font-mono text-xs">{products.length}</span>
        </li>

        {/* Categories List */}
        {ALL_CATEGORIES.map(category => {
          const isActive = selectedCategory === category;
          const count = getProductCount(category);

          return (
            <li 
              key={category}
              onClick={() => onCategoryClick(category)}
              className={`px-3 py-2 text-sm rounded cursor-pointer flex justify-between items-center transition-all ${
                isActive 
                  ? 'sidebar-active text-white font-medium bg-zinc-900/50' 
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <span>{category}</span>
              <span className={`font-mono text-xs ${isActive ? 'text-blue-400' : 'text-zinc-600'}`}>{count}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
