# Rodrigo Normando Art

Portfólio de arte tradicional em página única, com galeria, informações sobre o artista, preços e formulário de contato. A interface está disponível em português, inglês e alemão.

## Requisitos

- Node.js 20
- npm

## Desenvolvimento local

```bash
npm ci
npm run dev
```

O Vite inicia o servidor local na porta `3000`. Como o projeto usa a base pública `/art-portfolio/`, abra `http://localhost:3000/art-portfolio/`.

Copie `.env.example` para `.env.local` e preencha `VITE_FORMSPREE_FORM_ID` para testar o envio do formulário. No GitHub Pages, configure a mesma chave como uma repository variable em **Settings → Secrets and variables → Actions → Variables**.

## Validação

```bash
npm run lint
npm run build
npm run preview
```

O build de produção é criado em `dist/`. O preview local usa a mesma base pública do GitHub Pages.

## Deploy

O workflow `.github/workflows/deploy.yml` executa `npm ci`, gera `dist/` e publica esse diretório no GitHub Pages após alterações em `main` ou execução manual. O endereço público configurado é:

`https://rodnorm.github.io/art-portfolio/`

O script `npm run deploy` permanece disponível para publicação manual com `gh-pages`, quando necessário.

## Estrutura principal

- `src/pages/` — seções da página única
- `src/components/` — navegação, galeria, SEO e rodapé
- `src/locales/` — traduções em português, inglês e alemão
- `src/assets/img/` — imagens originais
- `src/assets/generated/` — variantes WebP responsivas
- `public/` — manifest, robots, sitemap e arquivos públicos
