"use client";

import Link from "next/link";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const navigation = [
  { name: "Início", href: "/" },
  { name: "Novidades", href: "#novidades" },
  { name: "Camisetas", href: "#categorias" },
  { name: "Calças", href: "#categorias" },
  { name: "Acessórios", href: "#categorias" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setHasScrolled(window.scrollY > 20);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <>
      <div className="bg-black px-4 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-white sm:text-xs">
        Frete grátis para compras acima de R$ 299
      </div>

      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          hasScrolled
            ? "border-black/10 bg-[#f7f5f2]/95 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-md"
            : "border-transparent bg-[#f7f5f2]"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setIsMenuOpen(true)}
            className="transition hover:opacity-50 lg:hidden"
          >
            <Menu size={23} strokeWidth={1.7} />
          </button>

          <Link
            href="/"
            className="text-base font-black uppercase tracking-[0.25em] sm:text-xl"
          >
            Vértice Men
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative py-2 transition hover:opacity-55"
              >
                {item.name}
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-black transition-transform duration-300 hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Pesquisar"
              className="transition hover:opacity-50"
            >
              <Search size={20} strokeWidth={1.7} />
            </button>

            <button
              type="button"
              aria-label="Favoritos"
              className="hidden transition hover:opacity-50 sm:block"
            >
              <Heart size={20} strokeWidth={1.7} />
            </button>

            <button
              type="button"
              aria-label="Minha conta"
              className="hidden transition hover:opacity-50 sm:block"
            >
              <User size={20} strokeWidth={1.7} />
            </button>

            <button
              type="button"
              aria-label="Carrinho"
              className="relative transition hover:opacity-50"
            >
              <ShoppingBag size={20} strokeWidth={1.7} />

              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] text-white">
                0
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        aria-hidden={!isMenuOpen}
        onClick={closeMenu}
        className={`fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-label="Menu principal"
        className={`fixed left-0 top-0 z-[80] flex h-full w-[86%] max-w-sm flex-col bg-[#f7f5f2] px-6 py-6 transition-transform duration-500 ease-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/10 pb-6">
          <p className="text-lg font-black uppercase tracking-[0.24em]">
            Vértice Men
          </p>

          <button
            type="button"
            aria-label="Fechar menu"
            onClick={closeMenu}
            className="flex h-10 w-10 items-center justify-center border border-black/15 transition hover:bg-black hover:text-white"
          >
            <X size={21} strokeWidth={1.6} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-center">
          {navigation.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={closeMenu}
              className="flex items-center justify-between border-b border-black/10 py-5 text-xl font-bold uppercase tracking-[-0.02em]"
            >
              {item.name}

              <span className="text-xs font-medium text-black/35">
                0{index + 1}
              </span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-black/10 pt-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-black/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em]"
            >
              <User size={17} />
              Conta
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-black/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em]"
            >
              <Heart size={17} />
              Favoritos
            </button>
          </div>

          <p className="mt-6 text-xs leading-5 text-black/45">
            Moda masculina contemporânea, direta e sem excessos.
          </p>
        </div>
      </aside>
    </>
  );
}
