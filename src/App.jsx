import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'

/* HashRouter usa o hash para rotas — href="#id" quebraria a navegação.
   Usar sempre este helper para scroll in-page. */
function goTo(id, e) {
  if (e) e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
import { SCHEDULE, ANCHOR_FILMS, PARTNERS as FILM_PARTNERS } from './data/films'

gsap.registerPlugin(ScrollTrigger)

/* ─── constants ─── */
const FESTIVAL_START = new Date('2026-04-08T19:00:00-03:00')

const MARQUEE_1 = [
  '17ª Mostra', '·', 'O Amor', '·', 'A Morte', '·', 'As Paixões',
  '·', 'Brasilidades', '·', 'Goiânia', '·', '08 a 22 de Abril',
  '·', '17ª Mostra', '·', 'O Amor', '·', 'A Morte', '·', 'As Paixões',
  '·', 'Brasilidades', '·', 'Goiânia', '·', '08 a 22 de Abril', '·',
]
const MARQUEE_2 = [
  'Idealização Instituto Jardim Cultural', '·', 'Curadoria Lisandro Nogueira', '·',
  'Coordenador Geral Gerson Santos', '·', 'Diretor Rubens Alves', '·',
  'Produtora Gabriela Cardoso', '·', 'Cinema Brasileiro', '·', 'Longa-Metragem', '·', 'Curta-Metragem', '·',
  'Idealização Instituto Jardim Cultural', '·', 'Curadoria Lisandro Nogueira', '·',
  'Coordenador Geral Gerson Santos', '·', 'Diretor Rubens Alves', '·',
  'Produtora Gabriela Cardoso', '·',
]


/* ─── PALESTRAS (dados 01.04) ─── */
/* Mantido aqui para referência — timeline completa em /palestras */

/* ── helper ── */
function getFilmSessions(title) {
  const result = []
  SCHEDULE.forEach(day => {
    day.sala1.forEach(s => {
      if (s.title === title) result.push({ date: day.date, weekday: day.weekday, time: s.time, sala: 'Sala 1' })
    })
    day.sala2.forEach(s => {
      if (s.title === title) result.push({ date: day.date, weekday: day.weekday, time: s.time, sala: 'Sala 2' })
    })
  })
  return result
}

/* ════════════════════════════════════════
   HOOKS
════════════════════════════════════════ */
function useCountdown(target) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const calc = () => {
      const diff = target - Date.now()
      if (diff <= 0) return setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      setTime({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [target])
  return time
}

/* ════════════════════════════════════════
   INTRO OVERLAY  (Dune-style reveal)
════════════════════════════════════════ */
function IntroOverlay() {
  const overlayRef = useRef(null)

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return
    gsap.to(overlay, {
      opacity: 0, duration: 1.4, ease: 'power2.inOut', delay: 2.4,
      onComplete: () => overlay.classList.add('hidden')
    })
  }, [])

  return (
    <div ref={overlayRef} id="intro-overlay">
      <div id="intro-logo-glow" />
      <div id="intro-line" />
      <img src="/images/logo-completa.webp" alt="" id="intro-logo" />
      <p id="intro-sub">08 · 22 Abril · Goiânia · 2026</p>
    </div>
  )
}

/* ════════════════════════════════════════
   CURSOR
════════════════════════════════════════ */
function Cursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    // Skip cursor on touch devices
    if (window.matchMedia('(hover: none)').matches) return

    const dot  = dotRef.current
    const ring = ringRef.current
    let mx = 0, my = 0, rx = 0, ry = 0, raf

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY
      gsap.to(dot, { x: mx, y: my, duration: 0 })
    }
    const loop = () => {
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      gsap.set(ring, { x: rx, y: ry })
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(loop)

    const addHover = () => {
      document.querySelectorAll('a, button, [data-hover]').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'))
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'))
      })
    }
    addHover()
    const obs = new MutationObserver(addHover)
    obs.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      obs.disconnect()
    }
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
    const onScroll = () => {
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      bar.style.width = pct + '%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <div id="scroll-progress" ref={barRef} />
}

/* ════════════════════════════════════════
   NAV
════════════════════════════════════════ */
function Nav() {
  const navRef = useRef(null)

  useEffect(() => {
    const nav = navRef.current
    const onScroll = () => nav.classList.toggle('nav--solid', window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => navRef.current.classList.remove('nav--open')
  const toggle = () => navRef.current.classList.toggle('nav--open')

  return (
    <>
      <nav ref={navRef} id="nav">
        <a href="#" onClick={(e) => goTo('hero', e)} className="nav-brand">
          <img src="/images/logo-lenco.webp" alt="Mostra" className="nav-brand-icon" />
          <div className="nav-brand-text">
            <span className="nav-brand-title">17ª Mostra</span>
            <span className="nav-brand-sub">O Amor · A Morte · As Paixões</span>
          </div>
        </a>

        <ul className="nav-links">
          <li><a href="#" className="btn-nav-home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Início</a></li>
          <li><a href="#" onClick={(e) => goTo('sobre', e)}>Sobre</a></li>
          <li><Link to="/palestras">Convidados &amp; Palestras</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><a href="#" onClick={(e) => goTo('curadoria', e)}>Curadoria</a></li>
          <li><a href="#" onClick={(e) => goTo('espaco', e)}>Espaço</a></li>
          <li><Link to="/programacao" className="btn-nav">Programação de Filmes</Link></li>
        </ul>

        <button className="nav-hamburger" aria-label="Menu" onClick={toggle}>
          <span /><span /><span />
        </button>
      </nav>

      <div id="mobile-menu">
        <ul>
          <li><a href="#" className="btn-nav-home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); close() }}>Início</a></li>
          <li><a href="#" onClick={(e) => { goTo('sobre', e); close() }}>Sobre</a></li>
          <li><Link to="/palestras" onClick={close}>Convidados &amp; Palestras</Link></li>
          <li><Link to="/blog" onClick={close}>Blog</Link></li>
          <li><Link to="/programacao" onClick={close}>Programação de Filmes</Link></li>
          <li><a href="#" onClick={(e) => { goTo('curadoria', e); close() }}>Curadoria</a></li>
          <li><a href="#" onClick={(e) => { goTo('espaco', e); close() }}>Espaço</a></li>
        </ul>
        <div className="mobile-menu-credits">
          <div>Idealização · Instituto Jardim Cultural</div>
          <div>Coordenador Geral · Gerson Santos</div>
          <div>Curadoria · Lisandro Nogueira</div>
          <div>Diretor · Rubens Alves</div>
          <div>Produtora · Gabriela Cardoso</div>
        </div>
      </div>
    </>
  )
}

/* ════════════════════════════════════════
   HERO
════════════════════════════════════════ */
function Hero() {
  const countdown = useCountdown(FESTIVAL_START)

  return (
    <section id="hero">
      {/* ambient glow blobs */}
      <div className="hero-ambient" aria-hidden="true">
        <div className="ambient-blob blob-1" />
        <div className="ambient-blob blob-2" />
        <div className="ambient-blob blob-3" />
        <div className="ambient-blob blob-4" />
      </div>

      {/* background */}
      <div className="hero-bg">
        {/* <video
          src="/video/hero.mp4"
          autoPlay muted loop playsInline
          className="hero-video"
        /> */}
        <img
          src="/images/cena.webp"
          alt=""
          className="hero-img-fallback"
          aria-hidden="true"
        />
        <div className="hero-overlay-1" />
        <div className="hero-overlay-2" />
        <div className="hero-texture" aria-hidden="true" />
      </div>

      {/* content */}
      <div className="hero-content">
        <div className="hero-apresenta">
          <img src="/images/sesc-branca.webp" alt="Sesc" className="hero-sesc-logo" />
          <span className="hero-apresenta-label">apresenta</span>
        </div>

        <span className="hero-edicao">17ª Edição · Mostra de Cinema</span>

        {/* logo — spotlight suave + contour pulse via drop-shadow */}
        <div className="hero-logo-outer">
          <div className="hero-logo-wrap">
            <img
              src="/images/logo-completa.webp"
              alt="17ª Mostra — O Amor, a Morte e as Paixões"
              className="hero-logo"
            />
          </div>
        </div>

        <div className="hero-venue">
          <img src="/images/ON_LOGO.png" alt="Centro Cultural Oscar Niemeyer" className="hero-venue-logo" />
          <span className="hero-venue-name">Centro Cultural Oscar Niemeyer</span>
        </div>

        <p className="hero-date">
          08<span>—</span>22 de Abril, 2026
          <span>·</span>
          Goiânia
        </p>

        <div className="hero-ctas">
          <Link to="/palestras" className="btn-primary">Convidados &amp; Palestras</Link>
          <Link to="/programacao" className="btn-primary-gold">Programação de Filmes</Link>
        </div>

        <div className="hero-countdown">

          <div className="countdown-item">
            <span className="countdown-num">{String(countdown.days).padStart(2,'0')}</span>
            <span className="countdown-label">Dias</span>
          </div>
          <span className="countdown-sep">:</span>
          <div className="countdown-item">
            <span className="countdown-num">{String(countdown.hours).padStart(2,'0')}</span>
            <span className="countdown-label">Hrs</span>
          </div>
          <span className="countdown-sep">:</span>
          <div className="countdown-item">
            <span className="countdown-num">{String(countdown.minutes).padStart(2,'0')}</span>
            <span className="countdown-label">Min</span>
          </div>
          <span className="countdown-sep">:</span>
          <div className="countdown-item">
            <span className="countdown-num">{String(countdown.seconds).padStart(2,'0')}</span>
            <span className="countdown-label">Seg</span>
          </div>
        </div>

        {/* scroll cue — 20px abaixo do countdown, no flow */}
        <div className="hero-scroll">
          <span className="hero-scroll-text">Role para baixo</span>
          <span className="scroll-drop" />
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════
   MARQUEE
════════════════════════════════════════ */
function Marquee({ items, reversed = false, className = '' }) {
  const doubled = [...items, ...items]
  return (
    <div className={`marquee-outer ${reversed ? 'marquee-rev' : ''} ${className}`}>
      <div className="marquee-track">
        {doubled.map((t, i) => (
          <span key={i} className={t === '·' ? 'mark-accent' : ''}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════
   SOBRE
════════════════════════════════════════ */
function Sobre() {
  return (
    <section id="sobre" style={{ position: 'relative' }}>
      <img src="/images/logo-lenco.webp" alt="" aria-hidden="true" className="sobre-lenco-deco" />
      <div className="sobre-grid">
        {/* text */}
        <div className="sobre-text">
          <div className="section-line">
            <span className="label">O Evento</span>
          </div>
          <h2 data-reveal>
            Cinema que pulsa<br />
            <em>amor</em> e morte.
          </h2>
          <p data-reveal>
            A <strong>17ª Mostra de Cinema</strong> traz ao centro a tríade fundamental da
            existência humana: o amor em suas formas mais viscerais, a morte como
            inevitabilidade que nos humaniza, e as paixões que nos movem para além do razoável.
          </p>
          <p data-reveal>
            Envoltos nas <strong>Brasilidades</strong> — na textura de nosso povo, na temperatura
            de nosso afeto, na cor de nossa história —, os filmes desta edição falam ao Brasil
            que somos e ao que queremos ser.
          </p>
          <p data-reveal>
            Uma seleção de <strong>oito longas-metragens</strong> e <strong>seis curtas</strong>{' '}
            que não temem a intensidade. Filmes que ardem — e que, por isso, ficam.
          </p>

          <div className="sobre-stats" data-reveal>
            <div className="stat-item">
              <span className="stat-num">17<em>ª</em></span>
              <span className="stat-label">Edição</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">71</span>
              <span className="stat-label">Filmes</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">15</span>
              <span className="stat-label">Dias de Mostra</span>
            </div>
          </div>

          <Link to="/programacao" className="btn-primary-gold" data-reveal>
            Programação de Filmes
          </Link>
        </div>

        {/* visual */}
        <div className="sobre-visual" data-reveal>
          <img
            src="/images/cena-v.webp"
            alt="Mostra de Cinema"
            className="sobre-img-main"
          />
          <img
            src="/images/bonde.webp"
            alt=""
            className="sobre-img-accent"
            aria-hidden="true"
          />
          <div className="sobre-visual-badge">
            <span className="sobre-visual-badge-num">17</span>
            <span className="sobre-visual-badge-text">Edição<br />2026</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════
   FILM CARD  (ANCHOR_FILMS)
════════════════════════════════════════ */
function FilmCard({ film }) {
  const cardRef    = useRef(null)
  const sessions   = getFilmSessions(film.title)
  const rafId      = useRef(null)
  const pendingEv  = useRef(null)

  const onMouseMove = useCallback((e) => {
    pendingEv.current = { clientX: e.clientX, clientY: e.clientY }
    if (rafId.current) return
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null
      const card = cardRef.current
      const ev   = pendingEv.current
      if (!card || !ev) return
      const rect = card.getBoundingClientRect()
      const x = ((ev.clientX - rect.left) / rect.width  - 0.5) * 10
      const y = ((ev.clientY - rect.top)  / rect.height - 0.5) * -10
      gsap.to(card, { rotateX: y, rotateY: x, transformPerspective: 800, duration: 0.4, ease: 'power2.out' })
    })
  }, [])

  const onMouseLeave = useCallback(() => {
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out' })
  }, [])

  return (
    <article
      className="film-card"
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      data-hover
    >
      <img
        src={film.poster}
        alt={film.title}
        className="film-card-poster"
        loading="lazy"
      />

      <div className="film-card-cat">{film.categoria.split('-')[0]}</div>
      <div className="film-card-sessions-badge">{film.sessions}×</div>

      <div className="film-card-overlay">
        <h3 className="film-card-title">{film.title}</h3>
        <p className="film-card-sinopse">{film.sinopse}</p>
        <div className="film-card-sessoes">
          {sessions.slice(0, 3).map((s, i) => (
            <span key={i} className="film-card-sessao">{s.date} · {s.time}</span>
          ))}
        </div>
      </div>
    </article>
  )
}

/* ════════════════════════════════════════
   FILMES — poster strip cinematográfico
════════════════════════════════════════ */
function FilmesStrip() {
  const stripRef = useRef(null)
  const [selected, setSelected] = useState(null)

  /* ── GSAP entrance ── */
  useEffect(() => {
    const items = stripRef.current?.querySelectorAll('.poster-item')
    if (!items?.length) return
    gsap.set(items, { x: '80vw', opacity: 0 })
    gsap.to(items, {
      x: 0, opacity: 1, duration: 1.4, stagger: 0.08, ease: 'power4.out',
      scrollTrigger: { trigger: stripRef.current, start: 'top 78%' },
    })
  }, [])

  const handleClick = (film) => {
    setSelected(prev => prev?.id === film.id ? null : film)
  }

  return (
    <section id="filmes">
      <div className="filmes-intro">
        <div className="section-line">
          <span className="label">Os Filmes</span>
        </div>
        <h2 data-reveal>Destaques<br /><em>da Mostra</em></h2>
        <p className="filmes-hint" data-reveal>
          Passe o cursor · Clique para ver sessões
        </p>
      </div>

      <div className="filmes-strip" ref={stripRef}>
        {ANCHOR_FILMS.map((film, idx) => {
          const isSelected = selected?.id === film.id
          const sessions   = isSelected ? getFilmSessions(film.title) : []

          return (
            <div
              key={film.id}
              className={`poster-item${isSelected ? ' selected' : ''}`}
              onClick={() => handleClick(film)}
              data-hover
            >
              {/* poster */}
              <div className="poster-media">
                <img src={film.poster} alt={film.title} className="poster-img" loading="lazy" />
                {!isSelected && (
                  <>
                    <div className="poster-info">
                      <span className="poster-cat">{film.categoria.split('-')[0]}</span>
                      <h3 className="poster-title">{film.title}</h3>
                      <span className="poster-sessions-label">{film.sessions} sessões</span>
                      <p className="poster-sinopse">{film.sinopse}</p>
                    </div>
                    <div className="poster-num">{String(idx + 1).padStart(2, '0')}</div>
                  </>
                )}
              </div>

              {/* painel de sessões — aparece à direita do poster */}
              {isSelected && (
                <div className="poster-panel">
                  <div className="poster-panel-head">
                    <div className="poster-panel-meta">
                      <span className="poster-cat">{film.categoria.split('-')[0]}</span>
                      <h3 className="poster-panel-title">{film.title}</h3>
                    </div>
                    <button
                      className="poster-panel-close"
                      onClick={(e) => { e.stopPropagation(); setSelected(null) }}
                      data-hover
                    >
                      ✕
                    </button>
                  </div>
                  <div className="poster-panel-sessions">
                    {sessions.map((s, i) => (
                      <div key={i} className="pps-row">
                        <span className="pps-date">{s.date}</span>
                        <span className="pps-time">{s.time}</span>
                        <span className="pps-sala">{s.sala.replace('Sala ', 'S')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ════════════════════════════════════════
   PROGRAMAÇÃO  (grade diária)
════════════════════════════════════════ */
function Programacao() {
  const [activeDay, setActiveDay] = useState(0)
  const dayNavRef = useRef(null)
  const day = SCHEDULE[activeDay]

  return (
    <section id="programacao">
      <div className="prog-header">
        <div className="prog-title-group">
          <div className="section-line">
            <span className="label">Programação Oficial · 09 a 22 de Abril</span>
          </div>
          <h2 data-reveal>Grade de<br />Sessões</h2>
        </div>
        <p className="prog-desc" data-reveal>
          Duas salas, 14 dias, 71 filmes.<br />
          Selecione o dia e confira as sessões.
        </p>
      </div>

      {/* ── seletor de dia ── */}
      <div className="day-nav-wrap">
        <div className="day-nav" ref={dayNavRef}>
          {SCHEDULE.map((d, i) => (
            <button
              key={d.date}
              className={`day-tab${i === activeDay ? ' active' : ''}`}
              onClick={() => setActiveDay(i)}
              data-hover
            >
              <span className="day-tab-num">{d.label}</span>
              <span className="day-tab-wd">{d.weekday.slice(0, 3)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── grade do dia selecionado ── */}
      <div className="schedule-wrap">
        <div className="schedule-day-label">
          <span className="schedule-weekday">{day.weekday}</span>
          <span className="schedule-date">{day.date} de Abril · 2026</span>
        </div>

        <div className="schedule-grid">
          {[
            { key: 'sala1', label: 'Sala 1', sessions: day.sala1 },
            { key: 'sala2', label: 'Sala 2', sessions: day.sala2 },
          ].map(({ key, label, sessions }) => (
            <div className="sala-col" key={key}>
              <div className="sala-header">{label}</div>
              <div className="sala-sessions">
                {sessions.map((s, i) => (
                  <div key={i} className={`session-row${s.fixo ? ' fixo' : ''}`}>
                    <span className="session-time">{s.time}</span>
                    <span className="session-title">{s.title}</span>
                    {s.fixo && <span className="session-tag">Especial</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════
   DESTAQUES DA MOSTRA  (ANCHOR_FILMS)
════════════════════════════════════════ */
function Destaque() {
  const [active, setActive] = useState(0)
  const film = ANCHOR_FILMS[active]
  const sessions = getFilmSessions(film.title)

  return (
    <section id="destaque">
      <div className="destaque-inner">
        {/* ── poster / visual ── */}
        <div className="destaque-visual">
          <img src={film.poster} alt={film.title} className="destaque-poster" />
          <div className="destaque-visual-overlay" />

          {/* seletor de filme — sobreposto ao poster */}
          <div className="destaque-film-picker">
            {ANCHOR_FILMS.map((f, i) => (
              <button
                key={f.id}
                className={`destaque-pick-btn${i === active ? ' active' : ''}`}
                onClick={() => setActive(i)}
                data-hover
                title={f.title}
              >
                <span className="destaque-pick-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="destaque-pick-title">{f.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── info ── */}
        <div className="destaque-content">
          <div className="destaque-badge" data-reveal>
            Destaques da Mostra
          </div>

          <span className="label" data-reveal>{film.categoria}</span>
          <h2 className="destaque-title" data-reveal>{film.title}</h2>

          <div className="destaque-meta" data-reveal>
            <span>{film.sessions} sessões</span>
          </div>

          <p className="destaque-sinopse" data-reveal>{film.sinopse}</p>

          {sessions.length > 0 && (
            <>
              <p className="destaque-sessoes-title" data-reveal>Sessões</p>
              <div className="destaque-sessoes" data-reveal>
                {sessions.slice(0, 5).map((s, i) => (
                  <div key={i} className="destaque-sessao">
                    {s.date} · {s.time} · {s.sala}
                  </div>
                ))}
              </div>
            </>
          )}

          <span className="btn-primary btn-disabled" data-reveal style={{opacity:0.4, pointerEvents:'none', cursor:'default'}}>
            Programação de Filmes · Em Breve
          </span>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════
   CURADORIA
════════════════════════════════════════ */
function Curadoria() {
  return (
    <section id="curadoria">
      <img src="/images/logo-lenco.webp" alt="" aria-hidden="true" className="curadoria-lenco-deco" />
      <div className="curadoria-inner">
        <div className="curadoria-quote" data-reveal>
          <span className="label" style={{ justifyContent: 'center', display: 'flex' }}>Nota de Curadoria</span>
          <blockquote>
            Curar é escolher o que merece ser visto. Mais do que isso: é defender
            a ideia de que o cinema pode mudar uma vida. Esta programação foi construída
            com o coração, frame a frame — em busca dos filmes que perturbam, encantam e ficam.
          </blockquote>
          <cite><span>Lisandro Nogueira</span> — Curador</cite>
        </div>

        <div className="curadoria-credits" data-reveal>
          <div className="credit-item">
            <span className="credit-role">Idealização</span>
            <span className="credit-name">Instituto Jardim Cultural</span>
          </div>
          <div className="credit-item">
            <span className="credit-role">Coordenador Geral</span>
            <span className="credit-name">Gerson Santos</span>
          </div>
          <div className="credit-item">
            <span className="credit-role">Curadoria</span>
            <span className="credit-name">Lisandro Nogueira</span>
          </div>
          <div className="credit-item">
            <span className="credit-role">Diretor</span>
            <span className="credit-name">Rubens Alves</span>
          </div>
          <div className="credit-item">
            <span className="credit-role">Produtora</span>
            <span className="credit-name">Gabriela Cardoso</span>
          </div>
        </div>

        <div className="brasilidades-block" data-reveal>
          <span className="label-gold" style={{ justifyContent: 'center', display: 'flex' }}>
            Brasilidades
          </span>
          <p className="brasilidades-text">
            A Mostra abraça as <strong>Brasilidades</strong> como eixo estético e temático.
            A textura do nosso cinema, a temperatura do nosso afeto, o peso do nosso luto —
            tudo aqui está envolto na identidade brasileira. Não como tema superficial, mas
            como <strong>substância</strong>. Como carne e osso de cada imagem.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════
   ESPAÇO
════════════════════════════════════════ */
function Espaco() {
  return (
    <section id="espaco">
      <div className="espaco-header" data-reveal>
        <span className="label">O Espaço</span>
        <h2>Nosso<br /><span>Cinema.</span></h2>
      </div>

      <div className="espaco-grid">
        <div className="espaco-img-wrap">
          <img src="/images/espaco-1.webp" alt="Espaço da Mostra" className="espaco-img" />
        </div>
        <div className="espaco-img-wrap">
          <img src="/images/espaco-2.webp" alt="Espaço da Mostra detalhe" className="espaco-img" />
        </div>
      </div>

      <div className="espaco-info">
        <div className="espaco-info-item">
          <span className="espaco-info-label">Período</span>
          <span className="espaco-info-value">08 a 22 de Abril</span>
        </div>
        <div className="espaco-info-item">
          <span className="espaco-info-label">Cidade</span>
          <span className="espaco-info-value">Goiânia, GO</span>
        </div>
        <div className="espaco-info-item">
          <span className="espaco-info-label">Entrada</span>
          <span className="espaco-info-value">Gratuita</span>
        </div>
        <div className="espaco-info-item">
          <span className="espaco-info-label">Realização</span>
          <span className="espaco-info-value">Instituto Jardim Cultural</span>
        </div>
      </div>

      <div className="espaco-venue" data-reveal>
        <span className="espaco-venue-label">Local do Evento</span>
        <img src="/images/ON_LOGO.png" alt="Centro Cultural Oscar Niemeyer" className="espaco-venue-logo" />
        <span className="espaco-venue-name">Centro Cultural Oscar Niemeyer</span>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════
   EDIÇÕES ANTERIORES
════════════════════════════════════════ */
function EdicoesAnteriores() {
  return (
    <section id="anteriores">
      <div className="anteriores-inner">
        <div className="anteriores-visual" data-reveal>
          <img
            src="/images/bonde.webp"
            alt="Edição anterior da Mostra"
            className="anteriores-img"
          />
        </div>
        <div className="anteriores-text">
          <span className="label" data-reveal>16ª Edição</span>
          <h2 data-reveal>Uma história que<br />se acumula.</h2>
          <p data-reveal>
            Há 17 anos a Mostra de Cinema ocupa um espaço único na cena cultural de Goiânia.
            Cada edição une realizadores, cineastas e o público em torno de uma temática
            que pulsa no coração do cinema nacional.
          </p>
          <p data-reveal>
            Das primeiras exibições às grandes estreias, a Mostra cresceu sem jamais
            perder sua essência: o comprometimento com um cinema que tem algo a dizer.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════
   PARCERIAS
════════════════════════════════════════ */
function Parcerias() {
  return (
    <section id="parcerias">
      <div className="parcerias-inner">
        <span className="label" style={{ marginBottom: 12 }}>Parcerias & Apoio</span>
        <h3>Feito junto com quem acredita no cinema.</h3>
        <div className="parcerias-grid" data-reveal>
          {FILM_PARTNERS.map((item, i) => (
            <div className="parceria-item" key={i}>
              {item.logo ? (
                <img src={item.logo} alt={item.name} />
              ) : (
                <span className="parceria-name">{item.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════
   FOOTER
════════════════════════════════════════ */
function Footer() {
  return (
    <footer id="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand-col">
            <img src="/images/logo-completa.webp" alt="17ª Mostra" className="footer-logo" />
            <p className="footer-tagline">
              O amor que move, a morte que limita e as paixões que definem.
            </p>
            <div className="footer-sesc-apresenta">
              <span className="footer-sesc-label">Apresentação</span>
              <img src="/images/sesc-branca.webp" alt="Sesc" className="footer-sesc-logo" />
            </div>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Programação</span>
            <ul>
              <li><Link to="/palestras">Convidados &amp; Palestras</Link></li>
              <li><Link to="/programacao">Programação de Filmes</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">A Mostra</span>
            <ul>
              <li><a href="#" onClick={(e) => goTo('sobre', e)}>Sobre</a></li>
              <li><a href="#" onClick={(e) => goTo('curadoria', e)}>Curadoria</a></li>
              <li><a href="#" onClick={(e) => goTo('espaco', e)}>Espaço</a></li>
              <li><a href="#" onClick={(e) => goTo('anteriores', e)}>Edições Anteriores</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Informações</span>
            <p className="footer-col-text">
              08 a 22 de Abril<br />
              <strong>Goiânia, GO</strong><br /><br />
              Entrada gratuita<br />
              Classificação por filme
            </p>
          </div>
        </div>

        <div className="footer-credits">
          <div className="footer-credit-item">
            <span className="footer-credit-role">Idealização</span>
            <span className="footer-credit-name">Instituto Jardim Cultural</span>
          </div>
          <div className="footer-credit-item">
            <span className="footer-credit-role">Coordenador Geral</span>
            <span className="footer-credit-name">Gerson Santos</span>
          </div>
          <div className="footer-credit-item">
            <span className="footer-credit-role">Curadoria</span>
            <span className="footer-credit-name">Lisandro Nogueira</span>
          </div>
          <div className="footer-credit-item">
            <span className="footer-credit-role">Diretor</span>
            <span className="footer-credit-name">Rubens Alves</span>
          </div>
          <div className="footer-credit-item">
            <span className="footer-credit-role">Produtora</span>
            <span className="footer-credit-name">Gabriela Cardoso</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © 2026 17ª Mostra de Cinema. Todos os direitos reservados.
          </p>
          <ul className="footer-social">
            <li><a href="#" aria-label="Instagram">Instagram</a></li>
            <li><a href="#" aria-label="YouTube">YouTube</a></li>
            <li><a href="#" aria-label="Facebook">Facebook</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

/* ════════════════════════════════════════
   PALESTRAS CTA  (card na página principal)
════════════════════════════════════════ */
function PalestrasCTA() {
  return (
    <section id="palestras-cta">
      <div className="pal-cta-inner">
        <div className="section-line" data-reveal>
          <span className="label">Convidados &amp; Palestras · 08 a 22 de Abril</span>
        </div>
        <h2 data-reveal>
          Vozes que<br /><em>iluminam</em>
        </h2>
        <p className="pal-cta-desc" data-reveal>
          Pensadores, escritores e cineastas que aprofundam o debate ao redor da programação.
          16 convidados ao longo dos 14 dias da Mostra.
        </p>
        <div className="pal-cta-names" data-reveal>
          {['Ruy Castro','Celso Camilo','Luiz Pondé','Cristian Dunker',
            'Vladimir Safatle','Jesse de Souza','Jeferson Tenório','Paula Febee',
            'Jussara Santos','Pedro Pacífico','e mais…'
          ].map((n, i) => (
            <span key={i} className="pal-cta-name">{n}</span>
          ))}
        </div>
        <Link to="/palestras" className="btn-primary" data-reveal>
          Ver Todos os Convidados
        </Link>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════
   PROGRAMAÇÃO EM BREVE  (teaser filmes)
════════════════════════════════════════ */
function ProgramacaoEmBreve() {
  return (
    <section id="prog-em-breve">
      <div className="peb-inner" data-reveal>
        <span className="peb-icon">🎬</span>
        <div className="peb-text">
          <span className="label-gold">Programação Oficial de Filmes</span>
          <h3>Longas &amp; Curtas · <em>Em Breve</em></h3>
          <p>A grade completa de filmes será divulgada em breve. Acompanhe.</p>
        </div>
        <div className="peb-dates">
          <span>08</span>
          <span className="peb-sep">—</span>
          <span>22</span>
          <span className="peb-month">ABR 2026</span>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════
   PALESTRAS — TIMELINE (mantida no código, oculta via SHOW_FILMS)
════════════════════════════════════════ */
function Palestras() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* linha cresce com o scroll */
      gsap.fromTo('.pal-line-inner',
        { scaleY: 0 },
        {
          scaleY: 1, ease: 'none', transformOrigin: 'top center',
          scrollTrigger: {
            trigger: '#palestras',
            start: 'top 70%',
            end: 'bottom 40%',
            scrub: 1.2,
          },
        }
      )

      /* cards entram de lados alternados */
      sectionRef.current?.querySelectorAll('.pal-item').forEach((item, i) => {
        const isLeft = item.classList.contains('pal-left')
        const card = item.querySelector('.palestra-card')
        if (!card) return
        gsap.fromTo(card,
          { opacity: 0, x: isLeft ? -64 : 64, y: 20 },
          {
            opacity: 1, x: 0, y: 0,
            duration: 1.1, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%' },
          }
        )
      })

      /* dots aparecem */
      gsap.utils.toArray('.pal-dot').forEach((dot) => {
        gsap.fromTo(dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2.5)',
            scrollTrigger: { trigger: dot, start: 'top 92%' },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="palestras" ref={sectionRef}>
      <div className="palestras-header">
        <div className="section-line">
          <span className="label">Convidados &amp; Palestras · 08 a 22 de Abril</span>
        </div>
        <h2 data-reveal>
          Vozes que<br /><em>iluminam</em>
        </h2>
        <p className="palestras-desc" data-reveal>
          Pensadores, escritores e cineastas que aprofundam o debate ao redor da programação.
        </p>
      </div>

      <div className="pal-timeline">
        {/* linha vertical */}
        <div className="pal-line">
          <div className="pal-line-inner" />
        </div>

        {PALESTRAS.map((p, i) => (
          <div
            key={p.id}
            className={`pal-item ${i % 2 === 0 ? 'pal-left' : 'pal-right'} ${p.tipo ? `pal-tipo-${p.tipo}` : ''}`}
          >
            <div className="pal-dot" />

            <div className="palestra-card">
              {/* data decorativa em bg */}
              <span className="pal-date-bg" aria-hidden="true">{p.date}</span>

              <div className="pal-card-inner">
                {/* topo: data + time + local */}
                <div className="pal-meta">
                  <span className="pal-date-label">{p.date} {p.month} · {p.weekday}</span>
                  <span className="pal-time">{p.time}</span>
                  {p.local && <span className="pal-local">{p.local}</span>}
                </div>

                {/* palestrante(s) */}
                <div className="pal-speakers">
                  {p.convidados.map((c, ci) => (
                    <h3 key={ci} className="pal-speaker-name">{c}</h3>
                  ))}
                </div>

                {/* cargo */}
                {p.cargo && <p className="pal-cargo">{p.cargo}</p>}

                {/* tema */}
                {p.tema && (
                  <p className="pal-tema">
                    <span className="pal-tema-mark">&ldquo;</span>
                    {p.tema}
                    <span className="pal-tema-mark">&rdquo;</span>
                  </p>
                )}

                {/* atração musical */}
                {p.atracao && (
                  <div className="pal-atracao">
                    <span className="pal-atracao-icon">♩</span>
                    {p.atracao}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ════════════════════════════════════════
   GSAP GLOBAL EFFECTS
════════════════════════════════════════ */
function useGSAPEffects() {
  useEffect(() => {
    /* ── scroll reveals ── */
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 64 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' } }
      )
    })

    /* ── hero BG parallax — desabilitado em mobile (evita artefatos) ── */
    if (window.innerWidth > 768) {
      gsap.to('.hero-bg', {
        yPercent: 25, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
      })
    }

    /* ── big title cinematic reveal ── */
    gsap.utils.toArray('.destaque-title, .espaco-header h2').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1.3, ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 85%' } }
      )
    })

    /* ── film cards stagger ── */
    gsap.utils.toArray('.film-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 48, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: i * 0.07, ease: 'power3.out',
          scrollTrigger: { trigger: '#programacao', start: 'top 80%' } }
      )
    })

    /* ── credits stagger ── */
    const credits = gsap.utils.toArray('.credit-item')
    gsap.fromTo(credits,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.curadoria-credits', start: 'top 85%' } }
    )

    /* ── sobre stats count-up ── */
    gsap.utils.toArray('.stat-num').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)',
          scrollTrigger: { trigger: el, start: 'top 90%' } }
      )
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])
}

/* ════════════════════════════════════════
   APP
════════════════════════════════════════ */
/* ── Back to Top ── */
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
      className="back-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Voltar ao topo"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 16V4M10 4L4 10M10 4L16 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}

export default function App() {
  useGSAPEffects()

  return (
    <>
      <IntroOverlay />
      <ScrollProgress />
      <Cursor />
      <Nav />
      <Hero />
      <Marquee items={MARQUEE_1} />
      <Sobre />
      <PalestrasCTA />
      <Marquee items={MARQUEE_2} reversed />
      <Curadoria />
      <Espaco />
      <EdicoesAnteriores />
      <Parcerias />
      <Footer />
      <BackToTop />
    </>
  )
}
