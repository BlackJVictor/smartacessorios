import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CustomerUser, Order, RepairOrder, Product, UserNoteChecklist } from '../types';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey && supabaseUrl.trim() !== '' && supabaseAnonKey.trim() !== '') {
    try {
      supabaseClient = createClient(supabaseUrl.trim(), supabaseAnonKey.trim());
      return supabaseClient;
    } catch (e) {
      console.warn('Falha ao inicializar o cliente Supabase:', e);
      return null;
    }
  }

  return null;
}

export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && key && url.trim().length > 5 && key.trim().length > 10);
}

// ============================================================================
// 1. Clientes / Usuários (Customers)
// ============================================================================
export async function saveCustomerToCloud(customer: CustomerUser): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('customers').upsert({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      cpf: customer.cpf,
      address: customer.address || {},
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('Erro ao salvar cliente no Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Exceção ao persistir cliente no Supabase:', err);
    return false;
  }
}

export async function fetchCustomersFromCloud(): Promise<CustomerUser[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone || '',
      cpf: row.cpf || '',
      address: row.address || undefined,
    }));
  } catch (err) {
    console.warn('Erro ao carregar clientes do Supabase:', err);
    return null;
  }
}

// ============================================================================
// 2. Pedidos de Venda (Orders)
// ============================================================================
export async function saveOrderToCloud(order: Order): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('orders').upsert({
      id: order.id,
      order_number: order.orderNumber,
      customer_id: order.customer.id,
      customer_info: order.customer,
      items: order.items,
      subtotal: order.subtotal,
      shipping_cost: order.shippingCost,
      discount: order.discount,
      total: order.total,
      payment_method: order.paymentMethod,
      payment_details: order.paymentDetails,
      payment_status: order.paymentStatus,
      created_at: order.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('Erro ao salvar pedido no Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Exceção ao persistir pedido no Supabase:', err);
    return false;
  }
}

export async function fetchOrdersFromCloud(): Promise<Order[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      orderNumber: row.order_number,
      customer: row.customer_info,
      items: row.items || [],
      subtotal: Number(row.subtotal),
      shippingCost: Number(row.shipping_cost),
      discount: Number(row.discount),
      total: Number(row.total),
      paymentMethod: row.payment_method,
      paymentDetails: row.payment_details || {},
      paymentStatus: row.payment_status,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.warn('Erro ao carregar pedidos do Supabase:', err);
    return null;
  }
}

// ============================================================================
// 3. Assistência Técnica / Ordens de Serviço (Repair Orders)
// ============================================================================
export async function saveRepairOrderToCloud(repair: RepairOrder): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('repair_orders').upsert({
      id: repair.id,
      protocol: repair.protocol,
      device_type: repair.deviceType,
      brand: repair.brand,
      model: repair.model,
      year: String(repair.year),
      problem_description: repair.problemDescription,
      customer_name: repair.customerName,
      customer_phone: repair.customerPhone,
      customer_email: repair.customerEmail || null,
      estimated_days: repair.estimatedDays,
      status: repair.status,
      quoted_price: repair.quotedPrice || null,
      technician_notes: repair.technicianNotes || null,
      created_at: repair.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('Erro ao salvar reparo no Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Exceção ao persistir reparo no Supabase:', err);
    return false;
  }
}

export async function fetchRepairOrdersFromCloud(): Promise<RepairOrder[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from('repair_orders').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      protocol: row.protocol,
      deviceType: row.device_type,
      brand: row.brand,
      model: row.model,
      year: row.year,
      problemDescription: row.problem_description,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      customerEmail: row.customer_email || undefined,
      estimatedDays: row.estimated_days,
      status: row.status,
      quotedPrice: row.quoted_price ? Number(row.quoted_price) : undefined,
      technicianNotes: row.technician_notes || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
    }));
  } catch (err) {
    console.warn('Erro ao carregar reparos do Supabase:', err);
    return null;
  }
}

// ============================================================================
// 4. Notas, Eventos e Checklists dos Usuários (User Notes & Checklists)
// ============================================================================
export async function saveUserNoteChecklistToCloud(item: UserNoteChecklist): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('user_notes_checklists').upsert({
      id: item.id,
      user_id: item.userId || null,
      type: item.type,
      title: item.title,
      content: item.content || null,
      is_completed: item.isCompleted || false,
      checklist_items: item.checklistItems || [],
      due_date: item.dueDate || null,
      tags: item.tags || [],
      created_at: item.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('Erro ao salvar nota/checklist no Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Exceção ao persistir nota/checklist no Supabase:', err);
    return false;
  }
}

export async function fetchUserNotesChecklistsFromCloud(userId?: string): Promise<UserNoteChecklist[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    let query = supabase.from('user_notes_checklists').select('*').order('created_at', { ascending: false });
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      userId: row.user_id || undefined,
      type: row.type,
      title: row.title,
      content: row.content || undefined,
      isCompleted: row.is_completed,
      checklistItems: row.checklist_items || [],
      dueDate: row.due_date || undefined,
      tags: row.tags || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
    }));
  } catch (err) {
    console.warn('Erro ao carregar notas do Supabase:', err);
    return null;
  }
}

// ============================================================================
// 5. Catálogo de Produtos e Estoque (Products)
// ============================================================================
export async function saveProductsToCloud(products: Product[]): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const rows = products.map((p) => ({
      id: p.id,
      sku: p.sku,
      ean: p.ean,
      name: p.name,
      brand: p.brand,
      category: p.category,
      model: p.model,
      color: p.color,
      release_year: p.releaseYear,
      status: p.status,
      pricing: p.pricing,
      stock: p.stock,
      copy: p.copy,
      smartphone_specs: p.smartphoneSpecs || null,
      case_specs: p.caseSpecs || null,
      headphone_specs: p.headphoneSpecs || null,
      images: p.images || [],
      tags: p.tags || [],
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('products').upsert(rows);
    if (error) {
      console.warn('Erro ao sincronizar produtos no Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Exceção ao persistir produtos no Supabase:', err);
    return false;
  }
}

export async function fetchProductsFromCloud(): Promise<Product[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return null;

    return data.map((row: any) => ({
      id: row.id,
      sku: row.sku,
      ean: row.ean || '',
      name: row.name,
      brand: row.brand,
      category: row.category,
      model: row.model,
      color: row.color,
      releaseYear: row.release_year || 2024,
      status: row.status || 'active',
      pricing: row.pricing,
      stock: row.stock,
      copy: row.copy,
      smartphoneSpecs: row.smartphone_specs || undefined,
      caseSpecs: row.case_specs || undefined,
      headphoneSpecs: row.headphone_specs || undefined,
      images: row.images || [],
      tags: row.tags || [],
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString(),
    }));
  } catch (err) {
    console.warn('Erro ao carregar produtos do Supabase:', err);
    return null;
  }
}
