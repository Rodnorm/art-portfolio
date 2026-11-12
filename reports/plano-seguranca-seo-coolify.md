# Plano de segurança, SEO e migração — Rodrigo Normando Art

Data: 12/11/2026. Estado: proposta para implementação; nenhuma configuração de produção foi alterada por este plano.

## 1. Objetivo e escopo

Preparar o portfólio para receber encomendas, ser publicado em domínio próprio no Coolify e ser descoberto pelo Google. Priorizar Alemanha/Essen, preservando português e inglês, identidade visual, obras e acessibilidade.

O Search Console permite verificar propriedade, enviar sitemap e acompanhar indexação; não garante inclusão no índice ou posição nas buscas. Segurança também não é um selo de ranking. O objetivo técnico é um site rápido, rastreável, confiável e fácil de manter. [1–4]

Este plano não autoriza deploy, DNS, troca de domínio, mudanças no Formspree ou publicação de dados pessoais. Essas ações compõem uma etapa posterior. A seleção técnica abaixo já permite desenvolver e validar localmente antes dessas decisões.

## 2. Diagnóstico confirmado

Leitura da `main` no commit `8cbfac6`, arquivos relacionados e respostas HTTP públicas em 12/11/2026. A branch de preços `chore/update-commission-prices` termina em `290fd61` e deve ser preservada. Não se deve partir do HTML antigo em `dist` para construir a nova publicação.

| Área | Evidência | Consequência/prioridade |
| --- | --- | --- |
| HTML inicial | `index.html` tem metadados genéricos em português e `<div id="root"></div>` vazio | Conteúdo depende da execução de JS; priorizar geração de HTML por idioma — P0 |
| Idiomas | i18next inicia em `pt`; seletor troca idioma na mesma URL | Traduções não têm URLs próprias para descoberta e compartilhamento — P0 |
| Metadados | `SEO.tsx` fixa domínio GitHub Pages; Home passa título/descrição em português | Corrigir origem, idioma e metadados no HTML gerado — P0 |
| Sitemap | Cinco entradas representam a mesma página, quatro com fragmentos; `lastmod` fixo em julho | Substituir por URLs canônicas reais — P0 |
| Robots | Arquivo em `/art-portfolio/robots.txt`; `/robots.txt` do host respondeu 404 | O arquivo em subdiretório não é o robots de controle do host; no novo domínio usar a raiz — P0 [5] |
| Cabeçalhos | HTTPS e HSTS presentes; CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy e X-Frame-Options ausentes na resposta observada | Configurar no novo servidor; ausência isolada não comprova exploração — P0 |
| Terceiros | Google Fonts via `@import`; POST direto ao Formspree | Hospedar fonte local e delimitar dependências externas — P1 |
| Formulário | Tem honeypot `_gotcha`, required, estado de envio e tratamento de falha; não tem limites explícitos de comprimento | Manter pontos positivos e revisar antispam no provedor — P1 |
| Build | Vite base `/art-portfolio/`, npm lockfile, CI Node 20; 108 arquivos de `dist` rastreados no Git | Construir de fontes e lockfile; adaptar base ao novo host — P0 |
| Operação | Não há Dockerfile/configuração de servidor na árvore examinada | Criar entrega reproduzível para Coolify — P0 |
| Conteúdo | 21 obras, descrições traduzidas, WebP responsivo, dimensões, legendas, galeria por teclado e um H1 | Preservar; enriquecer sem refazer funcionalidades existentes |

Limites: não foi executado pentest, scan da VPS, npm audit ou avaliação de permissões administrativas. Não foram acessados Coolify, DNS, Search Console ou painel Formspree. Não há base para afirmar ausência de vulnerabilidades ou conformidade jurídica. Os cabeçalhos observados passam pela infraestrutura de acesso e devem ser confirmados no novo domínio.

## 3. Decisões propostas

### 3.1 Domínio e idiomas

Usar domínio próprio dedicado ao ateliê. `art.normando.dev` é apenas uma sugestão; disponibilidade, DNS e decisão do proprietário ainda precisam ser confirmados. Usar `SITE_ORIGIN` como placeholder até então, sem colocar domínio provisório em canonical de produção.

| URL no domínio final | Conteúdo | Idioma |
| --- | --- | --- |
| `/` | Redirecionamento permanente para `/de/` | Entrada única e previsível |
| `/de/` | Portfólio completo e encomendas | `de` |
| `/pt/` | Portfólio completo e encomendas | `pt-BR` |
| `/en/` | Portfólio completo e encomendas | `en` |
| `/impressum/` e `/datenschutz/` | Informações próprias do site | Alemão inicialmente; traduções quando preparadas |

Canonical de cada tradução aponta para ela mesma. `hreflang` recíproco entre as três páginas, com `pt-BR` para a URL `/pt/`; `x-default` pode apontar para `/de/`, a entrada padrão. Links de idioma devem ser `<a href>` reais. A URL determina o idioma inicial; preferência salva não pode sobrepor uma URL explícita. Não redirecionar por IP ou forçar idioma do navegador. As âncoras de galeria/preços/contato continuam funcionando dentro de cada idioma. [2]

Preservar os valores aprovados na branch de preços; a tabela PT já usa reais e DE/EN usam euros. Essa diferença comercial deve ser documentada, sem introduzir uma conversão automática ou mudar moeda apenas por geolocalização.

### 3.2 Renderização

Manter React/Vite e gerar HTML estático por rota no build. O site tem poucas páginas e conteúdo estável: não há justificativa inicial para backend, banco de dados ou servidor Node permanente.

Fazer primeiro uma prova pequena de pré-renderização/SSG integrada ao build. Selecionar ferramenta compatível com as versões instaladas apenas após verificar manutenção e hidratação; não escolher uma dependência por suposição. Produzir o mesmo conteúdo para pessoas e buscadores, sem detecção especial de bot. [1]

Critério decisivo: os arquivos HTML devem conter título, descrição, canonical, hreflang, H1, texto de encomenda, preços, legendas e imagens da galeria antes de executar JS. Resolver os dados locais das imagens na geração; não capturar apenas os skeletons de React Query. Confirmar ausência de divergência de idioma, tema ou hidratação. Se a solução exigir reescrever o projeto, apresentar o custo da alternativa antes de migrar de framework.

### 3.3 Publicação

Preferência: Dockerfile multi-stage, com build Node em versão LTS ainda suportada na implementação, `npm ci` e build; imagem final Nginx sem Node/npm, servindo apenas o resultado gerado. Usar versão de imagem explícita e política de atualização; não fixar uma versão antiga indefinidamente.

O build pack Static do Coolify documentado atualmente empacota arquivos prontos e não executa o build do Vite. Portanto não confiar nele para compilar fontes nem publicar o `dist` rastreado, que pode estar defasado. Dockerfile é o caminho proposto para controlar build, rotas, headers e cache no mesmo lugar. [6–7]

## 4. Etapa 0 — Base de trabalho e inventário

- Buscar a `main` mais recente e verificar alterações locais antes de trocar de branch.
- Conferir se o reajuste de preços já foi integrado. Se não, preservar a branch e combinar a integração para a entrega final; não sobrescrever preços com os antigos.
- Criar branch de implementação específica, por exemplo `feat/security-seo-coolify`, quando a implementação for solicitada. Este documento, sozinho, não inicia essa etapa.
- Registrar versões, status HTTP, tamanho de assets, metadados, comportamento do formulário e capturas mobile/desktop. Medir Lighthouse/PageSpeed como diagnóstico, sem prometer nota 100.
- Rodar lint e build existentes para distinguir problemas anteriores. Auditar dependências de produção e desenvolvimento; avaliar cada alerta pelo uso real, sem `npm audit fix --force`.
- Inventariar terceiros, segredos, arquivos públicos e workflows. O identificador Formspree é público; variáveis `VITE_*` entram no bundle e nunca devem receber credenciais. [8]

Aceite: baseline e escopo registrados; nenhuma mudança de produção; nenhum dado ou trabalho anterior perdido.

## 5. Etapa 1 — SEO técnico e conteúdo multilíngue

Arquivos previstos: `index.html`, `SEO.tsx`, Home/App/Navbar/i18n, traduções, dados das obras e configuração de build/pré-renderização; arquivos públicos gerados.

1. Implementar URLs e HTML estático por idioma conforme seção 3.
2. Unificar a geração de metadados por documento para não manter título/descrição inicial divergentes dos metadados React.
3. Gerar title e description específicos e naturais. Exemplos de direção editorial, a revisar: DE “Ölporträts nach Foto in Essen | Rodrigo Normando”; PT “Retratos a óleo por encomenda | Rodrigo Normando”; EN “Commissioned Oil Portraits | Rodrigo Normando”. Texto deve refletir serviços realmente oferecidos.
4. Manter H1 único e H2 por seção. Explicar visivelmente encomenda por foto, técnicas, formatos, frete separado e localização em Essen. Não inventar clientes, avaliações, vendas, entrega mundial ou prazos novos.
5. Corrigir descrições genéricas como “Óleo sobre tela” com título/assunto verificado, técnica, suporte e tamanho. Preservar a identificação de estudos e cópias. Não incluir nomes de retratados privados sem autorização.
6. Servir uma imagem OG própria, com proporção adequada e URL absoluta, mais `og:image:alt`, locale e Twitter Card. Pode ser composição com obra existente autorizada; não gerar uma pintura fictícia como exemplo de trabalho.
7. Publicar sitemap apenas com URLs 200, canônicas e indexáveis. Excluir fragmentos, redirecionamentos, staging e erros. `lastmod` só quando houver data real de mudança relevante; remover datas inventadas. [3]
8. Colocar `/robots.txt` na raiz do domínio final e referência ao sitemap absoluto. Permitir JS, CSS e imagens necessárias. Não usar robots como proteção de dados ou como forma de aplicar `noindex`. [5]
9. Adicionar JSON-LD mínimo e factual: `Person`, `WebSite` e, se útil, `ImageObject`/`VisualArtwork`. Usar `sameAs` apenas para perfis reais. Não adicionar estrelas, avaliações, endereço privado, credenciais ou `Product/Offer` genérico sem um modelo comercial coerente. Dados estruturados não garantem rich results.
10. Deixar páginas individuais de obras/serviços para uma etapa de conteúdo futura, quando houver material próprio suficiente. Evitar páginas quase iguais criadas só para palavras-chave ou cidades.

Aceite: três URLs carregam diretamente e após reload; HTML bruto tem conteúdo correto; canonical/hreflang conferidos nos três documentos; todas as 21 obras preservadas; sitemap válido; meta tags sem duplicações conflitantes; links e imagens respondem corretamente.

## 6. Etapa 2 — Segurança da aplicação e privacidade

### Cabeçalhos e CSP

Definir uma única fonte de configuração para evitar cabeçalhos duplicados no Nginx e Traefik. Aplicar headers relevantes também a erros e redirects quando apropriado; conferir herança em cada location do Nginx.

| Controle | Direção proposta | Verificação |
| --- | --- | --- |
| HTTPS | Certificado válido e redirect HTTP → HTTPS | Cadeia, expiração e ausência de mixed content |
| HSTS | Ativar no host após validar HTTPS | Não usar preload/includeSubDomains sem avaliar outros hosts |
| CSP | Primeiro Report-Only; depois política aplicada | Navegação, tema, galeria, estilos e formulário sem violações legítimas |
| `frame-ancestors 'none'` e X-Frame-Options DENY | Impedir incorporação do site por terceiros | Header HTTP, não apenas meta tag |
| X-Content-Type-Options | `nosniff` | MIME correto em HTML, CSS, JS, imagens e erros |
| Referrer-Policy | `strict-origin-when-cross-origin` | Revisar comportamento dos links/formulário |
| Permissions-Policy | Desabilitar câmera, microfone, geolocalização e outros recursos não usados | Nenhuma função atual depende dessas permissões |

Direção da CSP: `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`; scripts locais sem `unsafe-eval`; imagens/fontes locais; `connect-src` limitado ao próprio site e Formspree se mantido. `form-action` deve seguir o método real de envio, lembrando que o POST atual via fetch é controlado por `connect-src`. Ajustar diretivas de worker/media apenas se forem realmente necessárias. [9]

O script inline do tema deve ser externalizado ou autorizado por hash gerado/validado no build. MUI/Emotion injeta estilos e há atributos style dinâmicos: testar a compatibilidade antes de bloquear inline styles. Um nonce fixo em HTML estático não oferece a proteção de um nonce novo por resposta. Evitar ampliar `script-src`; se estilos exigirem uma exceção temporária, delimitá-la às diretivas de estilo, documentar e testar. Hashes de JSON-LD inline também precisam ser considerados na política resultante.

### Formulário e terceiros

- Manter Formspree inicialmente, sem backend próprio. Conferir configuração e plano disponíveis para domínio permitido, filtros e proteção antispam; não assumir recurso pago como habilitado.
- Preservar honeypot e estado de envio; adicionar limites razoáveis a nome/e-mail/mensagem e mensagem clara para indisponibilidade/rate limit. Limites no navegador são UX, não proteção suficiente contra chamadas diretas.
- O POST vai ao Formspree: rate limit no Nginx da VPS não protege esse endpoint. Aplicar controles no provedor; só considerar proxy próprio se houver abuso que justifique a manutenção adicional.
- Definir timeout/cancelamento e impedir envios duplicados durante a requisição. Testar sucesso/erros com mocks; um envio real de aceitação deve usar o destinatário do proprietário e ser combinado.
- Hospedar Playfair Display localmente, com licença adequada e pesos usados; remover o `@import` externo.
- Preparar política própria de privacidade, incluindo hospedagem, formulário, logs e retenção; o link da política Formspree não descreve sozinho todo o tratamento deste site. O provedor informa hospedagem nos EUA; revisar termos/processamento e transferência conforme aplicável. [10]
- Preparar Impressum com informações corretas e revisar obrigações aplicáveis ao serviço comercial na Alemanha. Não inventar nem recuperar endereço residencial para publicação; resolver quais dados de contato/endereço válido serão publicados. §5 DDG é uma referência para essa verificação, não um certificado de conformidade deste plano. [11]
- Não adicionar analytics, pixels, embeds sociais ou banner genérico neste trabalho. Avaliar consentimento conforme os serviços efetivamente escolhidos. Search Console não exige instalar Analytics.

Aceite: CSP aplicada após testes; apenas terceiros justificados; formulário mantém todos os estados; nenhuma credencial no bundle, imagem Docker ou logs; conteúdo legal preparado com dados confirmados. Sem declarações vagas de “site invulnerável”.

## 7. Etapa 3 — Entrega para Coolify e configuração do servidor

Arquivos previstos: Dockerfile, `.dockerignore`, configuração Nginx, configuração de build/SSG, `.env.example` e README/runbook.

- Construir com `npm ci` e compilar a partir das fontes. Ajustar base Vite para `/` no novo host; não remover `/art-portfolio/` indiscriminadamente se ainda houver uma build de compatibilidade para Pages.
- Não levar `.git`, `.env*` reais, node_modules locais, caches ou dist antigo para o contexto/resultado de produção. Copiar apenas os artefatos necessários para a imagem final.
- Gerar HTML por idioma e servir a rota correspondente, com convenção consistente de barra final. URLs desconhecidas e assets ausentes devem retornar 404 real, nunca index.html com status 200.
- Configurar cache longo/immutable somente para assets com hash; HTML deve revalidar. Robots/sitemap/manifest não devem receber cache imutável de um ano.
- Desativar listagem de diretórios e impedir exposição de dotfiles, arquivos de configuração e mapas de código não destinados ao público. Não bloquear `/.well-known/` que seja necessário à infraestrutura.
- Usar porta interna sem privilégios se a imagem permitir; usuário não root, sem modo privilegiado, sem montar Docker socket. Restringir volumes e permissões ao mínimo e testar writable paths exigidos pelo Nginx.
- Configurar health check simples e recursos limitados a partir de medição; nada de reservar capacidade desnecessária para um site estático. Documentar porta real da imagem, sem assumir 80 ou 8080 antes de escolhê-la.
- No Coolify, preparar recurso próprio, fonte Git com menor permissão necessária, build args públicos e domínio. O Formspree ID precisa estar disponível no build, não apenas em runtime. Rebuild ao mudar valores Vite. [7–8]
- Manter painel Coolify/SSH e portas de administração separados do site público; revisar atualizações e acesso da VPS antes do lançamento. Expor o site pelo proxy, sem abrir sua porta interna indiscriminadamente.
- Adicionar verificação de dependências e permissões mínimas dos workflows de forma proporcional; evitar multiplicar pipelines pagos ou checks redundantes. Planejar runtime/Actions suportados na data de implementação.

Aceite local: imagem constrói de clone limpo; executa sem Node de desenvolvimento; health check e 404 funcionam; preços novos presentes; headers conferidos por HTTP e browser; app sem erros em mobile/desktop.

## 8. Etapa 4 — Preview, migração e lançamento

1. Criar preview protegido por autenticação; acrescentar `X-Robots-Tag: noindex` como defesa adicional. `robots Disallow` sozinho não impede indexação e pode impedir a leitura de noindex.
2. Validar DE/PT/EN, teclado, modal, tema claro/escuro, fontes, formulário, reload direto, CSP e erros. Conferir HTML bruto e renderizado.
3. Escolher domínio final e preparar DNS/certificado sem remover serviços existentes de `normando.dev`. Conferir A/AAAA, inclusive IPv6 se anunciado. Alterações de DNS devem ser específicas ao host escolhido.
4. Confirmar estratégia da URL antiga. Preferir 301/308 se houver controle HTTP apropriado. GitHub Pages de projeto não oferece regras arbitrárias de redirect de servidor; não prometer implementá-las com JavaScript. Não alterar CNAME do site de usuário ou outros projetos sem avaliar o impacto.
5. Se redirect HTTP do endereço antigo não for viável, manter temporariamente página de transição com link e canonical para destino correspondente; documentar que isso é um sinal mais fraco que redirecionamento permanente. Evitar deixar dois portfólios completos concorrendo indefinidamente. Atualizar links de Instagram/TikTok quando o novo endereço estiver validado. [4]
6. Publicar a imagem validada e confirmar SHA/digest. Remover autenticação/noindex apenas do host de produção. Não liberar o preview por engano.
7. Conferir 200, redirects sem cadeia/loop, canonical final, sitemap, robots, assets, TLS, HTTP headers e formulário. Revisar links antigos de `/art-portfolio/` e âncoras com mapeamento explícito.
8. Retirar o deploy automático do GitHub Pages apenas na etapa da migração em que for seguro, preservando evidência e rollback. Não deixar workflows voltarem a publicar a versão antiga por acidente.

Rollback: guardar imagem/digest anterior e configurações de domínio/proxy. Se o erro for do app, reimplantar a imagem validada anterior; se for DNS/TLS, restaurar registros/configuração específicos. Não usar reset/force push. Depois da reversão, verificar também canonical, robots e noindex; não avaliar sucesso só pelo container estar em execução.

## 9. Etapa 5 — Google Search Console

Fazer após o domínio final estar estável, evitando promover primeiro a URL que será abandonada.

1. Verificar se `normando.dev` já tem propriedade Domain; se o novo site for subdomínio, ela já abrange esse host quando verificada. Uma propriedade URL-prefix específica facilita acompanhar só o ateliê. Para domínio próprio separado, criar sua propriedade correspondente. [12]
2. Verificar propriedade por DNS usando exatamente o TXT/CNAME fornecido pelo Google; preservar registros existentes e manter o registro de verificação. Se preferir URL-prefix, usar um método oficialmente suportado, como arquivo ou meta tag no HTML inicial. Não inventar token. [12]
3. Enviar o sitemap do host final. Conferir que URLs no XML não são do GitHub, preview ou localhost. [3]
4. Inspecionar `/de/`, `/pt/` e `/en/` com teste ao vivo: acesso permitido, HTML/imagens presentes, canonical correto e sem noindex. Pedir indexação das páginas importantes. A ferramenta e o sitemap não garantem inclusão, nem prazo. [13]
5. Se houver migração de site já indexado, manter propriedade antiga verificável e avaliar a ferramenta de mudança de endereço apenas se o tipo de mudança for suportado; não tratá-la como obrigatória para qualquer mudança de caminho. [4]
6. Revisar após cerca de uma semana e novamente após um mês: indexação, canonical escolhido, sitemap, erros, impressões, cliques, consultas e países. Essas são janelas de acompanhamento propostas, não uma automação criada ou previsão de indexação.
7. Priorizar conteúdo real para consultas de intenção comercial, por exemplo “Ölporträt nach Foto Essen” e “Tierportrait Öl”. Não há pesquisa de volume de palavras-chave neste plano e não se promete posição para essas buscas.

## 10. Ordem e critérios de conclusão

| Etapa | Prioridade | Entrega verificável |
| --- | --- | --- |
| 0 — Baseline | P0 | Evidências, versões e escopo |
| 1 — HTML/idiomas/SEO | P0 | Três páginas pré-renderizadas, sitemap e metadados |
| 2 — Segurança/privacidade | P0/P1 | Headers/CSP testados e preparação dos textos necessários |
| 3 — Docker/Coolify | P0 | Imagem reproduzível e runbook |
| 4 — Preview e domínio | P0 | URL final verificada e rollback |
| 5 — Search Console | Após lançamento | Propriedade verificada, sitemap enviado e inspeções |

Não são necessárias dezenas de testes unitários para textos estáticos. Usar lint/build existentes, verificações automatizadas do HTML/XML e uma bateria pequena de integração: URLs e status, idioma/metadata, 21 obras, preços corretos, ausência de noindex em produção, headers e formulário simulado. Fazer inspeção visual/teclado real nos fluxos afetados.

O site está tecnicamente pronto para submissão quando: as páginas reais respondem 200; erros respondem 404; HTML inicial é útil; idiomas e canonical concordam; sitemap e robots estão corretos; não há bloqueio acidental; TLS e headers foram verificados; formulário está operacional; fontes/imagens carregam; dados de contato e textos necessários estão confirmados; deploy e rollback são reproduzíveis. “Indexado pelo Google” é um resultado externo a acompanhar, não um requisito que possa ser garantido pelo código.

## 11. Decisões pendentes antes da publicação

- Domínio final: subdomínio de `normando.dev` ou domínio específico do ateliê.
- Informações reais para Impressum/privacidade e contato público adequado.
- Acesso e configuração efetiva de Coolify, DNS e Formspree.
- Integração da branch de preços à base que será publicada.
- Destino e limitações de redirecionamento da URL GitHub Pages.

É possível iniciar preparação local e implementação técnica sem publicar dados pessoais ou alterar DNS. Este plano não pressupõe que esses acessos ou decisões já estejam disponíveis.

## 12. Fontes oficiais consultadas

Consultadas em 12/11/2026. Configurações concretas devem ser conferidas contra a versão instalada na implementação.

1. Google — JavaScript SEO: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
2. Google — Versões por idioma/hreflang: https://developers.google.com/search/docs/specialty/international/localized-versions
3. Google — Construir e enviar sitemap: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
4. Google — Migração com mudança de URL: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
5. Google — Robots.txt: https://developers.google.com/search/docs/crawling-indexing/robots/intro
6. Coolify — Static build pack: https://coolify.io/docs/applications/builds/static
7. Coolify — Dockerfile: https://coolify.io/docs/applications/builds/dockerfile
8. Vite — Variáveis de ambiente: https://vite.dev/guide/env-and-mode
9. MDN — Content Security Policy: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP
10. Formspree — Segurança e processamento: https://formspree.io/security/
11. Legislação alemã — §5 DDG: https://www.gesetze-im-internet.de/ddg/__5.html
12. Search Console — Verificar propriedade: https://support.google.com/webmasters/answer/9008080 ; propriedades: https://support.google.com/webmasters/answer/34592
13. Google — Solicitar novo rastreamento: https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl ; inspeção: https://support.google.com/webmasters/answer/9012289/