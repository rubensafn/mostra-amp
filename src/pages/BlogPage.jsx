import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './BlogPage.css'

gsap.registerPlugin(ScrollTrigger)

/* ─── DATA ─── */
const POSTS = [
  {
    id: 1,
    name: 'Lia Pereira Jardim',
    age: '85 anos',
    city: 'Mora em Goiânia há 60 anos',
    photo: '/images/blog/liapereira1.jpeg',
    tag: 'Depoimento',
    title: 'Do mundo ao falado',
    subtitle: 'Conselhos para quem quer recebê-los de pijama, sem abrir mão do microfone ou de outros atributos que permitam ficar de olho no que se lê',
    paragraphs: [
      'Bem, vamos lá:',
      'Se você quer vencer na vida e como costume dizem: "pessoas do agora, por isso mesmo", não se deixe enganar por miçangas e cores, eles só vão lhe render pessoas e dores de cabeça. Fato é que quando o coração não lhe custar os olhos da cara e você, não enxergando onde pisa e o que tem pela frente, perde o rumo e a tola montanha.',
      'Todavia se você quer realmente melhorar na vida e, em especial, se tornar um bom gourmet em matéria de vinho, consulte um enólogo e logo, logo ele vai lhe ensinar que vinho de pé em adegas ou prateleiras é impróprio para consumo. Já um domingo na sala de jantar, inclinando sobre a mesa posta além de ser uma delícia dos deuses é prova cabal de que você está aprimorando as suas escolhas, o seu bom gosto, a qualidade de suas celebrações e sua forma de expressar com elegância o seu amado português.',
      'Momentos especiais pedem um domingo à altura de suas comemorações. Beba com moderação. Você está caminhando na chuva e com o sol no coração.',
    ],
    signature: 'Ria',
  },
]

/* ════════════════════════════════════════
   SCROLL PROGRESS
════════════════════════════════════════ */
function ScrollProgress() {
  const barRef = useRef(null)
  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const onScroll = () => {
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      bar.style.width = pct + '%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <div id="blog-scroll-progress" ref={barRef} />
}

/* ════════════════════════════════════════
   BLOG NAV
════════════════════════════════════════ */
function BlogNav() {
  const navRef    = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const onScroll = () => nav.classList.toggle('blog-nav--solid', window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav ref={navRef} className="blog-nav" role="navigation">
        <Link to="/" className="blog-nav-back" aria-label="Voltar para o site">
          <span className="blog-nav-back-arrow">←</span>
          <span className="blog-nav-back-label">Voltar</span>
        </Link>

        <Link to="/" className="blog-nav-brand">
          <img src="/images/logo-lenco.webp" alt="17ª Mostra de Cinema" className="blog-nav-logo" />
          <span className="blog-nav-title">17ª MOSTRA</span>
        </Link>

        <ul className="blog-nav-links">
          <li><Link to="/" className="blog-nav-link--home">Início</Link></li>
          <li><Link to="/palestras">Convidados &amp; Palestras</Link></li>
          <li><Link to="/programacao">Programação de Filmes</Link></li>
        </ul>

        <button
          className={`blog-nav-hamburger${menuOpen ? ' open' : ''}`}
          aria-label="Menu"
          onClick={() => setMenuOpen(m => !m)}
        >
          <span /><span /><span />
        </button>
      </nav>

      {menuOpen && <div className="blog-mobile-overlay" onClick={() => setMenuOpen(false)} />}
      <div className={`blog-mobile-menu${menuOpen ? ' open' : ''}`}>
        <ul>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Início</Link></li>
          <li><Link to="/palestras" onClick={() => setMenuOpen(false)}>Convidados &amp; Palestras</Link></li>
          <li><Link to="/programacao" onClick={() => setMenuOpen(false)}>Programação de Filmes</Link></li>
        </ul>
      </div>
    </>
  )
}

/* ════════════════════════════════════════
   BLOG HERO
════════════════════════════════════════ */
function BlogHero() {
  const heroRef  = useRef(null)
  const lineRef  = useRef(null)
  const subRef   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const el = lineRef.current
      if (!el) return

      const text = el.textContent
      el.innerHTML = text
        .split('')
        .map(ch => ch === ' '
          ? `<span class="blog-hero-space"> </span>`
          : `<span class="blog-hero-char">${ch}</span>`)
        .join('')
      const chars = el.querySelectorAll('.blog-hero-char')

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.fromTo(chars,
        { opacity: 0, y: 80, rotateX: -40 },
        {
          opacity: 1, y: 0, rotateX: 0,
          duration: 1.1,
          stagger: { amount: 0.5, from: 'start' },
        }
      )
      .fromTo(subRef.current,
        { opacity: 0, y: 20, letterSpacing: '0.5em' },
        { opacity: 1, y: 0, letterSpacing: '0.28em', duration: 0.9, ease: 'expo.out' },
        '-=0.4'
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="blog-hero" ref={heroRef} id="blog-hero">
      <div className="blog-hero-bg">
        <img src="/images/fundo-geral.png" alt="" className="blog-hero-bg-img" aria-hidden="true" />
        <div className="blog-hero-overlay" />
      </div>

      <div className="blog-hero-grain" aria-hidden="true" />
      <div className="blog-hero-rule blog-hero-rule--top" aria-hidden="true" />
      <div className="blog-hero-rule blog-hero-rule--bottom" aria-hidden="true" />

      <div className="blog-hero-content">
        <div className="blog-hero-eyebrow">
          <span className="blog-hero-eyebrow-line" />
          <span className="blog-hero-eyebrow-text">17ª Mostra de Cinema · Goiânia</span>
          <span className="blog-hero-eyebrow-line" />
        </div>

        <h1 className="blog-hero-title" aria-label="Blog">
          <span ref={lineRef} className="blog-hero-line">BLOG</span>
        </h1>

        <p ref={subRef} className="blog-hero-sub">
          17ª Mostra de Cinema&nbsp;&nbsp;·&nbsp;&nbsp;08 a 22 de Abril&nbsp;&nbsp;·&nbsp;&nbsp;Goiânia
        </p>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════
   POST CARD
════════════════════════════════════════ */
function PostCard({ post }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    const ctx = gsap.context(() => {
      gsap.fromTo(card,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: card, start: 'top 88%', once: true },
        }
      )
    }, card)
    return () => ctx.revert()
  }, [])

  return (
    <article className="blog-post" ref={cardRef}>
      <div className="blog-post-header">
        <div className="blog-post-photo-col">
          <img
            src={post.photo} alt={post.name}
            className="blog-post-photo"
            loading="lazy"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
          <div className="blog-post-photo-overlay" />
        </div>

        <div className="blog-post-meta-col">
          <span className="blog-post-tag">{post.tag}</span>
          <h2 className="blog-post-title">{post.title}</h2>
          <p className="blog-post-subtitle">({post.subtitle})</p>

          <div className="blog-post-author-line">
            <span className="blog-post-author-rule" aria-hidden="true" />
            <div className="blog-post-author-info">
              <span className="blog-post-author-name">{post.name}</span>
              <span className="blog-post-author-desc">{post.age} · {post.city}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="blog-post-body">
        {post.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        {post.signature && (
          <div className="blog-post-signature">
            <span className="blog-post-signature-rule" aria-hidden="true" />
            <span className="blog-post-signature-name">{post.signature}</span>
          </div>
        )}
      </div>
    </article>
  )
}

/* ════════════════════════════════════════
   POSTS SECTION
════════════════════════════════════════ */
function BlogPosts() {
  return (
    <section id="blog-posts">
      <div className="blog-section-header">
        <h2 className="blog-section-title"><em>Depoimentos</em></h2>
        <p className="blog-section-desc">17ª Mostra de Cinema · Goiânia · 2026</p>
      </div>
      <div className="blog-posts">
        {POSTS.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}

/* ════════════════════════════════════════
   FOOTER
════════════════════════════════════════ */
function BlogFooter() {
  return (
    <footer className="blog-footer" id="blog-footer">
      <div className="blog-footer-inner">
        <Link to="/" className="blog-footer-brand">
          <img src="/images/logo-lenco.webp" alt="17ª Mostra de Cinema" className="blog-footer-logo" />
          <div className="blog-footer-brand-text">
            <span className="blog-footer-brand-title">17ª Mostra de Cinema</span>
            <span className="blog-footer-brand-sub">O Amor · A Morte · As Paixões</span>
          </div>
        </Link>

        <div className="blog-footer-divider" aria-hidden="true" />

        <div className="blog-footer-credits">
          <div className="blog-footer-credit-col">
            <span className="blog-footer-credit-label">Idealização</span>
            <span className="blog-footer-credit-value">Instituto Jardim Cultural</span>
          </div>
          <div className="blog-footer-credit-col">
            <span className="blog-footer-credit-label">Coordenador Geral</span>
            <span className="blog-footer-credit-value">Gerson Santos</span>
          </div>
          <div className="blog-footer-credit-col">
            <span className="blog-footer-credit-label">Curadoria</span>
            <span className="blog-footer-credit-value">Lisandro Nogueira</span>
          </div>
          <div className="blog-footer-credit-col">
            <span className="blog-footer-credit-label">Diretor</span>
            <span className="blog-footer-credit-value">Rubens Alves</span>
          </div>
          <div className="blog-footer-credit-col">
            <span className="blog-footer-credit-label">Produtora</span>
            <span className="blog-footer-credit-value">Gabriela Cardoso</span>
          </div>
        </div>

        <div className="blog-footer-divider" aria-hidden="true" />

        <div className="blog-footer-bottom">
          <span className="blog-footer-copy">
            &copy; 2026 17ª Mostra de Cinema · Goiânia · Todos os direitos reservados
          </span>
          <Link to="/" className="blog-footer-back-link">
            ← Voltar ao site principal
          </Link>
        </div>
      </div>
    </footer>
  )
}

/* ════════════════════════════════════════
   BACK TO TOP
════════════════════════════════════════ */
function BackToTop({ uiAnim }) {
  return (
    <button
      className={`blog-back-to-top${uiAnim !== 'hidden' ? ` ${uiAnim}` : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Voltar ao topo"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 16V4M10 4L4 10M10 4L16 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}

/* ════════════════════════════════════════
   BACK TO HOME
════════════════════════════════════════ */
function BackToHome({ uiAnim }) {
  return (
    <Link to="/" className={`blog-back-home${uiAnim !== 'hidden' ? ` ${uiAnim}` : ''}`} aria-label="Voltar à página inicial">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M13 8H3M3 8L7 4M3 8L7 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>Voltar</span>
    </Link>
  )
}

/* ════════════════════════════════════════
   PAGE INTRO OVERLAY
════════════════════════════════════════ */
function BlogPageIntro() {
  const overlayRef = useRef(null)

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return
    gsap.to(overlay, {
      opacity: 0, duration: 1.2, ease: 'power2.inOut', delay: 2.0,
      onComplete: () => overlay.classList.add('hidden')
    })
  }, [])

  return (
    <div ref={overlayRef} id="blog-page-intro">
      <div id="blog-intro-glow" />
      <div id="blog-intro-line" />
      <h1 id="blog-intro-title">
        <span id="blog-intro-line1">BLOG</span>
      </h1>
      <p id="blog-intro-sub">17ª Mostra de Cinema · Goiânia · 2026</p>
    </div>
  )
}

/* ════════════════════════════════════════
   PAGE
════════════════════════════════════════ */
export default function BlogPage() {
  const [uiAnim, setUiAnim] = useState('hidden')
  const uiTimer = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const target = document.getElementById('blog-hero')
    const obs = target && new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        clearTimeout(uiTimer.current)
        setUiAnim('visible')
      } else {
        setUiAnim('exiting')
        uiTimer.current = setTimeout(() => setUiAnim('hidden'), 320)
      }
    }, { threshold: 0 })
    if (obs) obs.observe(target)
    return () => {
      if (obs) obs.disconnect()
      clearTimeout(uiTimer.current)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <>
      <BlogPageIntro />
      <ScrollProgress />
      <BlogNav />
      <BlogHero />
      <BlogPosts />
      <BlogFooter />
      <BackToHome uiAnim={uiAnim} />
      <BackToTop uiAnim={uiAnim} />
    </>
  )
}
