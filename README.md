Agrega las credenciales de supabase en las variables de entorno .env:

NEXT_PUBLIC_SUPABASE_URL=https://psiocnhpdwttilgopapk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzaW9jbmhwZHd0dGlsZ29wYXBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNjI4MzksImV4cCI6MjA0ODczODgzOX0.0tlTlJtRcmvgNXCj67owB8WhhPdLxEcrU231_PaoAk8

Recuerda que la estructura de la base de datos es la siguiente:

-- ================================================
-- Script para configurar la base de datos en Supabase
-- Proyecto: Sistema Web Moderno para Restaurante
-- ================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. Tabla de perfiles de usuario (user_profiles)
-- ================================================
CREATE TABLE public.user_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    full_name text,
    avatar_url text,
    phone_number text,
    address text,
    role text DEFAULT 'cliente', -- Puede ser 'cliente', 'personal' o 'administrador'
    preferences jsonb, -- Para almacenar preferencias del usuario
    created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- ================================================
-- 2. Tabla de categorías (categories)
-- ================================================
CREATE TABLE public.categories (
    id serial PRIMARY KEY,
    name text NOT NULL,
    parent_id integer REFERENCES public.categories (id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- ================================================
-- 3. Tabla de elementos del menú (menu_items)
-- ================================================
CREATE TABLE public.menu_items (
    id serial PRIMARY KEY,
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL CHECK (price >= 0),
    image_url text,
    category_id integer REFERENCES public.categories (id) ON DELETE SET NULL,
    dietary_tags text[], -- Ejemplo: {'vegetariano', 'vegano'}
    is_available boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- ================================================
-- 4. Tabla de reservaciones (reservations)
-- ================================================
CREATE TABLE public.reservations (
    id serial PRIMARY KEY,
    user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
    reservation_datetime timestamp with time zone NOT NULL,
    number_of_people integer NOT NULL CHECK (number_of_people > 0),
    status text DEFAULT 'pendiente', -- 'pendiente', 'confirmada', 'cancelada'
    special_requests text,
    created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- ================================================
-- 5. Tablas de órdenes (orders y order_items)
-- ================================================

-- Tabla de órdenes
CREATE TABLE public.orders (
    id serial PRIMARY KEY,
    user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
    order_datetime timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
    status text DEFAULT 'pendiente', -- 'pendiente', 'en proceso', 'completada', 'cancelada'
    total_price numeric(10,2) DEFAULT 0 CHECK (total_price >= 0),
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- Tabla de ítems de órdenes
CREATE TABLE public.order_items (
    id serial PRIMARY KEY,
    order_id integer REFERENCES public.orders (id) ON DELETE CASCADE,
    menu_item_id integer REFERENCES public.menu_items (id) ON DELETE SET NULL,
    quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price numeric(10,2) NOT NULL CHECK (price >= 0)
);

-- Trigger para actualizar el precio total de la orden
CREATE OR REPLACE FUNCTION public.update_order_total_price()
RETURNS trigger AS $$
BEGIN
    UPDATE public.orders
    SET total_price = (
        SELECT COALESCE(SUM(price * quantity), 0)
        FROM public.order_items
        WHERE order_id = NEW.order_id
    )
    WHERE id = NEW.order_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_order_total_price
AFTER INSERT OR UPDATE OR DELETE ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.update_order_total_price();

-- ================================================
-- 6. Tabla de testimonios (testimonials)
-- ================================================
CREATE TABLE public.testimonials (
    id serial PRIMARY KEY,
    user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text,
    is_approved boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- ================================================
-- 7. Tabla de publicaciones de blog (blog_posts)
-- ================================================
CREATE TABLE public.blog_posts (
    id serial PRIMARY KEY,
    title text NOT NULL,
    content text NOT NULL,
    author_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- ================================================
-- 8. Tabla de eventos (events)
-- ================================================
CREATE TABLE public.events (
    id serial PRIMARY KEY,
    title text NOT NULL,
    description text,
    event_datetime timestamp with time zone NOT NULL,
    location text,
    created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- ================================================
-- 9. Tabla de notificaciones (notifications)
-- ================================================
CREATE TABLE public.notifications (
    id serial PRIMARY KEY,
    user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE,
    type text NOT NULL, -- 'reservacion', 'orden', 'mensaje', etc.
    message text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- ================================================
-- 10. Tabla de logs de actividad (activity_logs)
-- ================================================
CREATE TABLE public.activity_logs (
    id serial PRIMARY KEY,
    user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
    action text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

-- ================================================
-- 11. Función y trigger para manejar nuevos usuarios
-- ================================================

-- Función para manejar la creación de perfiles de usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    user_role text := NEW.raw_user_meta_data->>'role';
BEGIN
    IF user_role IS NULL THEN
        user_role := 'cliente';
    END IF;
    INSERT INTO public.user_profiles (id, role, created_at, updated_at)
    VALUES (NEW.id, user_role, NOW(), NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que llama a la función después de insertar en auth.users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- 12. Funciones para actualizar 'updated_at' automáticamente
-- ================================================

-- Crear función genérica para actualizar 'updated_at'
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers en las tablas que necesitan 'updated_at'
CREATE TRIGGER set_updated_at_user_profiles BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at_categories BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at_menu_items BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at_reservations BEFORE UPDATE ON public.reservations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at_orders BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at_testimonials BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at_blog_posts BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at_events BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ================================================
-- Fin del script
-- ================================================





