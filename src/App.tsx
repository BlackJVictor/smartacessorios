import React, { useState, useEffect } from 'react';
import { 
  Product, 
  NavTab, 
  ProductCategory,
  StoreNavCategory,
  AppMode,
  CustomerUser,
  CartItem,
  Order,
  RepairOrder,
  RepairStatus
} from './types';
import { INITIAL_CATALOG } from './data/initialCatalog';
import { INITIAL_REPAIR_ORDERS } from './data/initialRepairs';

// Admin Components
import { Navbar, StudioTab } from './components/Navbar';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CopywriterStudio } from './components/CopywriterStudio';
import { InventoryManager } from './components/InventoryManager';
import { ProductFormModal } from './components/ProductFormModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { RepairOrdersManager } from './components/RepairOrdersManager';

// Storefront (Customer) Components
import { StorefrontHeader } from './components/storefront/StorefrontHeader';
import { StorefrontCatalog } from './components/storefront/StorefrontCatalog';
import { StorefrontProductDetailModal } from './components/storefront/StorefrontProductDetailModal';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CustomerAuthModal } from './components/storefront/CustomerAuthModal';
import { CheckoutView } from './components/storefront/CheckoutView';
import { OrderSuccessModal } from './components/storefront/OrderSuccessModal';
import { TechnicalAssistanceView } from './components/storefront/TechnicalAssistanceView';
import { UserWorkspaceModal } from './components/storefront/UserWorkspaceModal';
import { 
  isSupabaseConfigured,
  saveCustomerToCloud,
  saveOrderToCloud,
  saveRepairOrderToCloud,
  saveProductsToCloud,
  fetchCustomersFromCloud,
  fetchOrdersFromCloud,
  fetchRepairOrdersFromCloud,
  fetchProductsFromCloud
} from './lib/supabase';

const CATALOG_STORAGE_KEY = 'techcommerce_catalog_v3';
const CART_STORAGE_KEY = 'techcommerce_cart_v1';
const USER_STORAGE_KEY = 'techcommerce_customer_user_v1';
const REPAIRS_STORAGE_KEY = 'techcommerce_repairs_v1';

export default function App() {
  // Mode State: 'storefront' (Client Store) vs 'admin' (Management Backoffice)
  const [appMode, setAppMode] = useState<AppMode>('storefront');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('techcommerce_admin_auth') === 'true';
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);

  // Admin Tab: 'catalog' | 'copywriter' | 'inventory'
  const [activeAdminTab, setActiveAdminTab] = useState<StudioTab>('catalog');

  // Customer Catalog State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(CATALOG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: Product) => {
            if (!p.images || p.images.length === 0) {
              const seedMatch = INITIAL_CATALOG.find((init) => init.id === p.id || init.sku === p.sku);
              if (seedMatch && seedMatch.images && seedMatch.images.length > 0) {
                return { ...p, images: seedMatch.images };
              }
            }
            return p;
          });
        }
      }
    } catch (e) {
      console.error('Failed to load catalog from localStorage', e);
    }
    return INITIAL_CATALOG;
  });

  // Customer Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    } catch (e) {
      console.error('Failed to load cart', e);
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Customer User State
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error('Failed to load customer user', e);
    }
    return null;
  });
  const [isCustomerAuthModalOpen, setIsCustomerAuthModalOpen] = useState(false);
  const [isUserWorkspaceOpen, setIsUserWorkspaceOpen] = useState(false);

  // Storefront Filter & Navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<StoreNavCategory>('all');
  const [selectedStorefrontProduct, setSelectedStorefrontProduct] = useState<Product | null>(null);
  const [isStorefrontDetailOpen, setIsStorefrontDetailOpen] = useState(false);

  // Technical Assistance & Repair Orders State
  const [repairs, setRepairs] = useState<RepairOrder[]>(() => {
    try {
      const savedRepairs = localStorage.getItem(REPAIRS_STORAGE_KEY);
      if (savedRepairs) {
        const parsed = JSON.parse(savedRepairs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load repairs', e);
    }
    return INITIAL_REPAIR_ORDERS;
  });

  // Checkout and Order State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);

  // Admin Modals & Selection State
  const [selectedAdminProduct, setSelectedAdminProduct] = useState<Product | null>(null);
  const [adminDetailModalTab, setAdminDetailModalTab] = useState<'overview' | 'specs' | 'copy' | 'payload' | 'stock'>('overview');
  const [isAdminDetailModalOpen, setIsAdminDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Initial Supabase Cloud Fetch / Sync
  useEffect(() => {
    const syncWithSupabaseCloud = async () => {
      if (!isSupabaseConfigured()) return;

      try {
        // Fetch remote repairs
        const cloudRepairs = await fetchRepairOrdersFromCloud();
        if (cloudRepairs && cloudRepairs.length > 0) {
          setRepairs((prev) => {
            const combined = [...cloudRepairs];
            prev.forEach((localR) => {
              if (!combined.some((c) => c.id === localR.id || c.protocol === localR.protocol)) {
                combined.push(localR);
              }
            });
            return combined;
          });
        }

        // Fetch remote products
        const cloudProducts = await fetchProductsFromCloud();
        if (cloudProducts && cloudProducts.length > 0) {
          setProducts(cloudProducts);
        }
      } catch (err) {
        console.warn('Erro ao sincronizar dados iniciais com Supabase:', err);
      }
    };

    syncWithSupabaseCloud();
  }, []);

  // Sync Products to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to persist catalog', e);
    }
  }, [products]);

  // Sync Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart', e);
    }
  }, [cart]);

  // Sync Customer User to LocalStorage & Supabase Cloud
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
        if (isSupabaseConfigured()) {
          saveCustomerToCloud(currentUser);
        }
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to persist user', e);
    }
  }, [currentUser]);

  // Sync Repair Orders to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(REPAIRS_STORAGE_KEY, JSON.stringify(repairs));
    } catch (e) {
      console.error('Failed to persist repairs', e);
    }
  }, [repairs]);

  // Repair Operations
  const handleCreateRepair = (repairData: Omit<RepairOrder, 'id' | 'protocol' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const nextProtocolNumber = Math.floor(1000 + Math.random() * 9000);
    const newRepair: RepairOrder = {
      ...repairData,
      id: `rep-${Date.now()}`,
      protocol: `OS-2024-${nextProtocolNumber}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRepairs((prev) => [newRepair, ...prev]);

    // Persist to Supabase cloud
    if (isSupabaseConfigured()) {
      saveRepairOrderToCloud(newRepair);
    }
  };

  const handleUpdateRepairStatus = (
    id: string, 
    status: RepairStatus, 
    quotedPrice?: number, 
    technicianNotes?: string
  ) => {
    let updatedItem: RepairOrder | null = null;

    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          updatedItem = {
            ...r,
            status,
            quotedPrice: quotedPrice !== undefined ? quotedPrice : r.quotedPrice,
            technicianNotes: technicianNotes !== undefined ? technicianNotes : r.technicianNotes,
            updatedAt: new Date().toISOString(),
          };
          return updatedItem;
        }
        return r;
      })
    );

    if (updatedItem && isSupabaseConfigured()) {
      saveRepairOrderToCloud(updatedItem);
    }
  };

  const handleDeleteRepair = (id: string) => {
    if (window.confirm('Deseja realmente remover esta Ordem de Serviço?')) {
      setRepairs((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // Cart Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => {
    const price = item.product.pricing.promotionalPrice || item.product.pricing.regularPrice;
    return acc + price * item.quantity;
  }, 0);

  // Cart Operations
  const handleAddToCart = (product: Product, quantity = 1, selectedColor?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          selectedColor: selectedColor || updated[existingIndex].selectedColor || product.color,
        };
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedColor: selectedColor || product.color || 'Padrão',
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleBuyNow = (product: Product, quantity = 1, selectedColor?: string) => {
    handleAddToCart(product, quantity, selectedColor);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (order: Order) => {
    // Deduct stock from purchased items
    setProducts((prev) =>
      prev.map((p) => {
        const itemMatch = order.items.find((item) => item.product.id === p.id);
        if (itemMatch) {
          const newPhysical = Math.max(0, p.stock.physical - itemMatch.quantity);
          const newAvailable = Math.max(0, newPhysical - p.stock.reserved);
          return {
            ...p,
            stock: {
              ...p.stock,
              physical: newPhysical,
              available: newAvailable,
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );

    // Empty cart
    setCart([]);
    setLastOrder(order);
    setIsCheckoutOpen(false);
    setIsOrderSuccessOpen(true);

    // Persist order to Supabase Cloud
    if (isSupabaseConfigured()) {
      saveOrderToCloud(order);
    }
  };

  // Admin Authentication
  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('techcommerce_admin_auth', 'true');
    setAppMode('admin');
    setIsAdminLoginModalOpen(false);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('techcommerce_admin_auth');
    setAppMode('storefront');
  };

  // Admin Product Operations
  const handleSelectAdminProduct = (product: Product, tab: 'overview' | 'specs' | 'copy' | 'payload' | 'stock' = 'overview') => {
    setSelectedAdminProduct(product);
    setAdminDetailModalTab(tab);
    setIsAdminDetailModalOpen(true);
  };

  const handleOpenCopywriterForProduct = (product: Product) => {
    setSelectedAdminProduct(product);
    setActiveAdminTab('copywriter');
  };

  const handleQuickStockUpdate = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newPhysical = Math.max(0, p.stock.physical + delta);
          const newAvailable = Math.max(0, newPhysical - p.stock.reserved);
          return {
            ...p,
            stock: {
              ...p.stock,
              physical: newPhysical,
              available: newAvailable,
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );
  };

  const handleUpdateStock = (productId: string, newStock: Partial<Product['stock']>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            stock: {
              ...p.stock,
              ...newStock,
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );
  };

  const handleApplyCopywriterToProduct = (productId: string, generatedCopy: any) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            copy: generatedCopy,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );
  };

  const handleCreateProductFromCopy = (
    generatedData: any, 
    category: ProductCategory, 
    brand: string, 
    modelName: string
  ) => {
    const newSku = `SKU-${brand.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      sku: newSku,
      ean: '789899' + Math.floor(1000000 + Math.random() * 9000000),
      name: generatedData.marketplaceTitle || `${brand} ${modelName}`,
      brand,
      model: modelName,
      category,
      color: 'Titanium Black',
      releaseYear: new Date().getFullYear(),
      status: 'active',
      pricing: {
        costPrice: 500,
        regularPrice: 999,
        promotionalPrice: 899,
        currency: 'BRL',
        marginPercent: 44.4,
      },
      stock: {
        physical: 30,
        reserved: 2,
        available: 28,
        minSafetyStock: 5,
        reorderPoint: 10,
        warehouseLocation: 'CD-SP-01 / Corredor C-02 / Prateleira 1',
        batchNumber: `LOT-2024-${Math.floor(100 + Math.random() * 900)}`,
        lastRestockedDate: new Date().toISOString().split('T')[0],
        leadTimeDays: 14,
      },
      copy: generatedData,
      tags: ['tech', category, brand.toLowerCase(), 'novidade'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProduct, ...prev]);
    setSelectedAdminProduct(newProduct);
  };

  const handleSaveProduct = (product: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? product : p));
      }
      return [product, ...prev];
    });
    setIsFormModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Deseja realmente remover este produto do catálogo?')) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      if (selectedAdminProduct?.id === productId) {
        setSelectedAdminProduct(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white font-sans antialiased">
      {/* ========================================================================= */}
      {/* MODE 1: CLIENT STOREFRONT (Loja do Cliente)                              */}
      {/* ========================================================================= */}
      {appMode === 'storefront' && (
        <>
          <StorefrontHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            cartCount={cartCount}
            cartTotal={cartTotal}
            onOpenCart={() => setIsCartOpen(true)}
            currentUser={currentUser}
            onOpenAuthModal={() => setIsCustomerAuthModalOpen(true)}
            onOpenUserWorkspace={() => setIsUserWorkspaceOpen(true)}
            onOpenAdminLogin={() => {
              if (isAdminAuthenticated) {
                setAppMode('admin');
              } else {
                setIsAdminLoginModalOpen(true);
              }
            }}
          />

          <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 outline-none">
            {isCheckoutOpen ? (
              <CheckoutView
                items={cart}
                currentUser={currentUser}
                onBackToStore={() => setIsCheckoutOpen(false)}
                onOrderCompleted={handleOrderCompleted}
              />
            ) : selectedCategory === 'repairs' ? (
              <TechnicalAssistanceView
                currentUser={currentUser}
                onSubmitRepair={handleCreateRepair}
              />
            ) : (
              <StorefrontCatalog
                products={products}
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                onViewProductDetails={(p) => {
                  setSelectedStorefrontProduct(p);
                  setIsStorefrontDetailOpen(true);
                }}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onBuyNow={(p) => handleBuyNow(p, 1)}
              />
            )}
          </main>

          {/* Customer Product Detail Modal */}
          {isStorefrontDetailOpen && selectedStorefrontProduct && (
            <StorefrontProductDetailModal
              product={selectedStorefrontProduct}
              isOpen={isStorefrontDetailOpen}
              onClose={() => {
                setIsStorefrontDetailOpen(false);
                setSelectedStorefrontProduct(null);
              }}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          )}

          {/* Cart Drawer */}
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onProceedToCheckout={() => {
              setIsCartOpen(false);
              setIsCheckoutOpen(true);
            }}
          />

          {/* Customer Auth (Register / Login) Modal */}
          <CustomerAuthModal
            isOpen={isCustomerAuthModalOpen}
            onClose={() => setIsCustomerAuthModalOpen(false)}
            currentUser={currentUser}
            onSaveUser={setCurrentUser}
            onLogout={() => setCurrentUser(null)}
          />

          {/* Customer Personal Workspace & Notes / Checklist Modal */}
          {currentUser && (
            <UserWorkspaceModal
              isOpen={isUserWorkspaceOpen}
              onClose={() => setIsUserWorkspaceOpen(false)}
              currentUser={currentUser}
              onUpdateUser={setCurrentUser}
              onLogout={() => {
                setCurrentUser(null);
                setIsUserWorkspaceOpen(false);
              }}
              userOrders={lastOrder ? [lastOrder] : []}
              userRepairs={repairs.filter(
                (r) =>
                  r.customerPhone === currentUser.phone ||
                  (currentUser.email && r.customerEmail === currentUser.email)
              )}
            />
          )}

          {/* Order Success Receipt Modal */}
          <OrderSuccessModal
            order={lastOrder}
            isOpen={isOrderSuccessOpen}
            onClose={() => {
              setIsOrderSuccessOpen(false);
              setLastOrder(null);
            }}
          />
        </>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: ADMIN BACKOFFICE (Acesso Restrito: admin/admin)                   */}
      {/* ========================================================================= */}
      {appMode === 'admin' && (
        <>
          <Navbar
            activeTab={activeAdminTab}
            setActiveTab={setActiveAdminTab}
            onSelectTab={setActiveAdminTab}
            productCount={products.length}
            totalProductsCount={products.length}
            lowStockCount={products.filter((p) => p.stock.available <= p.stock.reorderPoint).length}
            pendingRepairsCount={repairs.filter((r) => r.status === 'pending' || r.status === 'analyzing').length}
            onSwitchToStorefront={() => setAppMode('storefront')}
            onLogoutAdmin={handleAdminLogout}
            onOpenNewProduct={() => {
              setEditingProduct(null);
              setIsFormModalOpen(true);
            }}
            onOpenNewProductModal={() => {
              setEditingProduct(null);
              setIsFormModalOpen(true);
            }}
            onOpenExport={() => {
              const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `techcommerce_catalog_export_${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {activeAdminTab === 'catalog' && (
              <ProductCatalog
                products={products}
                onSelectProduct={(p, tab) => handleSelectAdminProduct(p, tab)}
                onEditProduct={(p) => {
                  setEditingProduct(p);
                  setIsFormModalOpen(true);
                }}
                onDeleteProduct={handleDeleteProduct}
                onOpenCopywriterForProduct={handleOpenCopywriterForProduct}
                onOpenPayloadForProduct={() => {}}
                onQuickStockUpdate={handleQuickStockUpdate}
              />
            )}

            {activeAdminTab === 'copywriter' && (
              <CopywriterStudio
                products={products}
                activeProduct={selectedAdminProduct}
                onApplyCopywriterToProduct={handleApplyCopywriterToProduct}
                onCreateProductFromCopy={handleCreateProductFromCopy}
              />
            )}

            {activeAdminTab === 'inventory' && (
              <InventoryManager
                products={products}
                onUpdateStock={handleUpdateStock}
                onOpenProductDetail={(p, tab) => handleSelectAdminProduct(p, tab)}
              />
            )}

            {activeAdminTab === 'repairs' && (
              <RepairOrdersManager
                repairs={repairs}
                onUpdateRepairStatus={handleUpdateRepairStatus}
                onDeleteRepair={handleDeleteRepair}
              />
            )}
          </main>

          {/* Admin Product Detail Modal */}
          {isAdminDetailModalOpen && selectedAdminProduct && (
            <ProductDetailModal
              product={selectedAdminProduct}
              initialTab={adminDetailModalTab}
              onClose={() => setIsAdminDetailModalOpen(false)}
              onOpenCopywriterTab={handleOpenCopywriterForProduct}
            />
          )}

          {/* Admin Add/Edit Form Modal */}
          {isFormModalOpen && (
            <ProductFormModal
              initialProduct={editingProduct}
              onClose={() => {
                setIsFormModalOpen(false);
                setEditingProduct(null);
              }}
              onSave={handleSaveProduct}
            />
          )}
        </>
      )}

      {/* Admin Login Modal (Triggerable from Storefront) */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}
