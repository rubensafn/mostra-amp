import { useEffect, useRef, useCallback, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SCHEDULE, ANCHOR_FILMS, FILMS_DATA } from '../data/films'
import { TRAILERS } from '../data/trailers'
import '../App.css'
import './PalestrasPage.css'

gsap.registerPlugin(ScrollTrigger)

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
   GSAP REVEAL HOOK
════════════════════════════════════════ */
function useGSAPReveal() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 64 },
          { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' } }
        )
      })
    })
    return () => ctx.revert()
  }, [])
}

/* ════════════════════════════════════════
   CURSOR
════════════════════════════════════════ */
function ProgCursor() {
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

    document.body.classList.remove('cursor-hover')
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
      document.body.classList.remove('cursor-hover')
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
   NAV
════════════════════════════════════════ */
function ProgNav() {
  const navRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const onScroll = () => nav.classList.toggle('pal-nav--solid', window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setMenuOpen(false)

  return (
    <>
      <nav ref={navRef} className="pal-nav" role="navigation">
        <Link to="/" className="pal-nav-back" aria-label="Voltar para o site">
          <span className="pal-nav-back-arrow">←</span>
          <span className="pal-nav-back-label">Voltar</span>
        </Link>

        <Link to="/" className="pal-nav-brand">
          <img src="/images/logo-lenco.webp" alt="17ª Mostra de Cinema" className="pal-nav-logo" />
          <span className="pal-nav-title">17ª MOSTRA</span>
        </Link>

        <ul className="pal-nav-links">
          <li><Link to="/" className="pal-nav-link--home">Início</Link></li>
          <li><Link to="/palestras">Convidados &amp; Palestras</Link></li>
        </ul>

        <button className={`pal-nav-hamburger${menuOpen ? ' open' : ''}`} aria-label="Menu" onClick={() => setMenuOpen(m => !m)}>
          <span /><span /><span />
        </button>
      </nav>

      {menuOpen && <div className="pal-mobile-overlay" onClick={close} />}
      <div className={`pal-mobile-menu${menuOpen ? ' open' : ''}`}>
        <ul>
          <li><Link to="/" onClick={close}>Início</Link></li>
          <li><Link to="/palestras" onClick={close}>Convidados &amp; Palestras</Link></li>
        </ul>
      </div>
    </>
  )
}

/* ════════════════════════════════════════
   PAGE INTRO OVERLAY
════════════════════════════════════════ */
function ProgPageIntro() {
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
    <div ref={overlayRef} id="pal-page-intro">
      <div id="pal-intro-glow" />
      <div id="pal-intro-line" />
      <h1 id="pal-intro-title">
        <span id="pal-intro-line1">PROGRAMAÇÃO</span>
        <span id="pal-intro-amp" style={{ color: 'var(--gold)' }}>·</span>
        <span id="pal-intro-line2">DE FILMES</span>
      </h1>
      <p id="pal-intro-sub">17ª Mostra de Cinema · Goiânia · 2026</p>
    </div>
  )
}

/* ════════════════════════════════════════
   HERO
════════════════════════════════════════ */
function ProgHero() {
  const heroRef  = useRef(null)
  const line1Ref = useRef(null)
  const line2Ref = useRef(null)
  const subRef   = useRef(null)
  const statsRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      <div className="pal-hero-rule pal-hero-rule--top" aria-hidden="true" />
      <div className="pal-hero-rule pal-hero-rule--bottom" aria-hidden="true" />

      <div className="pal-hero-content">
        <div className="pal-hero-eyebrow">
          <span className="pal-hero-eyebrow-line" />
          <span className="pal-hero-eyebrow-text">17ª Mostra de Cinema · Goiânia</span>
          <span className="pal-hero-eyebrow-line" />
        </div>

        <h1 className="pal-hero-title" aria-label="Programação de Filmes">
          <span ref={line1Ref} className="pal-hero-line pal-hero-line--1">PROGRAMAÇÃO</span>
          <span ref={line2Ref} className="pal-hero-line pal-hero-line--2" style={{ color: 'transparent', WebkitTextStroke: '1.5px #fff' }}>DE FILMES</span>
        </h1>

        <p ref={subRef} className="pal-hero-sub">
          17ª Mostra de Cinema&nbsp;&nbsp;·&nbsp;&nbsp;08 a 22 de Abril&nbsp;&nbsp;·&nbsp;&nbsp;Goiânia
        </p>

        <div ref={statsRef} className="pal-hero-stats">
          <div className="pal-hero-stat">
            <span className="pal-hero-stat-num">71</span>
            <span className="pal-hero-stat-label">Filmes</span>
          </div>
          <span className="pal-hero-stat-sep" aria-hidden="true">·</span>
          <div className="pal-hero-stat">
            <span className="pal-hero-stat-num">14</span>
            <span className="pal-hero-stat-label">Dias de Mostra</span>
          </div>
          <span className="pal-hero-stat-sep" aria-hidden="true">·</span>
          <div className="pal-hero-stat">
            <span className="pal-hero-stat-num">2</span>
            <span className="pal-hero-stat-label">Salas</span>
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
  const cardRef = useRef(null)
  const sessions = getFilmSessions(film.title)

  const onMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10
    gsap.to(card, { rotateX: y, rotateY: x, transformPerspective: 800, duration: 0.4, ease: 'power2.out' })
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
          Passe o cursor · Clique para ver sinopse &amp; horários
        </p>
      </div>

      <div className="filmes-strip" ref={stripRef}>
        {ANCHOR_FILMS.slice(0, 2).map((film, idx) => {
          const isSelected = selected?.id === film.id
          const sessions   = isSelected ? getFilmSessions(film.title) : []

          return (
            <div
              key={film.id}
              className={`poster-item${isSelected ? ' selected' : ''}`}
              onClick={() => handleClick(film)}
              data-hover
            >
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

                  {film.sinopse && (
                    <p className="poster-panel-sinopse">{film.sinopse}</p>
                  )}

                  <div className="poster-panel-sessions-label">
                    <span>Sessões</span>
                    <span className="pps-count">{sessions.length}×</span>
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
   FILMES — lista completa clicável
════════════════════════════════════════ */
function getPoster(title) {
  const anchor = ANCHOR_FILMS.find(f => f.title === title)
  if (anchor) return anchor.poster
  const seed = title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 14) + '26'
  return `https://picsum.photos/seed/${seed}/200/300`
}

/* ── Modal compartilhado (renderizado via portal) ── */
function FilmModal({ title, onClose }) {
  const data     = FILMS_DATA[title] || null
  const sessions = getFilmSessions(title)
  const trailer  = TRAILERS[title] || null

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div className="fl-overlay" onClick={onClose}>
      <div className="fl-modal" onClick={e => e.stopPropagation()}>

        <div className="fl-modal-hero">
          <img src={getPoster(title)} alt={title} className="fl-modal-hero-img" />
          <div className="fl-modal-hero-grad" />
          <button className="fl-modal-close" onClick={onClose} data-hover aria-label="Fechar">✕</button>
          <div className="fl-modal-hero-content">
            {data && (
              <div className="fl-modal-tags">
                {data.pais     && <span className="fl-modal-tag">{data.pais}</span>}
                {data.ano      && <span className="fl-modal-tag">{data.ano}</span>}
                {data.duracao  && <span className="fl-modal-tag">{data.duracao}</span>}
              </div>
            )}
            <h2 className="fl-modal-title">{title}</h2>
            {data?.diretor && (
              <p className="fl-modal-credits">Direção: <strong>{data.diretor}</strong></p>
            )}
          </div>
        </div>

        <div className="fl-modal-body">
          {data?.presencaIlustre && (
            <div className="fl-modal-presenca">
              <img src={data.presencaIlustre.foto} alt={data.presencaIlustre.nome} className="fl-modal-presenca-foto" />
              <div className="fl-modal-presenca-info">
                <span className="fl-modal-presenca-tag">Presença Exclusiva Confirmada</span>
                <strong className="fl-modal-presenca-nome">{data.presencaIlustre.nome}</strong>
                <span className="fl-modal-presenca-cargo">{data.presencaIlustre.cargo}</span>
                <p className="fl-modal-presenca-desc">{data.presencaIlustre.descricao}</p>
              </div>
            </div>
          )}
          {trailer && (
            <div className="fl-modal-trailer">
              <span className="fl-modal-trailer-label">Trailer</span>
              <div className="fl-modal-trailer-wrap">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer}?rel=0&modestbranding=1`}
                  title={`Trailer — ${title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {data?.sinopse && <p className="fl-modal-sinopse">{data.sinopse}</p>}

          {data?.premios && (
            <div className="fl-modal-premios">
              <span className="fl-modal-premios-icon">✦</span>
              <p>{data.premios}</p>
            </div>
          )}

          {sessions.length > 0 && (
            <div className="fl-modal-sessions">
              <div className="fl-modal-sessions-header">
                <span className="fl-modal-sessions-label">Sessões</span>
                <span className="fl-modal-sessions-count">{sessions.length}×</span>
              </div>
              <div className="fl-modal-sessions-grid">
                {sessions.map((s, i) => (
                  <div key={i} className="fl-modal-session-row">
                    <span className="fl-ms-date">{s.date}</span>
                    <span className="fl-ms-wd">{s.weekday.slice(0, 3)}</span>
                    <span className="fl-ms-time">{s.time}</span>
                    <span className="fl-ms-sala">{s.sala.replace('Sala ', 'S')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

function FilmesLista({ onSelect }) {
  const allFilms = useMemo(() => {
    const seen = {}
    SCHEDULE.forEach(day => {
      ;[...day.sala1, ...day.sala2].forEach(s => {
        if (!s.fixo && !seen[s.title]) seen[s.title] = true
      })
    })
    const sorted = Object.keys(seen).sort((a, b) => a.localeCompare(b, 'pt'))
    // Sexa sempre primeiro
    const idx = sorted.indexOf('Sexa')
    if (idx > 0) { sorted.splice(idx, 1); sorted.unshift('Sexa') }
    return sorted
  }, [])

  return (
    <section id="filmes-lista">
      <div className="fl-header">
        <div className="section-line"><span className="label">Todos os Filmes</span></div>
        <h2 data-reveal>Programação<br /><em>Completa</em></h2>
        <p className="fl-hint" data-reveal>Clique num filme para ver sinopse e horários</p>
      </div>

      <div className="fl-grid">
        {allFilms.map((title) => {
          const d = FILMS_DATA[title]
          const isDestaque = !!d?.presencaIlustre
          return (
            <button
              key={title}
              className={`fl-item${isDestaque ? ' fl-item--presenca' : ''}`}
              onClick={() => onSelect(title)}
              data-hover
            >
              <div className="fl-item-poster-wrap">
                <img
                  src={getPoster(title)}
                  alt={title}
                  className="fl-item-poster"
                  loading="lazy"
                />
                <div className="fl-item-poster-shine" />
                {isDestaque && (
                  <div className="fl-item-presenca-badge">
                    <img src={d.presencaIlustre.foto} alt={d.presencaIlustre.nome} className="fl-presenca-thumb" />
                    <span className="fl-presenca-label">Presença Exclusiva</span>
                  </div>
                )}
              </div>
              <div className="fl-info">
                <h3 className="fl-title">{title}</h3>
                {isDestaque ? (
                  <span className="fl-meta fl-meta--presenca">
                    ★ {d.presencaIlustre.nome} · {d.presencaIlustre.cargo}
                  </span>
                ) : (
                  <span className="fl-meta">
                    {d ? `${d.diretor}${d.duracao ? ' · ' + d.duracao : ''}` : 'Ver detalhes'}
                  </span>
                )}
              </div>
              <span className="fl-arrow" aria-hidden="true">→</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

/* ════════════════════════════════════════
   PROGRAMAÇÃO  (grade diária)
════════════════════════════════════════ */
function Programacao({ onSelect }) {
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
                  <div
                    key={i}
                    className={`session-row${s.fixo ? ' fixo' : ''}${s.presenca ? ' presenca-ilustre' : ''} session-row--clickable`}
                    onClick={() => onSelect(s.title)}
                    data-hover
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && onSelect(s.title)}
                  >
                    <span className="session-time">{s.time}</span>
                    <span className="session-title">{s.title}</span>
                    {s.fixo && <span className="session-tag">Especial</span>}
                    {s.presenca && (
                      <span className="session-presenca">{s.presenca}</span>
                    )}
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
        <div className="destaque-visual">
          <img src={film.poster} alt={film.title} className="destaque-poster" />
          <div className="destaque-visual-overlay" />

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
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════
   FOOTER
════════════════════════════════════════ */
function ProgFooter() {
  return (
    <footer className="pal-footer" id="pal-footer">
      <div className="pal-footer-inner">
        <Link to="/" className="pal-footer-brand">
          <img src="/images/logo-lenco.webp" alt="17ª Mostra de Cinema" className="pal-footer-logo" />
          <div className="pal-footer-brand-text">
            <span className="pal-footer-brand-title">17ª Mostra de Cinema</span>
            <span className="pal-footer-brand-sub">O Amor · A Morte · As Paixões</span>
          </div>
        </Link>

        <div className="pal-footer-divider" aria-hidden="true" />

        <div className="pal-footer-credits">
          <div className="pal-footer-credit-col">
            <span className="pal-footer-credit-label">Idealização</span>
            <span className="pal-footer-credit-value">Instituto Jardim Cultural</span>
          </div>
          <div className="pal-footer-credit-col">
            <span className="pal-footer-credit-label">Coordenador Geral</span>
            <span className="pal-footer-credit-value">Gerson Santos</span>
          </div>
          <div className="pal-footer-credit-col">
            <span className="pal-footer-credit-label">Curadoria</span>
            <span className="pal-footer-credit-value">Lisandro Nogueira</span>
          </div>
          <div className="pal-footer-credit-col">
            <span className="pal-footer-credit-label">Diretor</span>
            <span className="pal-footer-credit-value">Rubens Alves</span>
          </div>
          <div className="pal-footer-credit-col">
            <span className="pal-footer-credit-label">Produtora</span>
            <span className="pal-footer-credit-value">Gabriela Cardoso</span>
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
    const onScroll = () => setVis(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!vis) return null
  return (
    <button
      className="pal-back-to-top visible"
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
   VIEW TABS  (inline + floating)
════════════════════════════════════════ */
function ProgTabs({ activeView, setActiveView }) {
  return (
    <div className="pal-tabs-wrap" id="prog-view-tabs">
      <div className="pal-tabs-btns">
        <button
          className={`pal-tab-btn${activeView === 'filmes' ? ' active' : ''}`}
          onClick={() => setActiveView('filmes')}
        >
          Grade por Filmes
        </button>
        <button
          className={`pal-tab-btn${activeView === 'dias' ? ' active' : ''}`}
          onClick={() => setActiveView('dias')}
        >
          Grade por Dias
        </button>
      </div>
    </div>
  )
}

function ProgFloatingTabs({ activeView, setActiveView, uiAnim }) {
  return (
    <div className={`pal-floating-tabs${uiAnim !== 'hidden' ? ` ${uiAnim}` : ''}`}>
      <button
        className={`pal-ftab-btn${activeView === 'filmes' ? ' active' : ''}`}
        onClick={() => setActiveView('filmes')}
        title="Grade por Filmes"
      >
        F
      </button>
      <button
        className={`pal-ftab-btn${activeView === 'dias' ? ' active' : ''}`}
        onClick={() => setActiveView('dias')}
        title="Grade por Dias"
      >
        D
      </button>
    </div>
  )
}

function ProgBackHome({ uiAnim }) {
  return (
    <Link to="/" className={`pal-back-home${uiAnim !== 'hidden' ? ` ${uiAnim}` : ''}`} aria-label="Voltar à página inicial">
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
export default function ProgramacaoPage() {
  useGSAPReveal()
  const [selectedFilm, setSelectedFilm] = useState(null)
  const [activeView, setActiveView]     = useState('filmes')
  const [uiAnim, setUiAnim]             = useState('hidden')
  const uiTimer = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const target = document.getElementById('prog-view-tabs')
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
      <ProgPageIntro />
      <ProgCursor />
      <ScrollProgress />
      <ProgNav />
      <ProgHero />
      <ProgTabs activeView={activeView} setActiveView={setActiveView} />
      <ProgFloatingTabs activeView={activeView} setActiveView={setActiveView} uiAnim={uiAnim} />
      {activeView === 'filmes'
        ? <FilmesLista onSelect={setSelectedFilm} />
        : <Programacao onSelect={setSelectedFilm} />
      }
      <ProgFooter />
      <BackToTop />
      <ProgBackHome uiAnim={uiAnim} />
      {selectedFilm && (
        <FilmModal title={selectedFilm} onClose={() => setSelectedFilm(null)} />
      )}
    </>
  )
}
