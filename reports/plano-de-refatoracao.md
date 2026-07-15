# Plano de Refatoração - Portfolio de Arte

## 1. Análise da Arquitetura Atual

### 1.1 Visão Geral do Projeto

O projeto é um **portfólio de artista tradicional** construído com React (Create React App), utilizando:
- **Framework**: React 18.3.1 com TypeScript 4.9.5
- **UI Library**: MUI (Material UI) v6
- **Internacionalização**: i18next + react-i18next
- **Build**: React Scripts 5.0.1
- **Deploy**: GitHub Pages via gh-pages

### 1.2 Estrutura de Diretórios

```
src/
├── App.tsx              # Componente raiz (SPA single-page)
├── index.tsx           # Entry point
├── i18n.js             # Configuração de internacionalização
├── navbar/
│   └── NavbarMui.tsx   # Menu lateral (Drawer) com MUI
├── Home/
│   ├── Home.tsx
│   └── Home.css
├── Work/
│   ├── Work.tsx        # Galeria de imagens (hardcoded)
│   └── Work.css
├── About/
│   ├── About.tsx       # Sobre o artista
│   └── About.css
├── Prices/
│   ├── Prices.tsx      # Tabela de preços
│   └── Prices.css
├── Contact/
│   ├── Contact.tsx     # Formulário WhatsApp
│   └── Contact.css
├── Footer/
│   ├── Footer.tsx
│   └── Footer.css
├── ImageCard/
│   ├── ImageCard.tsx   # Modal de visualização de imagens
│   └── ImageCard.css
├── locales/            # Arquivos de tradução
│   ├── pt/pt.json
│   ├── en/en.json
│   └── de/de.json
└── assets/
    ├── img/            # Imagens das obras (21 arquivos JPEG)
    └── icons/          # SVG icons (instagram, tiktok)
```

### 1.3 Problemas Identificados

| # | Categoria | Problema | Impacto |
|---|-----------|----------|---------|
| 1 | **Build** | Create React App (obsoleto) | Sem suporte ativo, vulnerabilidades |
| 2 | **Performance** | Imagens hardcoded com `require()` | Sem lazy loading, bundle grande |
| 3 | **Performance** | Todas as imagens em memória | Loading lento inicial |
| 4 | **Manutenção** | Imagens no código fonte | Dificil adicionar/remover obras |
| 5 | **Arquitetura** | Monolito (App.tsx) | Dificil manutenção |
| 6 | **Estilo** | CSS Modules + MUI inline styles | Inconsistência |
| 7 | **Tipos** | TypeScript 4.9.5 (antigo) | Recursos limitados |
| 8 | **SEO** | SPA sem SSR | indexing ruim |
| 9 | **Acessibilidade** | Falta atributos ARIA | Violação WCAG |
| 10 | **Responsividade** | Breakpoints não otimizados | UX mobile mediana |

### 1.4 Pontos Fortes

- ✅ Internacionalização (pt/en/de) bem implementada
- ✅ UI em MUI com theming consistente
- ✅ Navegação com drawer responsivo
- ✅ Modal de imagens com keyboard navigation
- ✅ Integração WhatsApp funcional

---

## 2. Plano de Ação

### Fase 1: Infraestrutura e Modernização

| Prioridade | Tarefa | Esforço |
|------------|--------|---------|
| **P1** | Migrar de CRA para Vite + React | Médio |
| **P1** | Atualizar TypeScript para 5.x | Baixo |
| **P1** | Adicionar ESLint + Prettier | Baixo |
| **P2** | Configurar ambiente de desenvolvimento | Baixo |

#### 1.1 Migrar CRA → Vite

**Por que**: 
- Build 10-100x mais rápido
- Suporte ativo
- Hot Module Replacement superior

**Como**:
```bash
npm create vite@latest . -- --template react-ts
# Copiar configurações necesarias
```

### Fase 2: Arquitetura e Componentes

| Prioridade | Tarefa | Esforço |
|------------|--------|---------|
| **P1** | Extrair dados de imagens para JSON | Baixo |
| **P1** | Criar componente Gallery com lazy loading | Médio |
| **P1** | Implementar react-query para cache de imagens | Médio |
| **P2** | Separar estilos para CSS Modules | Médio |
| **P2** | Criar custom hooks (useImages, useLanguage) | Médio |
| **P3** | Adicionar skeleton loaders | Médio |

#### 2.1 Estrutura Proposta

```
src/
├── components/
│   ├── Layout/
│   │   ├── Navbar/
│   │   └── Footer/
│   ├── Gallery/
│   │   ├── ImageCard/
│   │   ├── ImageModal/
│   │   └── Gallery.tsx
│   ├── Pricing/
│   └── Contact/
├── hooks/
│   ├── useGallery.ts
│   └── useLanguage.ts
├── data/
│   └── artworks.json
├── i18n/
│   └── config.ts
├── styles/
│   └── theme.ts
├── pages/
│   ├── Home.tsx
│   ├── Work.tsx
│   ├── About.tsx
│   ├── Prices.tsx
│   └── Contact.tsx
└── types/
    └── index.ts
```

### Fase 3: SEO e Performance

| Prioridade | Tarefa | Esforço |
|------------|--------|---------|
| **P1** | Adicionar react-helmet-async para meta tags | Baixo |
| **P1** | Otimizar imagens (WebP + CDN) | Médio |
| **P2** | Implementar next/image ou equivalente | Médio |
| **P2** | Adicionar sitemap.xml dinâmico | Baixo |
| **P3** | Preparar para SSR (opcional) | Alto |

### Fase 4: Acessibilidade e UX

| Prioridade | Tarefa | Esforço |
|------------|--------|---------|
| **P1** | Auditoria Lighthouse | Baixo |
| **P1** | Adicionar atributos ARIA faltantes | Médio |
| **P1** | Melhorar contraste de cores | Baixo |
| **P2** | Keyboard navigation completa | Médio |
| **P2** | Motion preferences (reduce-motion) | Baixo |

### Fase 5: Deploy e CI/CD

| Prioridade | Tarefa | Esforço |
|------------|--------|---------|
| **P2** | Configurar GitHub Actions | Médio |
| **P2** | Adicionar deploy to GitHub Pages | Médio |
| **P3** | Configurar preview deployments | Médio |

---

## 3. Roadmap Sugerido

```
Semana 1: Infraestrutura
├── [ ] Migração CRA → Vite
├── [ ] TypeScript 5.x
└── [ ] ESLint + Prettier

Semana 2: Arquitetura
├── [ ] Extrair dados para JSON
├── [ ] Criar estrutura de componentes
├── [ ] Custom hooks
└── [ ] CSS Modules

Semana 3: Performance
├── [ ] Lazy loading de imagens
├── [ ] Otimização de assets
├── [ ] Meta tags dinâmicas
└── [ ] Skeleton loaders

Semana 4: Polish
├── [ ] Acessibilidade
├── [ ] SEO
├── [ ] Testes
└── [ ] Deploy
```

---

## 4. Estimativa de Esforço

| Fase | Tempo Estimado |
|------|----------------|
| Fase 1 (Infra) | 4-6 horas |
| Fase 2 (Arquitetura) | 8-12 horas |
| Fase 3 (Performance) | 6-8 horas |
| Fase 4 (A11y/UX) | 4-6 horas |
| Fase 5 (Deploy) | 2-4 horas |
| **Total** | **24-36 horas** |

---

## 5. Riscos e Mitigações

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| Breaking changes na migração | Média | Backup do projeto, testes incrementais |
| Imagens quebradas após refatoração | Alta | Usar caminhos relativos, validar paths |
| Regressão de estilos | Média |Snapshot tests, Chromatic |
| Tempo de desenvolvimento | Alta | Dividir em fases menores |

---

## 6. Próximos Passos

1. **Aprovar este plano** - Revisar e confirmar escopo
2. **Backup do projeto** - Criar branch `backup-pre-refactor`
3. **Iniciar Fase 1** - Começar migração CRA → Vite

---

*Documento gerado em: 2026-07-15*