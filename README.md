# DROP/LAB — Premium Streetwear

Storefront demonstrativa de streetwear premium criada para portfólio. A experiência inclui catálogo, busca, filtros, favoritos, detalhes do produto, guia de medidas, cálculo de frete demonstrativo e carrinho persistido no navegador.

## Funcionalidades

- Catálogo local, sem dependência de banco externo na demonstração
- Busca instantânea e filtros por categoria
- Favoritos e carrinho persistidos no navegador
- Detalhes de produto, seleção de tamanho e limite por estoque
- Menu, modais e carrinho adaptados para celular
- Animações com Framer Motion e suporte a `prefers-reduced-motion`
- Metadados sociais e imagem Open Graph
- Build Next.js dedicado à Vercel
- Build Vite/vinext separado para OpenAI Sites

O checkout é demonstrativo. Para uso comercial, conecte pagamentos, frete, autenticação, estoque e gestão de pedidos reais.

## Desenvolvimento e validação

```bash
npm install
npm run dev
```

Validação completa da entrega para Vercel:

```bash
npm run check
```

Build alternativo para OpenAI Sites:

```bash
npm run build:sites
```

## Publicação

- A Vercel usa `vercel.json`, detecta o framework Next.js e executa `npm run build`.
- O diretório de saída da Vercel deve permanecer no padrão automático do Next.js; não configure `dist` como saída.
- A página usa âncoras como `/#catalogo` e `/#loja`. Elas não precisam de regras de rewrite nem de React Router.
- A demonstração não exige variáveis de ambiente para funcionar.
- A configuração em `.openai/hosting.json` pertence exclusivamente ao build de OpenAI Sites.

## Estrutura principal

- `app/`: página, layout e estilos globais
- `components/storefront/`: experiência interativa da loja
- `lib/demo-products.ts`: catálogo demonstrativo e caminhos locais das imagens
- `public/streetwear/`: imagens locais substituíveis do catálogo
- `db/` e `drizzle/`: base opcional para persistência futura
- `worker/`: entrada do build alternativo para OpenAI Sites

Projeto demonstrativo para portfólio. Antes de uma operação comercial, substitua os dados fictícios e confirme as licenças de uso de todas as imagens e marcas.
