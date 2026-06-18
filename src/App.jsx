import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Users,
  CheckCircle2, MapPin, Phone, Mail, ArrowRight, Target,
  Star, ChevronLeft, ChevronRight, Plus, Minus, ChevronDown,
  Heart, BedSingle, Waves, Coffee, Flame, Wine, Sun, Car
} from 'lucide-react'
import SEO from './components/SEO'
import CoroaciGuide from './pages/CoroaciGuide'

gsap.registerPlugin(ScrollTrigger)

/* ========================================
   LAZY IMAGE WITH SKELETON
   ======================================== */
function LazyImage({ src, alt, className, style, width, height }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="relative w-full h-full">
      {!loaded && <div className="absolute inset-0 img-skeleton rounded-inherit" />}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={style}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}

/* ========================================
   SCROLL PROGRESS BAR
   ======================================== */
function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)
  const totalRef = useRef(0)

  useEffect(() => {
    const updateTotal = () => {
      totalRef.current = document.documentElement.scrollHeight - document.documentElement.clientHeight
    }
    updateTotal()
    window.addEventListener('resize', updateTotal, { passive: true })

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const total = totalRef.current
        setProgress(total > 0 ? window.scrollY / total : 0)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateTotal)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[60] pointer-events-none">
      <div
        className="h-full bg-metallic origin-left"
        style={{ transform: `scaleX(${progress})`, transition: 'transform 0.1s linear' }}
      />
    </div>
  )
}

/* ========================================
   BACK TO TOP BUTTON
   ======================================== */
function BackToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 400)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Voltar ao topo"
      className={`fixed bottom-6 left-6 z-50 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-light transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ChevronDown size={22} className="rotate-180" />
    </button>
  )
}

/* ========================================
   SCROLL TO TOP ON ROUTE CHANGE
   ======================================== */
function useScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
}

/* ========================================
   NAVBAR
   ======================================== */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 80)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = useMemo(() => [
    { label: 'O Resort', href: '#sobre' },
    { label: 'Experiências', href: '#servicos' },
    { label: 'Contato', href: '#contato' },
  ], [])

  const isHomePage = location.pathname === '/'

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-primary-dark/95 backdrop-blur-sm shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          {isHomePage ? (
            <a href="#hero">
              <img src="/logo.png" alt="Hotel Club Resort Místico" width="420" height="354" className="h-12 w-auto" />
            </a>
          ) : (
            <Link to="/">
              <img src="/logo.png" alt="Hotel Club Resort Místico" width="420" height="354" className="h-12 w-auto" />
            </Link>
          )}

          <ul className="hidden lg:flex items-center gap-7 ml-auto">
            {links.map((l) => (
              <li key={l.href + l.label}>
                {l.href.startsWith('#') ? (
                  <a
                    href={isHomePage ? l.href : `/${l.href}`}
                    className="text-sm tracking-tight transition-colors hover:text-metallic font-medium text-white/80"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    to={l.href}
                    className={`text-sm tracking-tight transition-colors hover:text-metallic font-medium text-white/80 ${
                      location.pathname === l.href ? 'text-metallic' : ''
                    }`}
                  >
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile menu — always in DOM, animated with max-height + opacity */}
      <div
        className={`fixed top-0 left-0 w-full z-40 bg-primary lg:hidden flex flex-col items-center justify-center gap-8 overflow-hidden transition-all duration-300 ${
          mobileOpen ? 'max-h-screen opacity-100 py-24' : 'max-h-0 opacity-0 py-0'
        }`}
      >
        {links.map((l) => (
          l.href.startsWith('#') ? (
            <a
              key={l.label}
              href={isHomePage ? l.href : `/${l.href}`}
              className="text-2xl text-white hover:text-metallic transition-colors font-heading"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </a>
          ) : (
            <Link
              key={l.label}
              to={l.href}
              className="text-2xl text-white hover:text-metallic transition-colors font-heading"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          )
        ))}
        <Link
          to="/o-que-fazer-em-coroaci-mg"
          className="text-2xl text-white hover:text-metallic transition-colors font-heading"
          onClick={() => setMobileOpen(false)}
        >
          O que fazer em Coroaci
        </Link>
      </div>
    </>
  )
}

/* ========================================
   HERO
   ======================================== */
function Hero() {
  const ref = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-el', {
        y: 30, opacity: 0, duration: 0.9, stagger: 0.12,
        ease: 'power2.out',
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    // iOS Safari só respeita autoplay quando "muted" é setado via JS (atributo HTML não é suficiente)
    video.muted = true
    video.defaultMuted = true
    const playPromise = video.play()
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {})
    }
  }, [])

  return (
    <section id="hero" ref={ref} className="relative min-h-screen flex items-end lg:items-center bg-primary overflow-hidden">
      <img
        src="/hero.webp"
        alt=""
        width="1672"
        height="941"
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        webkit-playsinline="true"
        preload="auto"
        onCanPlay={(e) => { e.currentTarget.playbackRate = 1.5 }}
        onEnded={(e) => { e.currentTarget.style.opacity = '0' }}
        className="absolute inset-0 w-full h-full object-cover opacity-[0.85] blur-[2px] transition-opacity duration-1000"
      >
        <source src="/VID.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[#050c04]/95" />
      <div className="relative z-10 w-full pt-20 pb-10 lg:pt-0 lg:pb-0">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <img src="/logo.png" alt="Hotel Club Resort Místico" width="420" height="354" className="hero-el h-36 md:h-44 w-auto mb-3 drop-shadow-lg" />
          <div className="hero-el flex items-center gap-1.5 text-white/60 text-[10px] tracking-widest uppercase mb-6 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <MapPin size={10} className="text-metallic-gradient" />
            Coroaci &mdash; Minas Gerais
          </div>
          <h1 className="hero-el font-heading text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.1] mb-6 text-white">
            Uma experiência<br />
            única em <span className="text-metallic-gradient">natureza</span>
          </h1>
          <p className="hero-el text-white/70 text-base max-w-2xl mb-4 leading-relaxed" style={{whiteSpace: 'pre-line'}}>
            {"Conforto, tranquilidade e lazer reunidos em um só lugar. No Hotel Club Resort Místico, cada detalhe foi pensado para proporcionar descanso, diversão e experiências especiais para você e sua família."}
          </p>
          <p className="hero-el text-white/60 text-sm max-w-xl mb-10 leading-relaxed italic">
            Desconecte-se da rotina e reconecte-se com o que realmente importa.
          </p>
          <div className="hero-el flex flex-col sm:flex-row items-center gap-4">
            <a
              href="https://wa.me/5531987954136?text=Olá! Gostaria de reservar minha hospedagem no Hotel Club Resort Místico."
              target="_blank"
              rel="noopener noreferrer"
              className="group btn-shine bg-[#A67D15] hover:bg-[#8B6B10] text-white font-semibold px-8 py-4 rounded transition-all flex items-center gap-2 text-base"
            >
              Reserve sua hospedagem pelo WhatsApp
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
          <p className="hero-el text-white/50 text-sm mt-8 tracking-wide">
            Conforto &bull; Natureza &bull; Bem-Estar
          </p>
        </div>
      </div>
    </section>
  )
}

/* ========================================
   ABOUT
   ======================================== */
function About() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-item', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="sobre" ref={ref} className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch max-w-6xl mx-auto">

          {/* Bloco de imagens em grid */}
          <div className="about-item grid grid-cols-2 gap-3 h-[520px]">
            {/* Imagem principal — coluna esquerda, altura total */}
            <div className="rounded-2xl overflow-hidden shadow-xl row-span-2">
              <LazyImage
                src="/img01.webp"
                alt="Hotel Club Resort Místico"
                width="1200"
                height="675"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Imagem secundária — coluna direita, topo */}
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <LazyImage
                src="/img02.webp"
                alt="Hotel Club Resort Místico - Área de Lazer"
                width="1200"
                height="799"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Terceira imagem — coluna direita, baixo */}
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <LazyImage
                src="/hero.webp"
                alt="Hotel Club Resort Místico - Vista"
                width="1672"
                height="941"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Texto */}
          <div className="flex flex-col lg:justify-between lg:h-[520px]">
            <div className="text-center lg:text-left">
              <p className="about-item text-metallic-gradient text-[10px] font-bold tracking-widest uppercase mb-4 inline-flex items-center px-3 py-1.5 rounded-full bg-metallic/10 border border-metallic/25">O Resort</p>
              <h2 className="about-item font-heading text-3xl md:text-4xl lg:text-5xl text-dark font-bold leading-tight mb-4">
                Um refúgio perfeito para <span className="text-metallic-gradient italic">todas as idades</span>
              </h2>
              <p className="about-item text-gray-600 mb-3 text-sm leading-relaxed text-justify">
                Localizado em Coroaci, o Hotel Club Resort Místico é um <strong>refúgio cercado pela exuberante beleza natural</strong> da região, criado para proporcionar <strong>experiências inesquecíveis</strong> a casais, famílias e grupos que desejam desacelerar a rotina e aproveitar momentos de descanso com <strong>conforto, segurança e hospitalidade</strong>.
              </p>
              <p className="about-item text-gray-600 mb-3 text-sm leading-relaxed text-justify">
                Em meio a paisagens encantadoras e a uma atmosfera acolhedora, cada detalhe foi pensado para oferecer <strong>bem-estar e tranquilidade</strong>, sem abrir mão de opções de lazer para todas as idades. Aqui, os dias ganham um ritmo mais leve, convidando você a <strong>relaxar, renovar as energias</strong> e criar memórias especiais ao lado de quem mais importa.
              </p>
              <p className="about-item text-gray-500 text-sm leading-relaxed italic text-justify">
                No Hotel Club Resort Místico, você encontra o <strong>equilíbrio perfeito entre lazer, conforto e serenidade</strong>, o cenário ideal para viver <strong>momentos únicos em conexão com a natureza</strong>.
              </p>
            </div>
            <a
              href="https://wa.me/5531987954136?text=Olá! Gostaria de mais informações sobre o Hotel Club Resort Místico."
              target="_blank"
              rel="noopener noreferrer"
              className="about-item self-center lg:self-start inline-flex items-center gap-1.5 border border-dark text-dark text-xs font-semibold px-6 py-3 lg:px-3 rounded hover:bg-dark hover:text-white transition-colors mt-8 lg:mt-0"
            >
              Fale conosco pelo WhatsApp
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ========================================
   DIFERENCIAIS
   ======================================== */
function DiffCards() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.diff-card',
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.4, stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  const items = [
    { icon: Heart, title: 'Suítes para casal' },
    { icon: BedSingle, title: 'Suítes individuais' },
    { icon: Users, title: 'Suítes familiares' },
    { icon: Waves, title: 'Piscina adultos e crianças' },
    { icon: Coffee, title: 'Café da manhã incluso' },
    { icon: Flame, title: 'Área com churrasqueira' },
    { icon: Wine, title: 'Bares' },
    { icon: Target, title: 'Mesa de sinuca' },
    { icon: Sun, title: 'Ducha externa' },
    { icon: Car, title: 'Estacionamento' },

  ]

  return (
    <section id="diferenciais" ref={ref} className="py-20 md:py-28 bg-green-tint relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-metallic/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Feature Cards */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <p className="text-metallic-gradient text-[10px] font-bold tracking-widest uppercase mb-4 inline-flex items-center px-3 py-1.5 rounded-full bg-metallic/10 border border-metallic/25">
              Estrutura
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-dark font-bold leading-tight mb-4">
              Estrutura completa para a <span className="text-metallic-gradient italic">sua estadia</span>
            </h2>
            <p className="text-left text-gray-600 text-sm mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Desfrute de momentos especiais com uma estrutura pensada para o seu bem-estar:
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {items.map((item, i) => {
                const Icon = item.icon
                return (
                  <div
                    key={i}
                    className="diff-card group flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-primary/5 hover:border-metallic/30 hover:bg-white hover:shadow-md transition-all duration-300 cursor-default min-w-0"
                  >
                    <div className="w-10 h-10 rounded-lg bg-metallic/10 flex items-center justify-center shrink-0 group-hover:bg-metallic/20 group-hover:scale-110 transition-all duration-300">
                      <Icon size={18} className="text-metallic" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-dark transition-colors min-w-0 break-words">
                      {item.title}
                    </span>
                  </div>
                )
              })}
            </div>

            <p className="text-gray-500 text-sm italic flex items-center gap-2">
              <span className="w-6 h-px bg-metallic/40" />
              Tudo para que você aproveite cada instante sem preocupações.
            </p>
          </div>

          {/* Image with floating stat */}
          <div className="order-1 lg:order-2 relative">
            <div className="rounded-2xl overflow-hidden shadow-xl h-[320px] sm:h-[400px] lg:h-[520px]">
              <LazyImage
                src="/img02.webp"
                alt="Estrutura do Hotel Club Resort Místico"
                width="1200"
                height="799"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 sm:p-4 flex items-center gap-3 border border-primary/10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-metallic/10 flex items-center justify-center">
                <Star size={20} className="text-metallic sm:w-6 sm:h-6" fill="#C49A1A" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-dark">10</p>
                <p className="text-xs text-gray-500">Ambientes</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ========================================
   SUÍTES
   ======================================== */
function Services() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.suite-card',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  const suites = [
    {
      icon: Heart,
      title: 'Suíte Casal',
      desc: 'Aconchego e privacidade para quem vem a dois. Ambiente pensado para momentos especiais.',
      msg: 'Olá! Gostaria de informações sobre a Suíte Casal do Hotel Club Resort Místico.',
      image: '/img01.webp',
      imageWidth: 1200,
      imageHeight: 675,
    },
    {
      icon: BedSingle,
      title: 'Suíte Individual',
      desc: 'Praticidade e conforto para quem viaja sozinho, com toda a estrutura do resort.',
      msg: 'Olá! Gostaria de informações sobre a Suíte Individual do Hotel Club Resort Místico.',
      image: '/img02.webp',
      imageWidth: 1200,
      imageHeight: 799,
      badge: 'Mais reservada',
    },
    {
      icon: Users,
      title: 'Suíte Família',
      desc: 'Espaço generoso para toda a família curtir junta com conforto e liberdade.',
      msg: 'Olá! Gostaria de informações sobre a Suíte Família do Hotel Club Resort Místico.',
      image: '/img03.webp',
      imageWidth: 1200,
      imageHeight: 1240,
    },
  ]

  return (
    <section id="servicos" ref={ref} className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-metallic-gradient text-[10px] font-bold tracking-widest uppercase mb-4 inline-flex items-center px-3 py-1.5 rounded-full bg-metallic/10 border border-metallic/25">
            Acomodações
          </p>
          <h2 className="font-heading text-3xl md:text-5xl text-dark font-bold mb-4">
            Suítes para cada tipo de viagem
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Seja uma escapada romântica, uma viagem a sós ou aquele fim de semana com a família toda, temos a suíte certa para você.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {suites.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="suite-card group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer h-[420px]">
                {/* Background image */}
                <LazyImage
                  src={s.image}
                  alt={s.title}
                  width={s.imageWidth}
                  height={s.imageHeight}
                  className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

                {/* Badge */}
                {s.badge && (
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-metallic text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow">
                    <Star size={10} fill="white" />
                    {s.badge}
                  </div>
                )}

                {/* Icon top-left */}
                <div className="absolute top-4 left-4 z-10 w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <Icon size={18} className="text-white" />
                </div>

                {/* Hover overlay com CTA proeminente */}
                <div className="absolute inset-0 z-[5] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                  <a
                    href={`https://wa.me/5531987954136?text=${encodeURIComponent(s.msg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-metallic text-white font-bold px-6 py-3 rounded-lg shadow-xl hover:bg-metallic-light transition-colors text-sm uppercase tracking-wide"
                  >
                    Reservar Agora
                    <ArrowRight size={16} />
                  </a>
                </div>

                {/* Content bottom */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
                  <h3 className="font-heading text-xl font-bold text-white mb-2">
                    {s.title}
                  </h3>
                  <p className="text-white/70 text-xs leading-relaxed mb-4">
                    {s.desc}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-metallic-light">
                    Toque para reservar
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom text + CTA */}
        <div className="mt-14 text-center max-w-2xl mx-auto">
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Toda hospedagem no Club Resort Místico dá acesso à piscina, churrasqueira, sinuca, bares e ao café da manhã para começar bem o dia. Estacionamento no local, sem custo extra.
          </p>
          <a
            href="https://wa.me/5531987954136?text=Olá! Gostaria de fazer uma reserva no Hotel Club Resort Místico."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border-2 border-metallic text-metallic font-bold px-8 py-4 rounded-xl hover:bg-metallic hover:text-white shadow-xl hover:-translate-y-1 transition-all duration-300 text-base uppercase tracking-wide"
          >
            Reservar pelo WhatsApp
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  )
}

/* ========================================
   LOCALIZAÇÃO
   ======================================== */
function LocationSection() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.loc-el', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="localizacao" ref={ref} className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#1d3f1c_0.5px,transparent_0.5px)] bg-[length:20px_20px] opacity-[0.03]" />
      <div className="absolute top-0 left-0 w-80 h-80 bg-green-tint rounded-full -translate-x-1/3 -translate-y-1/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-metallic/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-5xl mx-auto">

          {/* Text */}
          <div className="order-2 lg:order-1">
            <div className="text-center lg:text-left">
              <p className="loc-el text-metallic-gradient text-[10px] font-bold tracking-widest uppercase mb-4 inline-flex items-center px-3 py-1.5 rounded-full bg-metallic/10 border border-metallic/25">
                Localização
              </p>
              <h2 className="loc-el font-heading text-3xl md:text-4xl lg:text-5xl text-dark font-bold leading-tight mb-4">
                No coração do <span className="text-metallic-gradient italic">Vale do Rio Doce</span>
              </h2>
            </div>
            <p className="loc-el text-gray-500 text-sm leading-relaxed mb-8">
              Hospedar-se em Coroaci é estar a um passo das belezas naturais da região: cachoeiras, o tradicional Morro do Cruzeiro e o charme das cidades históricas do Vale do Rio Doce. Use o resort como base e explore tudo o que Coroaci e arredores têm a oferecer.
            </p>
            <Link
              to="/o-que-fazer-em-coroaci-mg"
              className="loc-el flex w-fit mx-auto lg:mx-0 items-center gap-2 bg-metallic text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-metallic-light transition-colors shadow-md shadow-metallic/20"
            >
              <MapPin size={16} />
              O que fazer em Coroaci
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 loc-el">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl h-[280px] sm:h-[360px] lg:h-[420px]">
                <LazyImage
                  src="/coroaci.webp"
                  alt="Coroaci, Minas Gerais"
                  width="1600"
                  height="2262"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-4 py-3 sm:px-5 sm:py-4 border border-primary/10 flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-green-tint flex items-center justify-center">
                  <MapPin size={18} className="text-primary sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-dark">Coroaci, MG</p>
                  <p className="text-xs text-gray-400">Vale do Rio Doce</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ========================================
   CLUB DE SÓCIOS
   ======================================== */
function Auctions() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.leilao-el', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="leiloes" ref={ref} className="py-20 md:py-28 text-white relative z-10 overflow-hidden bg-[#050c04]">
      <div className="absolute inset-0 bg-[url('/coroaci.webp')] bg-cover bg-[center_30%] opacity-10" />
      <div className="relative z-10 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="lg:col-span-2 text-left">
            <div className="text-center lg:text-left">
              <p className="leilao-el text-metallic-gradient text-[10px] font-bold tracking-widest uppercase mb-4 inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">Club de Sócios</p>
              <h2 className="leilao-el font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                Um clube feito para quem quer viver o <span className="text-metallic-gradient italic">Místico</span> o ano todo
              </h2>
            </div>
            <p className="leilao-el text-white/70 mb-6 text-base leading-relaxed">
              O Club Resort Místico funciona por cotas individuais ou familiares, com mensalidade acessível. As vagas são <strong className="text-white">limitadas</strong>, garantindo exclusividade e pertencimento a quem faz parte desse círculo especial.
            </p>
            <h3 className="leilao-el font-heading text-lg text-metallic-gradient font-semibold mb-4">O que você acessa como sócio:</h3>
            <ul className="leilao-el space-y-3 mb-6">
              {[
                'Piscina, sauna, sinuca e churrasqueira à disposição',
                'Área de eventos para celebrações e confraternizações',
                'Shows com música ao vivo exclusivos para sócios',
                'Tarifas diferenciadas em hospedagem e serviços do resort',
                'Experiências e festas privativas que só sócios podem viver',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/90 text-sm">
                  <CheckCircle2 size={18} className="text-metallic-gradient shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="leilao-el text-white/50 italic text-sm mb-8">
              As cotas são em número limitado. Garanta a sua antes que acabem.
            </p>
            <a
              href="https://wa.me/5531987954136"
              target="_blank"
              rel="noopener noreferrer"
              className="leilao-el btn-shine flex w-fit mx-auto lg:mx-0 items-center gap-2 bg-[#A67D15] hover:bg-[#8B6B10] text-white font-semibold px-8 py-4 rounded transition-all text-base shadow-lg"
            >
              Quero garantir minha cota <ArrowRight size={18} />
            </a>
          </div>
          <div className="space-y-5">
            {[
              { val: 'Cotas', sub: 'Limitadas', label: 'Exclusividade garantida para os primeiros sócios' },
              { val: 'Individual', sub: '& Familiar', label: 'Planos para todos os perfis e tamanhos de família' },
              { val: 'Eventos', sub: 'Exclusivos', label: 'Shows, festas e experiências só para quem é sócio' },
            ].map((stat, idx) => (
              <div key={idx} className="backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-metallic/50 transition-all">
                <p className="font-heading text-2xl font-bold text-metallic-gradient inline-block leading-tight">
                  {stat.val}<br /><span className="text-xl">{stat.sub}</span>
                </p>
                <p className="text-white/50 text-xs mt-2 leading-relaxed">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ========================================
   BLOG PREVIEW (home)
   ======================================== */
/* ========================================
   DEPOIMENTOS
   ======================================== */
function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: 'Mariana Souza',
      city: 'Belo Horizonte, MG',
      text: 'Passamos um fim de semana incrível no Resort Místico. A piscina é maravilhosa, o ambiente é muito tranquilo e o café da manhã é farto. Com certeza voltaremos em breve!',
      initials: 'MS',
    },
    {
      id: 2,
      name: 'Carlos e Ana Lima',
      city: 'Governador Valadares, MG',
      text: 'Lugar perfeito para descansar em família. As crianças adoraram a piscina e a área de lazer. Funcionários muito atenciosos e carinhosos. Recomendo a todos!',
      initials: 'CL',
    },
    {
      id: 3,
      name: 'Fernanda Rocha',
      city: 'Ipatinga, MG',
      text: 'Nunca tinha ouvido falar de Coroaci antes, mas o resort nos conquistou. Natureza exuberante, instalações impecáveis e uma paz que a gente não encontra fácil. Uma descoberta e tanto!',
      initials: 'FR',
    },
    {
      id: 4,
      name: 'Roberto Alves',
      city: 'Caratinga, MG',
      text: 'Fui com minha esposa para comemorar nosso aniversário. Que surpresa incrível! O atendimento foi excepcional, o quarto muito confortável. Um lugar verdadeiramente mágico.',
      initials: 'RA',
    },
    {
      id: 5,
      name: 'Juliana Costa',
      city: 'Vitória, ES',
      text: 'Fizemos um evento de empresa aqui e superou todas as expectativas. Espaço amplo, estrutura completa e equipe muito profissional. Já marcamos a próxima confraternização!',
      initials: 'JC',
    },
    {
      id: 6,
      name: 'Paulo e Cláudia Mendes',
      city: 'Teófilo Otoni, MG',
      text: 'A experiência mais relaxante que já tivemos. A churrasqueira e o espaço de lazer são maravilhosos. Natureza de um lado, conforto do outro. Saímos renovados!',
      initials: 'PM',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = reviews.length;
  const maxIndex = Math.max(0, totalSlides - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [maxIndex]);

  return (
    <section id="depoimentos" className="py-20 md:py-28 bg-green-tint overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
             <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" width="20" height="20" loading="lazy" decoding="async" className="w-5 h-5" />
             <p className="text-metallic-gradient text-xs font-bold tracking-widest uppercase">Avaliações no Google</p>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl text-dark font-bold">
            O que nossos clientes dizem
          </h2>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 md:px-12">
           {/* Controls */}
           <button onClick={prevSlide} aria-label="Avaliação anterior" className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-green-tint z-10 transition-colors">
              <ChevronLeft size={24} className="text-dark" />
           </button>
           <button onClick={nextSlide} aria-label="Próxima avaliação" className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-green-tint z-10 transition-colors">
              <ChevronRight size={24} className="text-dark" />
           </button>

           {/* Carousel Track */}
           <div className="overflow-hidden bg-transparent py-4">
               <div 
                 className="flex transition-transform duration-500 ease-in-out"
                 style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
               >
                 {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="flex-shrink-0 px-2 lg:px-4"
                      style={{ width: `${100 / itemsPerView}%` }}
                    >
                      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 h-full flex flex-col p-6 gap-4">
                        {/* Estrelas */}
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} className="fill-metallic text-metallic" />
                          ))}
                        </div>
                        {/* Texto */}
                        <p className="text-gray-600 text-sm leading-relaxed flex-1">"{review.text}"</p>
                        {/* Autor */}
                        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {review.initials}
                          </div>
                          <div>
                            <p className="text-dark font-semibold text-sm">{review.name}</p>
                            <p className="text-gray-400 text-xs">{review.city}</p>
                          </div>
                          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-4 h-4 ml-auto opacity-50" />
                        </div>
                      </div>
                    </div>
                 ))}
               </div>
           </div>
           
           {/* Dots */}
           <div className="flex justify-center gap-2 mt-8">
              {[...Array(maxIndex + 1)].map((_, i) => (
                 <button 
                   key={`dot-${i}`}
                   onClick={() => setCurrentIndex(i)}
                   className={`w-2.5 h-2.5 rounded-full transition-colors ${
                     i === currentIndex ? 'bg-metallic' : 'bg-gray-300 hover:bg-gray-400'
                   }`}
                   aria-label={`Ir para grupo de depoimento ${i + 1}`}
                 />
              ))}
           </div>
        </div>
      </div>
    </section>
  )
}

/* ========================================
   FAQ
   ======================================== */
function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const ref = useRef(null)

  const faqs = [
    {
      q: "Como faço uma reserva no Resort Místico?",
      a: "As reservas podem ser feitas diretamente pelo nosso WhatsApp. Nossa equipe está disponível para auxiliar na escolha da melhor acomodação e pacote para a sua estadia. Basta clicar no botão do WhatsApp ou entrar em contato pelo número (31) 98795-4136."
    },
    {
      q: "Quais formas de pagamento são aceitas?",
      a: "Aceitamos cartões de crédito e débito das principais bandeiras, PIX e transferência bancária. Para reservas antecipadas, oferecemos condições especiais de parcelamento."
    },
    {
      q: "O café da manhã está incluso nas diárias?",
      a: "Sim, todas as nossas acomodações incluem café da manhã completo servido no restaurante do resort. Pacotes com meia-pensão e pensão completa também estão disponíveis."
    },
    {
      q: "O resort aceita pets?",
      a: "Temos uma política pet-friendly em determinadas acomodações. Entre em contato com nossa equipe antes da reserva para verificar disponibilidade e as condições específicas para hóspedes com animais de estimação."
    },
    {
      q: "Como funciona o programa Club de Sócios?",
      a: "O Club Resort Místico funciona por cotas individuais ou familiares, com mensalidade equivalente a 10% de um salário mínimo por cota. As vagas são limitadas, garantindo exclusividade e acesso facilitado a toda a estrutura do resort. Entre em contato para conhecer as condições e garantir a sua cota."
    }
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.faq-el', { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="faq" ref={ref} className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-14">
          <p className="text-metallic-gradient text-[10px] font-bold tracking-widest uppercase mb-4 inline-flex items-center px-3 py-1.5 rounded-full bg-metallic/10 border border-metallic/25 text-center">D&uacute;vidas</p>
          <h2 className="font-heading text-3xl md:text-5xl text-dark font-bold">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className={`faq-el border rounded-xl transition-all duration-300 ${
                  isOpen ? 'border-metallic shadow-md' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                >
                  <span className={`font-semibold md:text-lg ${isOpen ? 'text-metallic-gradient' : 'text-dark'}`}>
                    {item.q}
                  </span>
                  <div className={`shrink-0 ml-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? (
                      <Minus size={20} className="text-metallic-gradient" />
                    ) : (
                      <Plus size={20} className="text-dark/40" />
                    )}
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-5 md:p-6 pt-0 text-dark/70 leading-relaxed border-t border-gray-50">
                    {item.a}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ========================================
   CTA / CONTATO
   ======================================== */
function ContactCTA() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cta-el', { y: 25, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="contato" ref={ref} className="py-20 md:py-28 bg-green-tint text-dark overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Coluna de Texto */}
          <div className="text-left">
            <h2 className="cta-el text-center lg:text-left font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-dark leading-tight">
              Atendimento
            </h2>
            <p className="cta-el text-dark/70 text-lg mb-10 leading-relaxed max-w-xl">
              Nossa equipe est&aacute; pronta para ajudar voc&ecirc; a planejar a estadia perfeita no Hotel Club Resort M&iacute;stico.
            </p>

            <div className="cta-el flex flex-col gap-6 mb-8">
              <div className="flex items-center gap-4 text-dark/80 group">
                <div className="shrink-0 w-10 h-10 rounded-full bg-metallic/10 flex items-center justify-center text-metallic-gradient group-hover:bg-metallic group-hover:text-white transition-all duration-300">
                  <Phone size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-metallic-gradient uppercase tracking-wider">Telefone/WhatsApp</span>
                  <a href="https://wa.me/5531987954136?text=Olá! Gostaria de mais informações sobre o Hotel Club Resort Místico." target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-dark hover:text-metallic transition-colors">(31) 98795-4136</a>
                </div>
              </div>

              <div className="flex items-center gap-4 text-dark/80 group">
                <div className="shrink-0 w-10 h-10 rounded-full bg-metallic/10 flex items-center justify-center text-metallic-gradient group-hover:bg-metallic group-hover:text-white transition-all duration-300">
                  <Mail size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-metallic-gradient uppercase tracking-wider">E-mail</span>
                  <a href="mailto:dasilvarailda37@gmail.com" className="text-lg font-semibold text-dark hover:text-metallic transition-colors">dasilvarailda37@gmail.com</a>
                </div>
              </div>

              <div className="flex items-center gap-4 text-dark/80 group">
                <div className="shrink-0 w-10 h-10 rounded-full bg-metallic/10 flex items-center justify-center text-metallic-gradient group-hover:bg-metallic group-hover:text-white transition-all duration-300">
                  <MapPin size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-metallic-gradient uppercase tracking-wider">Endere&ccedil;o</span>
                  <span className="text-lg font-semibold text-dark leading-snug">Hotel Club Resort M&iacute;stico<br/><span className="text-sm font-normal text-dark/60 uppercase">Coroaci/MG</span></span>
                </div>
              </div>
            </div>

            <div className="cta-el pt-2">
              <a
                href="https://wa.me/5531987954136?text=Olá! Gostaria de mais informações sobre o Hotel Club Resort Místico."
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-metallic text-white font-bold px-10 py-5 rounded-lg hover:bg-metallic-dark shadow-xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto text-center text-base md:text-lg uppercase tracking-wide"
              >
                ENTRE EM CONTATO <ArrowRight size={20} className="inline" />
              </a>
            </div>
          </div>

          {/* Coluna do Mapa */}
          <div className="cta-el relative">
            <div className="absolute -inset-4 bg-metallic/5 rounded-[2rem] blur-2xl pointer-events-none" />
            <div className="relative z-10 w-full h-[450px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl border-4 border-white">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15042.068109682125!2d-42.2907527!3d-18.6274263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xb1ebf200bc70f7%3A0x31bbbfa7faa889b4!2sHotel%20Club%20Resort%20M%C3%ADstico!5e0!3m2!1spt-BR!2sbr!4v1712693000000!5m2!1spt-BR!2sbr" 
                className="w-full h-full grayscale-[0.3] hover:grayscale-0 transition-all duration-700 contrast-[1.1]"
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            {/* Overlay sutil para indicar o local no escritorio */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[90%] bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100 hidden md:flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-metallic-gradient uppercase tracking-widest mb-1">Visite-nos</p>
                <p className="text-sm text-dark font-medium leading-tight">Hotel Club Resort M&iacute;stico</p>
              </div>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Hotel+Club+Resort+M%C3%ADstico+Coroaci+MG"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-dark text-white px-4 py-2 rounded-lg font-bold hover:bg-metallic transition-colors"
              >
                Como Chegar
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ========================================
   FOOTER
   ======================================== */
function Footer() {
  return (
    <footer className="bg-[#050c04] text-white/60 py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-12">
          {/* Logo e Descrição */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
              <img src="/logo.png" alt="Hotel Club Resort Místico" width="40" height="40" loading="lazy" decoding="async" className="h-10 w-auto opacity-90" />
              <span className="font-heading text-xl md:text-2xl font-bold text-white">
                Hotel Club Resort Místico
              </span>
            </div>
            <p className="text-white/60 text-sm max-w-sm">
              Um ref&uacute;gio exclusivo onde conforto, natureza e bem-estar se unem para criar experi&ecirc;ncias &uacute;nicas e inesquec&iacute;veis.
            </p>
          </div>
          
          {/* Links Rápidos */}
          <div className="flex flex-col items-center md:items-end text-sm space-y-3">
             <p className="text-white font-bold mb-2 uppercase tracking-wide text-xs">Navega&ccedil;&atilde;o</p>
             <a href="#sobre" className="hover:text-metallic transition-colors">O Resort</a>
             <a href="#servicos" className="hover:text-metallic transition-colors">Experi&ecirc;ncias</a>
             <a href="#leiloes" className="hover:text-metallic transition-colors">Club de S&oacute;cios</a>
             <a href="#contato" className="hover:text-metallic transition-colors">Contato</a>
          </div>
        </div>

        {/* Informações Finais e Direitos */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-center md:text-left">
          <p className="text-white/80 font-medium tracking-wide">
            Hotel Club Resort M&iacute;stico | Conforto &bull; Natureza &bull; Bem-Estar
          </p>
          <p className="text-white/40">
            &copy; {new Date().getFullYear()} Hotel Club Resort M&iacute;stico. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ========================================
   WHATSAPP FLOAT
   ======================================== */
function WhatsAppFloat() {
  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25d366]/40 animate-pulse-ring" />

      {/* Tooltip */}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Fale conosco
        <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 border-4 border-transparent border-l-gray-900" />
      </span>

      <a
        href="https://wa.me/5531987954136?text=Olá! Gostaria de mais informações sobre o Hotel Club Resort Místico."
        target="_blank" rel="noopener noreferrer"
        className="relative w-16 h-16 bg-[#25d366] rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 transition-all duration-300"
        aria-label="WhatsApp — Fale conosco"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  )
}

/* ========================================
   LANDING PAGE (home)
   ======================================== */
function LandingPage() {
  return (
    <div className="bg-white">
      <SEO />
      <Hero />
      <About />
      <DiffCards />
      <Services />
      <LocationSection />
      <Auctions />
      <Testimonials />
      <ContactCTA />
      <FAQ />
    </div>
  )
}

/* ========================================
   APP — ROUTES
   ======================================== */
function App() {
  useScrollToTop()

  return (
    <>
      <ScrollProgressBar />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/o-que-fazer-em-coroaci-mg" element={<CoroaciGuide />} />
      </Routes>
      <Footer />
      <WhatsAppFloat />
      <BackToTopButton />
    </>
  )
}

export default App
