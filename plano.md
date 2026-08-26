# Plano de refatoração visual incremental — Portfólio de Rodrigo Normando

> Documento de planejamento. Este arquivo não autoriza iniciar nenhuma etapa, alterar código ou publicar o site. Cada etapa deve ser executada isoladamente e interrompida após o deploy para aprovação explícita.
>
> Diagnóstico realizado em 25 de agosto de 2026 a partir do código em `main`, da versão publicada em `https://rodnorm.github.io/art-portfolio/` e dos workflows públicos do repositório.

## 1. Objetivo

Refatorar incrementalmente o portfólio para uma linguagem de **galeria editorial contemporânea**, com referências a papel, pigmentos, pintura tradicional e ateliê. A galeria de obras deve se tornar o principal elemento visual, com melhor aproveitamento das proporções originais, hierarquia tipográfica mais autoral e uma experiência consistente em desktop e dispositivos móveis.

Todo o conteúdo e comportamento existentes devem ser preservados durante a refatoração: biografia, preços, prazos, traduções, obras, ordem das obras, descrições, links, WhatsApp, SEO e funcionalidades. Qualquer proposta futura que altere conteúdo, ordem, URL ou comportamento público exige aprovação separada.

O trabalho deve permanecer:

- incremental, com uma etapa coerente por vez;
- revisável por diffs pequenos;
- reversível por commit e deploy;
- validado em português, inglês e alemão;
- acessível por teclado e compatível com `prefers-reduced-motion`;
- interrompido após cada deploy para avaliação visual e aprovação.

## 2. Diagnóstico atual

### 2.1 Método e limites da análise

Legenda usada nesta seção:

- **Fato confirmado**: observado diretamente no código, nos assets, no Git, no HTML/CSS publicado ou no resumo público dos workflows.
- **Hipótese a validar**: indício consistente, mas que exige teste em navegador, acesso às configurações do repositório ou auditoria específica.

Foram analisados `package.json`, lockfile, Vite, TypeScript, ESLint, workflows, componentes, páginas, hooks, CSS, CSS Module, traduções, dados das obras, imagens, arquivos públicos, saída gerada versionada e a URL publicada.

Não há testes automatizados no repositório nem script `test` em `package.json`. A validação disponível hoje é composta por ESLint, TypeScript/Vite build, CI e testes manuais.

### 2.2 Stack existente

| Área | Estado confirmado |
| --- | --- |
| Aplicação | React 18.3.1 e React DOM 18.3.1 |
| Linguagem | TypeScript 5.6, modo `strict` |
| Build/dev server | Vite 6.4, saída em `dist` |
| Package manager | npm, confirmado por `package-lock.json` |
| Componentes | MUI 6 e MUI Icons |
| CSS-in-JS | Emotion, dependência do MUI |
| Estilos | CSS global, CSS Modules, `sx` do MUI e `style` inline |
| Dados assíncronos/cache | TanStack React Query |
| Internacionalização | i18next e react-i18next; idiomas `pt`, `en` e `de`; padrão/fallback `pt` |
| SEO | react-helmet-async, sitemap e robots públicos |
| Ícones | MUI Icons, React Icons e SVGs locais |
| Qualidade | ESLint 9; CI executa `npm ci`, lint e build |
| Deploy | GitHub Pages, por workflow e também com script local `gh-pages` |
| Testes | Nenhum framework ou script de teste configurado |
| Tailwind | Não instalado |

### 2.3 Organização da aplicação

A aplicação é uma SPA de página única. Todos os blocos são renderizados simultaneamente em `App.tsx` e a navegação usa âncoras:

```text
src/
├── App.tsx                         composição da página e providers
├── main.tsx                        entrada Vite, i18n e CSS global
├── components/
│   ├── Navbar/Navbar.tsx           AppBar + Drawer persistente do MUI
│   ├── Gallery/Gallery.tsx         grade, loading e modal/carrossel
│   ├── Gallery/Gallery.module.css  estilos efetivamente usados na galeria
│   ├── Gallery/Gallery.css         versão global duplicada e aparentemente sem consumidor
│   ├── Footer/                     rodapé
│   └── SEO/SEO.tsx                 metatags com react-helmet-async
├── pages/
│   ├── Home                        hero
│   ├── Work                        título e Gallery
│   ├── About                       biografia e retrato
│   ├── Prices                      cartões de preços
│   └── Contact                     formulário WhatsApp e redes sociais
├── data/artworks.json              21 obras, ordem e chaves de descrição
├── hooks/                          imagens, idioma e movimento reduzido
├── locales/                        pt, en e de
├── assets/img/                     originais usados pela galeria
└── types/                          tipos compartilhados
```

Pontos arquiteturais confirmados:

- `App.tsx` já separa as principais seções em componentes; não é necessário reestruturar toda a aplicação para executar o redesign.
- A galeria centraliza a lista de obras em `artworks.json`, o que facilita preservar ordem e descrições.
- O hook `usePrefersReducedMotion` existe, mas não possui consumidor; a preferência também é atendida globalmente em CSS.
- `useLanguage` existe, porém o Navbar usa diretamente `useTranslation`; há duas abordagens de idioma, mas isso não precisa ser corrigido antes do redesign.
- React Query é usado para produzir URLs estáticas e fazer preload de imagens; não há backend nem requisição remota de obras.

### 2.4 Sistemas de estilo atuais

**Fatos confirmados:**

- `App.css`, `index.css` e os CSS de páginas aplicam regras globais.
- `Gallery.module.css` aplica CSS Modules.
- `About.tsx` e `Navbar.tsx` concentram muitos estilos em `sx` e `style`.
- `Gallery.css` duplica quase integralmente `Gallery.module.css`, mas não é importado pelo componente atual.
- Não existe `ThemeProvider` nem um tema MUI próprio; os componentes usam o tema padrão.
- Cores, espaçamentos, raios e tipografia são valores isolados, sem tokens compartilhados.
- Há duas pilhas globais de fonte concorrentes: Arial em `App.css` e uma pilha de sistema em `index.css`.
- `Playfair Display` é carregada por `@import` do Google Fonts e usada em títulos.

Consequência: a interface combina aparência padrão do MUI, cartões genéricos, botão azul de formulário e estilos autorais pontuais, sem uma identidade visual única.

### 2.5 Problemas visuais

**Fatos confirmados no código e no CSS publicado:**

- Todas as `section` recebem `height: 100vh`; Home também fixa `100vh`, Work define `min-height: 100vh` e About usa `minHeight: 100vh` inline.
- A galeria reduz todas as obras a cartões quadrados de `150 × 150 px`, ou `100 × 100 px` abaixo de 600 px, usando `object-fit: cover`.
- Proporções, orientação e detalhes das obras ficam ocultos até a abertura do modal.
- Preços usam cartões brancos com sombra e raio de 10 px, visual próximo de UI genérica.
- O CTA do contato usa azul Bootstrap (`#007bff`/`#0056b3`), sem relação com o restante da identidade.
- O About usa fundo fotográfico escurecido, retrato circular e conteúdo centralizado; a composição se aproxima de landing page genérica e não de catálogo editorial.
- O menu é um Drawer padrão do MUI com textura, sem integração tipográfica ou espacial com as demais seções.
- O rodapé preto não reutiliza nenhuma cor do conteúdo.

**Hipóteses a validar em navegador:**

- O uso repetido de telas completas pode produzir ritmo lento em desktop e áreas vazias em seções curtas.
- Textos maiores de alemão podem desequilibrar cartões e seções mais severamente que português e inglês.
- `background-attachment: fixed` no hero pode apresentar comportamento ruim ou ser ignorado em navegadores móveis.

### 2.6 Problemas de responsividade

**Fatos confirmados:**

- A única media query específica de componente está na galeria, em `600px`.
- Não há ajustes explícitos para header, hero, About, preços, contato ou footer.
- A regra global fixa a altura de todas as seções, mesmo quando o conteúdo precisa crescer.
- `100vw` é usado no Home e em limites de seção; o `overflow-x: hidden` global pode mascarar overflow em vez de corrigi-lo.
- A foto do About é fixa em `300 × 300 px`.
- Cada cartão de preço tem largura fixa de `300 px`.
- O formulário limita o grupo a 400 px, mas os campos usam apenas `50%` dessa largura, resultando em cerca de 200 px.
- Espaçamentos principais são valores fixos em pixels.

**Hipóteses a validar:**

- Pode haver corte ou sobreposição vertical em 320 px de largura, landscape móvel, zoom de 200% e traduções alemãs.
- Controles do modal posicionados nas bordas podem ficar próximos demais da imagem ou das áreas seguras em telas pequenas.

### 2.7 Problemas de acessibilidade

**Pontos positivos confirmados:**

- Existe skip link.
- Existe foco global com `:focus-visible`.
- Há regra global para `prefers-reduced-motion` e uma regra específica na galeria.
- O menu possui nomes acessíveis, `aria-expanded`, Escape e devolução de foco ao botão ao fechar.
- O modal responde a Escape e setas esquerda/direita.
- Inputs possuem `label` associado e usam validação nativa `required`.

**Problemas confirmados:**

- Os cartões da galeria são `Box`/`div` clicáveis, sem `button`, `tabIndex` ou teclado; não podem ser abertos por teclado.
- O modal não captura foco, não move foco inicial, não restaura foco ao cartão de origem e não bloqueia explicitamente o scroll de fundo.
- O `aria-label="Image viewer"` do modal é fixo em inglês.
- O texto do skip link também é fixo em inglês e aponta para `#trabalhos`, mas não há um elemento `<main>` semântico.
- Há dois `h1` montados na mesma página: Home e Work.
- Alts das thumbnails são genéricos (`Trabalhos 1`, etc.), embora as descrições das obras estejam disponíveis.
- Links internos do Drawer não chamam `handleDrawerClose`; o menu permanece aberto após selecionar uma seção.
- O Drawer usa variante `persistent`, que não fornece por si só a semântica/modalidade esperada de um menu móvel temporário.
- O estado de idioma ativo usa `aria-pressed`, mas não há indicação visual consistente confirmada.

**Hipóteses a validar:**

- Contraste de textos sobre as imagens do Home/About e dos estados de foco precisa ser medido com as imagens reais.
- Ordem de foco, comportamento com leitor de tela e zoom de 200% precisam de auditoria manual.
- Áreas clicáveis dos controles do modal podem estar abaixo do alvo mínimo recomendado.

### 2.8 Problemas de performance

**Fatos confirmados:**

- Existem 26 imagens em `src/assets/img`, totalizando aproximadamente **15,0 MB**.
- Há 21 obras no JSON. Várias imagens têm aproximadamente 2–3,15 megapixels e arquivos entre 400 KB e 1,19 MB.
- Não existem thumbnails dedicadas, `srcset`, `<picture>`, AVIF ou WebP.
- Embora as imagens usem `loading="lazy"`, `useImagePreloader` inicia o download de todas as URLs em segundo plano, anulando boa parte do benefício do lazy loading.
- O bundle JavaScript gerado e versionado tem aproximadamente 428 KB sem gzip; o CSS tem aproximadamente 5,7 KB.
- Quatro imagens aparecem duplicadas entre `src/assets/img` e `public`: assinatura, imagem do hero, perfil e textura.
- O Google Font é carregado com `@import`, que pode atrasar a descoberta da fonte.
- `background-attachment: fixed` pode aumentar custo de pintura.
- `dist` está versionado, mas não consta no `.gitignore`; `build` é ignorado e também existe localmente como resíduo gerado.

**Hipóteses a validar:**

- LCP provavelmente é dominado pelo hero ou por uma imagem grande; deve ser medido, não presumido.
- O preload total pode consumir dados e memória de forma perceptível em rede móvel.
- O uso de React Query para URLs estáticas adiciona complexidade e bundle sem ganho relevante, mas sua remoção deve ser medida e feita apenas em etapa técnica aprovada.

### 2.9 Internacionalização e conteúdo

**Fatos confirmados:**

- Os três idiomas têm a mesma estrutura de alto nível e todas as 21 descrições de obras existem nos três arquivos.
- O código cria `additional` com `t('prices.<item>.additional')` para todos os preços. Essa chave não existe em `oil_portrait_a4`, `oil_portrait_pet` e `watercolor`, em nenhum idioma.
- Como i18next normalmente devolve a própria chave quando ela está ausente, essas três chaves podem aparecer literalmente na interface; o teste precisa ser feito nos três idiomas.
- Títulos e descrições passados ao SEO são majoritariamente hardcoded em português, mesmo após troca de idioma.
- Os cinco componentes de seção montam instâncias de `SEO` simultaneamente; é necessário confirmar quais metatags prevalecem no documento final.

**Conteúdo-base que não pode mudar:**

- 21 obras, na ordem de IDs: `buarque`, `dicaprio`, `crews`, `estudo_tonal`, `gagarin`, `homem_cigarro`, `homem_pano`, `matogrosso`, `mulher_sorriso`, `vila`, `gata_lily`, `frajola`, `garoto_bebendo`, `alphonse_mucha`, `mulher_cacheado`, `terry_crews`, `leonardo_dicaprio`, `mulher_flor`, `baby`, `mestre_joao`, `baby1`.
- Cinco produtos de preço: retrato a lápis A4, retrato a óleo A4, retrato a óleo 60×50, retrato a óleo de animais A4 e aquarela Art Nouveau 29×42.
- WhatsApp: `491795204649`.
- Instagram: `https://www.instagram.com/atelier.normando/`.
- TikTok: `https://www.tiktok.com/@atelier.normando`.
- Âncoras públicas: `#home`, `#trabalhos`, `#about`, `#precos`, `#contato`.

### 2.10 SEO

**Fatos confirmados:**

- Há `robots.txt`, sitemap atualizado em `public/sitemap.xml` e um sitemap antigo duplicado na raiz.
- `SEO.tsx` referencia `/og-image.png`, mas esse arquivo não existe em `public`.
- Nenhuma página passa `url` ao componente SEO; portanto, `og:url` e canonical não são renderizados pelas chamadas atuais.
- O manifest ainda usa nomes padrão do Create React App (`React App` e `Create React App Sample`).
- A SPA usa fragmentos para seções; o sitemap inclui os fragmentos.

Esses pontos devem ser corrigidos sem apagar metatags ou alterar URLs públicas. Alterações editoriais de texto SEO exigem aprovação porque fazem parte do conteúdo preservado.

### 2.11 Build, deploy e comparação com a versão publicada

**Estado atual do código em `main`:**

- `npm run build` executa `tsc -b && vite build` e gera `dist`.
- `npm run deploy` publica `dist` com `gh-pages`.
- `vite.config.ts` usa `base: '/art-portfolio/'`.
- O workflow faz build e upload de `./dist`; o job de build mais recente concluiu com sucesso.
- O CI mais recente da `main` concluiu com sucesso.
- O job `deploy` mais recente falhou antes de expor etapas no resumo público.

**Comparação observada em 25/08/2026:**

| Item | Código/artefato atual | Site publicado |
| --- | --- | --- |
| URL | Esperada: `/art-portfolio/` | `https://rodnorm.github.io/art-portfolio/` responde |
| HTML | Vite deve gerar assets com base `/art-portfolio/` | Ainda referencia `./assets/index-B3Ea01Z0.js` e `./assets/index-YsNfGUI4.css` |
| Build | `dist` | O conteúdo publicado corresponde ao build anterior, não ao último workflow |
| Workflow | Build e upload passam | Deploy da `main` falha |
| Hero | O CSS gerado versionado contém `url(./Gagarin-Focus.JPEG)` dentro de `assets/` | O CSS publicado usa `../Gagarin-Focus.JPEG`, e o arquivo existe na raiz |
| Sitemap | `public/sitemap.xml` atualizado | A URL pública de sitemap responde |

**Problema confirmado:** a versão publicada está desatualizada em relação à `main`; a falha original de `build/` já foi corrigida no código, mas o deploy ainda não termina.

**Risco confirmado antes do próximo deploy:** o CSS atual deixa `Gagarin-Focus.JPEG` relativo à pasta do CSS. A URL pública `/art-portfolio/assets/Gagarin-Focus.JPEG` retorna 404, enquanto `/art-portfolio/Gagarin-Focus.JPEG` existe. A Etapa 0 deve normalizar esse caminho e validar visualmente o hero.

**Hipótese prioritária:** a fonte de publicação em **Settings → Pages** pode ainda não estar configurada como **GitHub Actions**, ou o environment `github-pages` pode restringir a branch. Isso explica um job de deploy interrompido antes das etapas, mas precisa ser confirmado com acesso às configurações/logs privados. Não tratar como fato até essa verificação.

### 2.12 Pontos fortes a preservar

- Conteúdo artístico real e amplo, com 21 obras e descrições detalhadas.
- Três idiomas com estrutura consistente.
- Separação existente entre dados das obras e apresentação.
- Integração WhatsApp simples e direta.
- Navegação por âncoras adequada ao formato de portfólio de uma página.
- Base inicial de acessibilidade: labels, Escape/setas, skip link, foco visível e movimento reduzido.
- Hero, assinatura, retrato e textura já fornecem matéria-prima visual autoral.
- CI já verifica lint e build.
- SEO, sitemap e robots já possuem uma base que deve ser corrigida e preservada, não substituída sem necessidade.

## 3. Direção visual

### 3.1 Conceito

**Galeria editorial de ateliê**: páginas de papel quente, grandes áreas de respiro, pigmentos terrosos, tipografia serifada expressiva e imagens tratadas como obras, não como miniaturas de produto. A interface deve parecer uma combinação de catálogo de exposição e caderno de artista contemporâneo.

Evitar:

- aparência de dashboard;
- cartões elevados repetitivos;
- azul genérico de ação;
- excesso de raios arredondados;
- grid rígido que recorte todas as imagens igualmente;
- ícones e controles com aparência padrão do Material Design;
- texturas fortes atrás de textos longos.

### 3.2 Paleta principal

| Token proposto | Hex | Uso |
| --- | --- | --- |
| `paper-50` | `#FBF8F1` | fundo mais claro, campos e áreas de leitura |
| `paper-100` | `#F2EBDD` | fundo principal semelhante a papel |
| `paper-200` | `#E4D7C4` | linhas, divisórias e superfícies secundárias |
| `ink-900` | `#29251F` | texto principal e fundos escuros |
| `ink-700` | `#514A40` | texto secundário |
| `terracotta-600` | `#A6533F` | ação primária, links e detalhes editoriais |
| `terracotta-800` | `#71382D` | hover/active, texto sobre papel com maior contraste |
| `olive-600` | `#66704A` | seção secundária, etiquetas e detalhes |
| `olive-800` | `#3E472F` | fundos escuros e estados de hover |
| `umber-700` | `#5B4032` | rodapé, linhas fortes e apoio à terracota |
| `ochre-500` | `#C58B32` | acento raro, foco decorativo e destaques |
| `white` | `#FFFFFF` | texto sobre fundos escuros quando necessário |
| `error-700` | `#9A342D` | erros de formulário; não usar terracota para erro |
| `success-700` | `#3F684B` | confirmação futura, caso necessária |

Regras semânticas:

- fundo padrão: `paper-100`; superfícies de leitura: `paper-50`;
- texto principal: `ink-900`; secundário: `ink-700`;
- CTA principal: `terracotta-800` com texto claro;
- olive deve apoiar a identidade, sem competir com as obras;
- ocre deve ocupar pequena proporção da página;
- foco deve usar um token próprio de alto contraste, testado sobre fundos claros, escuros e imagens;
- todas as combinações devem ser medidas em WCAG AA antes de aprovação.

### 3.3 Tipografia

- **Títulos/display:** `Playfair Display`, já usada no projeto, preferencialmente pesos 500–700. Usar com parcimônia e tamanhos fluidos por `clamp()`.
- **Corpo:** pilha de sistema legível (`Inter` apenas se futuramente aprovada e servida de modo performático; não adicionar fonte nesta fase por padrão). Base sugerida: `system-ui, -apple-system, "Segoe UI", sans-serif`.
- **Interface/legendas:** mesma sans do corpo, com peso 600; maiúsculas apenas em labels curtos e com `letter-spacing` moderado.
- **Texto longo:** 16–18 px, `line-height` entre 1.55 e 1.7, largura ideal de 60–68 caracteres.
- **Escala sugerida:** 14, 16, 18, 22, 28, 36, 48, 64 px, convertida em `rem` e fluidificada onde necessário.

Não trocar a fonte de títulos por outra família sem mockup e aprovação, pois a Playfair já faz parte da identidade publicada.

### 3.4 Espaçamento e layout

- Unidade-base: 4 px.
- Escala: 4, 8, 12, 16, 24, 32, 48, 64, 96 e 128 px.
- Largura máxima geral: `1200–1280px`, com gutter fluido de 16 px no mobile, 24–32 px no tablet e 48 px no desktop.
- Largura de leitura: máximo de `68ch`.
- Seções devem usar `min-height` apenas quando fizer sentido; conteúdo nunca deve ser limitado por `height: 100vh`.
- Ritmo vertical deve ser definido por padding, conteúdo e relações editoriais, não por telas completas obrigatórias.

### 3.5 Bordas, raios e sombras

- Bordas editoriais: 1 px em `paper-200` ou `ink-900` com baixa opacidade.
- Imagens: raio entre 0 e 4 px; preservar aparência de papel/tela.
- Campos e botões: raio entre 2 e 6 px.
- Pills apenas para controles que semanticamente pedem esse formato, como seletor de idioma.
- Sombras discretas, semelhantes a papel apoiado: baixa opacidade e grande difusão; não usar elevação de card MUI como padrão.
- Separação deve vir principalmente de espaço, contraste de superfície e linhas finas.

### 3.6 Movimento

- Durações: 160 ms para feedback, 240 ms para controles e 400 ms no máximo para entrada editorial.
- Animar apenas `opacity` e `transform` quando possível.
- Nada deve depender de animação para ser compreendido.
- Hover de obra pode usar leve deslocamento/escala de até 1–2%, sem cortar imagem.
- Modal pode usar fade curto; navegação entre obras não deve causar movimento excessivo.
- Sob `prefers-reduced-motion: reduce`, remover transições decorativas, parallax e smooth scroll.

### 3.7 Aplicação por seção

- **Header:** barra mínima, marca tipográfica e menu claramente acionável; no desktop pode haver navegação horizontal, mantendo Drawer acessível no mobile. Se sobreposto ao hero, deve ganhar superfície legível ao rolar.
- **Hero:** imagem em proporção ampla, altura mínima responsiva, título assimétrico e pequenos detalhes editoriais. Manter nome e “Arte Tradicional”.
- **Galeria:** grid responsivo de proporções naturais, com obras maiores e respiro; nenhuma imagem deve ser forçada a quadrado. Legendas podem aparecer no foco/hover ou abaixo, sem alterar o texto existente.
- **Modal:** fundo `ink-900`, imagem com máximo aproveitamento da viewport, descrição legível e controles discretos, grandes e acessíveis.
- **Sobre Mim:** composição em duas colunas no desktop e fluxo único no mobile; retrato sem recorte circular obrigatório; assinatura/textura como detalhe, não como ruído atrás do texto.
- **Preços:** lista editorial ou tabela responsiva com hierarquia clara; evitar cinco cards idênticos elevados.
- **Contato:** campos ocupando a largura útil, CTA terracota e redes sociais integradas à composição.
- **Footer:** fundo umber/olive escuro, tipografia pequena e contraste AA.

## 4. Decisão sobre Tailwind

### 4.1 Decisão

**Não recomendar Tailwind CSS v4 para esta refatoração.**

Motivos:

1. O projeto é pequeno e já possui MUI/Emotion, CSS global, CSS Modules e `sx`; adicionar Tailwind criaria um quinto sistema durante várias etapas.
2. Os problemas atuais são falta de tokens e disciplina de uso, não incapacidade técnica do CSS existente.
3. MUI fornece Drawer, Skeleton, tipografia e primitives com uma base útil de acessibilidade; removê-lo antes de substituir esses consumidores aumentaria risco.
4. CSS Modules atende bem uma interface editorial com layouts específicos e evita grandes listas de classes utilitárias no JSX.
5. A migração para Tailwind exigiria dependência, configuração e reescrita ampla, contrariando a preferência por diffs pequenos e reversíveis.

### 4.2 Estratégia de estilos recomendada

Estado-alvo:

- **CSS global mínimo:** reset, tokens CSS, fonte-base, foco, reduced motion e helpers realmente globais.
- **CSS Modules:** layout e aparência específica de cada componente/seção.
- **Tema MUI:** espelhar paleta, tipografia, espaçamento e estados dos tokens; centralizar overrides necessários.
- **`sx`:** somente para valores dinâmicos ou composição pontual que realmente dependa do tema.
- **`style` inline:** eliminar gradualmente quando não for dinâmico.
- **CSS global de componente:** migrar para Module por etapa; não reformatar tudo de uma vez.

Sequência:

1. criar tokens e tema sem mudar visual substancialmente;
2. migrar Navbar e Home;
3. migrar Gallery, About, Prices, Contact e Footer individualmente;
4. remover CSS duplicado somente quando não houver consumidor;
5. avaliar consumidores do MUI no fim; remover dependências apenas se chegar a zero e em tarefa separada.

## 5. Estratégia de branches, commits e deploy

### 5.1 Pré-condição Git

No momento da análise, `main` está alinhada com `origin/main`, mas há mudanças do usuário em `README.md`, `.claude/` e `AGENTS.md`. Antes de iniciar a Etapa 0:

1. executar `git status`, `git branch --show-current` e `git diff`;
2. preservar essas alterações sem `stash`, reset ou inclusão acidental;
3. obter autorização/decisão do usuário caso ainda estejam presentes e impeçam trocar de branch;
4. executar `git fetch origin`;
5. criar **uma única branch** a partir da `main` remota mais recente: `feat/portfolio-visual-refactor`.

Não criar várias branches para as etapas. O mesmo PR deve acumular apenas etapas já aprovadas, cada uma em commit(s) focado(s).

### 5.2 Commits e revisão

Para cada etapa:

1. confirmar que apenas os arquivos previstos serão tocados;
2. implementar o menor conjunto coerente;
3. revisar `git diff` e `git diff --staged`;
4. executar validações;
5. criar commit Conventional Commit específico;
6. fazer push da branch;
7. atualizar o mesmo PR com resumo, validação e URL;
8. gerar o deploy manual da etapa;
9. verificar a URL e registrar o commit implantado;
10. parar e aguardar aprovação.

Exemplos de commits:

- `chore: stabilize GitHub Pages preview workflow`
- `style: add portfolio design tokens`
- `fix: make gallery modal keyboard accessible`
- `perf: add responsive artwork variants`

### 5.3 Estratégia de preview escolhida

**Escolha:** usar `workflow_dispatch` para publicar manualmente a feature branch na URL existente do GitHub Pages.

Justificativa:

- o repositório já possui GitHub Pages e `workflow_dispatch`;
- não há Vercel, Netlify, Cloudflare Pages ou outra plataforma de preview configurada;
- GitHub Pages oferece uma única publicação por repositório;
- o input `preview` de `actions/deploy-pages` continua marcado como alpha e indisponível ao público no repositório oficial da action;
- introduzir nova plataforma aumentaria escopo, configuração e superfície de segurança.

Referências:

- [GitHub Docs — execução manual e seleção de branch](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow?tool=webui)
- [GitHub Docs — custom workflows para Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [actions/deploy-pages — preview ainda indisponível publicamente](https://github.com/actions/deploy-pages)

Limitação aceita: cada preview substitui temporariamente a versão pública em `https://rodnorm.github.io/art-portfolio/`. Isso deve ser comunicado antes de cada execução. Não fazer deploy automático da feature branch a cada push.

### 5.4 Ajustes a planejar na Etapa 0

- Confirmar em **Settings → Pages** que Source está em **GitHub Actions**.
- Confirmar regras do environment `github-pages` e permitir apenas os refs aprovados.
- Manter deploy automático de `main` e deploy manual de branch.
- Garantir que a execução manual faça checkout da branch escolhida e reporte branch/SHA.
- Evitar deploy em evento `pull_request`, especialmente para forks.
- Registrar `page_url` como output.
- Não adicionar plataforma externa.

### 5.5 Procedimento padrão de deploy intermediário

1. Confirmar aprovação para substituir temporariamente a URL pública.
2. Confirmar branch e SHA: `feat/portfolio-visual-refactor`.
3. Confirmar CI verde e diff sem arquivos inesperados.
4. Em Actions → Deploy to GitHub Pages → Run workflow, selecionar a feature branch.
5. Aguardar build **e** deploy concluírem com sucesso.
6. Abrir a URL publicada em janela anônima.
7. Verificar HTML, CSS, imagens, console, navegação e a área alterada em desktop/mobile.
8. Registrar URL, SHA e workflow run no PR e na tabela de progresso.
9. Parar para aprovação.

Não chamar um deploy de concluído apenas porque o workflow iniciou.

### 5.6 Rollback padrão

- Manter no registro o último SHA e workflow de deploy aprovado.
- Se a nova etapa falhar, reexecutar imediatamente o último workflow de Pages aprovado, que preserva o mesmo SHA/contexto.
- Se a reexecução não estiver disponível, criar um ref temporário autorizado no último SHA aprovado e disparar `workflow_dispatch`; isso requer aprovação antes de criar o ref.
- No código, usar `git revert <commit-da-etapa>`; nunca reset/force-push.
- Após o merge final, rollback de produção deve ser por PR de revert do merge ou por reexecução do último deploy aprovado.

## 6. Etapas de implementação

### Etapa 0 — Estabilizar build, assets e estratégia de deploy

**Objetivo:** garantir que o código atual possa ser publicado e revertido com segurança antes de qualquer mudança visual.

**Escopo:** diagnóstico do job de deploy, configuração Pages/Actions, caminho do hero, consistência entre `dist`, base Vite e URL pública.

**Arquivos provavelmente afetados:** `.github/workflows/deploy.yml`, `package.json`, `vite.config.ts`, `src/pages/Home.css` ou `src/pages/Home.tsx`; apenas se confirmado, `.gitignore`, `public/sitemap.xml` e o sitemap duplicado da raiz.

**Alterações planejadas:**

- preservar `dist` como saída e `/art-portfolio/` como base;
- confirmar Source = GitHub Actions e environment;
- tornar o manual deploy por branch previsível;
- corrigir a referência do hero para um asset resolvido pelo Vite ou por URL pública compatível com `base`;
- decidir/documentar se `dist` deve continuar versionado; não removê-lo sem confirmar a convenção do repositório;
- confirmar que somente `public/sitemap.xml` alimenta o build antes de remover qualquer duplicata;
- atualizar action/configuração apenas se o log indicar necessidade.

**Não alterar:** layout, paleta, conteúdo, obras, traduções, preços ou componentes não relacionados.

**Dependências:** acesso de maintainer às configurações Pages e aos logs completos do job.

**Critérios de aceite:**

- `npm run lint` e `npm run build` passam;
- artifact contém `index.html`, assets, sitemap e hero no caminho correto;
- workflow manual da branch conclui build e deploy;
- URL publicada corresponde ao SHA implantado;
- hero, retrato, assinatura, textura e todas as 21 obras respondem sem 404;
- console sem erro de asset;
- rollback para o último deploy aprovado é testado ou documentado com run válido.

**Comandos de validação:** `npm ci` em ambiente limpo quando necessário, `npm run lint`, `npm run build`, `npm run preview`; inspeção de rede/console e workflow.

**Deploy:** procedimento padrão da seção 5.5 na URL existente.

**Rollback:** reexecutar o último workflow público estável e reverter apenas o commit da Etapa 0.

**Estimativa:** 3–5 horas, podendo depender de configuração externa do GitHub.

**Checklist:**

- [ ] Causa real do deploy registrada.
- [ ] Pages Source e environment conferidos.
- [ ] Hero e assets sem 404.
- [ ] Build e lint verdes.
- [ ] Deploy manual verificado na URL.
- [ ] Rollback documentado/testado.
- [ ] Etapa aprovada antes da Etapa 1.

### Etapa 1 — Criar tokens, paleta, tipografia e tema

**Objetivo:** criar a fundação visual sem redesenhar seções ainda.

**Escopo:** tokens CSS, tema MUI, reset/base tipográfica e documentação curta de uso.

**Arquivos provavelmente afetados:** novos `src/styles/tokens.css` e `src/styles/theme.ts`; `src/main.tsx`, `src/index.css`, `src/App.css` e, se necessário, `src/App.tsx` para `ThemeProvider`/`CssBaseline`.

**Alterações planejadas:** implementar a paleta da seção 3, spacing, larguras, raios, sombras, tipografia, foco e motion; mapear os mesmos valores no tema MUI; remover apenas regras globais que forem substituídas nessa etapa.

**Não alterar:** composição, texto, dimensões da galeria, navegação ou conteúdo.

**Dependências:** Etapa 0 aprovada.

**Critérios de aceite:** tokens nomeados semanticamente; contraste inicial verificado; aparência atual sem regressão estrutural; nenhuma nova dependência; foco e reduced motion preservados.

**Comandos de validação:** `npm run lint`, `npm run build`, `npm run dev`; inspeção em 320, 768 e 1440 px e nos três idiomas.

**Deploy:** publicar a branch manualmente e conferir todas as seções.

**Rollback:** revert do commit de tokens/tema e reexecução do deploy aprovado da Etapa 0.

**Estimativa:** 3–5 horas.

**Checklist:**

- [ ] Tokens CSS criados.
- [ ] Tema MUI sincronizado.
- [ ] Tipografia e foco preservados.
- [ ] Nenhuma seção redesenhada antecipadamente.
- [ ] Lint/build/deploy verificados.
- [ ] Etapa aprovada.

### Etapa 2 — Refatorar header e navegação

**Objetivo:** tornar a navegação coerente com a identidade, responsiva e totalmente operável por teclado.

**Escopo:** botão de menu, Drawer/navegação desktop, seletor de idioma, skip link e landmark principal.

**Arquivos provavelmente afetados:** `src/components/Navbar/Navbar.tsx`, novo `Navbar.module.css`, `src/App.tsx`, `src/index.css` e traduções apenas se forem necessárias novas labels sem alterar existentes.

**Alterações planejadas:** fechar menu ao selecionar links internos; avaliar navegação horizontal desktop; usar Drawer temporário no mobile; gerenciar foco; indicar idioma ativo; localizar skip link; adicionar `<main>`; preservar âncoras e TikTok.

**Não alterar:** hrefs, redes sociais, textos existentes, ordem das seções ou idioma padrão.

**Dependências:** tokens/tema aprovados.

**Critérios de aceite:** Tab/Shift+Tab/Escape funcionam; foco retorna corretamente; link interno fecha menu e chega à seção; 200% zoom sem perda; contraste AA; todos os idiomas navegáveis.

**Comandos de validação:** `npm run lint`, `npm run build`, teste manual de teclado em 320/768/1440 px.

**Deploy:** workflow manual; testar navegação na URL publicada e em janela anônima.

**Rollback:** revert do commit da Navbar e reexecução do deploy da Etapa 1.

**Estimativa:** 4–6 horas.

**Checklist:**

- [ ] Menu fecha ao navegar.
- [ ] Desktop e mobile verificados.
- [ ] Skip link e `<main>` corretos.
- [ ] Foco e idioma ativo visíveis.
- [ ] Links preservados.
- [ ] Etapa aprovada.

### Etapa 3 — Refatorar o hero

**Objetivo:** transformar o início do site em abertura editorial, mantendo o nome, subtítulo e obra de fundo.

**Escopo:** layout, tipografia, overlay, altura responsiva e tratamento da imagem do Home.

**Arquivos provavelmente afetados:** `src/pages/Home.tsx`, `src/pages/Home.css` ou `Home.module.css`; eventualmente o asset do hero sem alterar seu conteúdo.

**Alterações planejadas:** substituir `height: 100vh` por estratégia de `min-height`/padding; composição assimétrica; título fluido; overlay com contraste medido; remover `background-attachment: fixed` se os testes confirmarem custo/problema móvel.

**Não alterar:** “Rodrigo Normando”, tradução de “Arte Tradicional”, imagem escolhida ou âncora `#home`.

**Dependências:** header e tokens aprovados; caminho do hero estabilizado na Etapa 0.

**Critérios de aceite:** LCP visual sem salto evidente; texto legível sobre a imagem; sem corte inadequado em 320 px, landscape e 1440 px; reduced motion respeitado.

**Comandos de validação:** lint, build, dev/preview; inspeção de rede, console e viewports.

**Deploy:** workflow manual e comparação visual com a etapa anterior.

**Rollback:** revert do commit do Home e deploy da Etapa 2.

**Estimativa:** 3–5 horas.

**Checklist:**

- [ ] Conteúdo do hero preservado.
- [ ] Contraste medido.
- [ ] Imagem sem 404.
- [ ] Mobile/desktop aprovados.
- [ ] Etapa aprovada.

### Etapa 4A — Refatorar a grade da galeria

**Objetivo:** fazer das obras o principal elemento visual, respeitando proporções e ordem.

**Escopo:** Work, grid, cards/figures, thumbnails, loading e legendas na grade.

**Arquivos provavelmente afetados:** `src/pages/Work.tsx`, estilos de Work, `src/components/Gallery/Gallery.tsx`, `Gallery.module.css`, tipos se estritamente necessário.

**Alterações planejadas:** grid CSS responsivo ou composição editorial que preserve aspect ratio; elementos semânticos (`figure`, `button`); foco visível; dimensões intrínsecas; loading estável; descrição útil como alt; manter ordem JSON.

**Não alterar:** lista, ordem, arquivos originais, descrições ou comportamento de abrir modal.

**Dependências:** hero aprovado; otimização de arquivos completos fica para Etapa 9.

**Critérios de aceite:** 21 obras visíveis na ordem; nenhuma forçada a quadrado; abertura por Enter/Espaço; layout sem overflow; skeleton sem layout shift relevante; descrições preservadas nos três idiomas.

**Comandos de validação:** lint, build, teste de teclado; viewports 320, 375, 768, 1024 e 1440 px.

**Deploy:** workflow manual; conferir início/meio/fim da galeria e rede.

**Rollback:** revert do commit da grade e deploy da Etapa 3.

**Estimativa:** 5–8 horas.

**Checklist:**

- [ ] 21 obras e ordem preservadas.
- [ ] Proporções naturais preservadas.
- [ ] Cards acessíveis por teclado.
- [ ] Sem overflow/CLS evidente.
- [ ] Etapa aprovada.

### Etapa 4B — Refatorar modal e carrossel

**Objetivo:** tornar a visualização ampliada editorial, acessível e robusta.

**Escopo:** dialog, foco, scroll, controles, descrição, Escape e setas.

**Arquivos provavelmente afetados:** `Gallery.tsx`, `Gallery.module.css`, traduções somente para labels ausentes.

**Alterações planejadas:** foco inicial e trap; restaurar foco à obra; bloquear fundo; usar `aria-labelledby`/`aria-describedby`; localizar label; manter setas/Escape; áreas de toque adequadas; evitar fechar ao interagir com conteúdo.

**Não alterar:** imagem selecionada, sequência, descrições ou atalhos existentes.

**Dependências:** grade aprovada.

**Critérios de aceite:** dialog completo por teclado; leitor de tela anuncia título/descrição; foco não escapa; scroll de fundo bloqueado; fechamento restaura foco; 320 px e zoom 200% funcionam.

**Comandos de validação:** lint, build, teste manual Tab/Shift+Tab/Escape/setas/Enter e leitor de tela quando disponível.

**Deploy:** workflow manual e teste direto do modal na URL.

**Rollback:** revert do commit do modal e deploy da Etapa 4A.

**Estimativa:** 4–6 horas.

**Checklist:**

- [ ] Foco preso e restaurado.
- [ ] Escape/setas mantidos.
- [ ] Labels localizadas.
- [ ] Fundo não interativo.
- [ ] Mobile/zoom aprovados.
- [ ] Etapa aprovada.

### Etapa 5 — Refatorar Sobre Mim

**Objetivo:** apresentar artista, retrato e assinatura como matéria editorial, com leitura confortável.

**Escopo:** composição, imagem, overlay/textura e tipografia do About.

**Arquivos provavelmente afetados:** `src/pages/About.tsx`, `About.css` convertido para Module e referências de assets.

**Alterações planejadas:** retirar estilos estáticos de `sx`; layout duas colunas/fluxo mobile; retrato proporcional; assinatura como detalhe; largura de leitura; contraste e hierarquia `h2`.

**Não alterar:** biografia, retrato, assinatura, traduções ou âncora `#about`.

**Dependências:** tokens e ritmo de layout aprovados.

**Critérios de aceite:** texto integral nos três idiomas; sem corte em alemão; imagens sem 404; contraste AA; ordem de leitura lógica.

**Comandos de validação:** lint, build, inspeção nos três idiomas e viewports.

**Deploy:** workflow manual; comparar retrato/texto em desktop e mobile.

**Rollback:** revert do commit About e deploy da Etapa 4B.

**Estimativa:** 3–5 horas.

**Checklist:**

- [ ] Biografia idêntica.
- [ ] Retrato/assinatura preservados.
- [ ] Layout responsivo.
- [ ] Contraste e leitura aprovados.
- [ ] Etapa aprovada.

### Etapa 6 — Refatorar preços

**Objetivo:** apresentar preços e prazos com hierarquia editorial e leitura comparável.

**Escopo:** estrutura visual dos cinco itens e correção da renderização de campos opcionais.

**Arquivos provavelmente afetados:** `src/pages/Prices.tsx`, `Prices.css`/Module; traduções somente se for necessário corrigir chaves, sem mudar valores.

**Alterações planejadas:** lista/tabela responsiva; remover aparência genérica de card; renderizar `additional` apenas quando a chave existir; preservar moeda, frete, pessoas adicionais, notas e prazos.

**Não alterar:** nenhum preço, prazo, produto ou texto traduzido.

**Dependências:** tokens aprovados; inventário de preços congelado.

**Critérios de aceite:** cinco itens em cada idioma; nenhuma chave `prices.*` visível; conteúdo comparado automaticamente/manual com JSON anterior; zoom 200% e 320 px sem corte.

**Comandos de validação:** lint, build; teste dos três idiomas; busca visual/DOM por `prices.`.

**Deploy:** workflow manual e captura comparativa dos cinco produtos.

**Rollback:** revert do commit Prices e deploy da Etapa 5.

**Estimativa:** 3–5 horas.

**Checklist:**

- [ ] Preços/prazos conferidos linha a linha.
- [ ] Chaves ausentes não aparecem.
- [ ] Layout responsivo.
- [ ] Três idiomas aprovados.
- [ ] Etapa aprovada.

### Etapa 7 — Refatorar contato e rodapé

**Objetivo:** tornar o contato claro, confortável e coerente com a identidade, preservando WhatsApp e redes.

**Escopo:** formulário, CTA, links sociais e footer.

**Arquivos provavelmente afetados:** `src/pages/Contact.tsx`, `Contact.css`/Module, `src/components/Footer/Footer.tsx`, `Footer.css`/Module.

**Alterações planejadas:** campos com largura útil total; estados hover/focus/disabled coerentes; CTA terracota; targets de toque; footer umber/olive; labels localizadas quando hoje hardcoded.

**Não alterar:** número `491795204649`, template de mensagem, Instagram, TikTok, validação required, copyright ou textos.

**Dependências:** tokens e Navbar aprovados.

**Critérios de aceite:** envio abre URL `wa.me` correta com mensagem codificada nos três idiomas; campos legíveis em mobile; navegação por teclado; links externos seguros; contraste AA.

**Comandos de validação:** lint, build; teste sem enviar mensagem real; teclado e viewports.

**Deploy:** workflow manual; testar geração do link sem concluir contato externo.

**Rollback:** revert dos commits Contact/Footer e deploy da Etapa 6.

**Estimativa:** 3–5 horas.

**Checklist:**

- [ ] WhatsApp preservado.
- [ ] Links sociais preservados.
- [ ] Campos largos e acessíveis.
- [ ] Footer consistente.
- [ ] Etapa aprovada.

### Etapa 8 — Consolidação de responsividade, acessibilidade e i18n

**Objetivo:** auditar a página integrada e corrigir apenas lacunas transversais.

**Escopo:** landmarks, headings, foco, contraste, zoom, reduced motion, idiomas, overflow e estados.

**Arquivos provavelmente afetados:** somente componentes/Modules com falhas encontradas; locales se houver labels técnicas ausentes.

**Alterações planejadas:** matriz de viewports/idiomas; hierarquia única de `h1`; auditoria de teclado; contraste; touch targets; remover alturas fixas restantes; tratar textos longos; confirmar nenhuma chave visível.

**Não alterar:** identidade aprovada das etapas, conteúdo ou funcionalidade.

**Dependências:** Etapas 1–7 aprovadas.

**Critérios de aceite:** WCAG AA para contraste; 320–1440 px; zoom 200%; keyboard-only; reduced motion; três idiomas; sem overflow horizontal; sem chaves i18n expostas.

**Comandos de validação:** lint, build, axe/Lighthouse quando disponíveis, teclado, leitor de tela e inspeção de console.

**Deploy:** workflow manual e auditoria na URL, não apenas local.

**Rollback:** commits de correções separados por problema; reverter somente a correção regressiva e redeploy da Etapa 7.

**Estimativa:** 5–8 horas.

**Checklist:**

- [ ] Matriz de viewports concluída.
- [ ] Três idiomas concluídos.
- [ ] Teclado/leitor de tela verificados.
- [ ] Contraste e zoom aprovados.
- [ ] Reduced motion preservado.
- [ ] Etapa aprovada.

### Etapa 9 — Otimizar imagens e performance

**Objetivo:** reduzir transferência e melhorar carregamento sem degradar as obras.

**Escopo:** variantes de thumbnail/full, formatos modernos, estratégia de loading e métricas.

**Arquivos provavelmente afetados:** assets derivados, `artworks.json`/tipos, Gallery, Home/About e configuração de build somente se necessário.

**Alterações planejadas:** gerar variantes WebP/AVIF e fallback; dimensões e `srcset/sizes`; thumbnail separada da visualização ampliada; prioridade apenas para hero; remover preload total; manter originais de qualidade; avaliar duplicatas; medir antes/depois.

**Não alterar:** enquadramento artístico sem aprovação, lista/ordem, descrições, cor das obras ou originais.

**Dependências:** layouts finais aprovados, pois determinam tamanhos necessários.

**Critérios de aceite:** redução documentada de bytes; hero/LCP priorizado; galeria baixa apenas imagens próximas; modal recebe variante adequada; sem diferença visual inaceitável; sem 404; Lighthouse comparado.

**Comandos de validação:** lint, build, inspeção Network com cache limpo e throttling, Lighthouse; script de geração somente se for determinístico e aprovado.

**Deploy:** workflow manual; validar rede e qualidade visual na URL.

**Rollback:** manter originais e reverter manifest/código/variantes da etapa; deploy da Etapa 8.

**Estimativa:** 6–10 horas.

**Checklist:**

- [ ] Baseline de bytes/LCP registrada.
- [ ] Thumbnails e full-size separados.
- [ ] `srcset/sizes` validado.
- [ ] Preload total removido/ajustado.
- [ ] Qualidade artística aprovada.
- [ ] Etapa aprovada.

### Etapa 10 — Limpeza técnica, SEO e deploy final

**Objetivo:** remover apenas resíduos comprovadamente sem uso, consolidar SEO e publicar a versão aprovada.

**Escopo:** CSS duplicado, estilos inline remanescentes, dependências sem consumidor, saída gerada, sitemap/manifest/metatags e documentação.

**Arquivos provavelmente afetados:** `Gallery.css`, CSS globais, `package.json`/lockfile somente para dependências realmente sem consumidor, `.gitignore`, `dist` se a política aprovada deixar de versioná-lo, SEO, manifest, sitemap e README.

**Alterações planejadas:** remover duplicações após `rg` de consumidores; alinhar canonical/OG e imagem existente; localizar SEO quando aprovado; corrigir manifest legado; decidir sitemap único; documentar build/deploy; auditoria final.

**Não alterar:** conteúdo editorial ou URLs sem aprovação; não remover MUI/Emotion/React Query enquanto houver consumidor; não fazer upgrade amplo.

**Dependências:** todas as etapas visuais e de performance aprovadas.

**Critérios de aceite:** lint/build/CI verdes; nenhuma dependência ou CSS órfão conhecido; SEO sem 404; deploy final concluído; URL aberta e funcional; Lighthouse/auditoria registrada; conteúdo comparado ao baseline.

**Comandos de validação:** `npm ci`, `npm run lint`, `npm run build`, preview, inspeção de bundle, links, sitemap, robots, metatags, console, axe/Lighthouse.

**Deploy:** merge somente após aprovação do PR; deploy de `main`; verificar URL exata e SHA implantado.

**Rollback:** revert do merge por PR ou reexecução do último deploy aprovado; preservar branch até confirmação.

**Estimativa:** 4–7 horas.

**Checklist:**

- [ ] Código/CSS órfão removido com evidência.
- [ ] Dependências revisadas sem remoção antecipada.
- [ ] SEO/manifest/sitemap verificados.
- [ ] Conteúdo comparado ao baseline.
- [ ] CI e deploy final verdes.
- [ ] URL final verificada.
- [ ] Refatoração aprovada.

## 7. Regras obrigatórias de preservação

Antes de cada commit e deploy, comparar com o baseline e confirmar:

- [ ] Textos e biografia permanecem inalterados em conteúdo e significado.
- [ ] Todos os preços permanecem inalterados em cada idioma.
- [ ] Todos os prazos e observações permanecem inalterados.
- [ ] Traduções em português, inglês e alemão permanecem disponíveis.
- [ ] Links do Instagram e TikTok permanecem idênticos.
- [ ] Número do WhatsApp permanece `491795204649`.
- [ ] Template e codificação da mensagem WhatsApp continuam funcionando.
- [ ] As 21 obras permanecem presentes.
- [ ] A ordem das 21 obras permanece igual ao JSON atual, salvo aprovação explícita.
- [ ] Descrições, técnicas, nomes e dimensões das obras permanecem iguais.
- [ ] Imagens originais não são sobrescritas; variantes são derivadas.
- [ ] Âncoras `#home`, `#trabalhos`, `#about`, `#precos` e `#contato` continuam válidas.
- [ ] SEO existente não é removido; correções devem manter ou ampliar cobertura.
- [ ] Sitemap e robots continuam acessíveis.
- [ ] Navegação por teclado existente é preservada e ampliada.
- [ ] Escape e setas do modal continuam funcionando.
- [ ] Foco visível continua disponível.
- [ ] `prefers-reduced-motion` continua respeitado.
- [ ] Nenhuma nova plataforma, dependência ou serviço é introduzido sem aprovação.
- [ ] Nenhum deploy é considerado aprovado sem inspeção da URL.

## 8. Definição de pronto

A refatoração só estará completa quando todos os itens forem verdadeiros:

### Código e entrega

- [ ] `npm ci`, `npm run lint` e `npm run build` passam em ambiente limpo.
- [ ] CI da `main` está verde.
- [ ] Workflow de GitHub Pages conclui build e deploy.
- [ ] URL `https://rodnorm.github.io/art-portfolio/` corresponde ao commit final.
- [ ] Não há 404 de assets nem erros óbvios no console.
- [ ] Rollback está documentado e usa um commit/deploy conhecido.

### Visual e responsividade

- [ ] Todas as etapas visuais foram aprovadas individualmente.
- [ ] Galeria é o principal elemento visual e preserva proporções das obras.
- [ ] Layout funciona em 320, 375, 768, 1024 e 1440 px.
- [ ] Layout funciona em orientação landscape e zoom de 200%.
- [ ] Não há overflow horizontal ou conteúdo cortado por `100vh`.
- [ ] Identidade usa consistentemente papel, terracota, oliva, umber e ocre.

### Acessibilidade

- [ ] Navegação completa por teclado.
- [ ] Modal gerencia e restaura foco.
- [ ] Landmarks e headings são semânticos.
- [ ] Contraste atende WCAG AA.
- [ ] Controles possuem nomes e alvos adequados.
- [ ] `prefers-reduced-motion` é respeitado.
- [ ] Auditoria axe, Lighthouse ou equivalente não apresenta erro crítico conhecido.

### Conteúdo, i18n e SEO

- [ ] Textos, biografia, preços, prazos, links e WhatsApp foram preservados.
- [ ] 21 obras, ordem e descrições foram preservadas.
- [ ] Português, inglês e alemão foram testados.
- [ ] Nenhuma chave de tradução está visível.
- [ ] Metatags, canonical, OG image, sitemap, robots e manifest foram verificados.

### Performance

- [ ] Imagens possuem variantes e dimensões adequadas ao uso.
- [ ] A galeria não faz preload indiscriminado de todas as obras.
- [ ] LCP, CLS, peso transferido e quantidade de requests foram registrados antes/depois.
- [ ] Lighthouse mobile/desktop ou auditoria equivalente foi anexada ao PR.
- [ ] Qualidade visual das obras foi aprovada após compressão.

## 9. Registro de progresso

Atualizar esta tabela somente após validação e deploy real. Todas as etapas começam pendentes.

| Etapa | Status | Branch/commit | Deploy | Aprovada |
| --- | --- | --- | --- | --- |
| Etapa 0 — Build, assets e deploy | Concluída — aguardando aprovação | `feat/portfolio-visual-refactor` / `ffdeb6b` | Dispensado pelo usuário; validação local | Não |
| Etapa 1 — Tokens, paleta e tipografia | Concluída — aguardando aprovação | `feat/portfolio-visual-refactor` / `362ef78` | Dispensado pelo usuário; validação local | Não |
| Etapa 2 — Header e navegação | Concluída — aguardando aprovação | `feat/portfolio-visual-refactor` / `90da7ce` | Dispensado pelo usuário; validação local | Não |
| Etapa 3 — Hero | Concluída — aguardando aprovação | `feat/portfolio-visual-refactor` / `cf876ae` | Dispensado pelo usuário; validação local | Não |
| Etapa 4A — Grade da galeria | Concluída — aguardando aprovação | `feat/portfolio-visual-refactor` / `a631e5f` | Dispensado pelo usuário; validação local | Não |
| Etapa 4B — Modal e carrossel | Concluída — aguardando aprovação | `feat/portfolio-visual-refactor` / `b325c9b` | Dispensado pelo usuário; validação local | Não |
| Etapa 5 — Sobre Mim | Concluída — aguardando aprovação | `feat/portfolio-visual-refactor` / `b76c450` | Dispensado pelo usuário; validação local | Não |
| Etapa 6 — Preços | Concluída — aguardando aprovação | `feat/portfolio-visual-refactor` / `4fa52d8` | Dispensado pelo usuário; validação local | Não |
| Etapa 7 — Contato e rodapé | Concluída — aguardando aprovação | `feat/portfolio-visual-refactor` / `3afc219` | Dispensado pelo usuário; validação local | Não |
| Etapa 8 — Responsividade, acessibilidade e i18n | Concluída — aguardando aprovação | `feat/portfolio-visual-refactor` / `c01464c` | Dispensado pelo usuário; validação local | Não |
| Etapa 9 — Imagens e performance | Concluída — aguardando aprovação | `feat/portfolio-visual-refactor` / `818af41` | Dispensado pelo usuário; validação local | Não |
| Etapa 10 — Limpeza, SEO e deploy final | Concluída — aguardando aprovação | `feat/portfolio-visual-refactor` / `aaeba43` | Dispensado pelo usuário; validação local | Não |

**Regra de execução:** concluir uma única etapa, validar, fazer commit/push, publicar, informar URL e SHA, atualizar somente a linha correspondente e parar. A próxima etapa exige aprovação explícita.
