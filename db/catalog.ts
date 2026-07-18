import { and, asc, eq, sql } from "drizzle-orm";
import { getD1, getDb } from "./index";
import { categories, productImages, products, productVariants } from "./schema";

export type StorefrontProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: string;
  priceCents: number;
  compareAtPrice: string | null;
  image: string;
  imageAlt: string;
  stock: number;
};

let databaseReady: Promise<void> | null = null;

const categorySeeds = [
  ["cat-camisetas", "Camisetas", "camisetas", "Modelagens modernas e essenciais.", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85", 1],
  ["cat-calcas", "Calças", "calcas", "Jeans, sarja e alfaiataria.", "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1000&q=85", 2],
  ["cat-jaquetas", "Jaquetas", "jaquetas", "Peças marcantes para qualquer ocasião.", "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=85", 3],
  ["cat-calcados", "Calçados", "calcados", "Conforto e presença em cada passo.", "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85", 4],
] as const;

const productSeeds = [
  ["prod-camiseta-essential", "cat-camisetas", "Camiseta Essential Oversized", "camiseta-essential-oversized", "Algodão premium, caimento amplo e acabamento reforçado.", 12990, null, "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=900&q=85"],
  ["prod-calca-cargo", "cat-calcas", "Calça Cargo Urban", "calca-cargo-urban", "Modelagem reta com bolsos utilitários e ajuste confortável.", 24990, 27990, "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=85"],
  ["prod-jaqueta-premium", "cat-jaquetas", "Jaqueta Premium Black", "jaqueta-premium-black", "Jaqueta versátil com estrutura marcante e toque macio.", 39990, null, "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85"],
  ["prod-tenis-minimal", "cat-calcados", "Tênis Minimal White", "tenis-minimal-white", "Design limpo para acompanhar produções casuais e urbanas.", 32990, 35990, "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=85"],
] as const;

async function initializeDatabase() {
  const d1 = getD1();

  await d1.batch([
    d1.prepare("CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, description TEXT NOT NULL DEFAULT '', image_url TEXT, is_active INTEGER NOT NULL DEFAULT 1, sort_order INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    d1.prepare("CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY NOT NULL, category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, description TEXT NOT NULL DEFAULT '', price_cents INTEGER NOT NULL CHECK(price_cents >= 0), compare_at_price_cents INTEGER, currency TEXT NOT NULL DEFAULT 'BRL', status TEXT NOT NULL DEFAULT 'draft', is_featured INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    d1.prepare("CREATE TABLE IF NOT EXISTS product_images (id TEXT PRIMARY KEY NOT NULL, product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE, url TEXT NOT NULL, alt TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0, is_cover INTEGER NOT NULL DEFAULT 0)"),
    d1.prepare("CREATE TABLE IF NOT EXISTS product_variants (id TEXT PRIMARY KEY NOT NULL, product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE, sku TEXT NOT NULL UNIQUE, color TEXT NOT NULL, size TEXT NOT NULL, price_cents INTEGER, stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK(stock_quantity >= 0), is_active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS products_category_idx ON products(category_id)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS products_status_featured_idx ON products(status, is_featured)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS product_images_product_idx ON product_images(product_id)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS product_variants_product_idx ON product_variants(product_id)"),
  ]);

  const categoryStatements = categorySeeds.map((category) =>
    d1.prepare("INSERT OR IGNORE INTO categories (id, name, slug, description, image_url, is_active, sort_order) VALUES (?, ?, ?, ?, ?, 1, ?)").bind(...category),
  );
  await d1.batch(categoryStatements);

  for (const [index, product] of productSeeds.entries()) {
    const [id, categoryId, name, slug, description, priceCents, compareAtPriceCents, image] = product;
    await d1.batch([
      d1.prepare("INSERT OR IGNORE INTO products (id, category_id, name, slug, description, price_cents, compare_at_price_cents, currency, status, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, 'BRL', 'active', 1)").bind(id, categoryId, name, slug, description, priceCents, compareAtPriceCents),
      d1.prepare("INSERT OR IGNORE INTO product_images (id, product_id, url, alt, sort_order, is_cover) VALUES (?, ?, ?, ?, 0, 1)").bind(`img-${id}`, id, image, name),
      d1.prepare("INSERT OR IGNORE INTO product_variants (id, product_id, sku, color, size, stock_quantity, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)").bind(`var-${id}-p`, id, `VC-${index + 1}-P`, index === 3 ? "Branco" : "Preto", index === 3 ? "40" : "P", 8 + index),
      d1.prepare("INSERT OR IGNORE INTO product_variants (id, product_id, sku, color, size, stock_quantity, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)").bind(`var-${id}-m`, id, `VC-${index + 1}-M`, index === 3 ? "Branco" : "Preto", index === 3 ? "42" : "M", 10 + index),
      d1.prepare("INSERT OR IGNORE INTO product_variants (id, product_id, sku, color, size, stock_quantity, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)").bind(`var-${id}-g`, id, `VC-${index + 1}-G`, index === 3 ? "Branco" : "Preto", index === 3 ? "44" : "G", 6 + index),
    ]);
  }
}

async function ensureDatabase() {
  databaseReady ??= initializeDatabase().catch((error) => {
    databaseReady = null;
    throw error;
  });
  return databaseReady;
}

function formatPrice(value: number | null) {
  if (value === null) return null;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
}

export async function getFeaturedProducts(): Promise<StorefrontProduct[]> {
  await ensureDatabase();
  const db = getDb();

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      category: categories.name,
      priceCents: products.priceCents,
      compareAtPriceCents: products.compareAtPriceCents,
      image: productImages.url,
      imageAlt: productImages.alt,
      stock: sql<number>`coalesce(sum(${productVariants.stockQuantity}), 0)`,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .innerJoin(
      productImages,
      and(eq(productImages.productId, products.id), eq(productImages.isCover, true)),
    )
    .leftJoin(
      productVariants,
      and(eq(productVariants.productId, products.id), eq(productVariants.isActive, true)),
    )
    .where(and(eq(products.status, "active"), eq(products.isFeatured, true)))
    .groupBy(products.id, categories.name, productImages.url, productImages.alt)
    .orderBy(asc(products.createdAt))
    .limit(8);

  return rows.map((product) => ({
    ...product,
    price: formatPrice(product.priceCents) ?? "",
    compareAtPrice: formatPrice(product.compareAtPriceCents),
    stock: Number(product.stock),
  }));
}
