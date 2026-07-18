import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://brito-suyama-advocacia.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Brito & Suyama Advocacia | Advogados em Itanhaém",
  description:
    "Atuação em Direito Cível, Trabalhista e Previdenciário, com orientação clara e atendimento profissional em Itanhaém e região.",
  keywords: [
    "advogado em Itanhaém",
    "advocacia Itanhaém",
    "direito cível Itanhaém",
    "direito trabalhista Itanhaém",
    "direito previdenciário Itanhaém",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Brito & Suyama Advocacia",
    title: "Brito & Suyama Advocacia",
    description: "Ética, excelência e atendimento próximo em Itanhaém.",
  },
};

const legalBusiness = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Brito & Suyama Advocacia",
  description: "Escritório de advocacia com atuação nas áreas Cível, Trabalhista e Previdenciária.",
  telephone: "+55 13 99681-6741",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Walter Miranda, 2590 — Jardim Tropical",
    addressLocality: "Itanhaém",
    addressRegion: "SP",
    postalCode: "11740-000",
    addressCountry: "BR",
  },
  areaServed: "Itanhaém e região",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(legalBusiness) }}
        />
      </body>
    </html>
  );
}
