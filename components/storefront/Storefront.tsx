"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Heart,
  MapPin,
  Menu,
  PackageCheck,
  Search,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { StorefrontProduct } from "@/db/catalog";
import {
  AnimatedButton,
  AnimatedSection,
  HoverCard,
  RevealText,
} from "@/components/motion/MotionPrimitives";
import { motionTokens } from "@/components/motion/motion-config";

type CartItem = StorefrontProduct & { quantity: number; selectedSize?: string };

const productDetails: Record<
  string,
  {
    description: string;
    material: string;
    fit: string;
    color: string;
    sizes: string[];
  }
> = {
  "dp-boxy-camo-hoodie": {
    description:
      "Hoodie boxy com construção encorpada, zíper frontal e camuflagem tonal de leitura contemporânea.",
    material: "Algodão heavyweight com acabamento lavado",
    fit: "Boxy / oversized",
    color: "Oliva camuflado",
    sizes: ["PP", "P", "M", "G", "GG"],
  },
  "dp-black-camo-tee": {
    description:
      "T-shirt streetwear com estampa camuflada tonal e gola estruturada para manter a silhueta.",
    material: "100% algodão",
    fit: "Relaxed / boxy",
    color: "Preto camuflado",
    sizes: ["PP", "P", "M", "G", "GG"],
  },
  "dp-offwhite-knit": {
    description:
      "Knitwear de trama aberta com escudo tonal bordado e acabamento leve para sobreposições.",
    material: "Malha de algodão texturizada",
    fit: "Relaxed",
    color: "Off-white",
    sizes: ["PP", "P", "M", "G", "GG"],
  },
  "dp-coach-jacket": {
    description:
      "Coach jacket minimalista em ripstop leve, com botões de pressão e punhos elásticos.",
    material: "Ripstop técnico",
    fit: "Relaxed",
    color: "Mirage grey",
    sizes: ["PP", "P", "M", "G", "GG"],
  },
  "dp-denim-shirt": {
    description:
      "Overshirt em denim lavado com padronagem discreta, bolsos frontais e estrutura de jaqueta.",
    material: "Denim de algodão",
    fit: "Relaxed",
    color: "Marrom lavado",
    sizes: ["PP", "P", "M", "G", "GG"],
  },
  "dp-denim-pants": {
    description:
      "Jeans de perna reta com lavagem marrom e monograma tonal de baixo contraste.",
    material: "Denim de algodão",
    fit: "Straight / relaxed",
    color: "Marrom lavado",
    sizes: ["36", "38", "40", "42", "44", "46"],
  },
  "stussy-zip-hoodie": {
    description:
      "Zip hoodie garment dyed com fleece heavyweight, estampa tonal e ferragens metálicas.",
    material: "Fleece 100% algodão · 13.3 oz",
    fit: "Relaxed",
    color: "Faded black",
    sizes: ["PP", "P", "M", "G", "GG"],
  },
  "stussy-link-tee": {
    description:
      "T-shirt pigment dyed de peso médio com gráfico Link Sport na frente e nas costas.",
    material: "Jersey 100% algodão · 6.5 oz",
    fit: "Relaxed",
    color: "Faded black",
    sizes: ["PP", "P", "M", "G", "GG"],
  },
  "nike-airmax-pulse": {
    description:
      "Sneaker urbano com cabedal em camadas e amortecimento Air para uso cotidiano.",
    material: "Têxtil, couro e material sintético",
    fit: "Forma padrão",
    color: "Anthracite / black",
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
  },
  "puma-rsx-efekt": {
    description:
      "Runner de proporção marcante com construção em camadas e solado robusto inspirado nos anos 2000.",
    material: "Têxtil, sintético e borracha",
    fit: "Forma padrão",
    color: "Black / dark grey",
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
  },
};

const categories = [
  "Todos",
  "T-Shirts",
  "Hoodies",
  "Jackets",
  "Bottoms",
  "Knitwear",
  "Accessories",
  "Sneakers",
];

function brandFor(product: StorefrontProduct) {
  if (product.id.startsWith("dp-")) return "Daily Paper";
  if (product.id.startsWith("stussy-")) return "Stüssy";
  if (product.id.startsWith("nike-")) return "Nike";
  if (product.id.startsWith("puma-")) return "Puma";
  return "DROP/LAB";
}

function detailsFor(product: StorefrontProduct) {
  const exact = productDetails[product.id];
  if (exact) return exact;
  const clothingSizes = ["P", "M", "G", "GG"];
  const shoeSizes = ["38", "39", "40", "41", "42", "43", "44"];
  if (product.category === "Sneakers")
    return {
      description:
        "Silhueta atual selecionada para uma curadoria urbana versátil, com foco em conforto, presença e uso diário.",
      material: "Têxtil, sintético e borracha",
      fit: "Forma padrão",
      color: "Preto, branco e cinza",
      sizes: shoeSizes,
    };
  if (product.category === "Accessories")
    return {
      description:
        "Acessório funcional com desenho minimalista para completar produções urbanas.",
      material: "Materiais mistos de alta resistência",
      fit: "Ajustável",
      color: "Preto",
      sizes: ["Único"],
    };
  return {
    description:
      "Peça contemporânea com construção confortável, acabamento refinado e modelagem pensada para composições atuais.",
    material: "Algodão e fibras técnicas",
    fit: product.category === "Bottoms" ? "Relaxed / wide" : "Relaxed",
    color: "Paleta neutra",
    sizes: clothingSizes,
  };
}

function money(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function Storefront({ products }: { products: StorefrontProduct[] }) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 850], [0, 110]);
  const heroScale = useTransform(scrollY, [0, 850], [1.04, 1.12]);
  const headerShadow = useTransform(
    scrollY,
    [0, 90],
    ["0 0 0 rgba(0,0,0,0)", "0 16px 40px rgba(0,0,0,.09)"],
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<StorefrontProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [shippingZip, setShippingZip] = useState("");
  const [shippingResult, setShippingResult] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        setCart(JSON.parse(localStorage.getItem("droplab-cart") ?? "[]"));
        setFavorites(
          JSON.parse(localStorage.getItem("droplab-favorites") ?? "[]"),
        );
      } catch {
        /* dados locais inválidos são descartados */
      }
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("droplab-cart", JSON.stringify(cart));
  }, [cart, ready]);

  useEffect(() => {
    if (ready)
      localStorage.setItem("droplab-favorites", JSON.stringify(favorites));
  }, [favorites, ready]);

  useEffect(() => {
    document.body.style.overflow =
      cartOpen || menuOpen || selectedProduct || sizeGuideOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, menuOpen, selectedProduct, sizeGuideOpen]);

  function openProduct(product: StorefrontProduct) {
    setSelectedProduct(product);
    setSelectedSize("");
  }

  const visible = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory =
          category === "Todos" || product.category === category;
        const haystack =
          `${product.name} ${product.category} ${brandFor(product)}`.toLowerCase();
        return matchesCategory && haystack.includes(query.trim().toLowerCase());
      }),
    [products, query, category],
  );

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0,
  );

  function addToCart(product: StorefrontProduct, size?: string) {
    setCart((current) => {
      const found = current.find(
        (item) => item.id === product.id && item.selectedSize === size,
      );
      return found
        ? current.map((item) =>
            item.id === product.id && item.selectedSize === size
              ? {
                  ...item,
                  quantity: Math.min(item.quantity + 1, product.stock),
                }
              : item,
          )
        : [...current, { ...product, quantity: 1, selectedSize: size }];
    });
    setNotice(`${product.name} adicionado ao carrinho`);
    window.setTimeout(() => setNotice(""), 2200);
  }

  function updateQuantity(id: string, delta: number, size?: string) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id && item.selectedSize === size
            ? {
                ...item,
                quantity: Math.max(
                  0,
                  Math.min(item.stock, item.quantity + delta),
                ),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  }

  function submitNewsletter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.currentTarget.reset();
    setNotice("Cadastro realizado — você entrou no Drop Club");
    window.setTimeout(() => setNotice(""), 2500);
  }

  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <motion.main
      data-motion-safe-content
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.45 }}
      className="min-h-screen overflow-clip bg-[#f1f0eb] text-[#11110f]"
    >
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 12, x: "-50%" }}
            role="status"
            className="fixed bottom-5 left-1/2 z-[100] bg-black px-5 py-3 text-sm text-white shadow-xl"
          >
            {notice}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#11110f] px-4 py-2.5 text-center text-[9px] font-semibold uppercase tracking-[.28em] text-white sm:text-[10px]">
        Drop 01 disponível · envio nacional · 5% no Pix
      </div>
      <motion.header
        style={{ boxShadow: headerShadow }}
        initial={{ y: reduceMotion ? 0 : -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.65, ease: motionTokens.ease }}
        className="sticky top-0 z-40 border-b border-black/10 bg-[#f1f0eb]/92 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <button
            aria-label="Abrir menu"
            onClick={() => setMenuOpen(true)}
            className="grid h-11 w-11 place-items-center lg:hidden"
          >
            <Menu />
          </button>
          <a
            href="#inicio"
            className="text-xl font-black uppercase tracking-[-.07em]"
          >
            DROP/LAB
          </a>
          <nav
            className="hidden gap-8 text-sm font-medium lg:flex"
            aria-label="Navegação principal"
          >
            <a href="#catalogo">Novidades</a>
            <a href="#colecoes">Coleções</a>
            <a href="#lookbook">Lookbook</a>
            <a href="#entrega">Entrega</a>
            <a href="#loja">Visite</a>
          </nav>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label={`Abrir carrinho com ${itemCount} ${itemCount === 1 ? "item" : "itens"}`}
            onClick={() => setCartOpen(true)}
            className="relative grid h-11 w-11 place-items-center"
          >
            <ShoppingBag size={21} />
            <motion.span
              key={itemCount}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-black px-1 text-[10px] text-white"
            >
              {itemCount}
            </motion.span>
          </motion.button>
        </div>
      </motion.header>

      <section
        id="inicio"
        className="relative grid min-h-[82svh] overflow-hidden bg-[#171815] px-5 py-16 text-white lg:min-h-[88svh] lg:px-16"
      >
        <motion.div
          aria-hidden="true"
          style={
            reduceMotion ? undefined : { y: heroParallax, scale: heroScale }
          }
          className="absolute -inset-16 bg-[linear-gradient(90deg,rgba(0,0,0,.76),rgba(0,0,0,.08)),url('/streetwear/editorial-look-01.jpg')] bg-cover bg-center will-change-transform"
        />
        <motion.div
          data-motion-safe-content
          {...reveal}
          className="relative z-10 flex max-w-5xl flex-col justify-end pb-8 pt-40 lg:pb-16"
        >
          <p className="mb-5 text-xs font-semibold uppercase tracking-[.3em] text-white/70">
            Drop 01 / Desert Signal / 2026
          </p>
          <h1 className="max-w-4xl text-5xl font-black uppercase leading-[.82] tracking-[-.075em] sm:text-7xl lg:text-[7.5rem]">
            <RevealText>Form follows</RevealText>
            <RevealText className="text-white/60">movement.</RevealText>
          </h1>
          <p className="mt-7 max-w-sm text-sm leading-6 text-white/72 sm:text-base">
            Streetwear de construção premium. Silhuetas amplas, materiais densos
            e uma curadoria feita para durar além do drop.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#catalogo"
              className="bg-white px-7 py-4 text-[10px] font-black uppercase tracking-[.22em] text-black transition hover:scale-[1.03] hover:bg-white/85"
            >
              Comprar agora
            </a>
            <a
              href="#lookbook"
              className="border border-white/60 px-7 py-4 text-[10px] font-semibold uppercase tracking-[.22em]"
            >
              Ver lookbook
            </a>
          </div>
          <div className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-white/25 pt-5 text-[9px] uppercase tracking-[.2em] text-white/60 sm:text-[10px]">
            <span>Heavyweight</span>
            <span>Relaxed fit</span>
            <span>Limited drop</span>
          </div>
        </motion.div>
      </section>

      <section
        aria-label="Benefícios da loja"
        className="overflow-hidden border-t border-white/10 bg-[#11110f] py-4 text-white"
      >
        <motion.div
          animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="flex w-max gap-12 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[.28em] text-white/75"
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-12" aria-hidden={copy === 1}>
              <span>Heavyweight jersey</span>
              <span>Limited quantities</span>
              <span>Curated streetwear</span>
              <span>Worldwide influence</span>
              <span>Free exchange</span>
              <span>Independent culture</span>
            </div>
          ))}
        </motion.div>
      </section>

      <AnimatedSection
        id="colecoes"
        className="bg-[#d8d3c7] px-5 py-20 sm:py-28 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.35fr_.65fr]">
          <HoverCard className="group relative min-h-[620px] overflow-hidden bg-[#25251f] text-white lg:min-h-[760px]">
            <motion.img
              loading="lazy"
              decoding="async"
              src="/streetwear/editorial-hero.webp"
              alt="Editorial streetwear em tons terrosos"
              className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-[1.025]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10">
              <p className="text-[10px] font-semibold uppercase tracking-[.3em] text-white/65">
                Collection 01 / Field Notes
              </p>
              <h2 className="mt-3 max-w-lg text-4xl font-black uppercase leading-[.9] tracking-[-.06em] sm:text-6xl">
                Built for the city. Shaped by movement.
              </h2>
            </div>
          </HoverCard>
          <div className="flex flex-col bg-[#11110f] text-white">
            <div className="p-7 sm:p-10">
              <p className="text-[10px] uppercase tracking-[.3em] text-white/45">
                The uniform
              </p>
              <h3 className="mt-5 text-3xl font-black uppercase tracking-[-.05em] sm:text-4xl">
                Camadas densas. Proporções amplas.
              </h3>
              <p className="mt-5 max-w-sm text-sm leading-6 text-white/55">
                Camo tonal, washed denim, knitwear aberto e fleece heavyweight
                em uma paleta construída para combinar entre si.
              </p>
              <button
                onClick={() => {
                  setCategory("Jackets");
                  document.querySelector("#catalogo")?.scrollIntoView({
                    behavior: reduceMotion ? "auto" : "smooth",
                  });
                }}
                className="mt-8 min-h-11 border-b border-white px-1 text-[10px] font-bold uppercase tracking-[.24em]"
              >
                Explorar outerwear
              </button>
            </div>
            <div className="relative mt-auto min-h-[360px] overflow-hidden">
              <motion.img
                loading="lazy"
                decoding="async"
                src="/streetwear/editorial-look-02.jpg"
                alt="Modelo usando streetwear em tons terrosos"
                className="absolute inset-0 h-full w-full object-cover transition duration-1000 hover:scale-[1.03]"
              />
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        id="catalogo"
        className="section-grid border-y border-black/10 bg-[#f1f0eb] py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.25em] text-black/45">
                New arrivals / Drop 01
              </p>
              <h2 className="mt-3 text-4xl font-bold uppercase tracking-[-.045em] sm:text-6xl">
                Streetwear, curated.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-black/55">
                Peças de construção premium, volumes contemporâneos e uma paleta
                pensada para funcionar como uniforme.
              </p>
            </div>
            <motion.label
              animate={reduceMotion ? undefined : { scale: query ? 1.015 : 1 }}
              className="flex min-w-64 items-center gap-3 border-b border-black py-3"
            >
              <Search size={18} />
              <span className="sr-only">Buscar produtos</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar marca ou produto"
                className="w-full bg-transparent text-sm outline-none"
              />
            </motion.label>
          </div>
          <div
            className="hide-scrollbar my-10 flex gap-6 overflow-x-auto border-y border-black/10 py-5"
            aria-label="Filtrar por categoria"
          >
            {categories.map((item) => (
              <AnimatedButton
                key={item}
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`relative min-h-11 whitespace-nowrap px-1 text-[10px] font-bold uppercase tracking-[.2em] transition-colors ${category === item ? "text-black" : "text-black/42 hover:text-black"}`}
              >
                {category === item && (
                  <motion.span
                    layoutId="active-category"
                    className="absolute inset-x-0 bottom-0 h-px bg-black"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{item}</span>
              </AnimatedButton>
            ))}
          </div>
          {visible.length ? (
            <motion.div
              layout
              className="grid gap-x-4 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {visible.map((product, index) => (
                  <motion.article
                    data-motion-safe-content
                    role="button"
                    tabIndex={0}
                    aria-label={`Abrir ${product.name}`}
                    onClick={() => openProduct(product)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ")
                        openProduct(product);
                    }}
                    layout
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{
                      duration: 0.45,
                      delay: reduceMotion ? 0 : index * 0.05,
                    }}
                    key={product.id}
                    className="group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4"
                  >
                    <HoverCard className="relative aspect-[4/5] overflow-hidden bg-[#e2e0da]">
                      <motion.img
                        layoutId={`product-image-${product.id}`}
                        loading="lazy"
                        decoding="async"
                        src={product.image}
                        alt={product.imageAlt}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                      />
                      <span className="absolute left-3 top-3 bg-[#11110f] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[.2em] text-white">
                        Drop 01
                      </span>
                      <AnimatedButton
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        aria-label={
                          favorites.includes(product.id)
                            ? `Remover ${product.name} dos favoritos`
                            : `Favoritar ${product.name}`
                        }
                        className={`absolute right-3 top-3 grid h-11 w-11 place-items-center bg-white/90 backdrop-blur ${favorites.includes(product.id) ? "text-black" : "text-black/55"}`}
                      >
                        <Heart
                          size={18}
                          fill={
                            favorites.includes(product.id)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </AnimatedButton>
                      <motion.div
                        initial={false}
                        className="absolute inset-x-3 bottom-3 bg-black/90 px-4 py-3 text-center text-[9px] font-bold uppercase tracking-[.2em] text-white opacity-0 backdrop-blur transition group-hover:opacity-100"
                      >
                        Explorar produto
                      </motion.div>
                    </HoverCard>
                    <p className="mt-4 text-[9px] font-semibold uppercase tracking-[.22em] text-black/42">
                      {brandFor(product)} / {product.category}
                    </p>
                    <h3 className="mt-2 text-sm font-semibold uppercase tracking-[-.01em]">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="font-bold">{product.price}</p>
                      <p className="text-[10px] uppercase tracking-[.14em] text-black/38">
                        {product.stock < 15 ? "Últimas unidades" : "Em estoque"}
                      </p>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              data-motion-safe-content
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-dashed border-black/20 py-20 text-center"
            >
              <p className="text-lg font-semibold">Nenhum produto encontrado</p>
              <button
                onClick={() => {
                  setQuery("");
                  setCategory("Todos");
                }}
                className="mt-3 text-sm underline"
              >
                Limpar filtros
              </button>
            </motion.div>
          )}
        </div>
      </AnimatedSection>

      <AnimatedSection
        id="lookbook"
        className="bg-[#11110f] px-5 py-20 text-white sm:py-28 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[.3em] text-white/45">
                Lookbook / 001
              </p>
              <h2 className="mt-3 text-4xl font-black uppercase leading-[.9] tracking-[-.055em] sm:text-6xl">
                Desert signal.
              </h2>
            </div>
            <p className="hidden max-w-xs text-right text-xs leading-5 text-white/45 sm:block">
              Texturas naturais, volumes amplos e peças técnicas atravessando a
              mesma paisagem.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-[.75fr_1.25fr]">
            <motion.div
              data-motion-safe-content
              {...reveal}
              className="relative min-h-[520px] overflow-hidden md:min-h-[760px]"
            >
              <img
                loading="lazy"
                decoding="async"
                src="/streetwear/editorial-mobile.webp"
                alt="Editorial da coleção em ambiente urbano"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </motion.div>
            <motion.div
              data-motion-safe-content
              {...reveal}
              className="relative min-h-[420px] overflow-hidden md:min-h-[760px]"
            >
              <img
                loading="lazy"
                decoding="async"
                src="/streetwear/editorial-look-01.jpg"
                alt="Look streetwear bege com modelagem relaxada"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <p className="absolute bottom-7 left-7 text-[10px] font-semibold uppercase tracking-[.28em]">
                Sand / Earth / Asphalt
              </p>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        id="entrega"
        className="section-grid border-y border-black/10 bg-white px-5 py-24 sm:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[.25em] text-black/45">
            Entrega e conveniência
          </p>
          <h2 className="mt-3 text-4xl font-black uppercase">
            Da nossa loja até você.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="border border-black/10 p-7">
              <Truck />
              <h3 className="mt-5 font-bold uppercase">Envio nacional</h3>
              <p className="mt-2 text-sm leading-6 text-black/55">
                Despacho em até 2 dias úteis e código de rastreio por e-mail.
              </p>
            </div>
            <div className="border border-black/10 p-7">
              <PackageCheck />
              <h3 className="mt-5 font-bold uppercase">Troca simples</h3>
              <p className="mt-2 text-sm leading-6 text-black/55">
                Primeira troca grátis em até 30 dias após o recebimento.
              </p>
            </div>
            <div className="border border-black/10 p-7">
              <MapPin />
              <h3 className="mt-5 font-bold uppercase">Retire na loja</h3>
              <p className="mt-2 text-sm leading-6 text-black/55">
                Retirada demonstrativa em São Paulo após confirmação do pedido.
              </p>
            </div>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setShippingResult(
                "Entrega estimada: 3 a 6 dias úteis · frete demonstrativo R$ 19,90",
              );
            }}
            className="mt-8 flex max-w-2xl flex-col gap-3 bg-[#efefed] p-5 sm:flex-row"
          >
            <label className="sr-only" htmlFor="shipping-zip">
              CEP
            </label>
            <input
              id="shipping-zip"
              required
              inputMode="numeric"
              maxLength={9}
              value={shippingZip}
              onChange={(event) =>
                setShippingZip(event.target.value.replace(/[^0-9-]/g, ""))
              }
              placeholder="Digite seu CEP"
              className="min-h-12 flex-1 border border-black/15 bg-white px-4 outline-none focus:border-black"
            />
            <button className="min-h-12 bg-black px-6 text-xs font-bold uppercase tracking-wider text-white">
              Calcular frete
            </button>
          </form>
          {shippingResult && (
            <p role="status" className="mt-3 text-sm font-medium">
              {shippingResult}
            </p>
          )}
        </div>
      </AnimatedSection>

      <AnimatedSection
        id="suporte"
        className="border-b border-black/10 bg-[#e2e2df] px-5 py-24 sm:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.25em] text-black/45">
              Central de ajuda
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase">
              A gente resolve.
            </h2>
            <p className="mt-5 max-w-md leading-7 text-black/60">
              Atendimento fictício de segunda a sábado, das 9h às 19h, por
              WhatsApp e e-mail.
            </p>
            <p className="mt-6 font-semibold">
              contato@droplab.com.br · (11) 99999-2026
            </p>
          </div>
          <div className="divide-y divide-black/15 border-y border-black/15">
            {[
              [
                "Como acompanho meu pedido?",
                "Enviamos o código de rastreio por e-mail assim que o pedido é despachado.",
              ],
              [
                "Posso trocar na loja?",
                "Sim. Leve o produto sem sinais de uso e o comprovante da compra em até 30 dias.",
              ],
              [
                "Quais formas de pagamento?",
                "Pix com 5% de desconto e cartões em até 6x sem juros.",
              ],
              [
                "Os produtos são originais?",
                "Esta é uma loja demonstrativa de portfólio. Em um projeto real, fornecedores e notas fiscais seriam validados.",
              ],
            ].map(([question, answer]) => (
              <details key={question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-bold">
                  {question}
                  <ChevronDown
                    className="transition group-open:rotate-180"
                    size={18}
                  />
                </summary>
                <p className="pt-3 text-sm leading-6 text-black/60">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        id="loja"
        className="overflow-hidden bg-black px-5 py-24 text-white sm:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.25em] text-white/45">
              Visite a DROP/LAB
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase">
              Rua Harmonia, 128
              <br />
              Vila Madalena · SP
            </h2>
            <p className="mt-6 leading-7 text-white/60">
              Endereço fictício para demonstração. Segunda a sábado, 10h às 20h.
              Domingo, 11h às 18h.
            </p>
            <a
              href="https://maps.google.com/?q=Vila+Madalena+Sao+Paulo"
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex border border-white/35 px-6 py-3 text-xs font-bold uppercase tracking-wider transition hover:bg-white hover:text-black"
            >
              Ver região no mapa
            </a>
          </div>
          <div className="grid min-h-72 place-content-center border border-white/15 bg-[radial-gradient(circle_at_center,#333_0,#111_55%,#000_100%)] text-center">
            <MapPin className="mx-auto" size={38} />
            <p className="mt-4 text-sm font-bold uppercase tracking-[.2em]">
              Loja conceito · São Paulo
            </p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        id="sobre"
        className="mx-auto grid max-w-7xl gap-10 px-5 py-24 lg:grid-cols-2 lg:px-8"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.25em] text-black/45">
            Independent point of view
          </p>
          <h2 className="mt-4 max-w-lg text-4xl font-black uppercase leading-tight sm:text-5xl">
            Um uniforme para a cidade.
          </h2>
        </div>
        <div className="max-w-xl text-lg leading-8 text-black/60">
          <p>
            A DROP/LAB reúne streetwear contemporâneo em uma seleção de
            silhuetas amplas, materiais densos e peças construídas para durar.
          </p>
          <p className="mt-5">
            Cada drop combina roupas, acessórios e sneakers em uma paleta sóbria
            que funciona como uma coleção — não como um marketplace.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-grid border-t border-black/10 bg-[#dededb] px-5 py-24 text-black">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.25em] text-black/55">
              Drop Club
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase sm:text-5xl">
              Receba os próximos lançamentos
            </h2>
          </div>
          <form
            onSubmit={submitNewsletter}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Seu e-mail
            </label>
            <input
              id="newsletter-email"
              required
              type="email"
              placeholder="seu@email.com"
              className="min-h-14 flex-1 border border-black/30 bg-white px-5 outline-none focus:border-black"
            />
            <button className="min-h-14 bg-black px-7 text-xs font-bold uppercase tracking-[.15em] text-white transition hover:bg-black/80 active:scale-[.98]">
              Entrar no clube
            </button>
          </form>
        </div>
      </AnimatedSection>
      <footer className="bg-black px-5 py-10 text-white/55">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-xs uppercase tracking-[.14em] sm:flex-row">
          <p className="font-bold text-white">DROP/LAB</p>
          <p>
            Projeto multimarcas demonstrativo · sem afiliação com as marcas
            citadas
          </p>
        </div>
      </footer>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 z-[80] grid overflow-y-auto bg-black/60 p-3 sm:p-6 lg:place-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-label={`Detalhes de ${selectedProduct.name}`}
              initial={{ opacity: 0, y: 35, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              onClick={(event) => event.stopPropagation()}
              className="relative my-auto grid w-full max-w-5xl overflow-hidden bg-[#f8f6f1] shadow-2xl lg:grid-cols-[1.05fr_.95fr]"
            >
              <button
                aria-label="Fechar detalhes do produto"
                onClick={() => setSelectedProduct(null)}
                className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white shadow"
              >
                <X size={20} />
              </button>
              <div className="min-h-[420px] overflow-hidden bg-[#e9e5de] lg:min-h-[650px]">
                <motion.img
                  layoutId={`product-image-${selectedProduct.id}`}
                  src={selectedProduct.image}
                  alt={selectedProduct.imageAlt}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col p-6 sm:p-9 lg:p-12">
                <p className="text-xs font-semibold uppercase tracking-[.22em] text-black/45">
                  {brandFor(selectedProduct)} / {selectedProduct.category}
                </p>
                <h2 className="mt-3 pr-10 text-3xl font-black uppercase leading-tight">
                  {selectedProduct.name}
                </h2>
                <div className="mt-4 flex items-center gap-3">
                  <p className="text-xl font-bold">{selectedProduct.price}</p>
                  {selectedProduct.compareAtPrice && (
                    <p className="text-sm text-black/40 line-through">
                      {selectedProduct.compareAtPrice}
                    </p>
                  )}
                </div>
                <p className="mt-6 leading-7 text-black/65">
                  {detailsFor(selectedProduct).description}
                </p>

                <div className="mt-8 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[.16em]">
                    Escolha o tamanho
                  </p>
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="min-h-11 px-2 text-xs underline"
                  >
                    Guia de medidas
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {detailsFor(selectedProduct).sizes.map((size) => (
                    <AnimatedButton
                      key={size}
                      type="button"
                      aria-pressed={selectedSize === size}
                      onClick={() => setSelectedSize(size)}
                      className={`relative grid h-11 min-w-12 place-items-center border px-3 text-sm font-semibold transition ${selectedSize === size ? "border-black text-white" : "border-black/20 bg-transparent hover:border-black"}`}
                    >
                      {selectedSize === size && (
                        <motion.span
                          layoutId="selected-size"
                          className="absolute inset-0 bg-black"
                        />
                      )}
                      <span className="relative z-10">{size}</span>
                    </AnimatedButton>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="mt-2 text-xs text-black/45">
                    Selecione um tamanho para continuar.
                  </p>
                )}

                <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-black/10 py-6 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-black/40">
                      Material
                    </p>
                    <p className="mt-1 font-medium">
                      {detailsFor(selectedProduct).material}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-black/40">
                      Modelagem
                    </p>
                    <p className="mt-1 font-medium">
                      {detailsFor(selectedProduct).fit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-black/40">
                      Cor
                    </p>
                    <p className="mt-1 font-medium">
                      {detailsFor(selectedProduct).color}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-black/40">
                      Disponibilidade
                    </p>
                    <p className="mt-1 font-medium">
                      {selectedProduct.stock} unidades
                    </p>
                  </div>
                </div>

                <button
                  disabled={!selectedSize}
                  onClick={() => {
                    addToCart(selectedProduct, selectedSize);
                    setSelectedProduct(null);
                    setCartOpen(true);
                  }}
                  className="mt-7 w-full bg-black py-4 text-xs font-bold uppercase tracking-[.16em] text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-black/25"
                >
                  Adicionar ao carrinho
                </button>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[10px] font-semibold uppercase tracking-wider text-black/45">
                  <span>Compra segura</span>
                  <span>Troca em 30 dias</span>
                  <span>Envio nacional</span>
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sizeGuideOpen && (
          <motion.div
            className="fixed inset-0 z-[95] grid place-items-center overflow-y-auto bg-black/70 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSizeGuideOpen(false)}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-label="Guia de medidas"
              onClick={(event) => event.stopPropagation()}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="relative w-[calc(100vw-2rem)] min-w-0 max-w-2xl overflow-hidden bg-white p-6 sm:w-full sm:p-9"
            >
              <button
                aria-label="Fechar guia de medidas"
                onClick={() => setSizeGuideOpen(false)}
                className="absolute right-5 top-5"
              >
                <X />
              </button>
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-black/45">
                Encontre seu tamanho
              </p>
              <h2 className="mt-2 text-3xl font-black uppercase">
                Guia de medidas
              </h2>
              <p className="mt-4 text-sm leading-6 text-black/60">
                Meça o pé do calcanhar até o dedo mais longo. Para roupas,
                compare a largura de uma peça que veste bem.
              </p>
              {selectedProduct &&
              !["Sneakers", "Accessories"].includes(
                selectedProduct.category,
              ) ? (
                <div className="mt-7 min-w-0 max-w-full overflow-x-auto">
                  <table className="w-full min-w-[480px] text-left text-sm">
                    <thead className="border-b-2 border-black">
                      <tr>
                        <th className="py-3">Tamanho</th>
                        <th>Peito</th>
                        <th>Comprimento</th>
                        <th>Manga</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["P", "50 cm", "70 cm", "21 cm"],
                        ["M", "53 cm", "72 cm", "22 cm"],
                        ["G", "56 cm", "74 cm", "23 cm"],
                        ["GG", "59 cm", "76 cm", "24 cm"],
                        ["EGG", "62 cm", "78 cm", "25 cm"],
                      ].map((row) => (
                        <tr key={row[0]} className="border-b border-black/10">
                          {row.map((cell) => (
                            <td key={cell} className="py-3">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : selectedProduct?.category === "Sneakers" ? (
                <div className="mt-7 min-w-0 max-w-full overflow-x-auto">
                  <table className="w-full min-w-[480px] text-left text-sm">
                    <thead className="border-b-2 border-black">
                      <tr>
                        <th className="py-3">BR</th>
                        <th>Comprimento do pé</th>
                        <th>US masc.</th>
                        <th>US fem.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["38", "25,0 cm", "7", "8,5"],
                        ["39", "25,5 cm", "7,5", "9"],
                        ["40", "26,5 cm", "8,5", "10"],
                        ["41", "27,0 cm", "9", "10,5"],
                        ["42", "28,0 cm", "10", "11,5"],
                        ["43", "28,5 cm", "10,5", "12"],
                        ["44", "29,5 cm", "11,5", "13"],
                      ].map((row) => (
                        <tr key={row[0]} className="border-b border-black/10">
                          {row.map((cell) => (
                            <td key={cell} className="py-3">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="mt-7 border-y border-black/10 py-6 text-sm leading-6 text-black/60">
                  Bonés possuem ajuste traseiro. Bolsas e mochilas têm tamanho
                  único; confira as dimensões e o material na ficha do produto.
                </div>
              )}
              <p className="mt-5 text-xs leading-5 text-black/45">
                Medidas aproximadas para demonstração. Em uma loja real, a
                tabela oficial de cada fabricante deve prevalecer.
              </p>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(cartOpen || menuOpen) && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Fechar painel"
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]"
            onClick={() => {
              setCartOpen(false);
              setMenuOpen(false);
            }}
          />
        )}
      </AnimatePresence>
      <motion.aside
        initial={false}
        animate={{ x: cartOpen ? 0 : "100%", opacity: cartOpen ? 1 : 0.7 }}
        transition={{ duration: 0.38, ease: motionTokens.ease }}
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho"
        aria-hidden={!cartOpen}
        inert={!cartOpen ? true : undefined}
        className="fixed right-0 top-0 z-[60] flex h-full w-full max-w-md flex-col bg-[#f8f6f1] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-black/10 p-6">
          <div>
            <p className="text-xl font-black uppercase">Seu carrinho</p>
            <p className="mt-1 text-xs text-black/50">
              {itemCount} {itemCount === 1 ? "item" : "itens"}
            </p>
          </div>
          <button
            aria-label="Fechar carrinho"
            onClick={() => setCartOpen(false)}
            className="grid h-11 w-11 place-items-center"
          >
            <X />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length ? (
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize ?? "unico"}`}
                  className="grid grid-cols-[72px_1fr] gap-4"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="h-24 w-[72px] object-cover"
                  />
                  <div>
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{item.name}</p>
                        {item.selectedSize && (
                          <p className="mt-1 text-xs uppercase tracking-wider text-black/50">
                            Tamanho {item.selectedSize}
                          </p>
                        )}
                      </div>
                      <button
                        aria-label={`Remover ${item.name}`}
                        onClick={() =>
                          setCart((current) =>
                            current.filter(
                              (value) =>
                                !(
                                  value.id === item.id &&
                                  value.selectedSize === item.selectedSize
                                ),
                            ),
                          )
                        }
                        className="grid h-11 w-11 shrink-0 place-items-center"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="mt-1 text-sm font-bold">
                      {money(item.priceCents)}
                    </p>
                    <div className="mt-3 inline-flex items-center border border-black/15">
                      <button
                        aria-label="Diminuir quantidade"
                        onClick={() =>
                          updateQuantity(item.id, -1, item.selectedSize)
                        }
                        className="grid h-11 w-11 place-items-center text-lg leading-none"
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center text-xs">
                        {item.quantity}
                      </span>
                      <button
                        aria-label="Aumentar quantidade"
                        onClick={() =>
                          updateQuantity(item.id, 1, item.selectedSize)
                        }
                        className="grid h-11 w-11 place-items-center text-lg leading-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid h-full place-content-center text-center">
              <ShoppingBag className="mx-auto text-black/25" size={42} />
              <p className="mt-4 font-semibold">Seu carrinho está vazio</p>
              <p className="mt-2 text-sm text-black/50">
                Escolha uma peça para começar.
              </p>
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div className="border-t border-black/10 p-6">
            <div className="mb-4 flex justify-between font-bold">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <p className="mb-4 text-xs leading-5 text-black/50">
              Frete e descontos são calculados na próxima etapa. Pagamento por
              Pix ou cartão.
            </p>
            <button
              onClick={() =>
                setNotice(
                  "Checkout pronto para integrar Mercado Pago, Stripe ou WhatsApp da loja",
                )
              }
              className="w-full bg-black py-4 text-xs font-bold uppercase tracking-[.16em] text-white"
            >
              Finalizar pedido
            </button>
          </div>
        )}
      </motion.aside>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen ? true : undefined}
        className={`fixed left-0 top-0 z-[60] h-full w-[86%] max-w-sm overflow-y-auto bg-[#f4f1eb] p-6 transition-transform ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between">
          <p className="font-black uppercase tracking-[-.04em]">DROP/LAB</p>
          <button
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
            className="grid h-11 w-11 place-items-center"
          >
            <X />
          </button>
        </div>
        <nav className="mt-16 flex flex-col text-2xl font-bold uppercase">
          <a
            onClick={() => setMenuOpen(false)}
            className="border-b border-black/10 py-5"
            href="#catalogo"
          >
            Novidades
          </a>
          <a
            onClick={() => setMenuOpen(false)}
            className="border-b border-black/10 py-5"
            href="#colecoes"
          >
            Coleções
          </a>
          <a
            onClick={() => setMenuOpen(false)}
            className="border-b border-black/10 py-5"
            href="#lookbook"
          >
            Lookbook
          </a>
          <a
            onClick={() => setMenuOpen(false)}
            className="border-b border-black/10 py-5"
            href="#entrega"
          >
            Entrega
          </a>
          <a
            onClick={() => setMenuOpen(false)}
            className="border-b border-black/10 py-5"
            href="#suporte"
          >
            Suporte
          </a>
          <a
            onClick={() => setMenuOpen(false)}
            className="border-b border-black/10 py-5"
            href="#loja"
          >
            Visite
          </a>
        </nav>
      </aside>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setNotice(
            "WhatsApp demonstrativo — o número da loja será configurado para cada cliente",
          );
          window.setTimeout(() => setNotice(""), 2600);
        }}
        aria-label="Falar com a loja pelo WhatsApp"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-white/20 bg-black px-4 py-3 text-sm font-bold text-white shadow-xl"
      >
        <Heart size={21} />
        <span className="hidden sm:inline">Fale com a loja</span>
      </motion.button>
    </motion.main>
  );
}
