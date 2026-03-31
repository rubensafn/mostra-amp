# 17ª Mostra de Cinema — Documentação de Design & Desenvolvimento

> **Tema:** O Amor, a Morte e as Paixões  
> **Período:** 08 a 22 de Abril de 2026 · Goiânia, GO  
> **Stack:** React 19 + Vite 8 + GSAP 3 + Framer Motion 12

---

## 1. Identidade Visual

### Paleta de Cores

| Token CSS        | Valor       | Uso                                  |
|------------------|-------------|--------------------------------------|
| `--bg`           | `#060402`   | Fundo principal (quase preto quente) |
| `--bg-2`         | `#0b0806`   | Seções alternadas                    |
| `--bg-3`         | `#110d09`   | Seções terciárias                    |
| `--accent`       | `#E01865`   | Rosa/vermelho — Amor & Morte         |
| `--accent-hot`   | `#FF2070`   | Rosa neon — efeitos de brilho        |
| `--gold`         | `#E0B040`   | Dourado — Paixão & Brasilidades      |
| `--gold-hot`     | `#FFB930`   | Dourado neon — efeitos de brilho     |
| `--cream`        | `#F2E6D0`   | Texto principal                      |
| `--cream-dim`    | `55% opacity`| Texto secundário                    |

### Tipografia

| Fonte       | Peso     | Uso                                    |
|-------------|----------|----------------------------------------|
| **Brinnan Black** (900) | Display | Títulos grandes: programação, hero, espaco |
| **Brinnan Bold** (700) | UI | Navegação, labels, CTAs |
| **Brinnan Regular** (400) | Nav links | Links de navegação |
| **Cormorant Garamond** | Itálico | Subtítulos, sinopses, citações |
| **Inter** | 300–600 | Corpo de texto, metadados |

> **Nota:** Brinnan é a fonte-padrão da marca. Arquivos `.otf` estão em `/public/fonts/`. Já carregados via `@font-face` no `index.css`.

### Logo

| Arquivo                 | Uso                         |
|-------------------------|-----------------------------|
| `logo-completa.png`     | Hero, intro overlay, footer |
| `logo-lenco.png`        | Nav icon, decorativo        |

> **Importante:** As logos têm fundo branco no PNG. Para que o glow apareça corretamente (seguindo o contorno e não um retângulo), usar `mix-blend-mode: screen` no elemento `<img>`. O glow visual é criado por blobs radiais absolutos com `filter: blur()`, não por `filter: drop-shadow()`.

---

## 2. Arquitetura do Site

### Seções (ordem de aparição)

```
[IntroOverlay]     — Tela preta com reveal cinematográfico (3.5s)
[ScrollProgress]   — Barra de progresso no topo (pink→gold)
[Cursor]           — Cursor customizado dot + ring
[Nav]              — Fixo, transparente → sólido no scroll
[Hero]             — Full viewport
[Marquee ×1]       — Faixa temática (direção normal)
[Sobre]            — Grade 2 colunas + stats
[Programação]      — Carrossel horizontal tabbed
[Destaque]         — Split-screen filme featured
[Marquee ×2]       — Faixa de créditos (direção reversa)
[Curadoria]        — Quote + créditos + bloco Brasilidades
[Espaço]           — Grid do venue + infos
[Edições Anteriores] — Histórico
[Footer]           — Logo + links + créditos institucionais
```

### Componentes (src/App.jsx)

| Componente         | Função                                      |
|--------------------|---------------------------------------------|
| `IntroOverlay`     | Tela de abertura cinematic (GSAP)           |
| `ScrollProgress`   | Barra de progresso de scroll                |
| `Cursor`           | Cursor personalizado (dot + ring magnético) |
| `Nav`              | Navegação fixa com logo swap                |
| `Hero`             | Seção principal com countdown               |
| `Marquee`          | Faixa animada infinita (prop `reversed`)    |
| `Sobre`            | Seção sobre o evento                        |
| `FilmCard`         | Card de filme com 3D tilt + neon hover      |
| `Programacao`      | Tabs Longas/Curtas + carrossel              |
| `Destaque`         | Filme em evidência (sempre `LONGAS[0]`)     |
| `Curadoria`        | Quote + créditos institucionais             |
| `Espaco`           | Fotos e info do venue                       |
| `EdicoesAnteriores`| Histórico da mostra                         |
| `Footer`           | Rodapé completo                             |
| `useCountdown`     | Hook: countdown ao vivo para abertura       |
| `useGSAPEffects`   | Hook: todos os efeitos GSAP globais         |

### Dados da Programação

```
src/data/films.js
├── LONGAS[]    — 8 longas-metragens (fictícios, substituir)
├── CURTAS[]    — 6 curtas-metragens (fictícios, substituir)
└── FEATURED    — LONGAS[0] (sempre o destaque)
```

**Para atualizar a programação:** editar `src/data/films.js`. Cada filme tem:
```js
{
  id, title, original, year, director, duration, country,
  categoria, sinopse, poster,   // poster: URL da imagem
  featured, cor,
  sessoes: [{ data, hora, local }]
}
```

---

## 3. Sistema de Animações

### Intro Overlay (Abertura Cinematográfica)
- Glow blob radial aparece por baixo da logo
- Logo entra com `blur(24px) → blur(0)` + scale `0.82 → 1`
- Texto expande letter-spacing `0.6em → 0.4em`
- Linha central cresce horizontalmente
- Após 2.4s: tudo faz fade e component se remove do DOM

### Lenço (Motivo Visual da Marca)
- **Ghost** (camada de fundo): entra com `x: 150% → 0`, opacidade 7%, rotação -8°
- **Main** (frente): entra com `x: 120% → 0`, opacidade 22%, elastic bounce
- **Float loop**: após entrada, oscila ±18px verticalmente em loop sinusoidal
- **Parallax**: ao rolar, sobe e some com rotação
- **Magnetic**: cursor dentro de 300px atrai/repele o lenço suavemente
- **Aparece também:** watermark em Sobre (opacity 4%) e Curadoria (opacity 5%)

### Logo Neon (elliptical, sem efeito quadrado)
```
hero-logo-outer (overflow: visible)
├── hero-logo-glow-1  ← radial gradient ellipse, filter: blur(28px), animação logoGlow
├── hero-logo-glow-2  ← radial gradient dourado, filter: blur(40px), animação reversa
└── hero-logo-wrap (overflow: hidden) ← clip da scan line
    ├── ::after  ← scan line que varre horizontalmente a cada 8s
    └── img.hero-logo  ← mix-blend-mode: screen (remove fundo branco do PNG)
```

### Neon nos Elementos
| Elemento               | Técnica                                      |
|------------------------|----------------------------------------------|
| Edicão / Countdown sep | `text-shadow` multicamada pink neon          |
| Labels `.label`        | `text-shadow` pink + glow                    |
| Botão primary hover    | `box-shadow` multicamada                     |
| Film card hover        | `box-shadow` borda + glow + profundidade     |
| Badge da categoria     | `box-shadow` + `text-shadow`                 |
| Títulos grandes        | `text-shadow` sutil para depth               |
| Nav links hover        | `text-shadow` pink flash                     |
| Nav brand icon         | `drop-shadow` na logo lenco (PNG transparente)|
| Marquee `·`            | `text-shadow` neon nas bolinhas separadoras  |

### Scroll Reveals (GSAP ScrollTrigger)
- `[data-reveal]`: `opacity 0, y 64` → `opacity 1, y 0` (start: `top 90%`)
- Film cards: stagger de 70ms cada, scale 0.96 → 1
- Créditos curadoria: stagger 150ms
- Stats (números): `scale 0.7` → `1` com `back.out(2)`
- Títulos destaque/espaço: slide lateral `x: -50` → `0`

### Cursor Customizado
- Dot (8px): segue mouse exatamente
- Ring (40px): segue com lerp 12% por frame
- `body.cursor-hover`: dot cresce, ring vai para 60px e muda para cor ouro
- Hover em: `a`, `button`, `[data-hover]`

---

## 4. Assets

### Estrutura de Arquivos

```
public/
├── fonts/
│   ├── Brinnan-Black.otf
│   ├── Brinnan-BlackOblique.otf
│   ├── Brinnan-Bold.otf
│   ├── Brinnan-BoldOblique.otf
│   ├── Brinnan-Regular.otf
│   └── Brinnan-Light.otf
├── images/
│   ├── logo-completa.png   (logo com texto+lenço, fundo branco)
│   ├── logo-lenco.png      (só o lenço, fundo branco)
│   ├── fundo-wall.png      (fundo clean, 1920×1080)
│   ├── fundo-geral.png     (fundo geral, 1920×1080)
│   ├── fundo-vertical.png  (fundo vertical, 1080×1920)
│   ├── texture-interior.jpeg
│   ├── texture-abstract.jpeg
│   ├── texture-blur.jpeg
│   ├── texture-macro.jpeg
│   ├── texture-closeup.jpeg
│   ├── texture-minimal.jpeg
│   ├── espaco-1.png        (foto do venue)
│   ├── espaco-2.png        (foto do venue detalhe)
│   └── edicao-anterior.png (mockup edição anterior)
└── video/
    └── hero.mp4            (vídeo de fundo do hero)
```

### Originais (não excluir)
```
C:\Users\ruben\ARQUIVOS MOSTRA\
├── LOGOS\
├── FUNDOS\
├── FUNDO TEXTURAS\
├── MOCKUPS NOVOS\
├── EXEMPLOS DE ARTES QUE FIZEMOS\
└── BRINNAN\  (fontes .otf originais)
```

---

## 5. Próximos Passos

### Programação Real
- [ ] Substituir dados fictícios em `src/data/films.js`
- [ ] Substituir URLs dos posters (`picsum.photos/seed/...`) por URLs reais
- [ ] Atualizar sessões (data, hora, local)
- [ ] Confirmar cidade/venue (texto hardcoded: "Goiânia, GO")

### Checklist de Entrega
- [ ] Adicionar links reais de redes sociais no Footer
- [ ] Confirmar link do botão "Ver Filmes" (atualmente âncora interna)
- [ ] Adicionar Google Analytics ou Pixel
- [ ] Definir domínio e fazer deploy
- [ ] Testar vídeo `hero.mp4` em mobile (autoplay tem restrições em iOS)
- [ ] Adicionar fallback estático para o hero.mp4 em mobile (já existe `hero-img-fallback`)
- [ ] Verificar classificação indicativa dos filmes

### Melhorias Futuras (sugestões)
- Adicionar filtro por data/sala na programação
- Modal de detalhes ao clicar no card do filme
- Página individual por filme (React Router)
- Calendário de sessões interativo
- Formulário de credenciamento para imprensa

---

## 6. Comandos

```bash
# Desenvolvimento
npm run dev       # http://localhost:5173

# Build de produção
npm run build     # gera /dist

# Preview do build
npm run preview
```

---

## 7. Créditos Institucionais

| Papel         | Nome              |
|---------------|-------------------|
| Realização    | Cinex             |
| Curadoria     | Lisandro Nogueira |
| Idealização   | Gerson Santos     |

---

*Documentação gerada em Março de 2026. Atualizar conforme o projeto evoluir.*
