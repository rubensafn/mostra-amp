import { useEffect, useRef, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './PalestrasPage.css'

gsap.registerPlugin(ScrollTrigger)

/* ─── DATA ─── */
const PALESTRAS = [
  { id:1,  date:'08', month:'ABR', weekday:'Quarta-Feira',   time:'19:30h', local:'Coquetel de Abertura', convidados:['Elenco do Filme — A Definir'], tema:null, atracao:'Atração Musical — A Definir', tipo:'abertura' },
  { id:2,  date:'09', month:'ABR', weekday:'Quinta-Feira',   time:'18:30h', local:'Livraria',             convidados:['Celso Camilo'], tema:'Tudo o que você precisa saber sobre inteligência artificial' },
  { id:3,  date:'10', month:'ABR', weekday:'Sexta-Feira',    time:'19:00h', local:'Palco Central',        convidados:['Ruy Castro','Heloisa Seixas'], tema:'Ficção e não-ficção e Vice-Versa', atracao:'Atração Musical MPB · 20:30h' },
  { id:4,  date:'11', month:'ABR', weekday:'Sábado',         time:'19:30h', local:'Palco Central',        convidados:['Luiz Pondé'], cargo:'Filósofo · Escritor · Professor Universitário', tema:'Valor sentimental: angústia e reparação' },
  { id:5,  date:'12', month:'ABR', weekday:'Domingo',        time:'16:30h', local:'Livraria',             convidados:['Jossane Gonzaga'], cargo:'Psicanalista', tema:'Autismo e altas habilidades sob a lente do diagnóstico tardio' },
  { id:6,  date:'13', month:'ABR', weekday:'Segunda-Feira',  time:'19:30h', local:'Palco Central',        convidados:['Jesse de Souza'], tema:'Por que a esquerda morreu' },
  { id:7,  date:'14', month:'ABR', weekday:'Terça-Feira',    time:'19:30h', local:'Livraria',             convidados:['Marina Cançado','Beto Amaral'], cargo:'Psicanalistas', tema:'Guimarães Rosa e Jacques Lacan' },
  { id:8,  date:'15', month:'ABR', weekday:'Quarta-Feira',   time:'19:30h', local:'Livraria',             convidados:['Rubens Machado Jr','Alberto Silva'], cargo:'Prof. USP · Prof. de Cinema Sorbonne 3', tema:'Debate pós-filme — O Agente Secreto' },
  { id:9,  date:'16', month:'ABR', weekday:'Quinta-Feira',   time:'19:30h', local:'Palco Central',        convidados:['Paula Febee'], cargo:'Autora · Psicanalista · Roteirista', tema:null },
  { id:10, date:'16', month:'ABR', weekday:'Quinta-Feira',   time:'21:30h', local:'Palco Central',        convidados:['Maysa Balduino','Wolney Fernandes'], cargo:'Psicanalista · Prof. de Cinema UFG', tema:'Debate pós-filme — Valor Sentimental' },
  { id:11, date:'17', month:'ABR', weekday:'Sexta-Feira',    time:'20:30h', local:'Livraria',             convidados:['João Pedro','Pedro Andrade'], cargo:'Críticos de Cinema', tema:'Debate pós-filme — A Vida de Chuck' },
  { id:12, date:'18', month:'ABR', weekday:'Sábado',         time:'16:00h', local:'Palco Central',        convidados:['Cristian Dunker','Vladimir Safatle'], tema:'Transformar Mundos e Pessoas' },
  { id:13, date:'19', month:'ABR', weekday:'Domingo',        time:'18:00h', local:null,                   convidados:['Jeferson Tenório'], tema:null },
  { id:14, date:'20', month:'ABR', weekday:'Segunda-Feira',  time:'21:30h', local:null,                   convidados:['Raimundo Alves','Karla Rady','Fabiana Pulcinelli'], tema:'Debate pós-filme — O Peso do Silêncio: Tarzan e a Ditadura' },
  { id:15, date:'21', month:'ABR', weekday:'Terça-Feira',    time:'18:30h', local:null,                   convidados:['Jussara Santos'], tema:'Democratização do colo' },
  { id:16, date:'22', month:'ABR', weekday:'Sexta-Feira',    time:'19:00h', local:'Palco Central',        convidados:['Pedro Pacífico'], tema:null, tipo:'encerramento' },
]

/* ════════════════════════════════════════
   CURSOR  (necessário pois body tem cursor:none global)
════════════════════════════════════════ */
function PalCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    const dot  = dotRef.current
    const ring = ringRef.current
    let mx = 0, my = 0, rx = 0, ry = 0, raf

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY
      gsap.to(dot, { x: mx, y: my, duration: 0 })
    }
    const loop = () => {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12
      gsap.set(ring, { x: rx, y: ry })
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <>
      <div id="cursor-dot"  ref={dotRef}  />
      <div id="cursor-ring" ref={ringRef} />
    </>
  )
}

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
  return <div id="pal-scroll-progress" ref={barRef} />
}

/* ════════════════════════════════════════
   PAL NAV
════════════════════════════════════════ */
function PalNav() {
  const navRef = useRef(null)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const onScroll = () => nav.classList.toggle('pal-nav--solid', window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav ref={navRef} className="pal-nav" role="navigation">
      <Link to="/" className="pal-nav-back" aria-label="Voltar para o site">
        <span className="pal-nav-back-arrow">←</span>
        <span className="pal-nav-back-label">Voltar</span>
      </Link>

      <Link to="/" className="pal-nav-brand">
        <img src="/images/logo-lenco.png" alt="17ª Mostra de Cinema" className="pal-nav-logo" />
        <span className="pal-nav-title">17ª MOSTRA</span>
      </Link>

      <ul className="pal-nav-links">
        <li><a href="#pal-timeline">Convidados</a></li>
      </ul>
    </nav>
  )
}

/* ════════════════════════════════════════
   PAL HERO
════════════════════════════════════════ */
function PalHero() {
  const heroRef    = useRef(null)
  const line1Ref   = useRef(null)
  const line2Ref   = useRef(null)
  const subRef     = useRef(null)
  const statsRef   = useRef(null)
  const arrowRef   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* split line1 and line2 into individual letter spans */
      const splitLine = (el) => {
        const text = el.textContent
        el.innerHTML = text
          .split('')
          .map(ch => ch === ' '
            ? `<span class="pal-hero-space"> </span>`
            : `<span class="pal-hero-char">${ch}</span>`)
          .join('')
        return el.querySelectorAll('.pal-hero-char')
      }

      const chars1 = splitLine(line1Ref.current)
      const chars2 = splitLine(line2Ref.current)

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

      tl.fromTo([...chars1, ...chars2],
        { opacity: 0, y: 80, rotateX: -40 },
        {
          opacity: 1, y: 0, rotateX: 0,
          duration: 1.1,
          stagger: { amount: 0.7, from: 'start' },
        }
      )
      .fromTo(subRef.current,
        { opacity: 0, y: 20, letterSpacing: '0.5em' },
        { opacity: 1, y: 0, letterSpacing: '0.28em', duration: 0.9, ease: 'expo.out' },
        '-=0.4'
      )
      .fromTo(statsRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.3'
      )
      .fromTo(arrowRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.2'
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="pal-hero" ref={heroRef} id="pal-hero">
      <div className="pal-hero-bg">
        <img src="/images/fundo-geral.png" alt="" className="pal-hero-bg-img" aria-hidden="true" />
        <div className="pal-hero-overlay" />
      </div>

      <div className="pal-hero-grain" aria-hidden="true" />

      {/* decorative lines */}
      <div className="pal-hero-rule pal-hero-rule--top" aria-hidden="true" />
      <div className="pal-hero-rule pal-hero-rule--bottom" aria-hidden="true" />

      <div className="pal-hero-content">
        <div className="pal-hero-eyebrow">
          <span className="pal-hero-eyebrow-line" />
          <span className="pal-hero-eyebrow-text">17ª Mostra de Cinema · Goiânia</span>
          <span className="pal-hero-eyebrow-line" />
        </div>

        <h1 className="pal-hero-title" aria-label="Convidados & Palestras">
          <span ref={line1Ref} className="pal-hero-line pal-hero-line--1">CONVIDADOS</span>
          <span ref={line2Ref} className="pal-hero-line pal-hero-line--2">&amp; PALESTRAS</span>
        </h1>

        <p ref={subRef} className="pal-hero-sub">
          17ª Mostra de Cinema&nbsp;&nbsp;·&nbsp;&nbsp;08 a 22 de Abril&nbsp;&nbsp;·&nbsp;&nbsp;Goiânia
        </p>

        <div ref={statsRef} className="pal-hero-stats">
          <div className="pal-hero-stat">
            <span className="pal-hero-stat-num">16</span>
            <span className="pal-hero-stat-label">Convidados</span>
          </div>
          <span className="pal-hero-stat-sep" aria-hidden="true">·</span>
          <div className="pal-hero-stat">
            <span className="pal-hero-stat-num">14</span>
            <span className="pal-hero-stat-label">Dias de Mostra</span>
          </div>
          <span className="pal-hero-stat-sep" aria-hidden="true">·</span>
          <div className="pal-hero-stat">
            <span className="pal-hero-stat-num">16</span>
            <span className="pal-hero-stat-label">Eventos</span>
          </div>
        </div>

        <a href="#pal-timeline" className="pal-hero-scroll" ref={arrowRef} aria-label="Ver programação">
          <span className="pal-hero-scroll-label">Ver Programação</span>
          <span className="pal-hero-scroll-drop" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════
   PAL TIMELINE CARD
════════════════════════════════════════ */
function PalCard({ palestra, side = 'left' }) {
  const cardRef  = useRef(null)
  const innerRef = useRef(null)

  useEffect(() => {
    const card  = cardRef.current
    const inner = innerRef.current
    if (!card || !inner) return

    /* magnetic hover — desktop only */
    const handleMouseMove = (e) => {
      if (window.innerWidth < 900) return
      const rect = card.getBoundingClientRect()
      const cx   = rect.left + rect.width  / 2
      const cy   = rect.top  + rect.height / 2
      const dx   = (e.clientX - cx) / (rect.width  / 2)
      const dy   = (e.clientY - cy) / (rect.height / 2)
      gsap.to(inner, { x: dx * 7, y: dy * 5, duration: 0.35, ease: 'power2.out' })
    }
    const handleMouseLeave = () => {
      gsap.to(inner, { x: 0, y: 0, duration: 0.5, ease: 'expo.out' })
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const isAbertura     = palestra.tipo === 'abertura'
  const isEncerramento = palestra.tipo === 'encerramento'
  const isSpecial      = isAbertura || isEncerramento

  const typeLabel = isAbertura ? 'Abertura' : isEncerramento ? 'Encerramento' : null

  return (
    <div className={`pal-item pal-item--${side}`} data-id={palestra.id}>
      {/* Dot on the timeline axis */}
      <div
        className={`pal-dot${isSpecial ? ' pal-dot--special' : ''}`}
        aria-hidden="true"
      />

      {/* Card */}
      <article
        ref={cardRef}
        className={`pal-card palestra-card${isSpecial ? ' pal-card--special' : ''}`}
        aria-label={`${palestra.weekday}, ${palestra.date} de ${palestra.month} — ${palestra.convidados.join(', ')}`}
      >
        {/* big decorative date number */}
        <span className="pal-date-bg" aria-hidden="true">
          {palestra.date}
        </span>

        <div ref={innerRef} className="pal-card-inner">
          {/* header row */}
          <header className="pal-card-header">
            <div className="pal-card-date-block">
              <span className="pal-card-day">{palestra.date}</span>
              <span className="pal-card-month">{palestra.month}</span>
            </div>
            <div className="pal-card-meta">
              <span className="pal-card-weekday">{palestra.weekday}</span>
              <div className="pal-card-meta-row">
                <span className="pal-card-time">{palestra.time}</span>
                {palestra.local && (
                  <>
                    <span className="pal-card-meta-dot" aria-hidden="true">·</span>
                    <span className="pal-card-local">{palestra.local}</span>
                  </>
                )}
              </div>
            </div>
            {typeLabel && (
              <span className={`pal-card-badge pal-card-badge--${palestra.tipo}`}>
                {typeLabel}
              </span>
            )}
          </header>

          {/* divider */}
          <div className="pal-card-divider" aria-hidden="true" />

          {/* convidados */}
          <div className="pal-card-guests">
            {palestra.convidados.map((name, i) => (
              <span key={i} className="pal-card-guest">{name}</span>
            ))}
          </div>

          {palestra.cargo && (
            <p className="pal-card-cargo">{palestra.cargo}</p>
          )}

          {/* tema */}
          {palestra.tema
            ? <p className="pal-card-tema">"{palestra.tema}"</p>
            : <p className="pal-card-tema pal-card-tema--tbd">Tema a definir</p>
          }

          {/* atração */}
          {palestra.atracao && (
            <div className="pal-card-atracao">
              <span className="pal-card-atracao-icon" aria-hidden="true">♪</span>
              {palestra.atracao}
            </div>
          )}
        </div>
      </article>
    </div>
  )
}

/* ════════════════════════════════════════
   PAL TIMELINE
════════════════════════════════════════ */
function PalestrasTimeline() {
  const sectionRef = useRef(null)
  const lineRef    = useRef(null)
  const wrapRef    = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      /* linha cresce com scroll */
      gsap.fromTo(lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1, ease: 'none', transformOrigin: 'top center',
          scrollTrigger: { trigger: section, start: 'top 75%', end: 'bottom 20%', scrub: 0.8 },
        }
      )

      /* dots: sempre visíveis — acendem conforme o card passa pela viewport */
      gsap.utils.toArray('.pal-dot', section).forEach((dot) => {
        const item = dot.closest('.pal-item')
        if (!item) return

        /* aparece com um pop suave quando entra na viewport */
        gsap.fromTo(dot,
          { scale: 0.4 },
          {
            scale: 1, duration: 0.45, ease: 'back.out(2)',
            immediateRender: false,
            scrollTrigger: { trigger: item, start: 'top 90%', toggleActions: 'play none none none', once: true },
          }
        )

        /* acende quando o card chega à zona central — fica aceso */
        ScrollTrigger.create({
          trigger: item,
          start: 'top 62%',
          onEnter: () => dot.classList.add('pal-dot--active'),
        })
      })

      /* cards: slide do lado de origem — esquerda ou direita */
      gsap.utils.toArray('.palestra-card', section).forEach((card) => {
        const isLeft = card.closest('.pal-item--left') !== null
        gsap.from(card,
          {
            x: isLeft ? -40 : 40, duration: 0.75, ease: 'power3.out', immediateRender: false,
            scrollTrigger: { trigger: card, start: 'top 92%', toggleActions: 'play none none none', once: true },
          }
        )
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section className="pal-timeline-section" ref={sectionRef} id="pal-timeline">
      <div className="pal-timeline-header">
        <span className="pal-tl-eyebrow">Agenda Completa</span>
        <h2 className="pal-tl-title">Programação de<br /><em>Convidados</em></h2>
        <p className="pal-tl-desc">
          08 a 22 de Abril de 2026 · Goiânia
        </p>
      </div>

      <div className="pal-timeline-wrap" ref={wrapRef}>
        <div className="pal-items">
          {/* linha vertical dentro de .pal-items — mesmo referencial dos dots */}
          <div className="pal-line-track" aria-hidden="true">
            <div ref={lineRef} className="pal-line" />
          </div>
          {PALESTRAS.map((p, i) => (
            <PalCard key={p.id} palestra={p} side={i % 2 === 0 ? 'left' : 'right'} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════
   PAL FOOTER
════════════════════════════════════════ */
function PalFooter() {
  return (
    <footer className="pal-footer" id="pal-footer">
      <div className="pal-footer-inner">
        <Link to="/" className="pal-footer-brand">
          <img src="/images/logo-lenco.png" alt="17ª Mostra de Cinema" className="pal-footer-logo" />
          <div className="pal-footer-brand-text">
            <span className="pal-footer-brand-title">17ª Mostra de Cinema</span>
            <span className="pal-footer-brand-sub">O Amor · A Morte · As Paixões</span>
          </div>
        </Link>

        <div className="pal-footer-divider" aria-hidden="true" />

        <div className="pal-footer-credits">
          <div className="pal-footer-credit-col">
            <span className="pal-footer-credit-label">Realização</span>
            <span className="pal-footer-credit-value">Instituto Jardim Cultural</span>
          </div>
          <div className="pal-footer-credit-col">
            <span className="pal-footer-credit-label">Produtor</span>
            <span className="pal-footer-credit-value">Gerson dos Santos</span>
          </div>
          <div className="pal-footer-credit-col">
            <span className="pal-footer-credit-label">Curadoria</span>
            <span className="pal-footer-credit-value">Lisandro Nogueira</span>
          </div>
          <div className="pal-footer-credit-col">
            <span className="pal-footer-credit-label">Direção de Criação</span>
            <span className="pal-footer-credit-value">Rubens Alves</span>
          </div>
        </div>

        <div className="pal-footer-divider" aria-hidden="true" />

        <div className="pal-footer-bottom">
          <span className="pal-footer-copy">
            &copy; 2026 17ª Mostra de Cinema · Goiânia · Todos os direitos reservados
          </span>
          <Link to="/" className="pal-footer-back-link">
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
function BackToTop() {
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const onScroll = () => setVis(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!vis) return null
  return (
    <button
      className="pal-back-to-top"
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
function BackToHome() {
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const onScroll = () => setVis(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!vis) return null
  return (
    <Link to="/" className="pal-back-home" aria-label="Voltar à página inicial">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M13 8H3M3 8L7 4M3 8L7 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>Voltar</span>
    </Link>
  )
}

/* ════════════════════════════════════════
   PAGE
════════════════════════════════════════ */
export default function PalestrasPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <>
      <PalCursor />
      <ScrollProgress />
      <PalNav />
      <PalHero />
      <PalestrasTimeline />
      <PalFooter />
      <BackToHome />
      <BackToTop />
    </>
  )
}
