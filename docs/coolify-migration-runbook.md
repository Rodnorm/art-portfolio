# Runbook de Implantação Coolify, SEO e Operação

Este runbook orienta a publicação, configuração e manutenção do portfólio Rodrigo Normando Art no Coolify em domínio próprio.

---

## 1. Visão Geral da Arquitetura

- **Build:** Multi-stage Dockerfile (`node:20-alpine` para compilação + SSG estático).
- **Runtime:** `nginx:1.27-alpine` de alta performance e baixo consumo de memória (< 30 MB RAM).
- **Pré-renderização (SSG):** Rotas estáticas geradas no build (`/de/`, `/pt/`, `/en/`, `/impressum/`, `/datenschutz/`).
- **Segurança:** Content Security Policy (CSP), HSTS (no proxy), X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, bloqueio de dotfiles.
- **Fontes:** Playfair Display auto-hospedada em WOFF2 (sem dependência externa de Google Fonts).

---

## 2. Configuração no Coolify

### 2.1 Criar Novo Recurso
1. No painel do Coolify, selecione o Projeto e Ambiente desejado.
2. Clique em **+ New Resource** → **Public Repository** (ou **Private Repository** com chave deploy).
3. Informe o repositório `art-portfolio` e a branch de produção (`main`).
4. Selecione **Build Pack: Dockerfile**.
5. O Coolify detectará automaticamente o `Dockerfile` na raiz.

### 2.2 Variáveis de Ambiente (Build Arguments & Environment)
Defina as seguintes variáveis na aba **Environment Variables** do Coolify:

| Variável | Exemplo | Obrigatório? | Descrição |
| --- | --- | --- | --- |
| `VITE_SITE_URL` | `https://art.normando.dev` | Sim | Domínio de produção sem barra final |
| `VITE_FORMSPREE_FORM_ID` | `xpwzgkqv` | Sim | Identificador do formulário no Formspree |

*Nota:* Como as variáveis `VITE_*` são incorporadas estaticamente no build do Vite, qualquer alteração nelas requer um novo build/deploy no Coolify.

### 2.3 Rede e Portas
- **Porta interna do container:** `80`
- **Health Check Endpoint:** `http://127.0.0.1/healthz`
- **Domínio FQDN:** Configure o domínio final com HTTPS automático gerenciado pelo Traefik do Coolify (ex: `https://art.normando.dev`).

---

## 3. Comportamento de Roteamento e HTTP

- `GET /` → Redirecionamento permanente (`301 Moved Permanently`) para `/de/`.
- `GET /de`, `/pt`, `/en`, `/impressum`, `/datenschutz` → Redirecionamento 301 para trailing slash normalizada (`/de/`, etc.).
- Rotas ou arquivos inexistentes → Retornam código **404 real** servindo a página personalizada `404.html`.
- Assets com hash (`/assets/*`, `/fonts/*`) → Servidos com cabeçalho de cache imutável (`Cache-Control: public, max-age=31536000, immutable`).
- Documentos HTML e meta-arquivos (`robots.txt`, `sitemap.xml`) → Servidos com revalidação (`Cache-Control: public, no-cache`).

---

## 4. Procedimento de Rollback

Se um novo deploy apresentar qualquer problema:

1. **Rollback de Aplicação (Coolify):**
   - Acesse o recurso no Coolify → vá para a aba **Deployments**.
   - Localize o commit/deploy anterior validado e clique em **Redeploy**.
   - O Coolify restaurará a imagem anterior em segundos.
2. **Rollback de DNS/Domínio:**
   - Caso haja instabilidade na VPS ou no Coolify durante a fase de transição, aponte o DNS de volta para o provedor anterior (ex: GitHub Pages).

---

## 5. Google Search Console

Após o domínio final estar publicado com certificado SSL válido:

1. **Verificação de Propriedade:**
   - Adicione a propriedade no Google Search Console (recomendado: Propriedade do Domínio via registro DNS TXT, ou Prefixo de URL `https://art.normando.dev`).
2. **Envio do Sitemap:**
   - No menu lateral **Sitemaps**, envie `sitemap.xml` (URL completa: `https://art.normando.dev/sitemap.xml`).
   - O sitemap inclui as URLs 200 indexáveis (`/de/`, `/pt/`, `/en/`, `/impressum/`, `/datenschutz/`) com tags `xhtml:link` recíprocas.
3. **Inspeção de URLs:**
   - Execute o teste ao vivo nas URLs `/de/`, `/pt/` e `/en/` para confirmar que o Googlebot recebe o HTML pré-renderizado completo com as 21 obras, metadados e sem bloqueio no `robots.txt`.
