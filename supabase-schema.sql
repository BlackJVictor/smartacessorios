-- ============================================================================
-- SMARTACESSÓRIOS - SUPABASE DATABASE SCHEMA (PostgreSQL)
-- Execute este script no SQL Editor do seu Dashboard Supabase (https://supabase.com/dashboard)
-- ============================================================================

-- 1. Habilitar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Clientes / Usuários (Perfis com endereço e dados de cadastro)
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    cpf TEXT,
    password_hash TEXT,
    address JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Pedidos de Compras (Carrinho, Checkout, Pagamentos PIX/Cartão/Boleto)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    customer_id TEXT REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_info JSONB NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    shipping_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    payment_method TEXT NOT NULL,
    payment_details JSONB DEFAULT '{}'::jsonb,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de Assistência Técnica & Ordens de Serviço (Reparos de Celular e Notebook)
CREATE TABLE IF NOT EXISTS public.repair_orders (
    id TEXT PRIMARY KEY,
    protocol TEXT NOT NULL UNIQUE,
    device_type TEXT NOT NULL, -- 'smartphone' ou 'notebook'
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year TEXT NOT NULL,
    problem_description TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    estimated_days INTEGER NOT NULL DEFAULT 3, -- 3 para celular, 15 para notebook
    status TEXT NOT NULL DEFAULT 'pending',
    quoted_price NUMERIC(12, 2),
    technician_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabela de Notas, Eventos, Tarefas e Checklists dos Usuários
CREATE TABLE IF NOT EXISTS public.user_notes_checklists (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.customers(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'note', -- 'note', 'checklist', 'event', 'reminder'
    title TEXT NOT NULL,
    content TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    checklist_items JSONB DEFAULT '[]'::jsonb, -- Array de [{id: string, text: string, done: boolean}]
    due_date TIMESTAMPTZ,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabela de Catálogo de Produtos e Estoque WMS
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    sku TEXT NOT NULL UNIQUE,
    ean TEXT,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL, -- 'smartphones', 'cases', 'headphones'
    model TEXT NOT NULL,
    color TEXT NOT NULL,
    release_year INTEGER,
    status TEXT NOT NULL DEFAULT 'active',
    pricing JSONB NOT NULL,
    stock JSONB NOT NULL,
    copy JSONB NOT NULL,
    smartphone_specs JSONB,
    case_specs JSONB,
    headphone_specs JSONB,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para alto desempenho em consultas
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_repair_orders_protocol ON public.repair_orders(protocol);
CREATE INDEX IF NOT EXISTS idx_repair_orders_created_at ON public.repair_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON public.user_notes_checklists(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);

-- Configuração de Row Level Security (RLS) permissivo para anon/authenticated
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso público aos clientes" ON public.customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público aos pedidos" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público às ordens de reparo" ON public.repair_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público às notas e checklists" ON public.user_notes_checklists FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público aos produtos" ON public.products FOR ALL USING (true) WITH CHECK (true);
